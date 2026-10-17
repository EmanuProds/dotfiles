---
name: rescisao-clt-calculo
description: Calcula verbas rescisórias por motivo (sem justa causa, justa causa, pedido demissão, acordo, fim contrato, aposentadoria, falecimento), gera TRCT e prepara GRRF/eSocial.
allowed-tools: Read Grep Bash Edit Write
user-invocable: true
---

## Quando usar

Sempre que houver término do contrato de trabalho. Use junto com a skill 24 (eSocial-rescisao) que cobre transmissão e prazos. Esta skill foca em **cálculo financeiro**.

## Inputs necessários

1. Data de admissão e desligamento
2. Salário atual + médias de variáveis dos últimos 12 meses (HE, adicionais, comissões)
3. Motivo (definição em CLT art. 482, 483, 484, 484-A; Lei 13.467/2017)
4. Saldo de férias (vencidas + proporcionais)
5. Avos de 13º proporcional
6. Saldo FGTS na conta vinculada (consulta CAIXA)
7. Aviso prévio: trabalhado, indenizado, dispensa pelo empregado
8. Vale-transporte adiantado, plano de saúde quitado

## Tabela síntese — verbas por motivo

| Verba | Sem justa causa | Justa causa | Pedido demissão | Acordo (484-A) | Fim contrato prazo | Aposentadoria | Falecimento |
|---|---|---|---|---|---|---|---|
| Saldo salário | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Aviso prévio | Sim (indenizado ou trab) | Não | Pago pelo empregado se não cumprir | 50% | Não | Não | Não |
| Férias vencidas + 1/3 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Férias proporcionais + 1/3 | ✓ | Não (Súm 171 TST) | ✓ (Súm 261 TST) | ✓ | ✓ | ✓ | ✓ |
| 13º proporcional | ✓ | Não | ✓ | ✓ | ✓ | ✓ | ✓ |
| FGTS (saque) | Sim | Não | Não | Sim 80% | Sim | Sim | Sim (dep.) |
| Multa 40% sobre FGTS | Sim | Não | Não | 20% | Não | Não | Não |
| Seguro-desemprego | Sim | Não | Não | Não | Não | Não | Não |

## Cálculos detalhados

### 1. Saldo de salário
```
(dias trabalhados no mês / 30) × salário base
```

### 2. Aviso prévio
- Mínimo: 30 dias (CF art. 7º XXI)
- Lei 12.506/2011: + 3 dias por ano completo, máximo 60 dias adicionais
- Total possível: até 90 dias

```
Aviso indenizado = (30 + acréscimo) / 30 × salário + médias
```

### 3. Férias vencidas (período aquisitivo já completo)
```
Salário + médias + 1/3
```

### 4. Férias proporcionais
```
(avos / 12) × (salário + médias) × 1,33
Avos: meses com 15+ dias trabalhados
```

### 5. 13º proporcional
```
(avos / 12) × salário + médias
Avos: meses com 15+ dias trabalhados (incluindo aviso indenizado projeta)
```

### 6. FGTS
```
Saldo na conta CAIXA + depósitos do mês corrente + multa
Multa = 40% sobre saldo + depósitos rescisórios (sem justa causa)
       = 20% (acordo Lei 13.467)
       = 0% (justa causa, pedido, fim contrato sem direito)
```

### 7. Descontos
- INSS sobre saldo salário, aviso, 13º (segregar bases)
- IRRF: aviso indenizado, 13º, multa de FGTS — verificar incidência. **IRRF sobre aviso indenizado: STJ Súmula 463 — não incide; sobre férias indenizadas tampouco (Tema 481).**
- Sobre 1/3 de férias proporcionais: jurisprudência consolidada que **não incide IRRF** nas verbas indenizatórias da rescisão.
- Vale-transporte adiantado, plano de saúde, contribuição sindical (se ainda autorizada).

## Templates

### Cálculo (sem justa causa)

```
TRABALHADOR ________________________ Adm: __/__/____ Demissão: __/__/____
Salário base: R$ _________  Médias variáveis (12m): R$ _________
Tempo de casa: ___ anos ___ meses  Aviso: ___ dias

VERBAS RESCISÓRIAS
Saldo salário (___ dias)............. R$ _________
Aviso indenizado (___ dias).......... R$ _________
Férias vencidas + 1/3................ R$ _________
Férias proporcionais (__/12) + 1/3... R$ _________
13º proporcional (__/12)............. R$ _________
                              SUBTOTAL R$ _________

DESCONTOS
INSS (saldo + aviso + 13º)........... R$ _________
IRRF (apenas sobre saldo + 13º)...... R$ _________
Vale-transporte adiantado............ R$ _________
Plano de saúde........................ R$ _________
                              SUBTOTAL R$ _________

LÍQUIDO RESCISÃO..................... R$ _________

FGTS
Saldo na conta vinculada (extrato)... R$ _________
Depósito mês competente.............. R$ _________
Depósito sobre aviso indenizado...... R$ _________
Multa 40%............................ R$ _________
                              GRRF    R$ _________
```

## Erros comuns

- IRRF sobre aviso prévio indenizado e férias indenizadas (não incide — STJ Súmulas 463 e 498 e Tema 481).
- Esquecer FGTS sobre aviso indenizado (incide).
- Acordo Lei 13.467/2017: aplicar 40% (correto: 20%).
- Justa causa sem documentação prévia (advertências, suspensões) → revertida.
- Pedido demissão de empregado com mais de 1 ano sem assistência sindical (a Reforma 2017 dispensou, mas conferir CCT).
- Não pagar em 10 dias → multa 477 §8º (1 salário em favor do trabalhador).
- Empregado em estabilidade (gestante, CIPA, acidentado) demitido sem justa causa → reintegração ou indenização do período.

## Checklist

- [ ] Motivo confirmado e documentado
- [ ] Salário e médias dos últimos 12 meses
- [ ] Avos calculados corretamente
- [ ] Aviso prévio Lei 12.506
- [ ] FGTS extratado e multa correta para o motivo
- [ ] INSS e IRRF aplicados conforme verba
- [ ] TRCT preenchido modelo MTP
- [ ] Pagamento em até 10 dias
- [ ] eSocial S-2299 (skill 24)
- [ ] GRRF / FGTS Digital paga
- [ ] Chave seguro-desemprego (quando cabível)
- [ ] Plano de saúde — opção de manutenção comunicada

## Referências

- CLT arts. 477 a 484-A
- Lei 13.467/2017
- Lei 12.506/2011 (aviso prévio)
- Lei 8.036/1990 (FGTS) art. 14, 18
- Súmulas TST 171, 261, 305, 437; STJ 463, 498
- Tema 481 STJ (IRRF férias indenizadas)
