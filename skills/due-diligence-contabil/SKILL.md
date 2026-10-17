---
name: due-diligence-contabil
description: Conduz due diligence contábil-fiscal-trabalhista pré-M&A ou pré-investimento, identifica passivos ocultos, contingências e ajustes ao EBITDA, com relatório de findings classificado por risco.
allowed-tools: Read Grep Bash Edit Write
user-invocable: true
---

## Quando usar

Compra/venda de empresa, fusão, aporte de fundo (VC, PE), franquia, sucessão. Trabalho temporário (4-12 semanas) com escopo definido. Cliente tipicamente é o **comprador/investidor** ou banco de M&A.

## Inputs necessários

1. NDA assinado (Termo de Confidencialidade)
2. Acesso a data room (Google Drive, Intralinks, SharePoint)
3. Contrato com escopo, prazo, cut-off date e nível de materialidade
4. Lista padrão de documentos a serem entregues pelo target (request list)

## Escopo típico (4 dimensões)

### 1. Contábil
- Balanços e DREs dos últimos 3-5 anos auditados ou não
- Plano de contas e qualidade da escrituração
- Provisões: férias, 13º, FGTS, contingências, PCLD, impairment
- Imobilizado: existência, depreciação, impairment
- Estoques: inventário físico vs. contábil, obsolescência
- Receita: política de reconhecimento (CPC 47), corte de período
- Operações com partes relacionadas (sócio, controladas)
- Empréstimos com taxa diferente de mercado

### 2. Fiscal
- Regime tributário e comparação com cenários alternativos (skill 42)
- Apurações dos últimos 5 anos (decadência) — IRPJ, CSLL, PIS, COFINS, ICMS, ISS
- SPEDs entregues × pagamentos
- PER/DCOMP em aberto / glosadas
- Parcelamentos federais, estaduais, municipais
- Autos de infração + defesas
- Substituição tributária / DIFAL (estados de operação)
- Recuperações de créditos identificadas (skill 43) — pode ser bonificação para o comprador

### 3. Trabalhista / Previdenciária
- Folha dos últimos 5 anos
- Reclamações trabalhistas (em curso e arquivadas) — provisão CPC 25
- Audit de admissões/desligamentos
- Conformidade do eSocial / FGTS / GFIP (até 2018) / Reinf
- Plano de saúde, PLR, benefícios, acordos coletivos
- Estabilidade de empregados, gestantes, acidentados, dirigentes sindicais
- Risco de pejotização de prestadores que são na prática empregados

### 4. Societária / Regulatória
- Contrato social e alterações
- Ata de assembleia
- Quadro societário (controle direto e indireto)
- Acordo de sócios
- Licenças (sanitária, ambiental, ANVISA, ANATEL, etc.)
- Registro de marca / patente
- LGPD (encarregado, política, incidentes)

## Processo (semana a semana)

### Sem 1 — Kick-off
- Reunião de escopo
- Request list enviada
- Acesso ao data room

### Sem 2-3 — Levantamento
- Coleta de documentos
- Análise dos 5 últimos anos
- Cruzamento SPEDs (skill 44)

### Sem 4-5 — Análise aprofundada
- Validação de provisões
- Inventário físico (se autorizado)
- Entrevistas com áreas

### Sem 6 — Relatório preliminar (red flags)
- Findings classificados por risco
- Quantificação preliminar

### Sem 7 — Ajustes ao EBITDA
- One-offs identificados
- Ajustes para aproximação a normalizado

### Sem 8 — Relatório final + apresentação
- Defesa em reunião com banco/comprador

## Findings — classificação

| Severidade | Critério | Exemplo |
|---|---|---|
| **Alta** | Valor > 5% do EBITDA / risco regulatório / passivo iminente | Auto de infração de R$ 2 mi; pejotização sistêmica |
| **Média** | 1-5% EBITDA / contingência possível | Provisão de PCLD subdimensionada; ICMS-ST mal calculado |
| **Baixa** | < 1% EBITDA / regularizável | Pequenas inconsistências em DCTFWeb |

## EBITDA ajustado (Quality of Earnings)

```
EBITDA reportado
+ One-offs não recorrentes (multas pagas, indenizações isoladas, M&A costs)
- Receitas não recorrentes (venda de ativo, ganho cambial não-operacional)
+ Compensações fora de mercado (sócio retirando salário menor que market)
± Ajustes contábeis (provisões a regularizar)
± Operações com partes relacionadas a valor de mercado
= EBITDA AJUSTADO
```

## Templates

### Request list (resumo)

```
DOCUMENTOS — DUE DILIGENCE — CNPJ ____ — DATA ____

A. CONTÁBIL
[ ] Balanços e DREs últimos 5 anos (ECD)
[ ] Plano de contas detalhado
[ ] Razão de cada conta principal
[ ] Inventário físico × contábil
[ ] Política contábil (regime, reconhecimento receita, depreciação)
[ ] Demonstrações auditadas (se houver)

B. FISCAL
[ ] SPEDs (ECD, ECF, ICMS/IPI, Contribuições) últimos 5 anos
[ ] DCTFWeb / DCTF / GFIP por mês
[ ] DARFs / GPS / GNRE
[ ] PER/DCOMP em aberto
[ ] Autos de infração e defesas
[ ] Parcelamentos ativos
[ ] Certidões: CND federal, estadual, municipal, FGTS, INSS

C. TRABALHISTA
[ ] eSocial e Reinf últimos 5 anos
[ ] Folha analítica
[ ] Reclamações trabalhistas (acórdãos, sentenças, acordos)
[ ] CCT vigente
[ ] Inspeções MTPS
[ ] Atestados, ASOs

D. SOCIETÁRIO
[ ] Contrato social atualizado + alterações
[ ] Atas
[ ] Licenças e alvarás
[ ] Cadastro CADIN, Serasa, SPC
[ ] LGPD: política, encarregado

E. CONTRATOS
[ ] Top clientes (top 20)
[ ] Top fornecedores (top 20)
[ ] Empréstimos / financiamentos
[ ] Locação imobiliária
[ ] Marcas e patentes
[ ] Software (licenças)
```

### Findings report (exemplo de linha)

```
ID: F-002
Categoria: Fiscal
Severidade: Alta
Tema: ICMS-ST recolhido a menor
Período: 2022-2024
Valor estimado: R$ 1.250.000 (principal + multa 75% + Selic)
Causa: MVA original aplicada em vez da MVA ajustada em interestaduais SP→BA
Recomendação: provisionar passivo; cláusula de ajuste de preço (price adjustment); definir responsável por adesão a parcelamento se decidir pagar
Documentos: NFs amostradas, EFD ICMS/IPI, parecer
```

## Erros comuns

- Escopo aberto demais ("tudo que houver") — atenção a tempo e custo.
- Não definir cut-off date — análise vira alvo móvel.
- Fundir achados de baixa criticidade no relatório principal — diluem os críticos.
- Não quantificar — "risco existe" não ajuda comprador.
- Esquecer revisão LGPD em SaaS / e-commerce.
- Subestimar pejotização (parcelas de PJ que na prática são vínculo CLT).
- Não incluir cláusulas de **representations & warranties** (R&W) e **escrow** no contrato com base nos findings.

## Checklist

- [ ] Escopo, prazo, cut-off, materialidade definidos
- [ ] NDA assinado
- [ ] Request list completa
- [ ] Acesso ao data room garantido
- [ ] Cruzamentos SPED feitos
- [ ] Provisões revisadas
- [ ] Contingências quantificadas
- [ ] EBITDA ajustado
- [ ] Findings classificados por risco
- [ ] Relatório final assinado pelo contador líder
- [ ] Apresentação ao cliente (comprador/investidor)
- [ ] Cláusulas R&W sugeridas para o contrato

## Referências

- CPC 25 (provisões e contingências)
- CPC 26
- IN RFB 2.005/2021
- Lei 9.430/1996 (decadência tributária — 5 anos)
- CTN art. 173 (decadência) e 174 (prescrição)
- Boa prática (PE/M&A — referenciais Big Four / IFC)
