# Skill: calima-register-vinculo

> Authorisation: `calima-erp`. Driving the form: `calima-navigation`.
> Input mechanics: `calima-rules`. Silent failures: `calima-rules`.
>
> Verified 08/10/2026 at a Simples Nacional construction company — all four
> vínculos of a four-worker crew registered end to end.
> This file closes the gap left by `calima-register-worker`, whose Vínculo
> section was explicitly marked *"not yet exercised"*.
>
> **Two claims in the first draft of this file were wrong and are now
> corrected in place:** that a validation error prevents the save (it does not
> — it writes anyway and a retry duplicates the vínculo), and that a schedule is
> linked by picking it (the row is clicked, there is no checkbox).

## Route

`Módulo Folha de Pagamento › Manutenção › Trabalhador › Vínculo` → `/mfp/vinculoSearchView`

`Incluir` opens `/mfp/vinculoSearchView/edit`. **There is no `edit/<id>` link
for a vínculo that was never saved** — while `Registros: 0`, every attempt
starts over from `Incluir`.

## The save gate — three items, and the error does NOT stop the save

`Salvar` raises a modal listing exactly these:

```
Atenção Existem informações inválidas. Verifique os campos indicados abaixo:
  Salário não informado
  Nenhum cargo foi informado
  Quadro de horários não informado
```

> **Corrected 08/10/2026 — the original version of this skill was wrong here.**
> It said the save is refused. It is not. The modal appears **and the vínculo is
> written anyway**: the request behind `Salvar` is `POST persistence/persist`
> and it returns **`200`** while the error modal is on screen. The server treats
> the partial payload as valid.
>
> The consequence is severe and was hit in production: **clicking `Salvar` again
> after the error creates a second, duplicate vínculo for the same worker.** On
> the next attempt the modal changes to *"Já existe outro vínculo ativo
> cadastrado para este trabalhador, deseja continuar?"* — that question appears
> only because the first click already wrote a record nobody could see.
>
> **Therefore: `Salvar` exactly once, and only when all three grids read
> `Registros: 1` and every select's hidden input is populated.** Verify before
> saving, never after. If the modal appears, the vínculo already exists — do not
> click `Salvar` again.

### The error also wipes what was not committed

That same re-render resets the form: selects revert to empty, `dataAdmissao`
clears, and all three grids drop back to `Registros: 0`. A rejected save
destroys the work done since the last successful grid save. Expect to rebuild
from `Gerais`.

## react-select: reading `innerText` tells you nothing

The most expensive misconception on this form. **The `innerText` of a
`react-select` wrapper shows the text of the open dropdown menu, not the
selected value.** After `Enter`, a field can report
`option 01 / 101 - Empregado, selected` and still be empty.

Two reliable reads, and use both:

```js
// 1. what is actually selected
w = document.querySelector('#idcategoria');
w.querySelector('[class*="__single-value"]')?.innerText   // → "01 / 101 - Empregado"
//    absent means NOTHING is selected

// 2. the value bound to the model
w.querySelector('input[type="hidden"]').value               // → "EMPREGADO"
```

The hidden input is the ground truth — it holds the enum the server will
receive (`EMPREGADO`, `PRAZO_INDETERMINADO`, `NORMAL`, `DEDUCOES_LEGAIS`,
`PRIMEIRO_EMPREGO`). **Assert it is non-empty for every required select before
`Salvar`.** A field whose container only contains a placeholder renders no
`__single-value` and an empty hidden input, and is easy to miss in a dump
(filtering by `offsetParent` hides it).

### Select it like this

```js
// focus the search input, verify focus actually landed, then type a filter
el.focus(); if (document.activeElement !== el) return 'FOCO FALHOU';
for (const ch of "101") press(ch);      // filter, then read the focused option
press("Enter");
```

`Control+a` + `Backspace` before typing is unreliable on these — it can select
the page instead of the input and leave a stale value behind. Filter with a
short substring (`101`, `legais`, `1`, `7170`) rather than clearing.

## `idtipoAdmissao` — hidden default that fails the save

`idtipoAdmissao` is **not** in the visible `Gerais` dump and ships defaulted to
`TRANSFERÊNCIA`. Left alone, `Salvar` fails with:

```
Para o tipo de admissão TRANSFERÊNCIA é necessário informar a data de transferência
```

Options are `1º Emprego` · `Reemprego` · `Reintegração` · `Transferência`.
There is **no** `Admissão` — for a first registration pick **`1º Emprego`**
(filter by `1`, then `Enter`; the hidden input becomes `PRIMEIRO_EMPREGO`).

> If the field is left **empty** the vínculo saves without complaint — two were
> saved that way before this was found — but `S-2200` requires `tpAdm`, and the
> event is rejected without it. **Set it on every vínculo**, including ones
> already saved: open the edit form, set `idtipoAdmissao`, `Salvar`. Editing an
> existing vínculo does not duplicate it.

## Tab map

`Gerais` · `Cargos` · `Salários` · `Horários` · `Vale-transporte` ·
`Planos de saúde` · `eConsignado` · `Previdência complementar` ·
`Local de trabalho` · `Treinamentos` · `Trabalhador intermitente` ·
`Aprendiz/Estagiário`

The last two are enabled only by the category chosen in `Gerais`
(`111` intermitente; `07/103` aprendiz or `45/901` estagiário).

## Salary — the panel is a display, the grid is the input

**The `Salário atual` panel cannot be typed into.** Every field in it
(`tipoSalarioAtual`, `dataInclusaoSalarioAtual`, `valorSalarioAtual`,
`numHorasContratadasSalarioAtual`) ships `disabled=true` and stays that way.
They render the current salary; they are not an entry point. Reading them as
"the salary fields are broken" costs an hour.

The salary is entered in the **`Histórico de salários` grid**:

```
aba Salários → addButton-salarios → modal "Manutenção - Trabalhador - Vínculo - Salário"
```

Fields in that modal:

| Field | Notes |
|---|---|
| `tipoPagamento` | hidden input, defaults to `MENSAL`. `Periódico` blocks a monthly payroll |
| `data` | masked `__/__/____` — real keys |
| `valorFmt` | `input-money`: type **reais × 10**, **no `Tab`**. `18000` → `1.800,00` (see `calima-rules` 79 — the old "cents + Tab" advice is wrong and the field cannot be automated; a human types it) |
| `numeroHorasContratuais` | e.g. `44` |
| `reajusteFmt`, `reajusteHorasFmt` | leave at zero |
| `porcentagemComissaoSobreVendasFmt` | only for commission |
| `motivo` | free text, e.g. `ADMISSAO` |
| `salarioMinimo` | checkbox; when on, `valorFmt` locks to the current minimum |
| `horista`, `diarista` | horista needs `Valor da Hora`; `Fixar Nº Horas Mensais` optional |

Save the salary modal, then `Salvar` the vínculo.

## Quadro de horário — a global record, then a link

Two distinct objects. The vínculo grid only **links**; it never defines.

### 1. Create the schedule globally

`Módulo Folha › Manutenção › Quadro de horário` → `/mfp/quadroHorarioSearchView`

| Field | Notes |
|---|---|
| `codigo` | short code, e.g. `1` |
| `descricao` | descriptive name |
| `idsindicato` | optional |
| `idtipoJornada` | pick to match the real rest day — *"Jornada com horário diário fixo e folga fixa (no domingo)"* for a Sunday-off crew |

Then add days with **`addButton-quadroHorarioDia`**. Each opens a `Turno` modal:

| Field | Notes |
|---|---|
| `turnodropDown` | `1º Turno` / `2º Turno` — **must be set first**, `horaEntrada` and `horaSaida` are `disabled` until it is |
| day checkboxes | `segundaSelecionado` … `sabadoSelecionado`, plus `domingoSelecionado` |
| `horaEntrada`, `horaSaida` | `react-input-date`: format **`HH:MM:SS`**. `08:00` leaves the mask as `08:00:__` |

The form footer computes `Total de horas` and `Média por dia` from the rows.

### 2. Link it to the vínculo

`aba Horários → addButton-quadrosHorarios` → grid → **`Incluir`** → pick the
schedule → `Salvar` → `Salvar` the vínculo.

> **Trap.** On a fresh vínculo, `addButton-quadrosHorarios` may raise
> *"Não foi encontrado nenhum vínculo cadastrado na empresa. Deseja cadastrar
> agora?"*. Clicking **`Não, cadastrar depois`** navigates to the dashboard and
> **discards the entire vínculo form**. If it appears, re-enter from
> `Incluir` and redo the steps — and expect to reach the same modal, which is
> harmless once the schedule already exists.

## The `Gerais` tab

| Field | Value used at a Simples Nacional construction company |
|---|---|
| `matriculaEsocial` | set from `K050` (e.g. `F0000000001`). The system does not fill it |
| `matricula` | **leave EMPTY** — 8-char limit. Copying the eSocial code here fails with *"máximo 8 caracteres"* |
| `idtrabalhador` | search by a distinctive surname fragment — `PERICLES`, not `LUCAS` |
| `dataAdmissao` | masked, real keys |
| `idcontratoTrabalho` | required. `Contrato de trabalho por prazo indeterminado` |
| `idtipoIncidenciaAdmissaoEnum` | required. `Normal` |
| `idtipoDeducaoIrrf` | required. `Deduções legais` unless the client says otherwise |
| `idcategoria` | `01 / 101 - Empregado` |
| `idtipoAdmissao` | **`1º Emprego`** — hidden field, defaults to `TRANSFERÊNCIA`. See above |
| `idcbo` | search by the **description**, not the code — `Assistente administrativo` |
| `idcentroCusto`, `idsindicato` | optional |

`idtrabalhador` is **disabled** and auto-filled from the outer context; that is
by design, not a broken field.

## Cargo — like the salary, the panel is display and the grid is the input

`input[name=cargoAtual]` ships `disabled=true` and stays that way, exactly like
the salary panel. The cargo is registered in the **`Histórico de cargos` grid**:

```
aba Cargos → addButton-cargos → modal "Manutenção - Trabalhador - Vínculo - Cargo"
```

| Field | Notes |
|---|---|
| `idtrabalhador` | **disabled**, auto-filled from the vínculo |
| `idcargo` | the cargo to attach — from the shared cargo table |
| `dataAlteracao` | masked, real keys. Auto-fills with **today's date**; override it with the admission date so the history is truthful |
| `motivo` | free text, e.g. `ADMISSAO` |

`cargoAtual` stays empty until the vínculo is saved; the grid is what matters.

### The cargo table is shared across companies — codes collide

`Folha › Manutenção › Tabelas › Cargo` → `/mfp/cargoSearchView`. It is **not**
scoped per company, so it already holds other clients' cargos and the codes are
already taken.

> **A duplicate cargo code fails as a silent `POST 500`** on
> `persistence/persist` — no modal, no field highlighted, and the form empties
> itself. Pick the next free code; do not retry the same one.

| Field | Notes |
|---|---|
| `codigo` | must be unique in the table. Check the existing list first |
| `idcbo` | react-select. Search by description or 4-digit code prefix |
| **Descrição** | **a `<textarea>` inside `#iddescricao`** — it does not appear in an `input[name]` enumeration and is easy to miss. Empty description ⇒ *"Descrição Campo não pode estar em branco"* |

```js
el = document.querySelector('#iddescricao textarea')   // ← not input[name=descricao]
```

## Counting a grid's records — `closest('.tab-pane')` picks the wrong pane

Every grid renders `Registros: N` in a card above it. `b.closest('.tab-pane')`
resolves to the **containing tab**, which hosts several grids, so you read the
count of a sibling. Walk up until the text matches:

```js
let p = document.getElementById('addButton-quadrosHorarios'), found = '?';
for (let i = 0; i < 6 && p; i++, p = p.parentElement) {
  const m = p.innerText.match(/Registros: ([0-9]+)/);
  if (m) { found = m[1]; break; }
}
```

Verified counts: `addButton-cargos` → *Histórico de cargos*,
`addButton-salarios` → *Histórico de salários*,
`addButton-quadrosHorarios` → *Histórico de quadro de horários*.

## Link the schedule to the vínculo

`aba Horários → addButton-quadrosHorarios` opens a grid with one row per
schedule. **There is no checkbox — select by clicking the row**, which marks it
`class="gt-tr active"`, then `Salvar`. Re-read the class before saving; if it is
not `active`, the click did not register.

> The modal shows *"Carregando…"* first. Poll the text for the schedule
> description (e.g. `ISAPED 44H - …`) before touching the row — clicking during
> the load hits an empty grid.

## Removing a vínculo — broken in the UI (verified 08/10/2026)

`actionColumnRemoveButton-<n>` opens *"Confirmar remoção"* with the worker's name
and CPF. `Confirmar` fires:

```
POST mfp/podeExcluirVinculo/<id>      → 200
POST mfp/podeGerarS3000Vinculo        → 200
```

**and never issues a delete.** No request removes the record; the row survives a
full page reload under the default *Situação: Ativos* filter. Confirmed on both
duplicates, on a clean network, with an XHR hook installed — the two calls above
are the only traffic.

So a duplicate vínculo **cannot be removed from the application**. Escalate to
Calima support. Do not spend more attempts on it.

> The user did remove one by other means. If the list still shows the duplicate,
> stop and report rather than re-running the flow.

## CBO — search by name, then step down

Typing the six-digit code returns an unsorted-looking list
(`411010` → *Assistente administrativo sindical*, *Assistente de compras*, …).
Search the description instead, which narrows correctly:

```
"Assistente administrativo"  →  3 options, the wanted one is NOT first
ArrowDown once                →  moves to "Assistente administrativo"
Enter
```

Verify the focused option before `Enter` — the first hit is frequently the
wrong one (`sindical` suffix).

**Calima's CBO labels differ from the client's XML.** Search by the **4-digit
code prefix** (`7152`, `7170`) rather than by name — it is more reliable than
guessing the label:

| Client XML | Calima CBO | Stored |
|---|---|---|
| Assistente administrativo | *Assistente administrativo* | `411010` |
| Pedreiro | *Pedreiro de edificações* | `715230` |
| Pintor de obras | *Pintor de obras* | `716610` |
| Ajudante de pedreiro | **not present** — use *Ajudante de obras* | `717020` |

### The CBO list is virtualised and does not scroll — `ArrowDown` still walks it

The menu renders a fixed window of ~10 options with no scrollbar, and a search
term often returns matches you cannot see. **`ArrowDown` repeatedly walks past
the visible window.** This is the only way to reach a specific entry:

```js
for (let i = 0; i < 20; i++) {
  const cur = focusedOptionText();
  if (cur === "Ajudante de obras") break;
  press("ArrowDown");
}
press("Enter");
```

Give up after ~20 presses: the list wraps around and you are back at the first
option. When a code search returns a set that does not contain what you expect,
the CBO simply does not exist under that label.

## Worked example — one vínculo, end to end

Company **ISAPED CONSTRUTORA E SERVIÇOS LTDA** (CNPJ 46.571.106/0001-46), code `5`.

```
Gerais
  Trabalhador        1 - LUCAS PERICLES DA CRUZ SILVA
  Matrícula eSocial  (preenchido pelo sistema)
  Admissão           02/12/2024
  Contrato           prazo indeterminado
  Incidência adm.    Normal
  Dedução IRRF       Deduções legais
  Tipo de admissão   1º Emprego          ← obrigatório, senão o S-2200 é rejeitado
  Categoria          01 / 101 - Empregado
  CBO                Assistente administrativo (411010)

Cargos  (Histórico de cargos → +)
  ASSISTENTE ADMINISTRATIVO | alteração 02/12/2024 | Motivo: ADMISSAO

Salários  (Histórico de salários → +)
  02/12/2024 | Mensais | R$ 1.800,00 | 44,00 horas | Motivo: ADMISSAO

Horários  (quadro global 1 → vinculado)
  1º Turno  Segunda a Sexta  08:00:00 → 12:00:00
  2º Turno  Segunda a Sexta  13:00:00 → 18:00:00
  Total 45:00h · média 9:00h/dia
```

### The four vínculos, as saved

| Matrícula | Trabalhador | CBO | Admissão | Salário |
|---|---|---|---|---|
| 1 | LUCAS PERICLES DA CRUZ SILVA | Assistente administrativo `411010` | 02/12/2024 | R$ 1.800,00 |
| 2 | ALAN BORGES DE ARAUJO | Pedreiro de edificações `715230` | 03/12/2025 | R$ 2.780,80 |
| 3 | MATHEUS VICTOR MENDES | Pintor de obras `716610` | 03/12/2025 | R$ 2.780,80 |
| 5 | THIAGO REZENDE DE LIMA | Ajudante de obras `717020` | 03/12/2025 | R$ 2.010,80 |

All four: category `01/101`, contract `PRAZO_INDETERMINADO`, incidence
`NORMAL`, IRRF `DEDUCOES_LEGAIS`, admission type `PRIMEIRO_EMPREGO`, 44 h,
schedule `1`, plus one cargo, one salary and one schedule row each.

> The gap in the matrícula numbering is real, not a read error: a duplicate for
> MATHEUS was created (matrícula 4) and later removed by the user. Two vínculos
> were also saved before `idtipoAdmissao` was understood and had to be reopened
> and corrected — see above.

### The 44 h vs 45 h discrepancy — report it, do not "fix" it

The client's own S-2200 declares `<qtdHrsSem>44</qtdHrsSem>` while its
`dscJorn` describes `08:00-12:00-13:00-18:00` — which is 9 h/day × 5 = **45 h**.
Calima computes the schedule from the clock times (45 h) and the declared
weekly hours from the salary (44 h). Both are internally consistent in their
own place.

**Leave both as the client declared and flag it.** Editing a shift to make the
total match 44 h invents a schedule the client never approved, and the payroll
then rests on a fabricated timesheet. Raise it with the client.

## Verify before and after reporting

**Before `Salvar` — the only moment that matters:**

1. All three grids read `Registros: 1` (walk the parents; see above).
2. Every required select has a non-empty `input[type=hidden]`:
   `EMPREGADO`, `PRAZO_INDETERMINADO`, `NORMAL`, `DEDUCOES_LEGAIS`,
   `PRIMEIRO_EMPREGO`.
3. `dataAdmissao` matches the source XML.

**After `Salvar`:**

1. Navigate **away and back** before reading the list. A read taken
   immediately after saving reports *"Nenhum registro encontrado"* — stale DOM,
   not a failed save. Two confirmed phantom failures came from this.
2. One row per worker. **Two rows for the same name means a duplicate was
   written** — a previous `Salvar` went through despite showing an error.
3. Reopen the record: `Cargos`, `Salários` and `Horários` each have one row.
   **Grids collapse on reopen** — expand before reading.
4. Confirm **Matrícula eSocial** was system-generated, not typed.

## Beyond this

`S-2200` generation is **L4** and out of scope. When `Salvar` offers
*"Deseja gerar o evento S-2200 pendente?"*, answer **No**. The transmissão
decision belongs to the client.

## Where the numbers come from

| Field | Source |
|---|---|
| CBO, salary, admission, schedule | the client's own `S-2200` XML — it carries `CBOCargo`, `vrSalFx`, `dtAdm`, `tpRegJor`, `qtdHrsSem`, `dscJorn` |
| category, contract type | `codCateg`, `tpContr` in the same XML |
| union | `cnpjSindCategProf` — the S-2200 will carry a union CNPJ the ficha de registro never mentions |
| rest day | the ficha's schedule line, e.g. `08:00-12:00 - 13:00-18:00 DOM` |

Reading the S-2200 first removes every guess about the vínculo's shape.

Base directory for this skill: /home/emanuel/.agents/skills/calima-register-vinculo