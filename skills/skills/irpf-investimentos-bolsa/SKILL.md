---
name: irpf-investimentos-bolsa"
description: Apura IR sobre operações na B3 — swing trade, day trade, FIIs, ETFs, opções, futuros — com compensação de prejuízos, isenção R$ 20.000 e DARF mensal cód 6015.
allowed-tools: Read Grep Bash Edit Write
user-invocable: true
---

## Quando usar

Pessoa física com operações na B3. Apuração mensal, DARF cód **6015** até último dia útil do mês subsequente. Anual no IRPF.

## Inputs necessários

1. Notas de corretagem (todas as operações do mês)
2. Histórico de aquisições para custo médio
3. Saldo de prejuízo a compensar (do mês anterior e anos anteriores)
4. IRRF de 0,005% (swing) e 1% (day trade) retido na fonte
5. Tipo de operação por ativo

## Tipos de operações

| Tipo | Imposto | Isenção | DARF | IRRF na fonte |
|---|---|---|---|---|
| Swing trade ações | 15% | Vendas no mês ≤ R$ 20.000 | 6015 | 0,005% sobre valor da venda |
| Day trade | 20% | Sem isenção | 6015 | 1% sobre lucro |
| FII (cota) — ganho na venda | 20% | Sem isenção | 6015 | 0,005% sobre valor |
| FII — distribuição mensal | Isento (PF, ≤ 50 cotistas, etc.) | — | — | — |
| ETF de renda variável | 15% (swing) ou 20% (day) | Sem isenção R$ 20k | 6015 | 0,005% / 1% |
| Opções | 15% (swing) ou 20% (day) | — | 6015 | — |
| Futuros (mini-índice, mini-dólar) | 15-20% | — | 6015 | — |
| Tesouro Direto | 22,5% a 15% (regress) | — | Retido na fonte | Sim |
| CDB / Debênture / LCI / LCA | 22,5% a 15% (regress) | LCI/LCA isento PF | Retido | Sim |
| Bitcoin / cripto | 15% s/ ganho > R$ 35k mês | Ganho ≤ R$ 35k mês isento | 4600 | — |

## Cálculo

### Swing trade ações

```
1. Somar VALOR DAS VENDAS do mês (todas as ações, não importa se lucro/prejuízo)
2. Se ≤ R$ 20.000: ISENTO (lucro não tributa). Não gera DARF.
3. Se > R$ 20.000:
   - Calcular lucro do mês (Σ vendas − Σ custo médio das vendidas − despesas)
   - Compensar com prejuízos acumulados
   - Lucro líquido × 15% = IR
   - Abater IRRF dedo-duro (0,005%)
   - DARF cód 6015
```

### Day trade

```
1. Lucro day trade do mês = Σ ganhos − Σ perdas day trade
2. Compensar com prejuízos day trade acumulados (apenas day trade com day trade)
3. Lucro líquido × 20% = IR
4. Abater IRRF na fonte (1%)
5. DARF cód 6015
```

### Compensação de prejuízos

- **Swing × Swing**: prejuízo de swing compensa lucro futuro de swing.
- **Day × Day**: idem para day trade.
- **NÃO se cruza**: prejuízo de swing não compensa day trade e vice-versa.
- Prejuízo de ações não compensa FII e vice-versa (operação distinta).
- Prejuízo acumulado não tem prazo (vai indefinidamente até zerar).

### FII — distribuição mensal

Isenta se:
- Cota de FII negociado em bolsa/mercado de balcão
- Pelo menos 50 cotistas
- Cotista PF tem < 10% do FII

Caso contrário, distribuição é tributada como rendimento financeiro (15-22,5%).

## Custo médio

Cada novo lote afeta o custo médio (skill 50). Ações desdobradas, bonificadas, agrupadas: ajustar quantidade e custo.

## Exemplo

Investidor vendeu em março/2026:
- 100 ações ABC: total venda R$ 8.000 (custo R$ 5.000) → ganho R$ 3.000
- 200 ações XYZ: total venda R$ 15.000 (custo R$ 10.000) → ganho R$ 5.000
- Total venda: R$ 23.000 (> R$ 20k → tributa)
- Lucro total: R$ 8.000
- Prejuízo acumulado fev/26: R$ 2.000 → compensa
- Lucro tributável: R$ 6.000
- IR: 15% = R$ 900
- IRRF dedo-duro 0,005% × 23.000 = R$ 1,15 (compensar)
- **DARF 6015 = R$ 898,85**

## Templates

### Apuração mensal

```
COMPETÊNCIA __/____ — Investidor __________ CPF __________

SWING TRADE
Vendas do mês total: R$ _________ (isento se ≤ R$ 20.000)
Lucro bruto: R$ _________
Prejuízo acumulado a compensar: R$ _________
Lucro tributável: R$ _________
IR 15%: R$ _________
IRRF na fonte (0,005%): R$ _________
IR a pagar (DARF 6015): R$ _________

DAY TRADE
Lucro bruto: R$ _________
Prejuízo acumulado day: R$ _________
Lucro tributável: R$ _________
IR 20%: R$ _________
IRRF na fonte (1%): R$ _________
IR a pagar (DARF 6015): R$ _________

FII (ganho de capital na venda de cota)
Vendas: R$ _________ Lucro: R$ _________
IR 20% × Lucro: R$ _________
IRRF (0,005%): R$ _________
DARF 6015: R$ _________

DARF cód 6015 TOTAL: R$ _________ Vto __/__/____
```

## Erros comuns

- Aplicar isenção R$ 20k em ETF (não tem isenção).
- Cruzar prejuízo swing com day trade — vedado.
- Esquecer custo médio com bonificação (custo é o valor patrimonial bonificado, conforme assembleia).
- Não declarar FIIs no IRPF anual — Bens e Direitos.
- Não pagar DARF de meses pequenos (acumular se < R$ 10): correto, mas precisa pagar quando atingir o limite.
- Day trade sem DARF mensal — alta visibilidade na malha (corretora envia tudo).
- Operações com BDRs (estrangeiras) tratadas como ações brasileiras — atenção ao regime.

## Checklist mensal

- [ ] Notas de corretagem coletadas
- [ ] Custo médio atualizado (aquisições do mês)
- [ ] Swing trade × Day trade segregados
- [ ] Prejuízos compensados na ordem correta
- [ ] DARF 6015 gerado e pago no prazo
- [ ] Planilha de controle atualizada (para o anual)

## Checklist anual

- [ ] Importar para IRPF (Renda Variável + Bens em 31/12)
- [ ] Saldo de prejuízos no encerramento documentado
- [ ] Conferir com informe da corretora

## Referências

- Lei 11.033/2004 (renda variável)
- Lei 13.043/2014
- Decreto 9.580/2018 arts. 866-871
- IN RFB 1.585/2015 (regulamento renda variável)
- IN RFB 1.500/2014 (consolidação IRPF)
- Lei 8.668/1993 (FIIs)
