---
name: conciliacao-cartoes-credenciadora
description: Concilia vendas via cartão (crédito, débito, voucher, PIX QR) com repasses da credenciadora, identifica taxas, antecipações, chargebacks e ajusta receita líquida e custo financeiro.
allowed-tools: Read Grep Bash Edit Write
user-invocable: true
---

## Quando usar

Comércios e e-commerces com vendas processadas por Cielo, Stone, Rede, GetNet, PagSeguro, SafraPay, Mercado Pago, etc. Conciliação mensal — sem ela, receita líquida e custo financeiro ficam estimados.

## Inputs necessários

1. Vendas brutas por bandeira/modalidade (PDV / e-commerce)
2. Extrato analítico da credenciadora (relatório de vendas + relatório de repasses)
3. Tabela de taxas contratadas (MDR — Merchant Discount Rate)
4. Antecipação de recebíveis (taxa adicional)
5. Eventos: chargebacks, estornos, cancelamentos
6. PIX QR Code via credenciadora (taxa diferente do PIX direto)

## Estrutura típica

| Modalidade | Prazo recebimento | Taxa exemplo |
|---|---|---|
| Débito | D+1 ou D+2 | 1,0-1,5% |
| Crédito à vista | D+30 | 1,8-3,0% |
| Crédito parcelado lojista (até 12x) | D+30 por parcela | 2,0-3,5% |
| Crédito parcelado emissor | Antecipa, taxa juros embutida | Varia |
| Voucher (Sodexo, Alelo) | D+30 ou negociado | 3,5-5,0% |
| PIX QR (credenciadora) | D+0 ou D+1 | 0,3-1,0% |
| PIX direto (Banco Central) | Imediato | 0% |

## Passo a passo

### 1. Conciliar venda com lançamento na credenciadora
- Cada venda do PDV deve aparecer no relatório da credenciadora.
- Diferença = venda perdida / não capturada / cancelada.

### 2. Conciliar venda → repasse
- Cada venda gera um repasse com a taxa MDR debitada.
- Crédito parcelado: 12 repasses, um por mês, com taxa proporcional + juros.

### 3. Antecipação de recebíveis
- Empresa pode antecipar (todos ou alguns recebíveis) por taxa adicional.
- Antecipação de 30 dias com taxa 2,5%: empresa recebe 100 − 1,5 (MDR) − 2,5 (antec) = 96.

### 4. Lançamentos contábeis típicos

**Venda crédito 30 dias, MDR 2,5%, R$ 1.000**

```
(no momento da venda, reconhecimento da receita pelo bruto)
D 1.1.2.05 Cartões a receber (credenciadora)  R$ 1.000
   C 3.1.1 Vendas mercadorias                  R$ 1.000

(reconhecimento da despesa MDR — Receita CPC 47, valor justo)
D 5.4 Despesas financeiras (taxa cartão)      R$    25
   C 1.1.2.05 Cartões a receber                R$    25

(no recebimento D+30)
D 1.1.1.02 Banco c/c                          R$   975
   C 1.1.2.05 Cartões a receber                R$   975
```

**Antecipação de 30 dias, taxa 2,5%**

```
(quando antecipa)
D 1.1.1.02 Banco c/c                          R$   950
D 5.4 Despesa financeira (antecipação)        R$    25
   C 1.1.2.05 Cartões a receber                R$   975
```

### 5. Chargeback (cliente disputa)

```
D 1.1.2.05 Cartões a receber (estorno)        R$ 1.000
D 5.5 Despesa chargeback                       R$ Pode ter taxa adicional
   C 1.1.1.02 Banco c/c                        R$ 1.000+taxa
```

Investigar com a credenciadora — chargebacks injustos podem ser contestados.

## Templates

### Conciliação mensal

```
CREDENCIADORA: ____________ Período: __/____
TOTAL VENDAS PDV/ERP:           R$ _________
TOTAL VENDAS RELATÓRIO CREDENC: R$ _________
DIFERENÇA: R$ _________ (motivo: _____________)

REPASSES RECEBIDOS NO MÊS:
  Vendas do mês com prazo curto (débito, PIX): R$ _________
  Parcelas de meses anteriores:                R$ _________
  Antecipações:                                R$ _________
  TOTAL REPASSE BRUTO:                         R$ _________
  (-) MDR / Antecipação / Tarifas:             R$ _________
  TOTAL LÍQUIDO RECEBIDO:                      R$ _________

CARTÕES A RECEBER (saldo final):                R$ _________
CHARGEBACKS DO MÊS:                             R$ _________
ESTORNOS / CANCELAMENTOS:                       R$ _________
```

## Erros comuns

- Reconhecer receita líquida (já descontada a taxa) — distorce DRE; o correto é receita bruta + despesa financeira de taxa.
- Antecipação como receita financeira (errado: é despesa).
- Não conciliar parceladas (vendem em 12x, esquecem 11 parcelas).
- Vouchers (Sodexo, VR) tratados como cartão — taxa e prazo diferentes.
- Chargebacks acumulando sem revisão — pode ser fraude do cliente reclamando indevidamente.
- E-commerce com gateway (Cielo + intermediário) → dupla taxa que precisa ser identificada.

## Checklist

- [ ] Vendas PDV × Vendas credenciadora: divergência mapeada
- [ ] Repasses do mês conciliados com vendas
- [ ] MDR e antecipação contabilizados como despesa
- [ ] Cartões a receber com saldo coerente (contas em aberto)
- [ ] Chargebacks investigados
- [ ] PIX QR vs PIX direto separados
- [ ] Conciliação assinada e arquivada

## Referências

- CPC 47 — Receita (reconhecimento pelo justo valor)
- CPC 48 — Instrumentos Financeiros (recebíveis)
- Lei 13.455/2017 (vedação a diferenciação de preço por meio de pagamento)
- Manuais Cielo / Stone / Rede / Mercado Pago (relatórios fiscais)
