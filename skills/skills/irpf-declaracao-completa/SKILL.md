---
name: irpf-declaracao-completa
description: Monta IRPF anual completa para PFs com múltiplas fontes — empregados, autônomos, aluguel, ganho de capital, B3, exterior — escolhendo entre Simplificada e Completa, e antecipando malha fina.
allowed-tools: Read Grep Bash Edit Write
user-invocable: true
---

## Quando usar

Anualmente entre **15/03 e 31/05**. Pessoa física obrigada (renda > limite anual ~R$ 30.639,90 em 2026 — confirmar; bens > R$ 800.000; ganho de capital; operações na bolsa, atividade rural com receita > limite, residente fiscal mudou status, recebeu acima do limite com isenção).

## Inputs necessários

1. Comprovantes de rendimento (Informe IR de cada fonte)
2. Despesas dedutíveis: saúde (recibos com CPF, planos), educação (limite anual), pensão alimentícia (mandado), previdência privada (PGBL), doações com incentivo
3. Bens e direitos em 31/12 (saldos bancários, imóveis, veículos, ações, criptomoedas)
4. Ganho de capital (vendas de imóveis, ações fora da B3, criptos)
5. Operações na B3 (DARF cód 6015 mensais)
6. Rendimentos do exterior + Imposto pago no exterior
7. Atividade rural (Livro Caixa do Produtor Rural)
8. Dados de dependentes (CPF obrigatório)

## Estrutura da declaração

| Ficha | Conteúdo |
|---|---|
| Identificação | CPF, endereço, dependentes, cônjuge |
| Rendimentos Tributáveis Recebidos de PJ | Salários, pró-labore, aluguel pago por PJ |
| Rendimentos Tributáveis Recebidos de PF/Exterior | Aluguel pago por PF, exterior, RPA |
| Rendimentos Isentos | Lucros distribuídos, FGTS, indenizações, poupança, ações ME |
| Rendimentos Tributados Exclusivamente na Fonte | 13º, JCP, aplicações financeiras |
| Pagamentos Efetuados | Saúde, educação, pensão, previdência, advogado |
| Doações Efetuadas | Incentivadas (FUMCAD, Fundo do Idoso, etc.) |
| Bens e Direitos | Saldos em 31/12 |
| Dívidas e Ônus | Saldos > R$ 5.000 |
| Espólio | Inventário aberto |
| Ganhos de Capital | Importar do GCAP |
| Renda Variável | Resumo mensal de operações B3 |
| Atividade Rural | Receita, despesa, resultado |
| Bens no Exterior | Lei 14.754/2023 |
| Imposto Pago | DARFs do ano (carnê-leão, ganho capital, B3) |

## Passo a passo

### 1. Coletar tudo
- Lista padrão de documentos por fonte de renda

### 2. Importar declaração do ano anterior
- Mantém bens, ações, dependentes — só atualiza saldos

### 3. Lançar rendimentos
- Cada fonte na ficha correspondente
- Verificar Informe IR vs. lançamento (DIRF/R-4010 conferindo)

### 4. Lançar deduções legais (Completa)
- Saúde (sem limite, mas com recibo válido)
- Educação (limite anual por pessoa)
- Dependente (R$ 2.275,08 anual em 2026 — confirmar)
- Pensão alimentícia (decisão judicial / acordo homologado)
- Previdência oficial (INSS pago)
- Previdência privada PGBL (até 12% da renda tributável)

### 5. Calcular Simplificada vs. Completa
- Simplificada: desconto de 20% até R$ 16.754,34 (em 2026 — confirmar)
- Completa: deduções reais
- Programa simula automaticamente — escolher a menor carga

### 6. Tratar ganho de capital
- Importar do GCAP
- Imóveis: alíquota progressiva 15-22,5%
- Ações fora da B3: 15%
- Cripto e exterior: alíquota 15%

### 7. Renda variável (B3)
- Day trade: 20% sobre lucro (DARF cód 6015 mensal)
- Swing trade: 15% sobre lucro mensal acima de R$ 20.000 vendido
- Compensação de prejuízos do ano e anos anteriores

### 8. Bens no exterior (Lei 14.754/2023)
- Aplicações financeiras no exterior: regime de marcação a mercado anual + alíquota 15%
- Trusts: declaração específica
- Offshore: regime opcional

### 9. Pagamento ou restituição
- Saldo a pagar: cota única em maio ou 8 cotas mensais (mínimo R$ 50)
- Restituição: lotes de junho a setembro

### 10. Validar e transmitir
- Validador IRPF
- Erros comuns: CPF dependente inválido, soma rendimentos diferente do informe
- Recibo guardado por 5 anos

## Templates

### Lista de documentos por fonte

```
DECLARANTE __________ CPF __________

[ ] Informe IR — Empregador 1
[ ] Informe IR — Empregador 2 (se houver)
[ ] Informe IR — INSS (aposentado/pensionista)
[ ] Informe IR — Banco (saldos, aplicações, JCP, dividendos)
[ ] Informe IR — Corretora B3 (com DARFs cód 6015 anexos)
[ ] Recibos de aluguel recebido (PF) ou Informe IR aluguel pago por PJ
[ ] Recibos médicos com CPF
[ ] Comprovantes plano de saúde (titular + dependentes)
[ ] Comprovantes escola (mensalidade) — limites anuais
[ ] Pensão alimentícia: decisão judicial + comprovantes
[ ] Comprovantes PGBL/PRGV
[ ] DARFs ganho de capital (cód 4600) e GCAP
[ ] DARFs renda variável (cód 6015) e operações B3
[ ] Bens em 31/12 (escritura, RENAVAM, saldo bancário)
[ ] Dívidas > R$ 5.000 (contrato)
[ ] Bens no exterior (Lei 14.754/2023): saldos, aplicações, ofício
[ ] Doações incentivadas (FUMCAD, Fundo Idoso) — recibo
[ ] Recibo do IRPF do ano anterior
```

### Fluxograma — Simplificada × Completa

```
1. Calcular total das deduções da Completa: R$ ___
2. Se renda > R$ 83.771,70 limite Simplificada efetivo:
   - Simplificada gera desconto teto de R$ 16.754,34
3. Comparar:
   - Imposto Simplificada: R$ ___
   - Imposto Completa:    R$ ___
4. Optar pelo menor → economia de R$ ___
```

## Erros comuns

- Lançar dependente que está em outra declaração (pais separados que ambos declaram filho).
- Filho > 24 anos sem comprovante de universidade — perde dependência.
- Pai/mãe com renda > limite anual — não pode ser dependente.
- Recibo médico sem CPF — Receita não aceita.
- Educação: lançar curso de idiomas, técnico, MBA — apenas educação formal regular tem limite dedutível (Lei 9.250 art. 8º II "b").
- Não declarar ganho com venda de ações fora da B3.
- Day trade sem DARF mensal — multa.
- Dependente com plano de saúde não vinculado — perde dedução.

## Checklist

- [ ] Documentos de todas as fontes coletados
- [ ] Dependentes com CPF
- [ ] Deduções com comprovantes válidos
- [ ] Ganho de capital importado do GCAP
- [ ] Renda variável B3 com cálculo mensal
- [ ] Bens em 31/12 com saldos batendo (extrato, RENAVAM, escritura)
- [ ] Dívidas > R$ 5.000 declaradas
- [ ] Bens no exterior conforme Lei 14.754
- [ ] Simplificada × Completa simuladas
- [ ] Validador sem erro de bloqueio
- [ ] Transmitida e recibo guardado
- [ ] Plano de pagamento (cota única ou parcelas)

## Referências

- Decreto 9.580/2018 (RIR/2018)
- Lei 9.250/1995
- IN RFB 2.077/2022 (IRPF)
- Lei 14.754/2023 (bens no exterior, fundos exclusivos)
- Lei 13.043/2014 (bolsa de valores)
- Manual IRPF do ano vigente
