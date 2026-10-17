---
name: malha-fina-pf-diagnostico
description: Diagnostica IRPF na malha fina (extrato de processamento), identifica a inconsistência (rendimento omitido, dedução indevida, ganho de capital, dependente), prepara retificadora ou defesa.
allowed-tools: Read Grep Bash Edit Write
user-invocable: true
---

## Quando usar

Cliente PF recebe **comunicado de pendência** (extrato no e-CAC), intimação ou notificação. Também atue preventivamente após entrega da declaração — verificar pendências antes de a malha apertar.

## Inputs necessários

1. Declaração IRPF transmitida (cópia + recibo)
2. Extrato de Processamento (e-CAC > Meu IRPF > Pendências da Malha)
3. Informes de rendimento (todos os pagadores)
4. Informes de plano de saúde, previdência privada, doações (deduções)
5. DBE / DEFIS / DASN dos negócios (se sócio)
6. Comprovantes de despesas dedutíveis (médicas, educação)
7. Documentos de ganho de capital (escrituras, GCAP)
8. Extratos de corretora (B3 — IR sobre operações)

## Causas mais comuns de malha

### 1. Rendimento omitido
- Pagador informou na DIRF/R-4010 e não foi declarado pelo contribuinte.
- Multi-emprego, RPA esquecido, aluguel recebido, pensão, dividendos isentos mas listados.
- **Fonte mais comum**: empregos curtos, contratos temporários, RPAs sem comprovante.

### 2. Dedução indevida
- Despesa médica sem recibo válido (precisa CPF, valor, data, profissional).
- Plano de saúde com dependente que não consta na declaração.
- Educação acima do limite (R$ 3.561,50 anual por dependente em 2026 — confirmar tabela).
- Pensão alimentícia sem decisão judicial.
- Previdência privada PGBL sem vínculo com previdência oficial.

### 3. Dependente
- Mesmo dependente em duas declarações (família compartilhada).
- Filho > 24 anos sem ser estudante universitário/PNE.
- Pai/mãe com renda > limite (R$ 23.456,38 anual em 2026 — confirmar).

### 4. Ganho de capital não declarado
- Venda de imóvel sem GCAP.
- Venda de ações com lucro mensal > R$ 20.000 (isenção).
- Day trade não declarado.

### 5. Investimento incompatível
- Aplicação informada por banco que não bate com o que o contribuinte declarou.
- Ações na B3 que aparece em IRPF da fonte pagadora.

### 6. Variação patrimonial a descoberto
- Patrimônio cresceu mais do que a renda declarada permite.
- Empréstimo de PJ ou família sem documento.

## Passo a passo

### 1. Acessar o Extrato no e-CAC
- gov.br/receita > Meu IRPF > Extrato do Processamento
- Identificar a "pendência" e o **número da pendência** (ex.: 004, 010, 015)

### 2. Decifrar a pendência
- Cada código tem um significado (consulte o "Glossário do Extrato"):
  - 001 — Saldo a pagar
  - 002 — Restituição
  - 010 — Rendimento omitido
  - 015 — Dedução com saúde
  - 050 — Ganho de capital
  - 070 — Dependente

### 3. Levantar os documentos para defender / corrigir

### 4. Decidir: retificar ou defender

**Retificar**: mais simples, mais rápido, evita auto de infração.
- Aceita o erro, refaz IRPF, paga a diferença com Selic.
- Pode ser feito antes ou depois do prazo de entrega; não pode mudar de Completo p/ Simplificado após o último dia de entrega.

**Defender**: quando há documento a apresentar.
- Resposta à intimação: anexar comprovantes via e-CAC > "Apresentação de Documentos por Solicitação Fiscal".
- Aguardar a Receita validar.

### 5. Pagar diferença
- Se retifica e gera saldo a pagar: DARF cód 0211 com multa (75% se houver intimação) e Selic.

## Templates

### Cálculo de retificação

```
DECLARAÇÃO ORIGINAL:
Rendimento tributável...... R$ _________
Imposto devido............. R$ _________
Imposto retido na fonte.... R$ _________
Saldo a pagar / restituir.. R$ _________

AJUSTE (motivo: rendimento omitido — RPA não declarado):
+ Rendimento.............. R$ _________
+ INSS retido associado... R$ _________
+ IRRF retido associado... R$ _________

DECLARAÇÃO RETIFICADA:
Rendimento tributável...... R$ _________
Imposto devido............. R$ _________
Imposto retido na fonte.... R$ _________
Saldo a pagar / restituir.. R$ _________

Diferença saldo: R$ _________
+ Multa (1% a.m. ou 0,33%/dia, máx 20%): R$ _________
+ Selic acumulada: R$ _________
DARF a pagar: R$ _________
```

### Resposta a intimação

```
À Receita Federal do Brasil
DRF / Posto: __________
Contribuinte: __________ CPF: __________
Ano-calendário: ____ Pendência n° ____

Em atendimento à intimação ____, segue:

PENDÊNCIA: dedução com saúde no valor de R$ _________
(Indicado no extrato: lançamento ____ — informe pagador divergente)

DEFESA: anexamos os recibos abaixo, contendo CPF do paciente, valor, data e identificação do profissional/hospital, nos termos do art. 73 do RIR/2018:
   1. Recibo Dr. ____ CRM ____ data ____ valor R$ _________
   2. Recibo Hospital ____ CNPJ ____ data ____ valor R$ _________
   3. (...)

Solicitamos a baixa da pendência e processamento normal da declaração.

Atenciosamente,
__________
Contador CRC __________
Procurador (procuração e-CAC anexa)
```

## Erros comuns

- Retificar antes de entender a pendência — corrigir o que não estava errado.
- Apresentar recibos sem CPF do paciente — Receita não aceita.
- Demorar para responder — após 30 dias da intimação, vira auto de infração com multa de 75%.
- Pagar DARF sem retificar a declaração — o débito fica em aberto até a retificadora.
- Usar Simplificada quando a Completa daria restituição maior (ou vice-versa) — refazer simulação.

## Checklist

- [ ] Extrato consultado no e-CAC
- [ ] Pendência identificada e decifrada
- [ ] Documentos suporte coletados
- [ ] Decisão: retificar / defender
- [ ] Retificadora transmitida + DARF pago (se for o caso)
- [ ] Resposta à intimação anexada
- [ ] Procuração e-CAC ativa
- [ ] Cliente ciente e protocolo arquivado

## Referências

- Decreto 9.580/2018 (RIR/2018)
- IN RFB 2.077/2022 (IRPF)
- IN RFB 1.500/2014 (consolidação IRPF)
- Lei 9.250/1995
- Manual IRPF do ano vigente
