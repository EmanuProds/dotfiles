---
name: conciliacao-clientes"
description: Concilia razão de clientes (contas a receber) com NFs emitidas, recebimentos, descontos, devoluções, e ajusta PCLD conforme CPC 47/48 e idade do recebível.
allowed-tools: Read Grep Bash Edit Write
user-invocable: true
---

## Quando usar

Mensalmente nos clientes com volume relevante. Antes do fechamento, revisar carteira por aging para PCLD.

## Inputs necessários

1. Razão analítico por cliente (1.1.2.01.xx)
2. NFs emitidas no mês + contratos recorrentes
3. Recebimentos (boletos, PIX, transferências, cartões)
4. Aging da carteira (a vencer, vencido 1-30, 31-60, 61-90, 91-180, > 180, > 360)
5. Histórico de inadimplência por cliente
6. Acordos / cobrança extrajudicial / títulos protestados

## Passo a passo

### 1. Saldo inicial e movimentações
- Saldo inicial razão = saldo final do mês anterior conciliado
- + NFs emitidas (D Clientes / C Receita)
- − Recebimentos (D Banco / C Clientes)
- − Devoluções, abatimentos (D Receita ou Devoluções / C Clientes)
- ± Juros e descontos

### 2. Conciliação NF × título
- Cada NF gera 1+ títulos a receber (à vista, parcela 1, parcela 2...)
- Match data emissão, valor, vencimento, cliente

### 3. Recebimentos
- Boleto pago: D Banco / C Clientes (pelo valor recebido)
- PIX: precisa conferir CPF/CNPJ pagador para identificar cliente
- Cartão: passa pela credenciadora (skill 34) — D 1.1.2.05 Cartões a receber / C Clientes
- Cheque: D Cheques em trânsito / C Clientes; depois D Banco / C Cheques em trânsito

### 4. Descontos por antecipação
```
D Banco                 R$ 950
D Desconto concedido    R$  50  (3.2.2 ou redutor de receita)
   C Clientes           R$ 1.000
```

### 5. Inadimplência e aging

| Idade | Tratamento |
|---|---|
| A vencer | Normal |
| Vencido 1-30 | Acompanhar |
| 31-90 | Cobrar; juros e multa contratuais |
| 91-180 | Negociação; protesto se permitir |
| > 180 | PCLD obrigatória ou acordo |
| > 360 sem perspectiva | Baixa para perdas (Lei 9.430/96 art. 9-14) |

### 6. PCLD (Provisão para Créditos de Liquidação Duvidosa) — CPC 48 IFRS 9

A norma é **modelo de perdas esperadas** (não mais incorridas):
- Estágio 1: provisão de 12 meses esperados (cliente sem deterioração)
- Estágio 2: provisão pela vida toda (deterioração significativa)
- Estágio 3: provisão pela vida toda + receita pelo valor líquido (default)

Em PME, simplificação aceitável: matriz de provisão por idade do título.

Lançamento:
```
D 5.5 Despesa PCLD              R$ X
   C 1.1.2.02 (-) PCLD           R$ X
```

Reversão (cliente paga):
```
D 1.1.2.02 PCLD                  R$ X
   C 5.5 Reversão PCLD            R$ X
```

### 7. Baixa para perda fiscal (Lei 9.430/96)
Permitido baixar como despesa dedutível:
- Crédito até R$ 5.000 vencido há > 6 meses sem cobrança judicial
- Crédito de R$ 5.001 a 30.000 vencido > 1 ano com procedimento de cobrança
- > R$ 30.000 vencido > 1 ano com cobrança judicial

```
D 5.5 Perda em recebimento (dedutível) R$ Y
   C 1.1.2.01 Clientes                 R$ Y
```

## Templates

### Conferência por cliente

```
CLIENTE ____________________ CNPJ __________
Saldo inicial: R$ _________
+ NFs emitidas no mês:
   NF ____ Valor R$ _________ Vto __/__/__
   ...
- Recebimentos:
   Boleto ___ Valor R$ _________ Receb __/__/__
   ...
+ Juros recebidos: R$ _________
- Descontos concedidos: R$ _________
- Devoluções: R$ _________
= Saldo esperado: R$ _________
Saldo razão: R$ _________
DIFERENÇA: R$ _________

AGING:
A vencer: R$ _________
Vencido 1-30: R$ _________
31-60: R$ _________
61-90: R$ _________
91-180: R$ _________
> 180: R$ _________
PCLD existente: R$ _________
PCLD necessária (matriz): R$ _________
Ajuste a fazer: R$ _________
```

## Erros comuns

- Receber por PIX com identificação errada → baixar título do cliente errado.
- Não baixar parcelas; baixar a NF inteira no primeiro pagamento.
- PCLD não atualizada → balanço sobre-avaliado.
- Não dar baixa para perda quando atende Lei 9.430 → não aproveita despesa dedutível.
- Juros e multa não lançados → receita financeira subestimada.
- Desconto incondicional concedido na NF não escriturado como redutor.

## Checklist

- [ ] Top 20 clientes conciliados
- [ ] Aging atualizado
- [ ] PCLD revisada (CPC 48 ou matriz simplificada)
- [ ] Baixa fiscal (Lei 9.430) aplicada quando cabível
- [ ] Juros e multas lançados
- [ ] Descontos concedidos como redutores de receita
- [ ] Inadimplência: políticas de cobrança comunicadas
- [ ] Espelho arquivado

## Referências

- CPC 47 (Receita)
- CPC 48 / IFRS 9 (Instrumentos Financeiros)
- Lei 9.430/1996 art. 9-14 (perda em recebimento)
- NBC TG 1.000 (PME — simplificações)
- ITG 2000
