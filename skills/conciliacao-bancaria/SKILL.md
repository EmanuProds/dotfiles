---
name: conciliacao-bancaria
description: Concilia extrato bancário com razão contábil identificando depósitos, transferências, tarifas, juros, IOF, tributos e débitos não escriturados, fechando saldo com tolerância zero.
allowed-tools: Read Grep Bash Edit Write
user-invocable: true
---

## Quando usar

Mensalmente em todas as contas bancárias movimentadas. É a base para confiabilidade do fechamento — sem conciliação batida, balancete não confere.

## Inputs necessários

1. Extrato bancário do mês completo (OFX, CSV ou PDF)
2. Razão da conta contábil correspondente (ex.: 1.1.1.02.01 BB c/c)
3. Saldo inicial e final
4. Comprovantes de operações (boletos, transferências, PIX)
5. Lista de cheques emitidos pendentes (se houver)

## Passo a passo

### 1. Conferir saldo inicial
- Saldo inicial razão contábil = saldo inicial extrato bancário
- Se diverge: erro vem de meses anteriores — corrigir antes de avançar

### 2. Importar / digitalizar extrato
- OFX no ERP: matching automático por valor + data
- Manual: planilha com data, descrição, valor, tipo (débito/crédito)

### 3. Match item a item

Categorias típicas:
- **Depósito de cliente**: D Banco / C Clientes (1.1.2.01)
- **PIX recebido sem identificação**: D Banco / C 2.1.5 Outras obrigações (a regularizar)
- **Pagamento a fornecedor**: D 2.1.1 Fornecedores / C Banco
- **Tarifa bancária**: D 5.4 Tarifas bancárias / C Banco
- **IOF de operação**: D 5.4 IOF / C Banco
- **Juros recebidos (aplicação)**: D Banco / C 3.4 Receita financeira
- **Débito de empréstimo**: D Empréstimos / C Banco (principal) + D Despesa financeira / C Banco (juros)
- **Tributos pagos**: D Imposto a recolher (passivo) / C Banco
- **Folha**: D Salários a pagar / C Banco
- **Estorno**: lançamento ao contrário do original
- **Compensação de cheque**: tirar de "cheques em trânsito" → conciliar com a saída efetiva no extrato

### 4. Identificar pendências

**Lado banco** (no extrato, falta no razão):
- Tarifas, juros, IOF, débito automático
- Devolução de cheque
- Estorno

**Lado contábil** (no razão, falta no extrato):
- Cheques emitidos não compensados
- Depósitos em trânsito não creditados
- Erro de digitação

### 5. Lançar pendências do lado banco
- Cada item identificado precisa de lançamento contábil

### 6. Conferir saldo final

```
Saldo banco no extrato      R$ _________
+ Cheques pendentes          R$ _________
- Depósitos em trânsito      R$ _________
= Saldo conciliado           R$ _________
Saldo razão contábil         R$ _________
DIFERENÇA: R$ 0,00 (deve fechar)
```

## Templates

### Espelho de conciliação

```
Conta: 1.1.1.02.01 BB c/c 1234-5  Período: __/__/____
Saldo inicial razão: R$ _________  Saldo inicial extrato: R$ _________

ITENS DO EXTRATO QUE GERARAM LANÇAMENTO:
Data       Descrição               Valor       Lançamento
__/__/__   PIX cliente João       +5.000      D Banco / C Clientes
__/__/__   Tarifa manutenção        -25       D 5.4 Tarifas / C Banco
__/__/__   IOF aplicação            -12       D 5.4 IOF / C Banco
__/__/__   Juros aplic. CDB         +85       D Banco / C 3.4 Rec fin
...

PENDÊNCIAS (não no extrato, no razão):
Data       Cheque/Transação         Valor
__/__/__   Cheque 12345 a fornec    -1.500   (vai compensar em ___)

DEPÓSITOS EM TRÂNSITO (no razão, não no extrato):
Data       Origem                   Valor
__/__/__   Depósito boleto          +800

Saldo final razão:    R$ _________
+ Cheques pendentes:  R$ _________
- Depósitos trânsito: R$ _________
= Saldo conciliado:   R$ _________
Saldo final extrato:  R$ _________
DIFERENÇA: R$ ___ (deve ser ZERO)
```

## Erros comuns

- Conciliar pelo saldo final apenas, sem matching item a item — esconde erros que se compensam.
- Tarifas/IOF entulhadas em "Outros" sem natureza específica.
- PIX recebido sem identificação contabilizado como receita — pode ser empréstimo do sócio, devolução, etc.
- Cheque emitido com data futura escriturado na data da emissão (correto: reconhecer obrigação no fornecedor; banco só registra na compensação).
- Extrato ERP "auto-conciliando" o que não deveria — sempre revisar amostragem.
- Diferença de centavos por arredondamento — investigar (não pode existir centavo "fantasma").

## Checklist

- [ ] Saldo inicial razão = saldo inicial extrato
- [ ] Todos os itens do extrato com lançamento
- [ ] Tarifas e IOF lançados
- [ ] Juros e rendimentos de aplicações reconhecidos
- [ ] Cheques pendentes mapeados
- [ ] Depósitos em trânsito identificados
- [ ] Saldo final fecha com tolerância zero
- [ ] Lista de pendências entregue ao cliente
- [ ] Espelho de conciliação arquivado mensalmente

## Referências

- NBC TG 26 (apresentação)
- NBC TG 1.000 (PME)
- ITG 2000 — Escrituração Contábil
- Resolução CFC 1.330/2011 (procedimentos)
