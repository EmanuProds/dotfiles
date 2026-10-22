---
name: calima-register-responsible"
description: Register the responsável — accountant, partner or administrator — in Calima ERP Contábil, module Principal › Manutenção › Responsável. Use when asked to cadastrar o responsável, o contador, the sócio or the administrador of a company. Documents the three tabs, which fields accept digits only, where the required address and phone really come from, and how the responsável becomes linked to the company.
allowed-tools: browser Read Grep Glob Shell
user-invocable: true
---

> Authorisation: `calima-erp`. Driving the form: `calima-navigation`.
> The digit-only masks and the modal rules referenced here live in
> `calima-rules`.

## Route

`Módulo Principal › Manutenção › Responsável` → `/ger/responsavelSearchView`

`Incluir` opens `/ger/responsavelSearchView/edit`. Row actions link to
`/ger/responsavelSearchView/edit/<id>`.

## Why this comes before the company

The company form's responsável selector (`id="responsavel"`) lists the
responsáveis **already registered**. So the person must exist first, and the
link is made by writing the **company's CNPJ into the responsável's own record**
— not the other way round.

```
Responsável (CNPJ 32.837.272/0001-37)  →  Empresa form's #responsavel shows the person
```

## Three tabs, twelve fields

The form is tabbed. Every tab ships with `warning-tab` until it is complete,
and an incomplete tab keeps the record unsavable.

### Tab 1 — Dados Pessoais

| Field | Notes |
|---|---|
| `cpfFmt` | masked, accepts punctuation |
| `cnpjFmt` | **the company's CNPJ** — this is the link |
| `cei` | CEI/CNO; a Ltda has none, leave empty |
| `nome` | |
| `dataNascimento` | masked; needs the `keyup` event to format |
| nationality | **react-select**, not a text field |
| marital status | **react-select** |
| `email` | |
| `rg` | **digits only** |
| `orgaoEmissor` | free text, e.g. `DETRAN/RJ` |
| `telefoneFmt` | **required**, digits in, mask formats out |

### Tab 2 — Dados Responsável

| Field | Notes |
|---|---|
| Type | **react-select, no label, `id` absent but it is the responsável role**. 21 options: Administrador, Sócio, Contador, Diretor, Empresário, Procurador, Liquidante, Conselheiro… |
| `cargo` | required, free text |
| `numeroConselho` | only for a contador |
| `dataValidadeCRC` | only for a contador |

The role options are read from `Gerenciar > Responsável`. Pick by what the
contract social says the person is. A partner described as *sócio-administrador*
with powers of administration is `Administrador`; the `Cargo` field is where the
full phrase goes.

### Tab 3 — Endereço

| Field | Notes |
|---|---|
| CEP | **react-select**; selecting it auto-fills Tipo, UF, Cidade and Bairro |
| street type | disabled until CEP is picked; the list is truncated — see below |
| UF, Cidade, Bairro | react-selects |
| `logradouro`, `numero`, `complemento` | text |
| Principal / Residencial / Cobrança / Comercial | `tipoEnderecoPrincipal` and friends |

## Required fields, exactly

Validation messages seen on save:

| Message | Cause |
|---|---|
| `Somente são permitidos números ou letras.` | `rg` with punctuation |
| `Campo não pode estar em branco` | `rg` or `telefoneFmt` empty |
| `Somente são permitidos números.` | not this form — the IE mask belongs to the empresa |

The four Endereço fields that must be filled are **CEP, street type, UF, Cidade,
Bairro and Logradouro**. All of them block the save.

## Two traps specific to this form

### The person's address is not the company's

For Varanda, the company sits at Av. Vereador Edenites da Silva Viana, 227,
Centro. The partner lives at Rod. Simão Mansur, s/n, Volta Redonda — from the
shareholders' clause of the contract social. Filling the company address would
have been wrong, and plausible enough to slip through.

### The street type list is truncated

Selecting the CEP fills street type and Bairro from **that CEP's dominant
entry**, which for 28.230-000 is `Rodovia` in `Volta Redonda`. For the partner
that happens to be right; for the company it is not.

The street-type dropdown renders about ten entries and does not scroll, so
`Avenida` was unreachable. Left as the CEP default; the word `AVENIDA` carries
in the logradouro text. Say this in the report rather than forcing a wrong
value.

## Where the data comes from

| Field | Source |
|---|---|
| name, CPF, birth date, nationality, marital status, RG, issuing authority | consolidation of the contract social |
| the partner's own address | shareholders' clause, same document |
| **phone** | usually **only** on a DANFE. It was absent from the contract, the voter ID, the driver's licence, the CNPJ card and the IE certificate |

For Varanda the phone `(22) 99943-1643` came from the issuer block of NF-e nº 1.
The same NF-e carried a second number, `(22) 99874-1165` — that was the
**recipient**, not the company. Read the issuer block, not the first number that
appears.

## Worked example — Varanda Lanche e Pizzaria Ltda

Record `/ger/responsavelSearchView/edit/756401`, saved 06/10/2026 and verified
by reopening.

```
CPF            077.095.397-26
CNPJ           32.837.272/0001-37        <- links the person to the company
Nome           JORGE LUIZ VIEIRA ALVES
Nascimento     11/09/1979
Nacionalidade  Brasileiro
Estado civil   Casado
RG             114627342                  <- digits only
Órgão emissor  DETRAN/RJ
Telefone       (22) 99943-1643
Tipo           Administrador
Cargo          Sócio-Administrador
CEP            28230000
Logradouro     RODOVIA SIMÃO MANSUR
Número         0
Complemento    RUA BENEDITO SÁ FIGUEIRA, CASA/10
Bairro/UF/Cid  Volta Redonda / RJ / São Francisco de Itabapoana
```

Confirm after saving: the list count rises by one, and the person appears with
the company's CNPJ filled and the intended `Tipo`.

## Verify before reporting

1. Screenshot the list — is the count up, is the row correct?
2. Reopen the record — did the Endereço tab persist? Selects renumber on reload,
   so a stale id reading looks like an empty field when it is not.
3. Confirm no tab still carries `warning-tab`.
