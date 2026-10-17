# Routes verified in Calima

All under `https://stable.calima.app/mfp/<route>`. Verified 05/10/2026, build
**5.4.8.1.10**. Direct navigation works — `browser.navigate` is enough. A made-up
route lands on `/mfp/404`.

## Módulo Folha de Pagamento — eSocial

| Route | Screen |
|---|---|
| `monitorEventoEsocialProcessView` | **Monitor de Eventos** — the one you use most |
| `empresaEsocialConfigView` | eSocial › Configurações › Geral |
| `sincronizacaoEventosEsocialProcessView` | eSocial › Importação › Sincronização de eventos |
| `importacaoXMLEventosProcessView` | Import XML S-2210 / S-2220 / S-2240 |
| `reciboProtocoloEsocialReportView` | Recibo de protocolo |
| `comparativoEsocialReportView` | Comparativo Calima x eSocial |
| `ocorrenciaEsocialReportView` | Ocorrências eSocial (falhas/advertências) |
| `eventoReferenciaReportView` | Eventos utilizados na referência |
| `relacaoEventoTrabalhadorReportView` | Relação de evento x trabalhador |

## Módulo Folha de Pagamento — processes

| Route | Screen |
|---|---|
| `calculoParametrosProcessView` | **Calcular folha de pagamento** (never confirm) |
| `calculoReferenciaSearchView` | **Histórico de cálculos** — how many references ran |
| `consultaCalculosProcessView` | **Consultar cálculos de funcionários** — does the payroll have anyone? |
| `integracaoGrupoEventoProcessView` | Integração grupo evento |
| `procAutomatizadosFolhaProcessView` | Configurações de processos automatizados |
| `calculoProvisaoFeriasProcessView` | Provisão de férias analítico |
| `calculoProvisaoDecimoTerceiroProcessView` | Provisão de 13º |

Menu-only, no own route: **Fechamento/Restauração**, **Operações em lote**,
**Provisões**.

## Módulo Folha de Pagamento — worker maintenance

| Route | Screen |
|---|---|
| `trabalhadorSearchView` | Trabalhador (personal data) |
| `vinculoSearchView` / `vinculoSearchView/edit` | **Vínculo** — the record that produces the S-2200 |
| `vinculoEventoEditView` | Evento de vínculo: Normal |
| `vinculoEventoSimplificadoProcessView` | Evento: Simplificado |
| `vinculoEventoPlanoSaudeSimplificadoProcessView` | Evento: plano de saúde simplificado |
| `dependenteSearchView` | Dependente |
| `feriasEditView` | Férias |
| `rescisaoEditView` | Rescisão |
| `afastamentoEditView` | **Afastamento** — makes a reference no-movement |
| `catSearchView` | CAT / S-2210 |
| `monitoramentoSaudeTrabalhadorSearchView` | Exames / S-2220 |
| `exameToxicologicoSearchView` | Exames / S-2221 |
| `condicaoAmbientalTrabalhoSearchView` | S-2240 |
| `epiSearchView` | EPI |
| `quadroHorarioSearchView` | Quadro de horário |
| `grupoEventoSearchView` | **Grupo de eventos** (eSocial) |
| `tomadorServicoSearchView` | Tomador de serviço / obra |

## Módulo Folha de Pagamento — tables

`eventoSearchView`, `cargoSearchView`, `cboSearchView`, `centroCustoSearchView`,
`codigoGpsSearchView`, `sindicatoSearchView`, `feriadoSearchView`,
`feriasDeducaoFaltasSearchView`, `feriasDeducaoFaltasProporcionaisSearchView`,
`planoSaudeSearchView`, `rubricaHomolognetSearchView` (rubrica),
`avisoPrevioDiasSearchView`, `previdenciaComplementarSearchView`,
`fpasSearchView`, `customizacaoTermosSearchView`, `forcliSearchView`,
`valeTransporteSearchView`, `valorImpostoSearchView`,
`valorImpostoPLRSearchView`.

## Módulo Folha de Pagamento — GPS, DARF, reports

`guiaGpsSearchView`, `pagamentoCooperativaSearchView`,
`producaoRuralSearchView`, `compensacaoSearchView`,
`gpsDiversosAnexosSearchView`, `configDarfSearchView`,
`folhaAnaliticaReportView`, `folhaResumidaReportView`,
`folhaPresencaReportView`, `resumoFolhaReportView`,
`consolidadoFolhaReportView`, `memoriaCalculoDARFReportView`,
`memoriaCalculoGpsReportView`, `reciboProLaboreReportView`,
`conferenciaGRRFReportView`.

## Exports and imports

`bemExportacaoProcessView`, `exportacaoCagedProcessView`,
`exportacaoDirfProcessView`, `exportacaoManadProcessView`,
`exportacaoRaisProcessView`, `exportacaoGrrfProcessView`,
`exportacaoContraChequeSearchView`, `exportacaoDadosTrabalhadorProcessView`,
`importacaoNisProcessView`, `importacaoPontoEletronicoProcessView`,
`importacaoDOSProcessView`, `importacaoVinculoProcessView`,
`importacaoVinculoTomadorProcessView`, `importacaoEConsignado`.

## Sibling modules

| Module | Prefix | Landing |
|---|---|---|
| Contábil | `/ger` | `/ger/dashboard` |
| Fiscal | `/mcg` | `/mcg/dashboard` |
| Folha | `/mfp` | `/mfp/dashboard` |
| Controle Patronial | `/mlf` | `/mlf/dashboard` |
| Nitrus/Honorários | `/mho` | `/mho/dashboardnitrus` |
| Connect | `/connect` | `/connect/dashboard` |
| Box | `/box` | `/box/dashboard` |
| Site | `/site` | `/site/dashboard` |
| Integra Contador | `/mic` | `/mic/dashboard` |

## Discovering routes without guessing

The whole menu is in the DOM even while collapsed:

```
Array.from(document.querySelectorAll('a'))
  .map(a => (a.getAttribute('href')||'') + ' :: ' + (a.innerText||'').trim().replace(/\s+/g,' ').slice(0,50))
  .filter(s => /monitor|evento|esocial/i.test(s))
  .join('\n')
```

## The company cadastro is NOT here

Sections 1–6 of the PDF manual live in `Módulo Principal › Manutenção ›
Empresa` — prefix `/ger`. The eSocial **classificação tributária
([01]/[02]/[03]/[04])** and "Tipo de empresa" are there, **not** in the Folha
module. Do not look for them in `/mfp`.
