---
name: esocial-afastamentos
description: Registra afastamentos no eSocial (S-2230) — doença, acidente, licença-maternidade, serviço militar, etc. — com início, término e comunicação ao INSS quando devida.
allowed-tools: Read Grep Bash Edit Write
user-invocable: true
---

## Quando usar

Sempre que o trabalhador se afastar por mais de **3 dias consecutivos** (regra geral) ou em casos específicos, mesmo no primeiro dia:
- Acidente de trabalho (CAT obrigatória — S-2210)
- Licença-maternidade
- Licença-paternidade
- Auxílio-doença comum (a partir do 16º dia INSS, primeiros 15 dias empresa)
- Serviço militar
- Suspensão disciplinar > 3 dias
- Mandato sindical

## Inputs necessários

1. Identificação do trabalhador (CPF + matrícula eSocial)
2. Motivo do afastamento (Tabela 18 eSocial)
3. Data início e prevista de término
4. Atestado médico (CRM, CID, dias) ou documento comprobatório
5. CAT (acidente de trabalho) com data e tipologia
6. Após retorno: data efetiva de término

## Códigos S-2230 — principais motivos (Tabela 18)

| Código | Motivo |
|---|---|
| 01 | Acidente / doença do trabalho — comunicar via S-2210 |
| 03 | Acidente / doença não relacionada ao trabalho |
| 05 | Afastamento auxílio-doença |
| 06 | Aposentadoria por invalidez |
| 11 | Licença-maternidade |
| 12 | Licença-maternidade prorrogação Empresa Cidadã (60 dias) |
| 14 | Licença-paternidade (5 dias + Empresa Cidadã 15) |
| 15 | Licença-adoção |
| 17 | Licença não-remunerada |
| 18 | Suspensão contrato — perfeccionamento (Lei 9.601/98) |
| 19 | Inatividade — empresa parada |
| 20 | Serviço militar |
| 21 | Licença remunerada (sem prejuízo do salário) |
| 22 | Cessão de empregado |
| 23 | Serviço sindical |
| 26 | Mandato eletivo |
| 27 | Suspensão disciplinar (até 30 dias) |

## Passo a passo

### 1. Recebimento do atestado / CAT
- Atestado médico: CID-10 não obrigatório no atestado por jurisprudência, mas a empresa pode pedir (LGPD: dados sensíveis — manuseio restrito ao SESMT).
- CAT: emitir em **24 horas** após acidente para comunicação ao INSS, mesmo que o trabalhador não se afaste.

### 2. Registrar S-2230 (afastamento temporário)
- Data início, motivo, data prevista término.
- Prazo de transmissão:
  - **Até 1 dia** após o início do afastamento se ≥ 3 dias e código 01, 03, 05, 17, 18
  - Até **dia 15 do mês subsequente** para os demais

### 3. Pagamento dos primeiros 15 dias (auxílio-doença comum)
- Empresa paga os primeiros 15 dias com salário integral (CLT art. 60).
- A partir do 16º dia, empregado vai ao INSS — empresa para de pagar.

### 4. Acidente de trabalho
- Empresa paga primeiros 15 dias.
- INSS paga o auxílio-doença acidentário (B91) a partir do 16º dia.
- Estabilidade de 12 meses após retorno (Lei 8.213/91 art. 118).

### 5. Licença-maternidade
- 120 dias (CLT art. 392) ou 180 dias (Empresa Cidadã, Lei 11.770/2008).
- Folha mantém INSS sobre o salário.
- Empresa paga e compensa com a contribuição patronal (compensação no eSocial).

### 6. Retorno
- Enviar evento S-2230 com data efetiva de término.
- ASO de retorno (após 30 dias de afastamento — NR 7).

## Templates

### S-2230 cabeçalho

```
<evtAfastTemp>
  <ideEvento>
    <indRetif>1</indRetif>
    <perApur>2026-04</perApur>
    <procEmi>1</procEmi>
    <verProc>1.5</verProc>
  </ideEvento>
  <ideVinculo CPF/matric>
  <infoAfastamento>
    <iniAfastamento>
      <dtIniAfast>2026-04-15</dtIniAfast>
      <codMotAfast>03</codMotAfast>
      <infoMesmoMtv>N</infoMesmoMtv>
    </iniAfastamento>
  </infoAfastamento>
</evtAfastTemp>
```

### Controle interno

```
TRABALHADOR ____________________ CPF ____________
Início: __/__/____  Motivo: ___ (Tab 18)
Atestado / Documento: ____________________
Previsão término: __/__/____
S-2230 enviado em: __/__/____  Recibo: __________
1-15 dias pagos pela empresa? [ ] Sim
INSS comunicado? [ ] Sim (B31, B91, B32...)
Retorno efetivo: __/__/____
S-2230 (término) enviado: __/__/____
ASO retorno (>30d): [ ] Sim
```

## Erros comuns

- Não emitir CAT em 24h → multa de 1 a 6 SM por trabalhador (Lei 8.213/91 art. 22).
- Considerar atestado de 3 dias separados do mesmo CID como afastamentos isolados — agrupa para fins do 16º dia.
- Pagar 15 dias mas esquecer de notificar INSS pelo eSocial.
- Esquecer estabilidade pós-acidente (12 meses).
- Suspensão disciplinar > 30 dias = rescisão indireta (CLT art. 483).
- Empresa que adere à Empresa Cidadã sem registrar no eSocial perde o benefício fiscal.

## Checklist

- [ ] Atestado / CAT documentado
- [ ] Código motivo correto (Tabela 18)
- [ ] S-2230 transmitido no prazo
- [ ] Primeiros 15 dias pagos (auxílio-doença)
- [ ] CAT em 24h se acidente
- [ ] Folha do mês ajustada
- [ ] Retorno: S-2230 com término + ASO retorno se > 30d
- [ ] Estabilidade pós-acidente registrada na pasta

## Referências

- Lei 8.213/1991 arts. 19-23 (acidente do trabalho), 60 (auxílio-doença), 118 (estabilidade)
- CLT art. 60, 392, 473
- Lei 11.770/2008 (Empresa Cidadã)
- NR-7 (ASOs e PCMSO)
- Manual eSocial S-1.5
- Tabela 18 (motivos afastamento)
