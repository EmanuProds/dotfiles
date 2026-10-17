---
name: calima-esocial-s1010-rubricas
description: Decide which rubricas in Calima must be sent to the eSocial S-1010 table, reproducing a retired system's standard. Use when migrating from another payroll system, when a payroll produces no events, or when asked which rubricas should have "Enviar ao eSocial = Sim". Carries the verified comparison of Calima's 216-rubrica Evento catalog against the 67-rubrica eContab standard, with the twelve that must be flipped.
allowed-tools: browser Read Grep Glob Shell
user-invocable: true
---

> **Authorisation: L0–L3 only.**
> Changing a rubrica's `Enviar ao eSocial` flag and marking it in `Carga
> inicial` are both **L4 — not authorised**. Transmitting is **L5 — not
> authorised**, and is out of scope even with per-block approval.
>
> This skill produces the **decision**. Changing the flags is a separate,
> explicitly authorised step — one rubrica at a time, with the accountant
> approving each.

## Where the S-1010 actually lives

`Folha › Manutenção › Trabalhador › Evento` → `/mfp/eventoSearchView`

**Not** `/mfp/rubricaHomolognetSearchView`. That screen is called *Rubrica* and
holds 36 records, but it is the **payroll rubrica catalog** (Salário Fixo,
Garantia, Produção, …) — not the S-1010. Looking for the S-1010 there wastes
time.

Columns: `Código`, `Descrição`, `Tipo`, `Fórmula`, `Sub-fórmula`,
`Enviar ao eSocial`.

## The one column that decides everything

`Enviar ao eSocial = Não` means the rubrica **does not enter the S-1010**, even
when the payroll uses it. A payroll can be calculated and printed with rubricas
that were never registered, and the event never reaches the portal.

That is the first cause of "the payroll exists but generates no event".

## The catalog, as read

216 records, screen counter `Registros: 216`.

- **163** marked `Sim`
- **53** marked `Não`

Code **71** (INSS, Desconto) sits between 70 and 72 and is easy to miss — with
it omitted the count reads 215 and the total never reconciles.

Collection note: the pager only advances **between separate `evaluate` calls**.
At 100 per page the pages were 1..241, 243..343, 344..359 — 216 unique codes.

## Migration case: eContab → Calima

Varanda Lanche e Pizzaria Ltda used **eContab** and moved to **Calima**. The two
systems number rubricas differently — eContab uses `e001`, Calima uses `1` — so
**there is no numeric correspondence**. Compare by function.

### Source of the old standard

The four eContab screens archived as `PLANILHA EVENTOS E-SOCIAL001` … `004`,
every row showing status **"Concluído com Sucesso"** — the record of what the
portal actually accepted. Issued 30/03/2022 and 04/04/2022, valid from 2019-11.

**67 rubricas.** Cross-checked against the signed XMLs for 03/2024–07/2024:
66 of the 67 appear there. The exception is `e619` (Base Multa Rescisória), sent
in 2022 and not repeated in the 2024 batch.

That agreement between an independent screen and signed XMLs is what makes the
list trustworthy rather than merely a catalog.

### The rule

**Reproduce the old standard 1:1.** Every rubrica eContab transmitted goes to
Calima as `Sim` — including the ones Calima ships as `Não`.

### Of the 67: 54 have a Calima equivalent, 13 do not

Of the 54, **42 are already `Sim`** and **12 must be flipped**.

| Calima | Rubrica | From | Confidence |
|---|---|---|---|
| 40 | FGTS multa 50% - rescisão | `e045` | Direct |
| 55 | FGTS | `e601` | Direct |
| 52 | Base de cálculo do IRRF - folha/13º salário | `e602` | Probable |
| 50 | Base de cálculo do INSS - folha/13º salário | `e603` | Probable |
| 261 | Base de cálculo do INSS no 13º - rescisão | `e608` | Probable |
| 248 | Base cálculo do IRRF - férias | `e620` | Probable |
| 80, 48, 47, 105, 56, 53 | — | — | **Confirm first** |

**Only 2 are safe to change blind.** The rest need the name checked on screen,
and the six marked *Confirm* have no equivalent — they would send a wrong value.

### The inversion worth catching

In eContab the INSS base **was** registered: `e603` Base do INSS was in the
S-1010 with success. In Calima the equivalent — **50, Base de cálculo do INSS** —
ships as `Não`, while **51, Base de cálculo do FGTS** ships as `Sim`. The
pattern is the **inverse** of what eContab used.

A payroll calculated with 50 as `Não` reports the INSS without the base the
eSocial needs to reconcile it.

### Thirteen with no equivalent

Do not invent a code for these. The Calima resolves them by another route, and a
wrong match makes the portal reject the whole batch — while an open question
takes a minute to settle on screen.

They are the proportional salary, proportional salary-family, 1/3 on expired
leave, leave with pay in lieu, the trial-contract penalty (registered twice in
eContab, `e090` and `e348`), the termination advance, advance on leave, the
social-security / autonomous deduction, and the RAIS, deduction-base and
rescission-base family.

### The full comparison

The row-by-row table, with the reasoning for each equivalence, is the PDF
`RUBRICAS-S1010-CALIMA-O-QUE-ENVIAR.pdf` in the client's Drive folder
(`1K2dW5r1a2RJJkIqIb8eNvtixYlkhT2Cn`).

## The codes in the S-1010 are not the catalog codes

This list says **which rubrica to activate**, not which code will be written to
the S-1010. The code is produced by Calima at generation time and is the
company's own choice; changing it invalidates nothing.

Check it before transmitting: `Monitor de Eventos › Carga inicial › S-1010`
shows the codes Calima proposes.

## Changing a flag — **L4, one at a time**

1. Announce the rubrica, the code, and that this is L4.
2. Open `Evento`, edit the rubrica.
3. Set `Enviar ao eSocial = Sim`.
4. Save, screenshot, confirm.
5. Repeat only after the previous one is verified.

Then `Carga inicial` marking **only S-1010**, confirming `201 – Sucesso`, and
**recalculating the payroll** — without the recalculation the events do not
appear.

## Verify before reporting

- Count of `Sim` in the catalog, before and after.
- Screenshot of the edited row.
- `201 – Sucesso` in Já enviados, not merely *Pendente para envio*.
