---
name: fgts-guia-recolhimento"
description: Gera FGTS mensal (8% sobre folha) e rescisório (multa 40/20%) via Conectividade Social ou FGTS Digital, monitora calendário de saques, parcelamento e regularidade.
allowed-tools: Read Grep Bash Edit Write
user-invocable: true
---

> ⚠️ **AVISO FISCAL — CONFIRA ANTES DE GERAR A GUIA.** Todo código de receita (DARF/DAS), alíquota, base de cálculo, valor e data de vencimento gerado por este agente é **rascunho de apoio** e pode variar por ano, regime tributário, município ou caso específico. **Confira sempre na fonte oficial vigente (Receita Federal / e-CAC / legislação estadual e municipal) antes de transmitir declaração ou pagar guia.** A conferência final é responsabilidade do contador responsável.

## Quando usar

Mensalmente para depósito do FGTS (até dia 7 do mês subsequente — antecipa em dia útil). E em cada rescisão para GRRF.

A partir do **FGTS Digital** (rollout 2024) — substituiu Conectividade Social ICP / SEFIP em parte. Verificar o cliente já está obrigado.

## Inputs necessários

1. Folha do mês — base FGTS por trabalhador
2. Categorias: empregado CLT (8%), aprendiz (2%), doméstico (8% + 3,2% multa antecipada)
3. Dados bancários da empresa
4. Certificado digital
5. Para rescisão: motivo, saldo da conta vinculada, depósitos rescisórios

## Cálculo

### FGTS mensal

```
FGTS = Bruto × 8%
```

**Bases que entram**:
- Salário
- HE, adicionais (periculosidade, insalubridade, noturno)
- Comissões, prêmios habituais
- 13º salário
- Férias e 1/3
- Aviso prévio indenizado (a Lei 8.036/90 art. 15 §1º)

**Não entram**:
- Vale-transporte
- VR/VA pelo PAT
- Indenizações não habituais
- PLR (Lei 10.101/2000)
- Diárias até 50% do salário

### Aprendiz
- 2% sobre folha (CLT art. 432 e Decreto 5.598/2005).

### Doméstico (Lei Complementar 150/2015)
- FGTS 8% + 3,2% antecipação da multa rescisória + 0,8% seguro acidente + INSS empresa + IRRF
- Recolhido no DAE (Documento de Arrecadação eSocial Doméstico)

### Multa rescisória (rescisão sem justa causa)
- 40% sobre saldo + depósitos rescisórios
- Acordo (484-A): 20%
- Justa causa, pedido demissão: 0%

## Geração da guia

### FGTS mensal
- Conectividade Social ICP (até a obrigatoriedade do FGTS Digital) ou
- FGTS Digital (gov.br/fgtsdigital): geração automática a partir do eSocial fechado (S-1299) — a partir de 03/2024.

Pagamento via:
- Boleto FGTS
- Débito automático
- PIX (a partir de 2024 em algumas modalidades)

### Rescisão
- GRRF via Conectividade Social ou via FGTS Digital
- Saldo + depósitos do mês + multa
- Pagamento até a data de pagamento das verbas (10 dias do desligamento)

## Atrasos e parcelamento

### Multa por atraso
- Multa de 0,5% sobre o valor + juros 0,5% a.m. (1ª parcela) + atualização (TR + 3% ao ano)
- Após 30 dias: protesto e CADIN

### Parcelamento (PARI)
- Programa de Parcelamento Especial — até 60 meses
- Lei 8.036/90 art. 15 §6º + Resolução CCFGTS

### Certidão de Regularidade FGTS (CRF)
- Necessária para licitações, financiamento BNDES, PROUNI etc.
- Emitida no portal CAIXA — vigência 30 dias

## Templates

### Conferência mensal

```
COMP __/____ — Folha total: R$ _________ Base FGTS: R$ _________
FGTS 8% calculado: R$ _________
FGTS gerado eSocial/FGTS Digital: R$ _________
Divergência: R$ _________ (motivo: _____________)
[ ] Guia paga em __/__/____
[ ] CRF emitida em __/__/____ (valid até __/__/____)
```

## Erros comuns

- Não recolher FGTS sobre aviso indenizado e 13º.
- Aprendiz com 8% (correto: 2%).
- Atraso com pagamento sem regularizar multa/juros — gera autuação JT/MTP.
- GRRF rescisória esquecida → empregado processa pela multa 40% mais juros.
- Doméstico com FGTS 8% sem a antecipação 3,2% → falta multa quando rescisão sem justa causa.
- Empresa em RJ esquecendo CRF → impossibilita certidões.

## Checklist

### Mensal
- [ ] Base FGTS conferida
- [ ] Empregados com bases corretas (incluindo 13º na 1ª parcela: NÃO entra; 2ª parcela com 13º total)
- [ ] Aprendizes com 2%
- [ ] Domésticos com 8% + 3,2% via DAE
- [ ] Pagamento até dia 7
- [ ] CRF emitida e arquivada

### Rescisória
- [ ] Saldo da conta vinculada extratado
- [ ] Multa correta para o motivo
- [ ] GRRF gerada e paga até a data de pagamento das verbas
- [ ] eSocial S-2299 transmitido

## Referências

- Lei 8.036/1990 (FGTS)
- LC 150/2015 (doméstico)
- Decreto 99.684/1990 (regulamento FGTS)
- Lei 10.097/2000 + Decreto 9.579/2018 (aprendiz)
- IN MTP/SEPRT 2/2018 (FGTS)
- Resoluções CCFGTS (parcelamento, atualização TR)
- Manual FGTS Digital (gov.br/fgtsdigital)
