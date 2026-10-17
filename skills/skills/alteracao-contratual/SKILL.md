---
name: alteracao-contratual
description: Conduz alterações contratuais (entrada/saída de sócios, mudança de objeto/CNAE, capital social, endereço, transformação societária) com efeitos contábeis, fiscais e na Junta Comercial.
allowed-tools: Read Grep Bash Edit Write
user-invocable: true
---

## Quando usar

Sempre que houver mudança em:
- Quadro societário (cessão de cotas, entrada/saída de sócio)
- Atividade (CNAE) ou objeto social
- Capital social (aumento, redução, integralização)
- Endereço da sede ou abertura/fechamento de filial
- Nome empresarial / razão social
- Tipo societário (transformação)
- Administração (administradores, prazo de mandato)

## Inputs necessários

1. Contrato social vigente (última versão consolidada)
2. NIRE da empresa (Junta Comercial)
3. Documentação dos novos sócios (CPF, RG, e-CPF, comprovante endereço)
4. Motivo da alteração e nova redação proposta
5. Avaliação de bens (se integralização com bens)
6. Cláusula de não concorrência (saída de sócio)
7. Apuração de haveres (saída de sócio)
8. Aprovação dos sócios (assinatura digital)

## Tipos de alteração

### 1. Cessão de cotas (entrada/saída de sócio)

**Cessão onerosa**:
- Sócio vende cotas → pode ter ganho de capital (skill 50, alíquota 15-22,5%)
- DARF cód 4600 até último dia útil do mês subsequente

**Cessão gratuita (doação)**:
- ITCMD estadual (alíquota varia 4-8% por estado)
- Não há IR para o doador
- Receptor: aumenta patrimônio (pode gerar variação patrimonial a justificar no IRPF)

**Apuração de haveres**:
- Sócio retirante recebe sua participação avaliada
- Valor patrimonial de balanço (regra padrão CC art. 1.031) ou econômico (se o contrato prever)
- Pago em até 90 dias da apuração, salvo cláusula

### 2. Aumento de capital

**Por integralização em dinheiro**:
- Sócios depositam → D Banco / C Capital social

**Por integralização em bens**:
- Avaliação por 3 peritos ou empresa de avaliação (S.A.) ou aprovação por todos (LTDA)
- Bens transferidos por escritura/registro

**Por capitalização de lucros/reservas**:
- D Reserva de lucros / C Capital social
- Sem IR para sócios PF (Lei 9.249/95 art. 10)

**Por novos sócios**:
- Diluição dos atuais
- Novo sócio paga ágio (se houver) — D Banco / C Capital social (até o nominal) e C Reserva de capital — ágio (acima)

### 3. Redução de capital

- Por excesso (não absorção de prejuízos): permitida com publicação em diário oficial e prazo de 90 dias para credores oporem
- Por restituição a sócio: implica ganho de capital se valor restituído > custo de aquisição (Lei 9.249 art. 22)
- Por absorção de prejuízos: redução automática

### 4. Mudança de objeto / CNAE

- Verificar zoneamento do novo CNAE no município
- Inscrição estadual: pode ser necessária ou cancelada
- Regime tributário pode mudar (saiu do Simples? Anexo diferente?)
- Licenças sanitárias / ambientais novas

### 5. Mudança de endereço

- Mesmo município: alteração simples
- Outro município: nova inscrição municipal, alvará novo, possivelmente nova inscrição estadual
- Outro estado: nova inscrição estadual obrigatória
- Empresa sai de SP para GO: mudança vai além do contrato — verificar inscrição estadual GO + IE de cada filial

### 6. Transformação societária (LTDA → S.A. ou vice-versa)

- Não há dissolução
- Aprovação unânime
- Ata + estatuto/contrato → registro
- Tributação: continua o mesmo CNPJ; saldo contábil migra integralmente
- Se mudar de sociedade simples para empresarial → cartório para Junta Comercial

## Fluxo (REDESIM)

### 1. Elaborar a alteração contratual
- Cláusula da alteração
- Consolidação do contrato (recomendado: gerar nova versão consolidada)

### 2. Assinaturas digitais
- Todos os sócios + administradores

### 3. Protocolar na Junta Comercial
- DBE/REDESIM com a alteração
- Taxa da Junta

### 4. Receita Federal — atualização do CNPJ
- Automática via REDESIM

### 5. Estado e Município
- Atualizar inscrição estadual (se mudou endereço/atividade)
- Atualizar inscrição municipal e alvará

### 6. Atualizar bancos, fornecedores, contratos
- Comunicação aos bancos
- Cartórios (registro de imóveis, marcas, protestos)
- Receita: e-CAC com novos sócios para procuração

## Templates

### Cessão de cotas (cláusula tipo)

```
CLÁUSULA __ — CESSÃO DE COTAS
O sócio [Nome A], CPF __________, transfere ao sócio [Nome B], CPF __________, a totalidade de suas [N] cotas no valor total de R$ ____________ (___________ reais), a serem integralmente pagas em ___________.

Por força desta cessão, o quadro societário fica assim composto:
   Sócio B: ____ cotas (50%)
   Sócio C: ____ cotas (50%)

O sócio cedente declara não ter qualquer direito ou obrigação remanescente perante a sociedade, salvo as expressamente assumidas neste instrumento.
```

### Aumento de capital — cláusula tipo

```
CLÁUSULA __ — AUMENTO DE CAPITAL
O capital social, atualmente de R$ __________, fica aumentado para R$ __________, mediante a subscrição e integralização de [N] novas cotas no valor de R$ ____ cada uma, integralizadas em [moeda corrente / bens — descrever] pelos sócios, na proporção de suas participações atuais.
```

## Efeitos contábeis (esqueleto)

```
Aumento de capital em dinheiro:
D Banco c/c                R$ X
   C Capital social           R$ X

Cessão de cotas (apenas mudança no quadro — não afeta o PL):
(sem lançamento contábil — apenas alteração da Demonstração de Mutações do PL e cadastro de sócios)

Apuração de haveres pagos:
D Capital social              R$ X (proporção do retirante)
D Reserva de lucros           R$ Y (proporção)
   C Banco / Sócios a pagar    R$ X+Y
```

## Erros comuns

- Cessão de cotas sem ITCMD quando gratuita.
- Sócio retirante sem documento de quitação → futura ação judicial de haveres.
- Aumento por bens sem avaliação documentada — Junta pode recusar.
- Mudar CNAE para atividade do Simples Nacional sem comunicar opção.
- Esquecer atualização de cadastros bancários — empresa fica com cadastro travado para movimentação.
- Mudança de endereço para outro estado sem nova IE → autuação.
- Sócio menor de idade sem representante / autorização judicial.
- Sócio estrangeiro sem CPF brasileiro / procurador.

## Checklist

- [ ] Documentos dos sócios novos / saintes
- [ ] Cálculo de apuração de haveres / ganho de capital
- [ ] Minuta da alteração assinada digitalmente
- [ ] DBE / REDESIM
- [ ] Protocolo Junta Comercial
- [ ] CNPJ atualizado
- [ ] Inscrição estadual atualizada (se aplicável)
- [ ] Alvará e Inscrição Municipal (se aplicável)
- [ ] Bancos, fornecedores, e-CAC atualizados
- [ ] Cláusula de não concorrência (saída de sócio)
- [ ] Recibo de quitação ao sócio retirante
- [ ] DARF ganho de capital pago

## Referências

- Lei 14.195/2021 (REDESIM)
- Código Civil arts. 1.057, 1.072, 1.082-1.084, 1.113-1.115 (cessão, deliberação, transformação)
- Lei 6.404/1976 (S.A.) art. 220-234 (transformação)
- Lei 9.249/1995 (capitalização e redução de capital)
- LC 123/2006 (Simples)
- Decreto 9.580/2018 (RIR — ganho de capital)
