---
name: folha-pagamento-mensal"
description: Monta a folha de pagamento mensal CLT com salário, adicionais, INSS, IRRF, FGTS, vale-transporte e descontos, gerando holerite, DARFs e cruzando com eSocial.
allowed-tools: Read Grep Bash Edit Write
user-invocable: true
---

## Quando usar

Mensalmente, todo dia 1 ao 5 do mês subsequente. Cliente envia frequência (HE, faltas, atestados, comissões) e a skill monta a folha completa.

## Inputs necessários

1. Cadastro vigente: salário, jornada, dependentes, opção VT/VR, plano de saúde, sindicato/categoria, dissídio
2. Frequência do mês: dias trabalhados, faltas, HE 50%, HE 100%, adicional noturno, periculosidade, insalubridade
3. Pagamentos variáveis: comissões, prêmios, gratificações
4. Adiantamentos pagos no dia 15 (ou regra interna)
5. Atestados, afastamentos
6. Tabela INSS e IRRF vigente
7. Convenção coletiva (CCT) e dissídio

## Cálculo passo a passo

### 1. Composição bruta

```
Salário base................................... R$ _________
+ Adicionais
   Periculosidade (30% do salário base)......... R$ _________
   Insalubridade (10/20/40% do salário-mínimo)... R$ _________
   Adicional noturno (20% sobre hora 22-5)...... R$ _________
   Hora extra 50% / 100%......................... R$ _________
+ Comissões / prêmios........................... R$ _________
+ Bônus / DSR sobre HE.......................... R$ _________
= BRUTO MENSAL.................................. R$ _________
```

### 2. INSS (faixas 2026 — confirmar)

| Faixa salário | Alíquota efetiva |
|---|---|
| até R$ 1.518,00 | 7,5% |
| 1.518,01 a 2.793,88 | 9% |
| 2.793,89 a 4.190,83 | 12% |
| 4.190,84 a 8.157,41 | 14% |

INSS é calculado por **alíquota efetiva** (faixas progressivas, descontando a alíquota anterior em cada faixa). Atenção: o teto vigente em 2026 é ~R$ 8.157,41 (verificar Portaria MTP).

Fórmula prática (sobre salário até teto):
```
INSS = Salário × Alíquota faixa − Dedução faixa
```

### 3. IRRF
Aplicar tabela progressiva (skill 11) sobre Bruto − INSS − Dependentes − Pensão.

### 4. Outros descontos

```
- VT (mín entre 6% do salário OU custo real — Lei 7.418/85)
- VR/VA (sem desconto fixo, mas custo é dedutível PAT)
- Plano de saúde (cota empregado)
- Faltas e atrasos (CLT art. 64 — proporcional ao dia)
- Empréstimo consignado (margem 35% / 5% cartão / 5% emergência)
- Pensão alimentícia (judicial)
- Contribuição sindical (após STF/Lei 13.467: voluntária)
```

### 5. FGTS (depósito empresa)

```
FGTS = Bruto × 8% (depósito mensal)
```
Aprendiz: 2%. Doméstico: 8% + 3,2% multa antecipada.

### 6. Líquido a pagar

```
Líquido = Bruto − INSS − IRRF − VT (cota) − Plano − Faltas − Outros
```

## Encargos da empresa (resumo — skill 12 detalha)

```
Cota patronal INSS 20%............ Bruto × 20%
RAT × FAP......................... Bruto × (1-3%) × FAP
Terceiros 5,8% (típico)........... Bruto × 5,8%
FGTS.............................. Bruto × 8%
TOTAL ENCARGOS ≈ 36-40% do bruto
```

Empresa do Simples Anexos I, II, III, V: encargos no DAS. Anexo IV recolhe à parte.

## Templates

### Holerite

```
EMPRESA __________________  CNPJ __________
COMPETÊNCIA __/____  Pgto: __/__/____

EMPREGADO ____________________________________
CPF _____________  Cargo __________  Sal base R$ _________

PROVENTOS                              DESCONTOS
Salário base....... R$ _________     INSS (faixa) R$ _________
HE 50% ___ h....... R$ _________     IRRF........ R$ _________
HE 100% ___ h...... R$ _________     VT (6%)..... R$ _________
Adic. noturno...... R$ _________     Plano saúde. R$ _________
Periculosidade..... R$ _________     Empréstimo.. R$ _________
DSR sobre HE....... R$ _________     Adiantamento R$ _________
Comissão........... R$ _________     Sindicato... R$ _________
                                     Pensão...... R$ _________
TOTAL PROVENTOS R$ _________   TOTAL DESCONTOS R$ _________

LÍQUIDO A RECEBER R$ _________

Base FGTS R$ _________  FGTS depositado R$ _________
Base INSS R$ _________
Dependentes IRRF: ___
```

## Erros comuns

- INSS sem usar fórmula progressiva (calculando por faixa única) → desconto a maior do empregado.
- Esquecer DSR sobre HE/comissão (Súmula 27 e 60 TST + Lei 605/49).
- Conventional collective agreement não aplicado no dissídio.
- VT descontado do salário-mínimo (vedado: o desconto é sobre o salário base do empregado, não sobre o mínimo).
- Pagar adicional noturno mas esquecer hora reduzida (52'30" = 1 hora — CLT art. 73 §1º).
- Periculosidade × insalubridade: empregado escolhe a mais vantajosa, não soma.
- Aprendiz com FGTS 8% (correto: 2%).

## Checklist mensal

- [ ] Frequência conferida (cartão de ponto, banco de horas, atestados)
- [ ] CCT/dissídio aplicado
- [ ] HE / DSR sobre HE corretos
- [ ] INSS por alíquota efetiva
- [ ] IRRF com dependentes e pensão
- [ ] FGTS depositado até dia 7 (ou conforme calendário)
- [ ] Holerite assinado/entregue
- [ ] eSocial S-1200/S-1210 enviados
- [ ] DARF IRRF + GPS/INSS pagos no vencimento

## Referências

- CLT (toda)
- Lei 8.036/1990 (FGTS)
- Lei 7.418/1985 (Vale-Transporte)
- Lei 6.321/1976 (PAT)
- Lei 13.467/2017 (Reforma Trabalhista)
- Súmulas TST 27, 60, 264, 437
- Tabelas INSS / IRRF vigentes
