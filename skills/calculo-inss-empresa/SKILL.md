---
name: calculo-inss-empresa"
description: Calcula contribuição previdenciária patronal (CPP, RAT/FAP, terceiros), aplica desoneração da folha vigente, separa atividades concomitantes e gera GFIP/DCTFWeb.
allowed-tools: Read Grep Bash Edit Write
user-invocable: true
---

> ⚠️ **AVISO FISCAL — CONFIRA ANTES DE GERAR A GUIA.** Todo código de receita (DARF/DAS), alíquota, base de cálculo, valor e data de vencimento gerado por este agente é **rascunho de apoio** e pode variar por ano, regime tributário, município ou caso específico. **Confira sempre na fonte oficial vigente (Receita Federal / e-CAC / legislação estadual e municipal) antes de transmitir declaração ou pagar guia.** A conferência final é responsabilidade do contador responsável.

## Quando usar

Empresa com folha de pagamento que precisa apurar INSS patronal mensal. Empresas dos setores beneficiados pela desoneração (Lei 14.973/2024 — transição até 2027) podem optar pela CPRB. Lucro Real, Presumido e Simples Anexo IV aplicam.

## Inputs necessários

1. Folha de pagamento do mês (salário, horas extras, pró-labore, comissões, RAT)
2. Atividade preponderante (CNAE) — define alíquota RAT (1, 2 ou 3%)
3. FAP (Fator Acidentário de Prevenção) — informado pela RFB anualmente
4. Setor desonerado pela Lei 12.546/2011 (até 31/12/2024) ou Lei 14.973/2024 (transição 2025-2027)?
5. Empresa do Simples? Anexo IV recolhe CPP por fora; demais anexos têm CPP no DAS
6. Terceiros (Sistema S, INCRA, Salário-Educação)

## Cálculo INSS Patronal (regime regular)

```
CPP (cota patronal) = Folha total × 20%
RAT × FAP = Folha × (1, 2 ou 3%) × FAP (entre 0,5 e 2,0)
Terceiros = Folha × % conforme tabela CNAE (5,8% típico: SESI 1,5 + SESC 1,5 + SENAI 1 + INCRA 0,2 + Sal Educ 2,5 + SEBRAE 0,6)
```

Total típico: 20% + RAT_efetivo + 5,8% = ~28% sobre a folha.

### Pró-labore
- INSS empresa NÃO incide sobre pró-labore (não é "remuneração de empregado", é de "contribuinte individual").
- Mas há retenção de 11% do contribuinte individual (até teto) e 20% empresa sobre o pró-labore? **Atenção**: a empresa recolhe 20% sobre o pró-labore como **CPP de contribuinte individual** (Lei 8.212/91, art. 22, III).

## Desoneração da Folha (CPRB)

A Lei 14.973/2024 estabeleceu **transição** para os 17 setores antes desonerados:

| Ano | Alíquota CPRB | CPP folha |
|---|---|---|
| 2024 | Pleno (1 a 4,5% receita) | 0% (desonerado) |
| 2025 | 80% da CPRB | 20% folha (mas só 25% da folha sujeita) |
| 2026 | 60% da CPRB | 40% folha |
| 2027 | 40% da CPRB | 60% folha |
| 2028+ | revogada | 100% folha |

A empresa opta no início do ano (irretratável). Calcular qual é mais vantajoso comparando: alíquota CPRB × receita vs. 20% folha + RAT.

## Atividades concomitantes

Se a empresa tem operação na atividade desonerada **e** outra atividade não desonerada, aplica **proporcionalização** com base na receita de cada operação. Lei 12.546/2011, art. 9º §1º.

## Simples Nacional Anexo IV

- Empresas de construção civil, vigilância, limpeza pagam **INSS patronal por fora** do DAS, em GPS, alíquota 20% + RAT × FAP + terceiros.
- Demais anexos (I, II, III, V): CPP está incluso no DAS.

## Templates

```
INSS PATRONAL — Comp __/____
Folha total....................... R$ _________
  Salários...................... R$ _________
  HE/adicionais................. R$ _________
  Pró-labore.................... R$ _________
  Comissões..................... R$ _________

CPP 20%.......................... R$ _________
RAT ___% × FAP ___ × Folha....... R$ _________
Terceiros 5,8%................... R$ _________
TOTAL INSS A RECOLHER............ R$ _________

Vencimento: dia 20 do mês subsequente
GPS / DCTFWeb / DAE conforme caso
```

### Exemplo

Folha R$ 100.000, RAT 2%, FAP 1,2 → RAT efetivo 2,4%, Terceiros 5,8%:
- CPP: 20.000
- RAT: 2.400
- Terceiros: 5.800
- **Total: R$ 28.200**

## Erros comuns

- RAT errado para o CNAE (consultar Anexo V do Decreto 3.048/99).
- FAP desatualizado — RFB publica anualmente (consultar gov.br/inss).
- Não separar atividade desonerada da não desonerada.
- Pró-labore: esquecer 20% empresa sobre contribuinte individual.
- Esquecer terceiros (5,8% comum, mas varia por CNAE — clube esportivo, transporte, ensino têm composições diferentes).
- Empresa do Simples Anexo IV recolhendo somente DAS (autuação).

## Checklist

- [ ] CNAE preponderante e RAT atualizados
- [ ] FAP conferido no eSocial / RFB
- [ ] Pró-labore com CPP de 20% recolhido
- [ ] Atividades concomitantes proporcionalizadas
- [ ] DCTFWeb com débitos por rubrica (CPP, RAT, Terceiros)
- [ ] DAE / GPS gerada e paga
- [ ] eSocial S-5011 (totalizador) recebido após fechamento

## Referências

- Lei 8.212/1991 (Custeio da Seguridade Social)
- Decreto 3.048/1999 (RPS)
- Lei 12.546/2011 (CPRB original)
- Lei 14.973/2024 (transição da desoneração)
- IN RFB 2.005/2021 (DCTFWeb)
- IN RFB 2.110/2022 (consolidação contribuições)
