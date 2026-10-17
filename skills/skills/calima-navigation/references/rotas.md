# Verified routes and catalogs

Everything here was read off a running Calima 5.4.8.1.10 instance (stable,
production) and confirmed against the screen, not inferred.

## Module dashboards

Every module dashboard anchor is present in the sidebar DOM at all times. Click
the anchor; never type the URL.

| Module | Dashboard | Module |
|---|---|---|
| Principal | `/ger/dashboard` | Manutenção, Responsável, Empresa, CEP, Controle de usuário |
| Folha de Pagamento | `/mfp/dashboard` | eSocial, trabalhadores, folha, Calculating |
| Cadastro | `/mcg/dashboard` | |
| Folha | `/mlf/dashboard` | |
| Contas a Pagar | `/mcp/dashboard` | |
| Honors | `/mho/dashboard` | |
| Connect | `/connect/dashboard` | |
| Box | `/box/dashboard` | |
| Site | `/site/dashboard` | |
| Integra Contador | `/mic/dashboard` | |

## Principal — Manutenção (the `ger` module)

| Route | Screen |
|---|---|
| `/ger/empresaSearchView` | Empresa — list. `Incluir` opens the cadastro. Row actions link to `/ger/empresaSearchView/edit/<id>` |
| `/ger/responsavelSearchView` | Responsável — list. Row actions link to `/ger/responsavelSearchView/edit/<id>` |
| `/ger/grupoEmpresaSearchView` | Grupo de empresas |
| `/ger/relacaoEmpresaReportView` | Relação de empresas |

**The company cadastro is in `ger`, not `mfp`.** The eSocial tax
classification and "Tipo de empresa" are fields of this form.

## Folha de Pagamento — eSocial

| Route | Screen |
|---|---|
| `/mfp/monitorEventoEsocialProcessView` | **Monitor de Eventos** — the screen used most |
| `/mfp/sincronizacaoEventosEsocialProcessView` | eSocial › Importação › Sincronização de eventos |
| `/mfp/importacaoXMLEventosProcessView` | Import XML (S-2210 / S-2220 / S-2240) |
| `/mfp/grupoEventoSearchView` | Grupo de eventos |
| `/mfp/eventoSearchView` | **Evento — this is the S-1010 rubrica catalog** |

## Folha — worker maintenance

| Route | Screen |
|---|---|
| `/mfp/trabalhadorSearchView` | Trabalhador (personal data) |
| `/mfp/vinculoSearchView` | **Vínculo** — the record that produces the S-2200 |
| `/mfp/vinculoEventoEditView` | Evento de vínculo: Normal |
| `/mfp/dependenteSearchView` | Dependente |
| `/mfp/feriasEditView` | Férias |
| `/mfp/rescisaoEditView` | Rescisão |
| `/mfp/afastamentoEditView` | Afastamento |
| `/mfp/catSearchView` | CAT / S-2210 |
| `/mfp/quadroHorarioSearchView` | Quadro de horário |

## Folha — tables and calculations

| Route | Screen |
|---|---|
| `/mfp/rubricaHomolognetSearchView` | **Rubrica — NOT the S-1010.** 36 records; a payroll-rubrica catalog (Salário Fixo, Garantia, Produção…) |
| `/mfp/calculoParametrosProcessView` | Calcular folha — never confirm, it is L4 |
| `/mfp/consultaCalculosProcessView` | Consultar cálculos de funcionários |
| `/mfp/cargoSearchView`, `/mfp/cboSearchView`, `/mfp/centroCustoSearchView` | Tables |
| `/mfp/valeTransporteSearchView`, `/mfp/planoSaudeSearchView` | Tables |
| `/mfp/feriasDeducaoFaltasSearchView` | Tables |

## Catalogs already read

### Evento (S-1010 rubrica catalog) — 216 records

Read 06/10/2026 from `/mfp/eventoSearchView`, columns `Código`, `Descrição`,
`Tipo`, `Fórmula`, `Sub-fórmula`, `Enviar ao eSocial`. Counter on screen:
`Registros: 216`.

- **163** marked `Enviar ao eSocial = Sim`
- **53** marked `Não`

`Enviar ao eSocial = Não` means the rubrica **does not enter the S-1010**, even
when the payroll uses it. This is the single most consequential column in the
whole system.

Collection note: the pager only advances between separate `evaluate` calls, and
100-per-page gave pages of 1..241, 243..343, 344..359 — 216 unique. Code **71**
(INSS) is easy to miss because it sits between 70 and 72.

The full 216-row extract, plus the mapping against the retired eContab
standard, is in `calima-esocial-s1010-rubricas`.

### Rubrica catalog — 36 records

`/mfp/rubricaHomolognetSearchView`. **This is not the S-1010.** It is the
payroll rubrica catalog used by the folha screen. Looking for the S-1010 here
wastes time.

### Classificação tributária options

From `/mfp/eventoSearchView`'s sibling form (`/ger/empresaSearchView/edit`,
tab *eSocial / EFD-Reinf*):

| Code | Meaning |
|---|---|
| `01` | Simples Nacional, contribuição previdenciária **substituída** |
| `02` | Simples Nacional, previdência **não** substituída |
| `03` | Simples Nacional, substituída **e** não substituída |
| `04` | MEI |
| `06`–`11`, `13`, `14`, `21`, `22`, `60`, `70`, `80`, `85`, `99` | Other regimes |

The hidden input carries the literal value, e.g. `CLASSIFICACAO_01`.

## Known blank route

`/mfp/rubricaHomolognetSearchView` dropped the session when reached by direct
URL. Reached by clicking the menu link, it works. Consistent with the general
rule: **click, never type**.
