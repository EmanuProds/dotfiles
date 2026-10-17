---
name: calima-register-company
description: Register a company in Calima ERP Contábil — módulo Principal › Manutenção › Empresa — including its tabs, address, phones and tax vigência. Use when asked to cadastrar a empresa, when an empresa will not save, or when a validation message asks for a principal phone, a principal address or a tax vigência. Documents the four gates that block the save, the digit-only masks, and the eSocial classification rule for Simples Nacional.
allowed-tools: browser Read Grep Glob Shell
user-invocable: true
---

> Authorisation: `calima-erp`. Driving the form: `calima-navigation`.
> Masks and modal rules: `calima-rules`.
> The responsável must exist first — see `calima-register`.

## Route

`Módulo Principal › Manutenção › Empresa` → `/ger/empresaSearchView`

`Incluir` opens `/ger/empresaSearchView/edit`. Rows link to
`/ger/empresaSearchView/edit/<id>`.

**The company cadastro is in `ger`, not `mfp`.** The eSocial tax
classification and "Tipo de empresa" are fields of this form.

## Shape of the form

Six tabs plus four grids. The tabs carry `warning-tab` until complete, and any
incomplete tab blocks the save.

| Tab | Content |
|---|---|
| Dados principais | identity fields, plus the four grids |
| Dados complementares | company type, tax regime, **responsável**, contador |
| Registro da empresa | Junta Comercial, NIRE, opening date, CNAE |
| eSocial / EFD-Reinf | **classificação tributária** and the eSocial parameters |
| Observações gerais | free text |

The first three fields — `codigo`, `cnpjFmt`, `razaoSocial` — sit **above** the
tab panes, outside any `.form-group`. Address them by `name`.

### The four grids

`Endereços`, `Telefones`, `E-mails`, `Vigências de tributações`. Each has a
toolbar above the grid with `addButton-<grid>`, `editButton-<grid>` and
`removeButton-<grid>`, and each ships **collapsed** — expand before clicking
(see trap 10 in `calima-rules`).

## The four gates that block the save

The save is refused with one modal listing every unmet gate at once. Read it in
full; it is the whole to-do list.

```
Atenção — Existem informações inválidas. Verifique os campos indicados abaixo:
  Pelo menos um telefone deve ser cadastrado como principal.
  Pelo menos um endereço deve ser cadastrado como principal.
  Pelo menos uma vigência de tributação deve ser cadastrada.
  Vigências de tributações — É obrigatório que haja precisamente 1 (uma)
  vigência com o campo "Referência no fim da vigência" em branco.
```

| Gate | How to satisfy it |
|---|---|
| phone as principal | add a phone with **any** type and save; the app promotes it to Principal automatically |
| address as principal | check `tipoEnderecoPrincipal` in the address grid |
| at least one vigência | `addButton-tributacoes` |
| exactly one vigência with an **empty end** | leave `refFimVigenciaFmt` blank. Using the native setter to clear it does **not** work — the mask restores the old value. Use `browser.fill` with an empty string on the dialog ref. |

## The gates nobody sees until you hit `Salvar`

Beyond the four grid gates above, two **tab-level** requirements block the save
with no message on the button — the form just refuses and fires no request:

| Gate | Tab | Value |
|---|---|---|
| **Data início atividade** | `Registro da empresa` | required, masked, real keys |
| **Responsável** | `Dados complementares` | `id="responsavel"`, no visible label |
| **Contador** | `Dados complementares` | react-select, short prefix |

**`warning-tab = 0` is the real gate.** Count the incomplete tabs before saving:

```js
[...document.querySelectorAll('.warning-tab')].filter(x => x.offsetParent !== null)
```

Any result means `Salvar` will dispatch **no request at all** — no POST, no
toast, no console error. It reads exactly like a dead button. See
`calima-rules` 29.

## Field constraints

| Field | Constraint |
|---|---|
| `ie` | **digits only** — `14.004.67-0` must be entered as `14004670` |
| `numIdentOrgao` | **digits only** — NIRE `33.2.1309333-0` → `33213093330` |
| `cnaefDesmembramento` | **`maxLength=2`**. It cannot hold CNAE codes. Leave empty; record the real secondary CNAEs in the manual. Error: `Campo deve ter no máximo 2 caracteres` |
| `cnpjFmt`, `cnpjFmt` | masked, punctuation accepted |
| `cnaef` | main CNAE, digits |

## eSocial classification

In the *eSocial / EFD-Reinf* tab. Pick by regime, not by payroll:

| Regime | Code |
|---|---|
| Simples Nacional, previdência **substituída** | `01` |
| Simples Nacional, previdência **não** substituída | `02` |
| Simples Nacional, both | `03` |
| MEI | `04` |

The hidden input carries the literal, e.g. `CLASSIFICACAO_01`. Confirm it, not
the visible label.

**A payroll run does not imply `03`.** `03` means the company has genuinely both
substituted and non-substituted contributions — it is not a "has payroll"
marker. Simples Nacional sits at `01` or `02` according to the regime.

With `01` selected, "Indicador de contribuição substituída" becomes
`disabled` — that is expected, not a defect.

## Company type and tax fields

`Dados complementares`:

| Field | Value for a Simples Nacional company |
|---|---|
| Company type | check the checkbox matching the CNAE — commerce, industry, services |
| MEI | leave **unchecked** unless it really is one |
| `grandePorte` | leave unchecked for a micro or small company |
| Natureza jurídica | from the CNPJ card, e.g. `206-2 — Sociedade Empresária Limitada` |
| Tipo de contribuição | `Alíquota Básica` for Simples Nacional |
| Incidência tributária | `Não Cumulativo` for Simples Nacional |
| `codigoAcessoSimplesNacional` | from the portal, when you have it |
| Responsável | `id="responsavel"`, **no visible label** — lists already-registered responsáveis |
| Contador | react-select, matches on a short prefix (`W` works, `WELLINGTON` does not) |

The `responsavel` selector **looks empty until you type**. Its options are
loaded but do not render on open. Type `JOR` and the person appears. If it is
empty and never responds, the person was never registered — go back to
`calima-register-responsible`.

## Address grid

Selecting the CEP auto-fills street type, UF, Cidade and **Bairro** from that
CEP's dominant entry. **Verify Bairro against the contract social** — for
Varanda, CEP 28.230-000 produced `Volta Redonda`, which is the partner's
personal bairro, while the company is in `CENTRO`.

Correcting Bairro needs `fill` + a real click; the dropdown will not open under
synthetic events.

The `Principal` checkbox is enabled here (unlike the phone's), so it can be
checked directly.

## Worked example — Varanda Lanche e Pizzaria Ltda

Record `/ger/empresaSearchView/edit/756459`, code `4`, saved 06/10/2026 and
verified by reopening.

```
cnpjFmt            32.837.272/0001-37
razaoSocial        VARANDA LANCHE E PIZZARIA LTDA
nomeFantasia       VARANDA LANCHE E PIZZARIA
situação           Ativa
ie                 14004670                    <- digits only
codigo             (blank; the app assigned 4)

Dados complementares
  tipo             Comércio
  MEI              unchecked
  natureza         206-2 — Sociedade Empresária Limitada
  tipo contrib.    Alíquota Básica
  incidência       Não Cumulativo
  responsável      JORGE LUIZ VIEIRA ALVES
  contador         WELLINGTON BATISTA PEREIRA

Registro da empresa
  JUCERJ, NIRE 33213093330, início 20/02/2019
  transformação simples → empresarial  23/08/2024
  CNAE 5611203;  cnaefDesmembramento (vazio — maxLength 2)

eSocial / EFD-Reinf
  classificação    CLASSIFICACAO_01

Endereços  [1]
  AVENIDA VEREADOR EDENITES DA SILVA VIANA | 227 | 28.230-000
  CENTRO | São Francisco de Itabapoana | Principal

Telefones [1]
  JORGE LUIZ VIEIRA ALVES | (22) 99943-1643 | Celular, Principal

Vigências [1]
  Simples Nacional | início 02/2019 | fim (blank) | Tributação vigente
```

## Verify before reporting

1. Company list count rose, and the row shows the expected code and CNPJ.
2. Reopen the record: all five tabs clear of `warning-tab`, zero visible
   validation errors.
3. Re-read the four grids. **The grids are collapsed on reopen** — expand them;
   reading them collapsed returns nothing and looks like data loss.
4. Screenshot. The DOM lies here more than anywhere else in the app.

## The whole-company sequence, verified 09/10/2026

Four companies taken end to end this day — BAZAR, FARINHA, CARLOS CAR,
SALGADERIA DA NIQUE — at **~13 calls each**, down from ~30.

| # | Call | Does |
|---|---|---|
| 1 | click `Incluir` | form mounts on the *next* call, not this one |
| 2 | digit CNPJ real + click RF | first click always no-ops — rule 44 |
| 3 | read `razaoSocial`; click RF again if empty | rule 44 |
| 4 | read the three grids | RF populates endereço and telefone too |
| 5 | `addButton-tributacoes`, type `Simples` | |
| 6 | pick, set `refInicioVigenciaFmt` whole, `Salvar` | rule 49 |
| 7 | complementares: Comércio + 4 selects in one evaluate | rule 48 |
| 8–9 | responsável, **full name**, two calls | rule 47 |
| 10 | contador + IE + *Registro* tab + switch to *eSocial* | |
| 11–12 | classification `01`, then pick + `warning-tab` + `Salvar` | rule 29 |
| 13 | navigate to the list, re-read | rule 33 |

**Do not shortcut steps 2–3 or the company will silently refuse to save.**

## `warning-tab = 0` is necessary, not sufficient

Three gates do not surface in `warning-tab`, each confirmed by a failed save:

| Gate | Symptom |
|---|---|
| **CPF invalid** (rule 43) | nothing at all; same company saves on the next click with a valid CPF |
| **`cnpjFmt` written programmatically** (rule 46) | *"O campo CNPJ não pode estar em branco ou incompleto!"* on a field displaying a complete CNPJ |
| **a grid row lost to premature navigation** (rule 45) | company refuses to save; the missing row is in a grade already left behind |

The only trustworthy confirmation is the **list count rising**.

## Not every company saves — and the app never says why

R. V. LEITE ÓTICA (`03.116.103/0001-00`) failed **four** complete attempts:
`warning-tab` = 0, `Salvar` clicked, no error, no modal, no toast, count flat.
Two causes were eliminated by experiment (a missing phone; a programmatic CNPJ).
What remains unique to that record:

- **IE `75.957.513`, deactivated *de ofício* since 15/08/2018**
- **no phone on the CNPJ card** — the only such company in the batch
- the oldest CNPJ in the batch (opened 08/10/1998)

**Treat a tax figure the fisco has cancelled as reportable, not writable.** An IE
desativada de ofício in a live fiscal system can be rejected by SEFAZ. The
conservative position is to leave the field empty, record the divergence in the
project log, and let the contador decide. Do not "complete" a record with a
number you believe was cancelled.

## Companies outside the Simples Nacional

The `01`–`04` classification codes and the *Alíquota Básica* / *Não Cumulativo*
pair are **Simples-specific**. A company documented as *Porte DEMAIS — fora do
Simples* must not receive `CLASSIFICACAO_01`; that is a false tax classification
in a live record, not a cosmetic default.

For those, `Tipo de contribuição`, `Incidência tributária`, the vigência row and
the eSocial classification all have to be read off the real regime (Lucro
Presumido / Lucro Real) instead of copied from the Simples recipe. **Stop and
read the options in the form** rather than assuming — the option list is the
authority, and the project doc is the source of the regime.

`Empresário Individual` is a different shape again: natureza jurídica `213-5`,
not `206-2`.

## Left deliberately unset

Report these rather than inventing values:

- `cnaefDesmembramento` — cannot hold CNAE codes.
- `ie` when the source says *não localizada* — leave it empty.
- Address street type — truncated dropdown; left at the CEP default with the
  correct word in the logradouro.
- `nomeFantasia` when the CNPJ card leaves it blank — do not derive it from the
  razão social. A blank is a fact; a guess becomes a record.

## `Importar dados da RF` is the way to get the address — and it works

An earlier version of this file listed the button as producing *no visible
effect*. **That was wrong.** Verified 08/10/2026 on BAZAR E MERCEARIA MOURARIA
LTDA, CNPJ `31.310.873/0001-24`:

```js
// 1. type the CNPJ, then
[...document.querySelectorAll('button')]
  .find(x => /Importar dados da RF/i.test(x.innerText) && x.offsetParent !== null)
  .click();
```

It populated `razaoSocial` and created the `Endereços` grid row in one click:

```
SÃO LUIZ GONZAGA | 777 | 21.730-710 | Realengo | Rio de Janeiro | Principal
```

**It bypasses the local CEP catalogue entirely.** This matters because the
catalogue is tiny (see `calima-rules` 36) and its `Tipo` de logradouro has no
plain `Rua`, which silently blocks saving a new logradouro (`calima-rules` 38).
**Use the RF import first, always** — it is both faster and more accurate than
drilling *Manutenção › CEP › País/UF/Cidade/Bairro/Logradouro* by hand, and it
satisfies the "at least one address marked Principal" gate on its own.

**Use it before typing anything else.** It fills razão social, nome fantasia,
endereço, telefone, e-mail, natureza jurídica and data de início de atividade
from the CNPJ card. Anything already typed may be overwritten.

**It also settles document conflicts — and it will contradict older paperwork.**
For BAZAR the instrumento de reactivation (22/04/2025) says **São Cristóvão**;
the CNPJ card says **Realengo**. Same street, same number, same CEP, different
bairro. Record the divergence and take the CNPJ card: it is the registered
address and the one that will be validated against the fisco.

Reading the row back — the grid ships collapsed:

```js
const add = document.getElementById('addButton-enderecos');
const col = add.closest('.collapse');
if (getComputedStyle(col).display === 'none') { col.classList.add('show'); col.style.display = 'block'; }
[...add.closest('.card').querySelectorAll('table tr')]
  .map(tr => [...tr.querySelectorAll('td')].map(c => c.innerText.trim()).join(' | '));
```
