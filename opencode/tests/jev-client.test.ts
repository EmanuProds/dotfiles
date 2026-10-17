/**
 * Tests for the Jev decision client.
 *
 * Scope: the CONFIDENCE POLICY, not the network. Every call to Jev goes
 * through an injected fetchImpl, so this suite is deterministic and offline.
 * A test that reached the real endpoint would be slower, would fail whenever
 * the free tier is unavailable, and would not actually assert anything the
 * stubbed one does not.
 *
 * What is being pinned here:
 *   - Jev is an accelerator, never a replacement (the fallback contract)
 *   - a low-confidence answer leaves the caller's own ordering untouched
 *   - a partial answer (some candidates unsure) reorders NOTHING
 *   - network failure, timeout, and missing key are all "no opinion"
 *   - the API key is never sent anywhere but the Jev endpoint
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  askJev,
  decide,
  rerankCandidates,
  JEV_MODEL,
} from "../lib/jev-client.ts";

const KEY = "test-key-do-not-log";

/** Builds a fetch stub that returns a canned systemone payload. */
function stubFetch(payload: unknown, init: { ok?: boolean } = {}) {
  const calls: Array<{
    url: string;
    body: any;
    headers: Record<string, string>;
  }> = [];
  const impl = (async (url: any, options: any) => {
    calls.push({
      url: String(url),
      body: JSON.parse(options.body),
      headers: options.headers,
    });
    return {
      ok: init.ok ?? true,
      status: init.ok === false ? 429 : 200,
      json: async () => payload,
    };
  }) as unknown as typeof fetch;
  return { impl, calls };
}

/** Canned response with one noul answer per candidate index. */
function noulPayload(values: Record<string, number>) {
  const answers: Record<string, unknown> = {};
  for (const [id, noul] of Object.entries(values)) {
    answers[id] = { type: "noul", noul };
  }
  return {
    model: JEV_MODEL,
    answers,
    usage: { input_tokens: 100, output_tokens: 20 },
    cost: "0",
  };
}

const mem = (key: string, value: string) => ({ key, value });

describe("askJev", () => {
  it("posts state and questions to the systemone endpoint with the bearer key", async () => {
    const { impl, calls } = stubFetch(noulPayload({ q: 0.9 }));
    const result = await askJev(
      "some state",
      { q: { type: "noul", instructions: "is it?" } },
      {
        apiKey: KEY,
        fetchImpl: impl,
      },
    );

    assert.equal(calls.length, 1);
    assert.equal(calls[0]!.url, "https://opencode.ai/zen/v1/systemone");
    assert.equal(calls[0]!.headers.Authorization, `Bearer ${KEY}`);
    assert.equal(calls[0]!.body.state, "some state");
    assert.equal(calls[0]!.body.model, JEV_MODEL);
    assert.equal(result?.answers.q?.type, "noul");
  });

  it("defaults to the pinned free model, not the paid one", async () => {
    const { impl, calls } = stubFetch(noulPayload({ q: 0.9 }));
    await askJev(
      "s",
      { q: { type: "noul", instructions: "i" } },
      { apiKey: KEY, fetchImpl: impl },
    );
    assert.equal(calls[0]!.body.model, "jev-1.13-free");
  });

  it("returns null when no API key is available", async () => {
    const { impl, calls } = stubFetch(noulPayload({ q: 0.9 }));
    const result = await askJev(
      "s",
      { q: { type: "noul", instructions: "i" } },
      {
        apiKey: "",
        fetchImpl: impl,
      },
    );
    assert.equal(result, null);
    assert.equal(calls.length, 0, "must not call the endpoint without a key");
  });

  it("returns null on a non-ok response instead of throwing", async () => {
    const { impl } = stubFetch({ error: "rate limited" }, { ok: false });
    const result = await askJev(
      "s",
      { q: { type: "noul", instructions: "i" } },
      {
        apiKey: KEY,
        fetchImpl: impl,
      },
    );
    assert.equal(result, null, "a 429 must degrade, not propagate");
  });

  it("returns null when the transport throws", async () => {
    const impl = (async () => {
      throw new Error("ECONNREFUSED");
    }) as unknown as typeof fetch;
    const result = await askJev(
      "s",
      { q: { type: "noul", instructions: "i" } },
      {
        apiKey: KEY,
        fetchImpl: impl,
      },
    );
    assert.equal(result, null);
  });
});

describe("decide — the promotion policy", () => {
  const choiceResp = (confidence: number) => ({
    model: JEV_MODEL,
    answers: {
      c: {
        type: "choice" as const,
        choice: "a",
        confidence,
        probabilities: { a: confidence },
      },
    },
  });

  it("promotes when confidence clears the threshold", () => {
    const outcome = decide(choiceResp(0.93), "c", 0.8);
    assert.equal(outcome.kind, "promote");
    assert.equal(outcome.kind === "promote" && outcome.confidence, 0.93);
  });

  it("falls back when confidence is below the threshold", () => {
    const outcome = decide(choiceResp(0.55), "c", 0.8);
    assert.equal(outcome.kind, "fallback");
    assert.equal(
      outcome.kind === "fallback" && outcome.reason,
      "low-confidence",
    );
  });

  it("treats the noul number as its own confidence", () => {
    const promoted = decide(noulPayload({ c: 0.96 }), "c", 0.8);
    assert.equal(promoted.kind, "promote");
    const hesitant = decide(noulPayload({ c: 0.55 }), "c", 0.8);
    assert.equal(hesitant.kind, "fallback");
  });

  it("falls back as unavailable on a null response", () => {
    const outcome = decide(null, "c", 0.8);
    assert.equal(outcome.kind, "fallback");
    assert.equal(outcome.kind === "fallback" && outcome.reason, "unavailable");
  });

  it("falls back as unavailable when the question id is absent", () => {
    const outcome = decide(noulPayload({ other: 0.99 }), "c", 0.8);
    assert.equal(outcome.kind, "fallback");
    assert.equal(outcome.kind === "fallback" && outcome.reason, "unavailable");
  });
});

describe("rerankCandidates", () => {
  const pool = [
    mem("a", "FTS5 index rebuild"),
    mem("b", "Plugin loading order"),
    mem("c", "Loop guard tiers"),
  ];

  it("promotes high scores and demotes confirmed-irrelevant ones", async () => {
    // c0=0.2 is Jev saying "this does not answer the query" WITH confidence.
    // That is a ranking signal, not an abstention.
    const { impl } = stubFetch(noulPayload({ c0: 0.2, c1: 0.9, c2: 0.7 }));
    const out = await rerankCandidates("q", pool, {
      apiKey: KEY,
      fetchImpl: impl,
      threshold: 0.8,
    });
    assert.deepEqual(
      out.map((m) => m.key),
      ["b", "c", "a"],
    );
  });

  it("keeps a near-0.5 answer unranked instead of demoting it", async () => {
    // 0.5 is where an undecided model sits. Treating that as "irrelevant"
    // would bury a memory on no evidence.
    const { impl } = stubFetch(noulPayload({ c0: 0.95, c1: 0.91, c2: 0.5 }));
    const out = await rerankCandidates("q", pool, {
      apiKey: KEY,
      fetchImpl: impl,
      threshold: 0.8,
    });
    assert.deepEqual(
      out.map((m) => m.key),
      ["a", "b", "c"],
      "an undecided candidate must not be moved to the bottom",
    );
  });

  it("keeps FTS5 order entirely when an answer is missing", async () => {
    // c2 absent: the ranking is incomplete, so nothing is reordered.
    const { impl } = stubFetch(noulPayload({ c0: 0.95, c1: 0.91 }));
    const out = await rerankCandidates("q", pool, {
      apiKey: KEY,
      fetchImpl: impl,
      threshold: 0.8,
    });
    assert.deepEqual(
      out.map((m) => m.key),
      ["a", "b", "c"],
      "a partial ranking must not be acted on",
    );
  });

  it("keeps FTS5 order when Jev is unreachable", async () => {
    const impl = (async () => {
      throw new Error("offline");
    }) as unknown as typeof fetch;
    const out = await rerankCandidates("q", pool, {
      apiKey: KEY,
      fetchImpl: impl,
    });
    assert.deepEqual(
      out.map((m) => m.key),
      ["a", "b", "c"],
    );
  });

  it("asks one atomic question per candidate, with positional ids", async () => {
    const { impl, calls } = stubFetch(
      noulPayload({ c0: 0.9, c1: 0.9, c2: 0.9 }),
    );
    await rerankCandidates("q", pool, { apiKey: KEY, fetchImpl: impl });

    const asked = calls[0]!.body.questions;
    assert.deepEqual(Object.keys(asked).sort(), ["c0", "c1", "c2"]);
    for (const q of Object.values<any>(asked)) {
      assert.equal(
        q.type,
        "noul",
        "one atomic noul per candidate, never a pooled score",
      );
    }
  });

  it("never puts a memory key in the question id", async () => {
    // Keys carry ':' and '-', which is what broke the FTS5 query path.
    const { impl, calls } = stubFetch(noulPayload({ c0: 0.9, c1: 0.9 }));
    await rerankCandidates(
      "q",
      [mem("domain:subject:detail", "v"), mem("k-2", "v")],
      {
        apiKey: KEY,
        fetchImpl: impl,
      },
    );
    const ids = Object.keys(calls[0]!.body.questions);
    for (const id of ids) {
      assert.match(id, /^c\d+$/, `question id "${id}" must be positional`);
    }
  });

  it("is stable for equal scores, so FTS5 ties are not scrambled", async () => {
    const { impl } = stubFetch(noulPayload({ c0: 0.9, c1: 0.9, c2: 0.9 }));
    const out = await rerankCandidates("q", pool, {
      apiKey: KEY,
      fetchImpl: impl,
      threshold: 0.8,
    });
    assert.deepEqual(
      out.map((m) => m.key),
      ["a", "b", "c"],
    );
  });

  it("preserves the result count when limit is applied", async () => {
    const { impl } = stubFetch(noulPayload({ c0: 0.2, c1: 0.9, c2: 0.4 }));
    const out = await rerankCandidates("q", pool, {
      apiKey: KEY,
      fetchImpl: impl,
      limit: 2,
    });
    assert.equal(out.length, 2);
  });

  it("returns an empty array without calling the endpoint for an empty pool", async () => {
    const { impl, calls } = stubFetch(noulPayload({}));
    const out = await rerankCandidates("q", [], {
      apiKey: KEY,
      fetchImpl: impl,
    });
    assert.deepEqual(out, []);
    assert.equal(calls.length, 0);
  });

  it("keeps the tail beyond maxCandidates so nothing is dropped", async () => {
    const many = Array.from({ length: 15 }, (_, i) => mem(`k${i}`, `v${i}`));
    const values: Record<string, number> = {};
    for (let i = 0; i < 12; i++) values[`c${i}`] = 0.9;
    const { impl } = stubFetch(noulPayload(values));
    const out = await rerankCandidates("q", many, {
      apiKey: KEY,
      fetchImpl: impl,
      maxCandidates: 12,
    });
    assert.equal(out.length, 15, "candidates 12-14 must survive the pool cut");
  });
});
