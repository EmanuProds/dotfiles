---
name: ecd-escrituracao-contabil-digital
description: Gera, valida e transmite a ECD (Escrituração Contábil Digital) — Diário, Razão e Balancetes — com leiaute SPED-Contábil, assinatura digital e prazo de 31/05.
allowed-tools: Read Grep Bash Edit Write
user-invocable: true
---

## Quando usar

PJ tributada pelo Lucro Real (obrigatória), Presumido com distribuição de lucros acima do presumido líquido (obrigatória), imunes/isentas com receita > R$ 4,8 mi, e SCP. Entrega anual até **31/05** referente ao ano-calendário anterior (IN RFB 2.003/2021).

## Inputs necessários

1. ECD do ano anterior (último período de referência) — para amarrar saldo inicial
2. Plano de contas referencial e razão de cada conta (saldo inicial + movimentações)
3. Lançamentos contábeis do período (Diário em formato txt do PVA ou exportado do ERP)
4. Demonstrações: Balanço, DRE, DLPA/DMPL, DFC
5. Termos de abertura e encerramento do livro digital
6. Certificado digital A1 ou A3 do contador e do representante legal (e-CPF/e-CNPJ)
7. Junta Comercial onde será autenticada (custo da autenticação varia por estado)

## Estrutura de blocos da ECD

| Bloco | Conteúdo |
|---|---|
| 0 | Abertura, identificação, parâmetros |
| I | Lançamentos contábeis (I050 contas, I100 centros, I150 períodos, I155 saldos periódicos, I200 lançamentos, I250 partidas, I300 balancetes) |
| J | Demonstrações (J005 DRE, J100 BP ativo, J150 BP passivo, J210 DLPA, J215 DMPL, J800 outras) |
| K | SCP (sociedade em conta de participação) |
| 9 | Encerramento e controles |

## Passo a passo

### 1. Preparar o plano de contas
- Cada conta tem código contábil, código referencial (Anexo III IN RFB 2.003 — DIPJ/ECF), natureza (1 = ativo, 2 = passivo, 3 = PL, 4 = receitas, 5 = custos, 6 = despesas, 7 = outros), tipo (S = sintética, A = analítica), nível.
- Validar contas contra plano referencial — toda conta analítica precisa ter referencial mapeado.

### 2. Saldo inicial vs. ECD anterior
- Toda conta analítica deve ter o saldo inicial **idêntico** ao saldo final do ano-calendário anterior na ECD validada.
- Diferença = erro de migração ou abertura — corrigir antes de transmitir.

### 3. Lançamentos
- I200 cabeçalho do lançamento (data, valor, histórico).
- I250 partidas (débito + crédito que somam zero).
- Lançamento "complexo" precisa ter valor total no I200 = soma das partidas D/C.
- Histórico padronizado (códigos I075 + textos I100 quando aplicável).

### 4. Balancetes
- I300/I310/I350 = balancetes mensais ou de períodos. Obrigatórios apenas para alguns tipos de empresa.

### 5. Demonstrações
- J005: DRE. Cada linha vinculada a contas referenciais.
- J100/J150: BP por linha referencial.
- J210/J215: movimentação do PL.
- J800: notas explicativas em PDF (anexo).

### 6. Termos
- Termo de abertura: identificação, período, contador, representante.
- Termo de encerramento: idem + data fechamento.
- Auditor independente (J930) quando aplicável.

### 7. Validação no PVA (Programa Validador da ECD)
- Importar TXT, validar (PVA aponta erros de leiaute, integridade, referencial).
- Gerar relatório de erros e tratar até zero erro de bloqueio.

### 8. Assinatura e transmissão
- Assinar com e-CPF do contador (CRC) e e-CNPJ ou e-CPF do representante legal.
- Transmitir via Receitanet (Programa de Transmissão de Arquivos).
- Recibo de entrega + número da ECD.

### 9. Autenticação na Junta Comercial
- Pelo SPED, automatizada (Convênio MDIC/RFB).
- Algumas Juntas cobram taxa.

## Templates

### Estrutura mínima de I200 + I250

```
|I200|001|2026-01-15|9.500,00|N|
|I250|1.1.1.01.01|D|9.500,00||Caixa por venda à vista|
|I250|3.1.1.01.01|C|9.500,00||Receita venda mercadorias|
```

## Erros comuns

- Saldo inicial divergente da ECD anterior — bloqueio total.
- Conta sem código referencial — erro de bloqueio.
- Lançamento com partidas que não fecham (D ≠ C) — erro de bloqueio.
- Plano de contas contábil sem natureza correta (ex.: receita marcada como ativo).
- Esquecer J800 (notas explicativas) quando obrigatório.
- Usar histórico padrão genérico ("conforme documentos") — recomendação SPED é histórico explicativo.
- Termo de abertura sem assinatura do CRC ativo.

## Checklist

- [ ] Plano de contas validado (referencial 100%)
- [ ] Saldo inicial = saldo final ECD anterior
- [ ] Todos os meses encerrados (resultado contra PL)
- [ ] DRE fechada e amarrada com balancete
- [ ] J005, J100, J150, J210 batendo
- [ ] PVA com 0 erros de bloqueio
- [ ] Termos com data e assinaturas
- [ ] Certificado digital válido
- [ ] Recibo arquivado
- [ ] ECD vinculada à ECF antes de 31/07

## Referências

- IN RFB 2.003/2021 (regulamento ECD)
- Manual de Orientação da ECD (versão vigente)
- Lei 11.638/2007 e CPCs (escrituração)
- Decreto 8.683/2016 (autenticação automática Junta)
- Anexo III IN RFB 2.003 (plano referencial)
