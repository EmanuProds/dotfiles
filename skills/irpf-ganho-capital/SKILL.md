---
name: irpf-ganho-capital
description: Calcula ganho de capital de imóveis, ações fora da B3 e criptomoedas, aplica isenções (único imóvel até R$ 440k, reinvestimento em 180 dias, R$ 35 mil mês cripto), gera GCAP e DARF.
allowed-tools: Read Grep Bash Edit Write
user-invocable: true
---

## Quando usar

Em toda alienação onerosa por PF de bem ou direito (imóvel, veículo, ação, cota, cripto, ouro). Apuração no **mês da alienação**, DARF cód 4600 até último dia útil do mês subsequente.

## Inputs necessários

1. Tipo de bem (imóvel, ação, veículo, cripto, etc.)
2. Data de aquisição e valor de aquisição (escritura, NF, custo médio ações)
3. Data de alienação e valor da venda
4. Despesas comprovadas (corretagem, ITBI quando pago pelo vendedor, benfeitorias)
5. Histórico de aquisições parciais (consolidar custo médio)
6. Hipóteses de isenção aplicáveis

## Cálculo geral

```
Ganho de capital = Valor de alienação − (Custo de aquisição + Despesas)
Imposto = Ganho × Alíquota
```

### Alíquotas progressivas (imóveis, bens em geral — Lei 13.259/2016)

| Faixa de ganho | Alíquota |
|---|---|
| Até R$ 5.000.000 | 15% |
| 5 mi − 10 mi | 17,5% |
| 10 mi − 30 mi | 20% |
| > 30 mi | 22,5% |

### Ações fora da B3 e bens em geral (Lei 13.043/2014, regra antiga 15%) — confirmar.

### Criptoativos
- Alíquota 15% sobre ganho mensal > R$ 35.000 vendido (Lei 14.754/2023 e IN RFB 1.888/2019).
- Ganho até R$ 35.000 isento.

### Veículos
- Bem de uso pessoal — isento se < R$ 35.000 (Lei 9.250 art. 22).

## Isenções relevantes (imóvel)

### 1. Único imóvel até R$ 440.000
- Vendedor que não realizou outra alienação isenta nos últimos 5 anos
- Imóvel residencial, comercial, terreno
- Lei 9.250/95 art. 23

### 2. Reinvestimento em outro imóvel residencial em 180 dias
- Vendedor de imóvel residencial que adquire outro residencial no Brasil em até 180 dias
- Pode ser parcial (proporcional)
- Lei 11.196/2005 art. 39
- Não usar nos últimos 5 anos

### 3. Imóvel adquirido até 1969
- Isenção total (RIR art. 132 II)

### 4. Pequenos imóveis rurais (até 50 ha)
- Isento se for único e o vendedor for pequeno produtor (Lei 9.393/96)

## Redutores de imposto (Lei 11.196/2005)

Para imóveis adquiridos antes de **2017**, há redutor decrescente:

```
Redutor 1 (Fator 1) = 1 / (1 + 0,005 × (mês_alien − dez/2005))
Redutor 2 (Fator 2) = 1 / (1 + 0,0035 × (mês_alien − dez/2014))
```

Aplicar conforme a IN RFB 84/2001 e simulador GCAP.

## Custo médio (ações fora B3 e cripto)

```
Aquisição 1: 100 ações × R$ 10 = R$ 1.000
Aquisição 2: 200 ações × R$ 13 = R$ 2.600
Estoque: 300 ações, custo total R$ 3.600
Custo médio = R$ 12,00

Venda: 100 ações × R$ 18 = R$ 1.800
Custo das vendidas = 100 × 12 = R$ 1.200
Ganho = R$ 600 → IR 15% = R$ 90
```

## Passo a passo

### 1. Identificar o bem e a operação
- Tipo + datas + valores

### 2. Verificar isenção
- Bens > R$ 35.000 (limite ações), R$ 440.000 (imóvel), R$ 35.000 cripto/mês
- Reinvestimento em 180 dias
- 1969

### 3. Calcular ganho
- Custo de aquisição com despesas (escritura, ITBI, corretagem, benfeitorias com NF)
- Aplicar redutores quando cabível

### 4. Lançar no GCAP (programa anual da RFB)
- Importar para o IRPF na ficha "Ganhos de Capital"
- Gerar DARF cód 4600

### 5. Pagar até último dia útil do mês subsequente

### 6. Declarar no IRPF anual
- Ficha Bens e Direitos: dar baixa do bem alienado
- Ficha Ganhos de Capital: importar do GCAP
- Comprovar isenção (Bens e Direitos com observação) ou pagamento

## Templates

### Cálculo de ganho de capital (imóvel)

```
IMÓVEL ____________________________
Adquirido em: __/__/____ por R$ _________
+ Despesas com aquisição (escritura, ITBI): R$ _________
+ Benfeitorias com NF: R$ _________
= CUSTO TOTAL: R$ _________

Alienado em: __/__/____ por R$ _________
- Comissão imobiliária: R$ _________
= VALOR LÍQUIDO: R$ _________

GANHO BRUTO = Líquido − Custo: R$ _________

REDUTORES (Lei 11.196):
  Fator 1 (aquisição < 12/2005): ___
  Fator 2 (aquisição < 12/2014): ___
Ganho ajustado: R$ _________

ALÍQUOTA: __% (faixa progressiva)
IR DEVIDO: R$ _________

ISENÇÃO?
[ ] Único imóvel até R$ 440k (Lei 9.250 art. 23)
[ ] Reinvestimento residencial 180 dias (Lei 11.196 art. 39)
[ ] Aquisição < 1969

DARF cód 4600: R$ _________ Vto: __/__/____
```

## Erros comuns

- Esquecer de gerar DARF mensal — multa 0,33%/dia + Selic + multa de 75% se intimado.
- Não documentar benfeitorias (precisa NF) — Receita não aceita.
- Aplicar isenção R$ 440k e o vendedor já a usou nos últimos 5 anos.
- Reinvestimento em 180 dias com imóvel comercial — só vale residencial.
- Cripto: não somar todas as movimentações do mês para verificar > R$ 35k.
- Custo médio sem incluir taxa de corretagem/transferência.
- Veículo de uso pessoal vendido por > R$ 35.000: lembrar que o ganho é tributável.

## Checklist

- [ ] Documentos de aquisição e alienação coletados
- [ ] Custo total com despesas e benfeitorias
- [ ] Verificação de isenções
- [ ] Redutores Lei 11.196 aplicados (imóveis pré-2017)
- [ ] GCAP gerado
- [ ] DARF cód 4600 pago no prazo
- [ ] Lançamento no IRPF anual (Bens + Ganhos)
- [ ] Comprovantes arquivados por 5 anos

## Referências

- Lei 9.250/1995 art. 23
- Lei 11.196/2005 art. 39, 40, 47 (reinvestimento, redutor)
- Lei 13.259/2016 (alíquotas progressivas)
- IN RFB 84/2001 (regulamento ganho de capital)
- Lei 14.754/2023 (cripto e exterior)
- Decreto 9.580/2018 (RIR/2018) arts. 128-156
