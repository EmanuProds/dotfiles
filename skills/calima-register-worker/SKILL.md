---
name: calima-register-worker
description: Register workers and their vínculos in Calima ERP Contábil — módulo Folha › Manutenção › Trabalhador and Vínculo. Use when asked to cadastrar funcionários, criar vínculo, register dependentes or afastamentos, or continue a payroll cadastro. Documents the four mandatory validation gates, the fields the eSocial does not need, the two-step save flow, and which fields belong to immigrant workers and must stay empty. Verified on four registrations.
allowed-tools: browser Read Grep Glob Shell
user-invocable: true
---

> Authorisation: `calima-erp`. Driving the form: `calima-navigation`.
> Silent failures: `calima-rules`.
>
> Verified 06–07/10/2026 across four workers at a Simples Nacional company.
> Unlike the earlier version of this file, every step below was executed.

## Two records

| Record | Route | Holds |
|---|---|---|
| **Trabalhador** | `/mfp/trabalhadorSearchView` | the person — identity, documents, address, phone |
| **Vínculo** | `/mfp/vinculoSearchView` | the employment relationship — admission, role, salary. **Produces the S-2200** |

## Vínculo — a separate record, not part of this form

`/mfp/vinculoSearchView`. Saving the trabalhador does **not** create a vínculo:
no payroll, no S-2200, no eSocial event until the vínculo exists separately.
Its own save gate demands three things at once — salário, cargo, quadro de
horários — and the salary and schedule are entered in grids, not in the panels
whose names suggest them. That procedure is its own skill:
**`calima-register-vinculo`**.

## Field constraints this form enforces

Three masks reject the obvious input. All three cost a save cycle to discover.

| Field | Rejects | Accepts |
|---|---|---|
| `pis` | `201.977.809-08` — *"Campo deve ter no máximo 11 caracteres"* | **digits only**, `20197780908` |
| `identidadeOrgaoExpedidor` | `DETRAN/RJ` — *"Apenas letras, espaços e acentos são permitidos"* | `DETRAN RJ` |
| masked dates and `cpfFmt` | a native-setter write — see `calima-rules` 24 | `browser.press`, one character at a time, then `Tab` |

## Naturalidade — two selects that fight each other

The pair `naturalidadeUF` and `naturalidadeCidade` behave differently from every
other select on the form, in three ways that each cost a retry:

1. **Typing does not open the menu.** Focus the input, then `ArrowDown`. Only
   then do options appear. Typing first returns `0 results available`.
2. **Selecting the UF clears the city.** Set the UF first, then the city —
   never the other way round.
3. **The city list is short** and does not contain every IBGE municipality.
   Sweep it before concluding a city is absent; if genuinely missing, add it at
   *Módulo Principal › Manutenção › CEP › Cidade*.

Search `rj` in the UF select and `Rio` in the city select — short prefixes.
Reading the options once and pressing `Enter` immediately often lands on
nothing; re-read, then press. See `calima-rules` 26.

## Saving — two dialogs, in this order

Saving a worker opens two dialogs in sequence. Both must be answered.

| Dialog | Answer | Why |
|---|---|---|
| `A CTPS é necessária na emissão de arquivos digitais… Deseja salvar mesmo assim?` | **Sim** | advisory, not blocking |
| `Deseja incluir um vínculo ou dependente agora?` | **Concluir** | we register the worker first; the vínculo is a separate record |

> **Verified 12/10/2026 — these dialogs are NOT advisory, they gate the write.**
> Leaving the first one open means `POST persistence/persist` **never fires**: the
> fields keep the values you typed on screen, so the form _looks_ saved, and the
> record silently reverts to the old values on the next load. This cost a full
> re-entry of four identity corrections. Answer `Sim`, then `Concluir`.
>
> **The only valid verification is a reload.** Reading the fields after clicking
> `Salvar` shows your own typed values back at you (client state). Navigate to a
> list, come back to `edit/<id>`, and read there — or check
> `browser.network.list({ urlContains: 'persistence/persist' })` for the POST.
>
> After answering `Sim` the SPA sometimes navigates by itself to the page you
> visited before the form. That is not a failure; verify state on the server.

Both live in `.modal-dialog.alertContainer-modal`, outside `.modal-content`.
See `calima-rules` 14.

## The two-step save

Saving a worker opens **two** dialogs in sequence. Both must be answered.

| Dialog | Answer | Why |
|---|---|---|
| `A CTPS é necessária na emissão de arquivos digitais… Deseja salvar mesmo assim?` | **Sim** | only if CTPS fields are empty. Advisory, not blocking |
| `Deseja incluir um vínculo ou dependente agora?` | **Concluir** | we register the worker first; the vínculo is a separate record |

## The four gates

The save is refused with one modal listing every unmet gate. Read it in full.

1. **At least one address**, marked Principal — lives in `Dados complementares`
2. **At least one phone**, marked Principal — same tab
3. **RG emission date** (`identidadeDataEmissao`) — mandatory, and usually absent from the acervo
4. **Naturalidade** — `naturalidadeUF` **and** `naturalidadeCidade`, both mandatory. Leaving the section untouched is enough to skip it; filling UF alone is not

Gates 3 and 4 are Calima's own requirements, not the eSocial's. See
[What the eSocial does not need](#what-the-esocial-does-not-need).

## Two tabs

`Dados principais` holds identity, documents and the accordions (Título de
eleitor, Carteira de habilitação, Carteira de trabalho, Passaporte).
`Dados complementares` holds three grids: **Endereços, Telefones, E-mails** —
the two save gates live here, and they collapse on reopen.

## Fields that belong to immigrant workers — leave empty

Two fields on the main tab are traps. They are not about the worker:

| Label | Real meaning |
|---|---|
| `Residência` | `tempoResidenciaTrabImigrante` — time of residence of an **immigrant** |
| `Situação` | `condicaoTrabalhadorEstrangeiro` — condition of a **foreign** worker |

Their option lists read `Refugiado`, `Solicitante de Refúgio`, `Prazo
indeterminado`. Seeing those means you are looking at the wrong field: the
worker is Brazilian, leave both empty. They are also not validation gates.

## react-select ids

Two different variants are in play. Getting this wrong makes fields appear
to be missing:

- Main-tab fields: `react-select-dropdown__control` inside
  `<field>dropDown` (e.g. `sexodropDown`, `racadropDown`,
  `naturalidadeCidade`)
- Grids and Documents accordions: `react-select__control` inside
  `idnaturalidadeCidade`, `idcarteiraTrabalhoUF`

`react-select-123-input` ids renumber on every re-render. Target the stable
`<field>dropDown` / `id<field>` wrapper instead.

Some selects load no options under a synthetic `mousedown`; a keyboard
`ArrowDown` opens them. See `calima-rules`.

## The naturalidade municipality catalogue is short

The city list is not the full IBGE set — it holds only municipalities
already in use in this environment. Verified 07/10/2026:

| UF | Available |
|---|---|
| MG | Juiz de Fora, Ladainha, Matias Barbosa, **Recreio (3154101)** |
| RJ | Rio de Janeiro, Campos dos Goytacazes, São Francisco de Itabapoana |

Before concluding a municipality is missing, sweep the list by letter
(`ArrowDown` then filter `A`..`W`). Probing one name proves nothing.
**Recreio/MG is IBGE 3154101** — not 3154600, which is Ribeirão das Neves.

Missing municipalities are added at `Módulo Principal › Manutenção › CEP ›
Cidade`, and that immediately makes them selectable here.

## What the eSocial does not need

Do not let a missing document block a registration that the portal would
accept. For **S-2200, category 101**, the mandatory fields are:

CPF · Nome · **Sexo** · **Raça/Cor** · Grau de Instrução · Data de
Nascimento · naturalidade or country of birth · address · **PIS/PASEP** · cargo,
category, admission date.

**Not required:** RG number, RG emission date, CTPS, voter title.

- **RG emission date** — Calima's own requirement. The S-2200 schema has no
  such field (confirmed against the 90 distinct tags in the company's own
  S-2200 XMLs).
- **Sexo** — mandatory in eSocial, and absent from the ficha de registro
  form, which has no such column. Must be supplied from the client.
- **PIS** — mandatory, and a real gap when the RG prints `00000000000`:
  that means never issued, not a transcription error. Leave blank and
  resolve before generating the event.

## Where the data comes from

| Field | Source |
|---|---|
| CPF, PIS, RG, CTPS, address, parents, naturalidade | ficha de registro |
| RG emission date, real PIS | the RG scan, when one exists |
| PIS when missing | a CAIXA `cadastronis` confirmation screenshot |
| Sexo | the client — never inferred from the name without saying so |
| Phone | often nowhere; ask before borrowing the company number |

Cross-check every CPF and PIS against its check digits before entering it.
OCR of a scanned energy bill misread one digit and produced an invalid CPF.

## Worked example — four workers

Company **Varanda Lanche e Pizzaria Ltda** (CNPJ 32.837.272/0001-37),
`Registros: 0 → 4`.

| # | Worker | CPF | PIS | CTPS | Admission |
|---|---|---|---|---|---|
| 1 | Alessandra Tavares da Silva Pereira | 141.902.267-93 | — | 1419022 / 6793 / RJ | 06/03/2026 |
| 2 | Roseli dos Santos Sobrinho | 121.590.877-69 | 12670826549 | 1215907 / 7769 / RJ | 08/08/2026 (readmissão) |
| 3 | Thaison Luan Vicente Ferreira | 164.460.527-90 | 16674365077 | 1644605 / 2790 / RJ | 02/02/2025 |
| 4 | Thierre Pablo Vicente Ferreira | 164.244.957-11 | 16674367835 | 1642449 / 5711 / RJ | 02/12/2024 |

Roseli's admission has a paper trail worth reading before any vínculo: her
S-2200 history in the portal is `dtAdm 2024-03-01` → retified to
**2024-03-20** → readmitted **08/08/2026**. The portal holds the 2024
admission with **no S-2299**, so that vínculo must be terminated before any
new event is generated. That is L4.

## Deliberate gaps to report, never to invent

Four fields were filled with a placeholder or left blank by decision, and
each must be reported:

- **RG emission date** `01/08/2023` on workers 2–4 — that is worker 1's real
  date. The client had not yet produced the RGs.
- **Phone** `(22) 99943-1643` on all four — the company number. No worker
  phone exists in any document.
- **PIS** empty on worker 1 — correct, the RG prints `00000000000`.
- **Sexo** supplied by the client, not derived from documents.

## Verify before reporting

1. `Registros: N` on the list, and the row's CPF, RG, CTPS and PIS match.
2. Reopen the record: re-read every field, and open `Dados complementares` —
   the grids **collapse on reopen**, and reading them collapsed looks like
   data loss.
3. Screenshot. The DOM does not reliably show validation errors on this
   form (see `calima-rules`).

## Vínculo — see `calima-register-vinculo`

The vínculo procedure is documented separately. It carries its own save gate,
its own salary grid and its own schedule flow, and none of it is reachable from
the trabalhador form.

Saving a vínculo asks **`Deseja gerar o evento S-2200 pendente?`**. Answer
**No** — generating an event is L4.

Payload already verified for the four Varanda vínculos, from the 08/2026
payroll:

| Worker | CBO | Role | Salary 08/2026 |
|---|---|---|---|
| Alessandra | 513435 | Chapeiro | 1.850,00 |
| Roseli | 421125 | Operador de caixa | 1.860,00 |
| Thaison | 513405 | Garçom | 1.650,00 |
| Thierre | 513610 | Pizzaiolo | 1.850,00 |

Assumptions still unconfirmed: 44 h/week for all four; Thierre has four
afastamentos in 08/2026 (one O3 accident, three P3 illness) needing
`/mfp/afastamentoEditView` records; Thaison and Thierre show eConsignado,
to be confirmed in the portal.