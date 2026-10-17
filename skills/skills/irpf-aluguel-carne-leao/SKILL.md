---
name: irpf-aluguel-carne-leao
description: Calcula carnê-leão sobre rendimentos de PF (aluguel de PF, autônomo de PF, pensão estrangeira, ganho exterior) com tabela progressiva, deduções e DARF mensal.
allowed-tools: Read Grep Bash Edit Write
user-invocable: true
---

## Quando usar

PF que recebe rendimentos sem retenção pelo pagador (PF pagando PF, ou rendimentos do exterior). Apuração mensal, DARF cód 0190 até último dia útil do mês subsequente.

Casos típicos:
- Aluguel de imóvel pago por PF (locatário PF)
- Pensão alimentícia recebida (regime do beneficiário se não houver retenção)
- Autônomo prestando serviço a PF
- Profissional liberal (advogado, médico, dentista) recebendo de PF
- Rendimento do exterior (com possível compensação de IR pago lá)
- Atividade rural ocasional

**NÃO incide carnê-leão** quando o pagador é PJ (a PJ retém IRRF — skill 11).

## Inputs necessários

1. Valor do rendimento
2. Quem pagou (PF ou exterior)
3. Despesas dedutíveis (no caso de aluguel: IPTU pago pelo locador, taxa de condomínio, despesas de cobrança, comissão paga à imobiliária)
4. Dependentes (R$ 189,59/mês cada — confirmar)
5. Pensão alimentícia paga pelo declarante
6. INSS pago (autônomo: 11% sobre o serviço se pagar como contribuinte individual)
7. Imposto pago no exterior (compensação)

## Cálculo

### Tabela progressiva mensal (mesma do IRRF — skill 11)

| Base mensal | Alíquota | Dedução |
|---|---|---|
| até R$ 2.428,80 | 0% | 0 |
| 2.428,81 a 2.826,65 | 7,5% | 182,16 |
| 2.826,66 a 3.751,05 | 15% | 394,16 |
| 3.751,06 a 4.664,68 | 22,5% | 675,49 |
| > 4.664,68 | 27,5% | 908,73 |

(Valores 2026 — confirmar com a IN da Receita)

### Fórmula

```
Base = Rendimento − Despesas dedutíveis − Dependentes × 189,59 − Pensão paga − INSS pago
IR mensal = Base × Alíquota − Dedução
- IR pago no exterior (proporcional, limitado ao IR daqui)
= IR a pagar (DARF 0190)
```

### Despesas dedutíveis em aluguel (RIR/2018 art. 31)

Locador PF pode deduzir:
- IPTU pago pelo locador (não passado para o locatário)
- Taxa de condomínio paga pelo locador
- Despesas pagas para cobrança ou recebimento (comissão imobiliária)
- Despesas de aluguel (caso o imóvel seja sublocado)

Não dedutível:
- Reparos / benfeitorias

### Aluguel recebido por sociedade (PJ)
- Empresa paga IRPJ/CSLL/PIS/COFINS — não é carnê-leão.

## Passo a passo

### 1. Coletar comprovantes mensais
- Recibo de aluguel, contrato, comprovantes IPTU/condomínio
- RPA do autônomo, contrato

### 2. Calcular base e IR mensal
- Aplicar tabela e dedução

### 3. Lançar no Carnê-Leão Web (e-CAC > Meu IRPF > Carnê-Leão)
- Sistema gera DARF
- DARF cód 0190 até último dia útil do mês subsequente
- Valor mínimo R$ 10,00 (se < R$ 10, acumular)

### 4. Pagar e arquivar comprovante

### 5. Anual: importar carnê-leão para o IRPF
- Receita já vai com IR pago — apenas confere

## Templates

### Aluguel — cálculo mensal

```
LOCADOR ___________ CPF ___________
LOCATÁRIO (PF) ___________ CPF ___________
IMÓVEL ___________ Mês ___/____

Aluguel recebido: R$ _________
- IPTU (pago pelo locador, prop. mês): R$ _________
- Condomínio: R$ _________
- Comissão imobiliária: R$ _________
= BASE BRUTA: R$ _________

- Dependentes (qtd × 189,59): R$ _________
- Pensão alimentícia paga: R$ _________
= BASE IRPF: R$ _________

Faixa: ___% Dedução: R$ _________
IR DEVIDO: R$ _________
DARF cód 0190 vto __/__/____
```

### Autônomo (PF presta a PF) — cálculo mensal

```
AUTÔNOMO ___________ CPF ___________
TOMADOR (PF) ___________ CPF ___________
SERVIÇO ___________ Mês ___/____

Rendimento: R$ _________
- INSS contribuinte individual 11% × salário-base: R$ _________
- Dependentes: R$ _________
- Pensão paga: R$ _________
= BASE: R$ _________

IR DEVIDO: R$ _________
DARF 0190 vto __/__/____
```

## Erros comuns

- Não deduzir IPTU/condomínio quando o locador paga (informação no contrato).
- Aluguel recebido por administradora — quem é o locador (PF) ainda paga carnê-leão sobre o aluguel líquido.
- Esquecer DARF mensal — multa 1% a.m. + Selic.
- Aluguel < R$ 1.903,98 (limite isenção mensal antiga; agora limite é R$ 2.428,80 em 2026): pode estar isento por faixa, mas precisa lançar para somar com outros rendimentos no anual.
- IR pago no exterior: limite à diferença entre IR brasileiro e estrangeiro (não pode pegar restituição da diferença).
- Não importar para o IRPF anual — registro fica desconectado.

## Checklist mensal

- [ ] Rendimento de PF ou exterior conferido
- [ ] Despesas dedutíveis com comprovante
- [ ] INSS pago se autônomo (skill 12)
- [ ] DARF cód 0190 gerado e pago
- [ ] Carnê-Leão Web atualizado

## Checklist anual

- [ ] Todos os meses lançados
- [ ] Importação para IRPF
- [ ] Conferência das deduções
- [ ] Compensação de IR exterior (se houver)

## Referências

- Decreto 9.580/2018 art. 7º a 18 (rendimentos)
- Decreto 9.580/2018 art. 31 (deduções aluguel)
- Lei 9.250/1995 art. 8º
- Lei 7.713/1988
- IN RFB 1.500/2014 (consolidação IRPF)
