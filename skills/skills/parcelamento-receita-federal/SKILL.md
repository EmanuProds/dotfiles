---
name: parcelamento-receita-federal
description: Adere a parcelamentos federais (ordinário 60x, simplificado, programas especiais — RFB, PGFN), simula impacto, separa débitos parceláveis e gerencia mensalidades.
allowed-tools: Read Grep Bash Edit Write
user-invocable: true
---

## Quando usar

Cliente com débitos federais — RFB ou PGFN — sem caixa para pagar à vista, ou querendo trocar dívida cara por dívida estruturada com Selic.

## Inputs necessários

1. Lista de débitos com origem (DCTF, DARF não pago, auto de infração, NFLD)
2. Situação de cada débito: na RFB (em aberto), em discussão, em PGFN (inscrito em dívida ativa)
3. Existência de outros parcelamentos ativos (limite de 1 ordinário + 1 simplificado simultâneos via IN RFB 1.891)
4. Capacidade de pagamento mensal (skill 40)
5. Há decisão judicial bloqueando ou exigindo depósito?

## Modalidades vigentes (consolidação 2026)

### 1. Parcelamento ordinário (Lei 10.522/2002)
- Até **60 parcelas**
- Mínimo: R$ 200 (PJ) / R$ 100 (PF) por parcela
- Atualização: Selic
- Multa de mora reduzida em 50% no momento da adesão (Lei 12.844/2013) — se havia auto de infração com multa cheia, reduz no parcelamento
- Acessível pelo e-CAC > Pagamentos > Parcelamento

### 2. Parcelamento simplificado (Lei 10.522 art. 14)
- Limite por débito: até R$ 5.000.000
- Adesão totalmente online
- Garantia: nenhuma
- Cumulável com 1 ordinário

### 3. Transação tributária (Lei 13.988/2020)
- **Por adesão** (edital): condições publicadas pela PGFN
- **Individual** (acima de R$ 10 milhões): negociação caso a caso
- Descontos podem chegar a 65% sobre principal/multa/juros (créditos irrecuperáveis ou de difícil recuperação)
- Prazo até 145 meses (longo)
- Análise de capacidade de pagamento (DCP — Demonstração de Capacidade de Pagamento)

### 4. PERSE / PERT / PRR / programas pontuais
- Quando publicados, tem prazos limitados — acompanhar
- Em 2026 o PERSE (eventos) ainda existe parcialmente

### 5. Lei do Bem / parcelamento de débitos sob discussão
- Empresa pode parcelar débito discutido (com efeitos suspensivos): condições específicas

## Passo a passo

### 1. Diagnóstico
- e-CAC > Situação Fiscal: certidão de regularidade negativa ou positiva
- e-CAC > Consulta Pendências: lista débitos
- Sítio da PGFN: REGULARIZE > consulta de débitos inscritos em dívida ativa

### 2. Calcular consolidação
- Cada débito recebe atualização Selic + multa (com reduções)
- Simulador no e-CAC ou REGULARIZE

### 3. Verificar limites
- Empresa já tem parcelamento ativo?
- Se sim: pode aderir a 1 simplificado; ou rescindir o atual e fazer novo (atenção: rescindir perde benefícios)

### 4. Aderir
- e-CAC: Parcelamento ordinário/simplificado
- REGULARIZE (PGFN): para débitos inscritos
- Transação: edital específico

### 5. Pagar 1ª parcela
- DARF gerado pelo sistema
- Vencimento dia 8 do mês seguinte (PGFN) ou conforme cronograma RFB

### 6. Manter regularidade
- Pagar mensalmente em dia
- 3 parcelas em atraso = rescisão automática
- Rescindido: débito volta inteiro com Selic e perde reduções

### 7. CND
- Após adesão e pagamento da 1ª parcela: empresa fica regular
- Pode emitir CND (negativa de débitos federais)

## Cuidados especiais

### Parcelamento PGFN (já em dívida ativa)
- Honorários advocatícios cobrados (10-20%)
- Juros de mora pela TR + 1% (PGFN) ou Selic (RFB), conferir vigência
- Garantia em alguns casos (penhora, fiança)

### Em parcelamento e querendo aderir a outro
- Limite cumulativo (max 1 ordinário + 1 simplificado em geral)
- Migrar de ordinário para transação: pode ser vantajoso pelos descontos
- Planejar: rescindir um para aderir a outro pode tornar débito mais caro

### Empresa em RJ
- Lei 14.112/2020: parcelamento especial em até 120 meses
- Não confundir com RJ judicial (skill advogado 35)

## Templates

### Comparativo de cenários

```
DÉBITO TOTAL: R$ _________

CENÁRIO 1 — À VISTA
Pagamento agora: R$ _________ (multa cheia + Selic)
Caixa imediato impactado: -R$ _________

CENÁRIO 2 — ORDINÁRIO 60x
Multa reduzida 50%: R$ _________
Total parcelado: R$ _________
Parcela mensal: R$ _________
Total pago em 60 meses (com Selic): R$ _________

CENÁRIO 3 — TRANSAÇÃO PGFN (se elegível)
Desconto previsto (até 65%): R$ _________
Total a pagar: R$ _________
Prazo: ___ meses
Parcela mensal: R$ _________

CENÁRIO 4 — DISPUTAR JUDICIALMENTE
Custo advocatício: R$ _________
Probabilidade de êxito: ___%
Risco: depósito judicial / penhora

DECISÃO RECOMENDADA: ___________
JUSTIFICATIVA: ___________
```

## Erros comuns

- Aderir sem simular: alguns parcelamentos ficam mais caros que pagar à vista por causa da Selic acumulada.
- Continuar atrasando mesmo no parcelamento (3 parcelas = rescisão).
- Não destacar débitos em discussão administrativa (incluir esses débitos no parcelamento implica em desistência da defesa).
- Esquecer de incluir débitos previdenciários (eSocial) — vão a parcelamento à parte (RFB, mesma fila).
- Honorários PGFN não considerados no orçamento.
- Sócio responsabilizado solidariamente (ICMS estadual) sem o saber: cuidado com transferência.

## Checklist

- [ ] Diagnóstico completo (RFB + PGFN)
- [ ] Simulação de cada modalidade
- [ ] Capacidade de pagamento confirmada
- [ ] Não está em outro parcelamento (ou plano de rescindir)
- [ ] Adesão protocolada
- [ ] 1ª parcela paga
- [ ] CND emitida
- [ ] Calendário de parcelas no controle do cliente
- [ ] Reaproveitamento de Selic / juros de mora documentado

## Referências

- Lei 10.522/2002 (parcelamento ordinário)
- Lei 12.844/2013 (redução de multa)
- Lei 13.988/2020 (transação)
- Lei 14.112/2020 (RJ — parcelamento especial)
- IN RFB 1.891/2019 (modalidades simplificadas)
- Portaria PGFN 6.757/2022 (transação)
- e-CAC e REGULARIZE
