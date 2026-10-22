---
name: calculo-irrf-folha"
description: Calcula IRRF na folha de pagamento e em pagamentos a pessoas físicas (RPA, autônomos, aluguel, pró-labore) aplicando tabela vigente, dependentes, INSS deduzido e regime de caixa.
allowed-tools: Read Grep Bash Edit Write
user-invocable: true
---

> ⚠️ **AVISO FISCAL — CONFIRA ANTES DE GERAR A GUIA.** Todo código de receita (DARF/DAS), alíquota, base de cálculo, valor e data de vencimento gerado por este agente é **rascunho de apoio** e pode variar por ano, regime tributário, município ou caso específico. **Confira sempre na fonte oficial vigente (Receita Federal / e-CAC / legislação estadual e municipal) antes de transmitir declaração ou pagar guia.** A conferência final é responsabilidade do contador responsável.

## Quando usar

Toda vez que houver pagamento de PJ a PF tributável: salário, pró-labore, autônomo, aluguel, RPA, comissões. Apuração na competência de cada pagamento. Vencimento dia 20 do mês subsequente (DARF código varia).

## Inputs necessários

1. Tipo de rendimento (CLT, pró-labore, autônomo, aluguel, juros)
2. Valor bruto pago
3. INSS retido (deduz da base IRRF)
4. Dependentes informados pela PF (R$ 189,59 cada — valor 2026, conferir)
5. Pensão alimentícia judicial (deduz integral)
6. Tabela progressiva vigente (verificar IN RFB anual)

## Tabela progressiva 2026 (mensal — confira atualização)

| Base mensal (R$) | Alíquota | Dedução |
|---|---|---|
| até 2.428,80 | 0% | 0 |
| 2.428,81 a 2.826,65 | 7,5% | 182,16 |
| 2.826,66 a 3.751,05 | 15% | 394,16 |
| 3.751,06 a 4.664,68 | 22,5% | 675,49 |
| acima de 4.664,68 | 27,5% | 908,73 |

> A faixa de isenção foi estendida para R$ 2.428,80 (≈ 2 salários mínimos) com o desconto simplificado adicional de R$ 564,80 introduzido pela MP 1.171/2023, convertida em Lei. Confirmar o desconto simplificado (alternativa às deduções legais) na competência.

## Cálculo

```
Base IRRF = Bruto − INSS − Dependentes × R$ 189,59 − Pensão judicial
IRRF = (Base × Alíquota) − Dedução
```

Ou, se for vantajoso: usar o desconto simplificado (R$ 564,80) substituindo dependentes.

### Pró-labore
- Desconto INSS de 11% até o teto (~R$ 8.157 em 2026 — confirmar) na fonte.
- IRRF aplica tabela progressiva sobre o pró-labore − INSS − dependentes − pensão.

### Autônomo (RPA)
- INSS 11% sobre o valor (até teto), descontado pelo tomador.
- IRRF tabela progressiva.
- ISS retido pelo município se a lei municipal exigir.
- Tomador entrega DIRF (PJ) e o autônomo declara como rendimento tributável.

### Aluguel pago a PF
- IRRF tabela progressiva — dedutível o IPTU pago pelo locatário em nome do locador, taxa de condomínio, comissão de imobiliária paga pelo locador.

### Adiantamento / antecipação salarial
- IRRF na folha mensal calcula sobre o **pagamento total** (adiantamento + saldo) consolidado no fechamento.

### 13º salário
- IRRF próprio em DARF separado, exclusivo na fonte (não soma com a folha).
- Base: 13º bruto − INSS sobre 13º − dependentes − pensão.

## Códigos DARF

| Origem | Código |
|---|---|
| Trabalho assalariado | 0561 |
| Pró-labore | 0561 |
| Aluguel pago a PF | 3208 |
| Serviços profissionais (autônomo) | 0588 |
| 13º salário | 0561 (separado) |
| Juros pagos a PF | 3208 |

## Templates

```
IRRF FOLHA — Funcionário ____________ Comp ____
Salário bruto..................... R$ _________
Adicionais (HE, periculosidade)... R$ _________
(=) Bruto total................... R$ _________
(−) INSS (faixa)................. R$ _________
(−) Dependentes (qtd × 189,59)... R$ _________
(−) Pensão alimentícia........... R$ _________
(=) BASE IRRF.................... R$ _________
Alíquota: ___%   Dedução: R$ _________
IRRF............................. R$ _________
```

### Exemplo

Salário R$ 6.000, INSS R$ 660 (faixa 11%), 2 dependentes:
- Base IRRF = 6.000 − 660 − 2×189,59 = 6.000 − 660 − 379,18 = R$ 4.960,82
- Faixa 27,5% → IRRF = 4.960,82 × 27,5% − 908,73 = 1.364,23 − 908,73 = **R$ 455,50**

## Erros comuns

- Tributar 13º junto com a folha do mês — o correto é DARF próprio.
- Esquecer dependentes que o funcionário declarou.
- Aplicar INSS sobre o teto quando a soma de pró-labore + autônomo no mês ainda não atingiu (servir o teto).
- Calcular alíquota efetiva sem usar a parcela a deduzir (PD na tabela).
- Não reter IRRF em pagamento a autônomo argumentando "ele se vira no IRPF" — multa por descumprimento.
- Aluguel pago por PJ a PF: precisa reter IRRF (não confundir com aluguel pago entre PJs, que não retem IRRF mas é receita tributável).

## Checklist

- [ ] Tabela e parâmetros do ano vigentes
- [ ] Dependentes documentados (declaração assinada do colaborador)
- [ ] Pensão judicial com mandado/sentença
- [ ] DARF código correto por natureza
- [ ] DCTFWeb com débitos batendo
- [ ] DIRF anual com valores conferindo
- [ ] eSocial (S-1210/S-1200) com IRRF rubrica correta
- [ ] Comprovante de rendimentos entregue ao colaborador até 28/02

## Referências

- Lei 7.713/1988 (tabela e regime de caixa)
- Lei 11.482/2007 (atualização da tabela)
- Lei 14.663/2023 (faixa de isenção atualizada)
- Decreto 9.580/2018 (RIR/2018)
- IN RFB 2.060/2021 (DIRF)
- Tabela INSS atualizada anualmente (Portaria MTP)
