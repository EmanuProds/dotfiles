---
name: conciliacao-fornecedores
description: Concilia razão de fornecedores (contas a pagar) com NFs recebidas, boletos, comprovantes de pagamento e descontos, evitando duplicidade, baixas erradas e passivo oculto.
allowed-tools: Read Grep Bash Edit Write
user-invocable: true
---

## Quando usar

Mensalmente para todas as contas com volume relevante. Antes de fechar o balancete, conciliar fornecedores estratégicos (top 20 do volume).

## Inputs necessários

1. Razão analítico de cada fornecedor (conta 2.1.1.xx)
2. Notas fiscais recebidas no mês + contratos com pagamentos recorrentes
3. Boletos e comprovantes de pagamento (PIX, transferências, cheques)
4. Pendências de meses anteriores (cheques, NFs em discussão)
5. Cartas de circularização (auditoria) — se existirem

## Passo a passo

### 1. Levantar saldo inicial e movimentações
- Saldo inicial razão de fornecedor X
- Lançamentos do mês: débitos (pagamentos, descontos, devoluções) e créditos (compras, juros)
- Saldo final esperado

### 2. Conferir cada NF recebida
- NF emitida pelo fornecedor com data/valor/condição
- Já lançada na contabilidade? Match data + valor + número da NF.
- NFs em duplicidade (mesmo número lançado 2x) → estornar uma.
- NFs de serviço com retenções (CSRF, IRRF) — checar se o líquido lançado bate com o líquido pago.

### 3. Conferir cada pagamento
- Boleto pago × título no contas a pagar.
- Pagamento sem boleto (PIX direto): identificar a NF de origem.
- Adiantamento ao fornecedor (sem NF ainda): conta separada (1.1.5 Adiantamentos a fornecedores) — não confundir com fornecedor a pagar.

### 4. Identificar divergências

**Sintomas → causas**:
- Saldo razão > saldo do fornecedor: NF não lançada, pagamento duplicado, fornecedor já zerou.
- Saldo razão < saldo do fornecedor: pagamento lançado mas não realizado, NF emitida e não recebida.
- Saldo crédito (devedor para a empresa): adiantamento sem NF, devolução não baixada.

### 5. Solicitar circularização (auditoria)
- Saldo confirmado pelo fornecedor (extrato de conta corrente comercial).
- Para fornecedores com mais de 6 meses de relação: trimestral.
- Em ano de auditoria: anual.

### 6. Tratamento de descontos
- Desconto por pagamento antecipado: D Fornecedores / C 3.4 Receita financeira (ou redutor da despesa, dependendo do referencial).
- Desconto incondicional: já está na NF.

### 7. Juros e multa
- Atraso → D 5.4 Despesa financeira / C Fornecedores.
- Pago: D Fornecedores / C Banco.

## Templates

### Conferência por fornecedor

```
FORNECEDOR ____________________ CNPJ __________
Saldo inicial razão: R$ _________
+ NFs do mês:
   NF ____ Valor R$ _________ Vto __/__/__
   NF ____ Valor R$ _________ Vto __/__/__
   ...
- Pagamentos do mês:
   Boleto ____ Valor R$ _________ Pgto __/__/__
   PIX ___ Valor R$ _________ Pgto __/__/__
   ...
+ Juros / multa lançados: R$ _________
- Descontos (se redutores): R$ _________
= Saldo final esperado: R$ _________
Saldo final razão: R$ _________
DIFERENÇA: R$ _________ (motivo: _____________)
```

### Carta de circularização

```
[Empresa]
[Endereço]

Assunto: Confirmação de saldo em aberto — auditoria contábil

Prezados,
Solicitamos confirmar nosso saldo em aberto em 31/__/____ no valor de R$ _________, conforme nossos registros.

Caso haja divergência, favor informar o saldo segundo seus registros e enviar extrato analítico em anexo.

Resposta diretamente para [contador / e-mail].

Atenciosamente,
[Nome] — [Empresa]
```

## Erros comuns

- NF de serviço com retenções: lançar pelo bruto e baixar pelo líquido — sem registrar o passivo de IRRF/CSRF/INSS retido.
- Adiantamento contabilizado em fornecedores como crédito → distorce saldo (correto: 1.1.5 Adiantamentos).
- Pagamento "por fora" do sócio sem repasse documentado — passivo oculto.
- Devolução de mercadoria sem nota de devolução escriturada → duplicidade.
- Cheque emitido com data futura compensado antes do esperado → débito surpresa no banco e na razão.
- Trocar fornecedor pessoa física com pessoa jurídica (CPF × CNPJ) ao cadastrar.

## Checklist

- [ ] Top 20 fornecedores conciliados
- [ ] Adiantamentos separados em conta própria
- [ ] NFs em duplicidade estornadas
- [ ] Retenções de NF de serviço escrituradas (passivo)
- [ ] Juros/multas lançados
- [ ] Descontos com tratamento correto
- [ ] Circularização para fornecedores grandes
- [ ] Saldo final fecha com extrato do fornecedor
- [ ] Espelho de conciliação arquivado

## Referências

- NBC TG 26
- Lei 6.404/1976 art. 184 (passivo)
- ITG 2000 (escrituração contábil)
- CPC 25 (provisões e contingências)
