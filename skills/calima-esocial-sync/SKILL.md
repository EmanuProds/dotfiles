---
name: calima-esocial-sync
description: Reconcile Calima with the eSocial portal — import XML events, read the Monitor de Eventos, and diagnose why a payroll produces no events. Use when asked about pendência de evento, evento não gerado, sincronizar eSocial, importar XML, or why the folha exists but the S-1200 never reaches the portal. Read-only by design; generating and transmitting are gated.
allowed-tools: browser Read Grep Glob Shell
user-invocable: true
---

> **Authorisation: L0–L3 only.**
> - **L4 — generate** (`Carga inicial`, `Sincronização`, calculating a payroll)
>   is **not authorised**.
> - **L5 — transmit** (`Enviar`, `Reabrir`, `Excluir`) is **not authorised** and
>   is out of scope even with per-block approval.
>
> This skill exists to **read and diagnose**. Its procedure sections are written
> for an operator who holds a higher authorisation — do not execute them from
> here without the accountant saying so, block by block.

## Routes

| Route | Screen |
|---|---|
| `/mfp/monitorEventoEsocialProcessView` | **Monitor de Eventos** — where most diagnosis starts |
| `/mfp/sincronizacaoEventosEsocialProcessView` | eSocial › Importação › Sincronização de eventos — **L4**, and it **pushes**: it sends your Calima vínculos to the portal. It is *not* an import. See rule 22 |
| `/mfp/importacaoXMLEventosProcessView` | Import XML (S-2210 / S-2220 / S-2240) |
| `/mfp/importacaoXMLEventosArquivosDigitaisProcessView` | **Import XML dos eventos do eSocial** — S-1000, S-1005, S-1010, S-1020, **S-2200**, S-2205, S-2206, S-2210, S-2220, S-2221, S-2230, S-2240, S-2300, S-2306. `.xml`/`.zip`, 120 files max |
| `/mfp/integracaoGrupoEventoProcessView` | Integração grupo evento |
| `/mfp/calculoReferenciaSearchView` | Histórico de cálculos |
| `/mfp/consultaCalculosProcessView` | Consultar cálculos de funcionários |

## Gate zero: is the company even in the official environment?

Before any of the five reads below, open `Módulo Folha › eSocial ›
Configurações › Geral` (`/mfp/empresaEsocialConfigView`) and read the hidden
`input[name=tipoAmbiente]`:

| Hidden value | Visible label | What it means for everything below |
|---|---|---|
| `PRODUCAO` | Ambiente oficial | events sent have legal effect |
| `PRODUCAO_RESTRITA` | **Ambiente de teste** | **nothing sent has legal effect** |

In test mode the Monitor says *"Você está no ambiente de testes. Os dados gerados
não são considerados como valores oficiais para o eSocial"* and the semáforo
line reads *"Não foi possível buscar as informações do semáforo do eSocial"*.

**Consequence for diagnosis:** an empty *Eventos pendentes* list, a missing
semáforo, or a company that looks "all clear" **means nothing** while the
company is in `PRODUCAO_RESTRITA`. Fix the environment first (L3, one company at
a time, keep `Replicar as configurações` on `Somente a empresa atual`), then
diagnose. See `calima-rules` rule 85.

Also read there, because it changes behaviour silently: **Enviar
automaticamente eventos pendentes de tabela**. When it is on, table events
(S-1000/S-1005/S-1010/S-1020) go out **without anyone clicking `Enviar`** — that
is transmission (L5) arriving through a switch (L3). Turning it on is a decision
for the contador, never a side effect of a cadastro fix.

## Diagnose before touching anything

Run these five reads, in this order. The first hit decides the rest.

### 1. Is the payroll calculated for the reference?

`/mfp/calculoReferenciaSearchView`. No calculations means nothing downstream can
exist. `Folha vazia` outranks every other explanation.

### 2. Does the payroll actually contain the worker?

`/mfp/consultaCalculosProcessView`. A calculation can exist and still be empty
of people — and an absent worker produces no S-1200 for them.

### 3. Did the event reach the portal?

`/mfp/monitorEventoEsocialProcessView`. Check **Já enviados** for the
competence. Success is `201 – Sucesso`.

| State | Meaning |
|---|---|
| `201 – Sucesso` | accepted by the portal |
| *Pendente para envio* | generated locally, never transmitted — **expected at L0–L3** |
| *Nenhum registro encontrado* | the event was never generated |

### 4. Is the rubrica registered?

`/mfp/eventoSearchView` — the **Evento** catalog. Confirm the rubrica the payroll
used has `Enviar ao eSocial = Sim`. See `calima-esocial-s1010-rubricas`.

> `Enviar ao eSocial = Não` means the rubrica does **not** enter the S-1010, even
> when the payroll uses it. This is the single most common cause of "the payroll
> exists but the event never arrives".

### 5. Is the worker registered in eSocial?

For an admission: query the portal for an accepted S-2200 on that CPF and
competence. If one exists, the S-2200 is **already there** and Calima is simply
missing its copy.

## Why "the payroll exists" does not prove anything reached the portal

A payroll can be calculated and printed while the rubricas it used were never
registered in the S-1010. The event is built locally, and the portal rejects it
or never receives it.

Two independent proofs, both real:

- **A DCTFWeb for the month exists** — and a DCTFWeb can only be produced from
  events the eSocial **received**. So the portal has that month's events even
  though Calima shows nothing pending. The registration was done outside Calima.
- **The payroll printout lists rubricas absent from the S-1010** — the payroll
  used them, nothing registered them.

When these two appear together, the answer is **import the XML**, not generate.

## The three phases

| Phase | Events | Ordering |
|---|---|---|
| 1 | S-1000, S-1005, S-1010, S-1020 | all before anything else |
| 2 | S-2200 | admission, by the 15th of the following month |
| 3 | S-1200, S-1210, S-1299 | S-1200 by competence, S-1210 by payment, S-1299 last and matrix-only |

### Competência versus caixa

A payroll **paid** in October puts S-1210 in **October's reference**, carrying
`perRef` of September. Only S-1200 sits in September. Conflating the two is a
common and expensive mistake.

## Importing XML instead of generating — **L4**

When a portal event already exists, importing is strictly better: a duplicated
worker needs S-2299 plus S-3000 to undo, while a missing event can always be
generated later.

1. `eSocial › Importação › Importar XML dos eventos do eSocial`
2. Attach the XML. **Step 1 — file, step 2 — configuration.** Getting the file
   attached needs rule 22 in `calima-rules`: the drop zone is invisible to the
   axe tree until its `<input type=file>` is forced to `display:block`.
3. On step 2, turn **both** eSocial switches off before saving unless the
   accountant wants the side effects:
   - *Criar automaticamente… eventos pendentes após a importação* queues a new
     event for transmission;
   - *Realizar configuração do eSocial na empresa…* rewrites the company config.

   `Salvar` then refuses with *"é necessário que a(s) empresa(s) pendente(s) de
   informação seja(m) preenchida(s)"*. The company row's **Não configurado**
   button opens a per-worker form demanding **nationality, marital status,
   admission date, CBO and RG** — identity data typed into an event screen, and
   some of those columns render as `d-none` (rule 21), so the form can demand
   what it will not show you. Expect to source those fields from the worker's
   cadastro, not from the XML, and say so before writing them.
4. **L4** — confirm. Do not proceed without explicit authorisation.
5. Verify in the Monitor de Eventos that the imported event shows `201 – Sucesso`.

### Before you import: check what the portal already holds

The Monitor only knows events that **went through Calima**. An event sent by a
previous system (Alterdata, eContab, Folha) is invisible to it — no reference
in any month will find it, and the semaphore may report that it cannot be
reached at all. Look for the exported XML in the client's Drive before
concluding an event was never sent.

### S-2299 needs the vínculo that existed, not the current one

A readmissão does not replace the old vínculo in the portal — it adds one. The
S-2299 must close **the vínculo that was admitted back then**, with that
vínculo's own admission date. If the system only holds today's vínculo, the
rescisão date you have will fall *before* that vínculo was created and no
screen will accept it; the Rescisão screen's vínculo list comes back empty for
the same reason. Import the historical S-2200 first, or close it in the portal.

Never infer the rescisão date from the last S-1200: knowing someone was paid in
July does not tell you when they left. Get it from the TRCT, aviso prévio or
SD file.

## Importando S-1020 (Lotação tributária) antes da Carga Inicial

**Se a validação da Carga Inicial pedir "Lotação Tributária", ela não existe no
Calima.** A lotação tributária (S-1020) é um evento separado que a empresa
transmitiu antes. Sem ela, o S-1000 não valida.

1. Vá em **Folha › Manutenção › Configurações › Lotação tributária > Incluir**.
2. Preencha com os mesmos valores do S-1020 original (XML do Drive ou portal):
   - `codLotacao` (ex.: `VARLANCH`)
   - `tpLotacao = 01` — estabelecimento matriz / PJ por conta própria
   - `fpas` (ex.: 515 = comércio varejista de lanches)
   - `codTercs = 0000`
   - `iniValid` = competência de início (ex.: 09/2026)
3. Salvar.
4. Voltar ao wizard da Carga Inicial, recarregar o dropdown e prosseguir.

> **Não invente FPAS nem `tpLotacao`.** Use os valores do S-1020 original do
> Drive/portal. O tipo `01` + FPAS 515 + `codTercs 0000` corresponde a
> "Estabelecimento matriz / PJ que trabalha por conta própria" (tipo
> `OBRA_PROPRIA` no backend). Se a empresa já transmitiu S-1020, o XML do
> Drive tem todos os valores.

## After generating — **L4**

`Carga inicial` marks which events to build. Mark **only** what is needed —
generating a whole phase to fix one rubrica creates work that then has to be
excluded.

The sequence that matters: mark S-1010, locate the missing rubricas, proceed,
confirm `201 – Sucesso`, then **recalculate the payroll**. Without the
recalculation the events do not appear, and this reads as "the fix did nothing".

## Record what you read

Use the project's reading registry so the next session does not re-derive it:

```bash
.venv/bin/python -m ferramentas.calima leituras registrar \
  --slug <empresa> --competencia 2026-10 --arquivo <leitura.json>
```

> Known bug: `--slug` collides with the `slug` key inside the JSON and raises
> `TypeError: got multiple values for keyword argument 'slug'`. Remove `slug`
> and `competencia` from the file and pass them as flags.
