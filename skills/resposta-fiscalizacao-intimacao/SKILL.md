---
name: resposta-fiscalizacao-intimacao"
description: Responde a fiscalização federal, estadual e municipal — TIF, MPF, intimações, autos de infração — com prazo, fundamentação legal, anexos organizados e estratégia de defesa.
allowed-tools: Read Grep Bash Edit Write
user-invocable: true
---

## Quando usar

Cliente recebeu:
- **MPF (Mandado de Procedimento Fiscal)** — RFB
- **TIF (Termo de Intimação Fiscal)** — RFB ou estadual
- **Termo de Início de Fiscalização** — qualquer órgão
- **Intimação** — pede esclarecimento ou documento
- **Auto de Infração** — lançamento, com prazo de impugnação
- **Notificação** — comunicação de divergência

## Inputs necessários

1. Documento original do fisco (com nº, data, fundamento legal, prazo)
2. Procuração eletrônica para o contador (e-CAC, SEFAZ, prefeitura)
3. SPEDs e declarações do período investigado
4. Documentos suporte (NFs, contratos, ASOs, atas, balancetes)
5. Histórico de fiscalizações anteriores

## Princípios de boa defesa

1. **Prazo é absoluto**: 20 dias TIF, 30 dias auto de infração (Decreto 70.235/72), 30 dias defesa do contribuinte na esfera estadual. Pedir prorrogação **antes** de vencer (geralmente +30 dias concedidos).

2. **Cooperação não significa rendição**: responder sempre com tempestividade, mas só conceder o que está dentro do escopo. Cuidado com requerimentos vagos ("apresente toda a documentação").

3. **Documentar**: cada protocolo no e-CAC ou via correios com AR. Cópias arquivadas.

4. **Fundamentar**: nada de "respeitosamente recorremos". Citar artigo, súmula, jurisprudência aplicável.

5. **Sigilo profissional**: contador é responsável solidário em alguns casos (Lei 9.430 art. 18 §3º) — atenção a documentos que podem expor o contador.

## Procedimento Federal (Decreto 70.235/72)

### Fluxo
1. **Início**: MPF ou Termo de Início (RFB notifica abertura)
2. **Diligências**: TIFs intimando documentos
3. **Conclusão**: Termo de Verificação Fiscal
4. **Auto de Infração** (se houver irregularidade)
5. **Impugnação**: 30 dias para o contribuinte
6. **DRJ**: julga em 1ª instância
7. **CARF**: recurso voluntário
8. **CSRF**: recurso especial / divergência

### Resposta a TIF — estrutura

```
[Cabeçalho RFB / DRF / endereço]

[Empresa] CNPJ ____ — TIF nº ____ — Fiscalização nº ____ — Período ____

Em atenção à intimação, esclarecemos:

I. DOS FATOS
[Descrever o que a Receita pediu]

II. DOS DOCUMENTOS APRESENTADOS
[Lista numerada]
   1. [doc 1] — explicação
   2. [doc 2] — explicação
   ...

III. DOS ESCLARECIMENTOS
[Resposta às perguntas técnicas]

IV. DA FUNDAMENTAÇÃO
[Citar normas que justificam a operação. Ex.: "A operação foi corretamente classificada como X, com fundamento no art. Y da Lei Z e na Solução de Consulta COSIT W/AAAA"]

V. DO PEDIDO
Diante do exposto, requer:
a) Receber os documentos anexos;
b) Considerar prestados os esclarecimentos;
c) Encerramento da diligência sem lavratura de auto de infração.

[Local, data]
[Assinatura do representante / advogado / contador]
[Documento eletrônico: certificado digital]
```

### Auto de infração — impugnação

```
EXMO. DELEGADO DE JULGAMENTO DA RECEITA FEDERAL DO BRASIL

[Empresa] CNPJ ____, vem, por seu(s) procurador(es), nos termos do art. 16 do Decreto 70.235/1972, oferecer

IMPUGNAÇÃO

ao Auto de Infração nº ____ (PAF nº ____), pelas razões abaixo:

I. DOS FATOS
[Resumo do que o auto alega]

II. DA TEMPESTIVIDADE
[Provar que está dentro do prazo de 30 dias da ciência]

III. DAS RAZÕES DE DIREITO
III.1. Da nulidade [se houver]
III.2. Da decadência [se aplicável — 5 anos do art. 173 CTN]
III.3. Do mérito
   [Argumentar tese a tese]
III.4. Da multa [pedido de redução com base em jurisprudência]

IV. DO PEDIDO
a) Acolhimento da impugnação;
b) Improcedência do auto;
c) Subsidiariamente, redução da multa qualificada.

V. DAS PROVAS
Documentos anexos numerados de 1 a __, e perícia, se necessário.

[Local, data]
[Advogado OAB, contador CRC]
```

## Procedimento Estadual (ICMS)

- Cada estado tem sua lei processual (em SP: Lei 13.457/2009 + Decreto 54.486; em outros estados, similares).
- Prazo padrão: 30 dias para defesa do auto de infração.
- 1ª instância: TIT/TJ/órgão fazendário.
- Atenção a depósito recursal em alguns estados.

## Procedimento Municipal (ISS)

- Cada município tem lei processual própria
- Em SP: Lei 14.107/2005 + Decreto 50.385
- Prazo padrão: 30 dias

## Procedimento eSocial / RFB previdenciário

- Auto de infração lavrado pelo Auditor-Fiscal do Trabalho ou RFB
- Impugnação: Decreto 70.235

## Estratégias

### 1. Decadência (CTN art. 173)
- 5 anos a partir do 1º dia do exercício seguinte ao fato gerador (lançamento de ofício)
- 5 anos a partir do fato gerador (lançamento por homologação — § 4º art. 150 CTN)
- Auto fora do prazo: extingue o crédito tributário

### 2. Coisa julgada / questão idêntica já decidida
- Aproveitar precedentes (STF/STJ/TIT) favoráveis

### 3. Boa-fé e ausência de dolo (multa qualificada 150%)
- Comprovar boa-fé reduz multa para 75% (regular) ou 20% (homologação tácita)

### 4. Denúncia espontânea (CTN art. 138)
- Pagamento antes da fiscalização → sem multa (apenas Selic)
- Não vale após início da fiscalização

### 5. Prescrição (CTN art. 174)
- 5 anos para cobrar após constituição definitiva
- Pode-se alegar em qualquer fase

## Templates

### Pedido de prorrogação

```
Solicita-se a prorrogação do prazo concedido por TIF nº ____ por mais 30 dias, em razão da complexidade do levantamento documental do período de ____ anos, com fulcro no art. 23 do Decreto 70.235/72 e no princípio do contraditório (CF art. 5º LV).
```

### Pedido de vista do processo

```
Requer-se vista dos autos do processo administrativo nº ____ para análise integral antes da apresentação de defesa, pelo prazo de ___ dias úteis (CTN art. 5º LXXVIII e Lei 9.784/99 art. 3º II).
```

## Erros comuns

- Perder prazo — aceitação tácita do lançamento.
- Defender sem fundamento legal — DRJ nega facilmente.
- Aceitar multa qualificada (150%) sem contestar dolo.
- Confessar irregularidade ao tentar "negociar" diretamente com o fiscal.
- Não anexar procuração no e-CAC.
- Documentar mal o protocolo (sem AR, sem recibo).
- Não preservar arquivo digital (e-mails, WhatsApp com cliente sobre o caso).

## Checklist

- [ ] Documento do fisco lido com prazo, valor, fundamento mapeados
- [ ] Procurações ativas (e-CAC, SEFAZ, prefeitura)
- [ ] Cliente ciente da fiscalização e da estratégia
- [ ] Diagnóstico técnico completo (skill 44 cruzamento SPED)
- [ ] Decisão: prorrogar / responder / impugnar
- [ ] Defesa redigida com fundamentação legal
- [ ] Documentos suporte numerados
- [ ] Protocolo confirmado (e-CAC ou correio com AR)
- [ ] Acompanhamento periódico do andamento
- [ ] Honorários do trabalho contratados (com cláusula de êxito se for o caso)

## Referências

- Decreto 70.235/1972 (PAF Federal)
- Lei 9.430/1996
- Lei 9.784/1999 (procedimento administrativo geral)
- CTN (Código Tributário Nacional) arts. 138, 142-150, 173-174
- IN RFB 2.022/2021 (procedimento de fiscalização)
- Lei 13.988/2020 (transação)
- Súmulas CARF e STF/STJ pertinentes
