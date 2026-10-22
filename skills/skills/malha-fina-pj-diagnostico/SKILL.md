---
name: malha-fina-pj-diagnostico"
description: Diagnostica intimações da malha PJ (Termo de Intimação Fiscal, Comunicado de Inconsistência), identifica divergências entre SPEDs e DCTFWeb, prepara resposta ou retificação.
allowed-tools: Read Grep Bash Edit Write
user-invocable: true
---

## Quando usar

PJ recebeu Termo de Intimação Fiscal, Comunicado de Inconsistência, Ofício, Aviso de Lançamento ou está com pendência de regularidade na CND. Skill correlata: 44 (revisão SPED) — fazer cruzamento antes para conhecer divergências.

## Inputs necessários

1. Documento da Receita (intimação, ofício, comunicado) com período e tributos
2. SPEDs e declarações do período (skill 44)
3. Pagamentos / DARFs / GPS do período
4. Procuração e-CAC ativa
5. Notificações anteriores (verificar se já houve fiscalização)

## Tipos de notificação

| Documento | Significado | Prazo |
|---|---|---|
| Comunicado de Inconsistência | Aviso preventivo, sem auto | Variável |
| Termo de Intimação Fiscal (TIF) | Pede esclarecimentos / documentos | 20 dias prorrogáveis |
| Auto de Infração | Lançamento — cobra tributo + multa | 30 dias para impugnação |
| Despacho Decisório | Decisão sobre PER/DCOMP | 30 dias para manifestação |
| Aviso de Lançamento (DARF) | Cobrança de saldo declarado e não pago | Pagar ou parcelar |

## Causas mais comuns

### 1. Divergência receita ECF × EFD-Contribuições
- Receita financeira tributada de forma diferente
- ICMS Tema 69 excluído em uma e não em outra

### 2. Divergência DCTFWeb × eSocial / Reinf
- eSocial fechado mas DCTFWeb não retransmitida
- Retificações em eSocial sem ajustar DCTFWeb

### 3. Compensação não homologada (PER/DCOMP)
- Crédito glosado por insuficiência ou ausência de retificação SPED

### 4. Falta de pagamento
- DCTFWeb confessou débito mas não foi pago
- DARF gerado e ignorado

### 5. CNPJ inativo / cadastro divergente
- Endereço fiscal divergente
- Quadro societário desatualizado

### 6. Indícios em declarações de terceiros
- Cliente PJ informou pagamento em DIRF/R-4020 e o prestador não declarou receita

### 7. ICMS diferente entre EFD e DEFIS/DAS
- Empresa Simples acima do sublimite com ICMS por fora não pago

## Passo a passo

### 1. Ler com atenção o documento
- Identificar:
  - Tributo
  - Período
  - Valor
  - Fundamento legal
  - Prazo de resposta

### 2. Levantar a documentação
- SPEDs do período + DCTFWeb + DARFs + apurações + ECD/ECF

### 3. Reconstruir o motivo
- Aplicar skill 44 (cruzamento SPED) para o período exato
- Identificar onde está a divergência

### 4. Decidir estratégia

**a) Retificar SPED + DCTFWeb + pagar diferença + responder à intimação**
- Quando o erro é nosso e não há defesa.

**b) Apresentar defesa documental**
- Quando o motivo da Receita é equivocado e temos prova.

**c) Negociar / parcelar**
- Quando débito é correto mas falta caixa.

### 5. Resposta à intimação
- Via e-CAC > "Apresentação de Documentos"
- Por petição com fundamentação legal e anexos
- Solicitar prorrogação se necessário (mais 30 dias geralmente concedido)

### 6. Acompanhar a decisão
- Resposta da Receita: arquivamento, novo TIF, auto de infração

### 7. Em caso de auto de infração
- Impugnação ao DRJ em 30 dias (Decreto 70.235/72)
- Sem garantia (administrativo)
- Recurso ao CARF se DRJ negar

## Templates

### Resposta a Termo de Intimação Fiscal

```
À Delegacia da Receita Federal do Brasil
[Endereço da DRF]

Contribuinte: __________ CNPJ: __________
TIF nº: __________ Período: __________

Em resposta à intimação acima, esclarecemos:

1. FATOS
[Descrever o que a Receita questiona]

2. ANÁLISE
A divergência de R$ ___ apontada pela fiscalização decorre de [causa identificada].

3. DOCUMENTOS ANEXOS
3.1. EFD-Contribuições retificadora — competências ___ a ___
3.2. DCTFWeb retificadora — recibo nº ___
3.3. DARF complementar — código ___ valor R$ ___ pago em ___
3.4. Memória de cálculo

4. PEDIDO
Diante do exposto, requer-se a baixa da pendência e o reconhecimento da regularidade fiscal do período investigado.

[Local], [data]
__________________
[Representante legal] / Procurador
[Nome do Contador] CRC ____
```

### Pedido de prorrogação de prazo

```
Solicita prorrogação de prazo para resposta de mais 30 dias, sob a justificativa de complexidade do levantamento documental, nos termos do art. 23 do Decreto 70.235/1972.
```

## Erros comuns

- Ignorar o prazo (20 dias TIF; 30 dias auto de infração) — perde direito de defesa.
- Retificar SPED sem alinhar DCTFWeb e ECF — gera nova divergência.
- Pagar DARF de mais do que o devido por insegurança — irrecuperável (apenas via PER/DCOMP, com tempo).
- Aceitar auto sem analisar — pode ser parcialmente improcedente.
- Não anexar procuração no e-CAC quando contador está respondendo.
- Defesa sem fundamentação jurídica em auto de infração — DRJ nega facilmente.

## Checklist

- [ ] Documento lido com prazo e fundamento mapeados
- [ ] SPEDs e declarações do período
- [ ] Causa raiz identificada
- [ ] Estratégia escolhida (retificar/defender)
- [ ] Retificações executadas (se for o caso)
- [ ] Pagamento da diferença (se houver)
- [ ] Resposta protocolada via e-CAC
- [ ] Acompanhamento da decisão
- [ ] Cliente ciente da estratégia e do risco
- [ ] Procuração e-CAC válida
- [ ] Honorários do trabalho contratados

## Referências

- Decreto 70.235/1972 (PAF — Processo Administrativo Fiscal)
- Lei 9.430/1996 (procedimentos)
- Lei 9.784/1999 (procedimento administrativo geral)
- IN RFB 2.022/2021 (procedimento de fiscalização)
- IN RFB 2.055/2021 (compensação)
