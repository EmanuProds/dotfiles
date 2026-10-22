---
name: encerramento-empresa-baixa"
description: Conduz baixa de empresa via REDESIM (baixa fácil para regulares; "baixa com débito" desde Lei 11.598/2007), com encerramento contábil, distribuição de acervo e cancelamento de inscrições.
allowed-tools: Read Grep Bash Edit Write
user-invocable: true
---

## Quando usar

Cliente quer encerrar a empresa: cessação de atividade, sócios não querem continuar, inviabilidade econômica. Lembrar que **manter empresa parada custa**: obrigações acessórias, contador, taxas anuais.

## Inputs necessários

1. Contrato social vigente
2. Distrato social (a redigir)
3. Apurações pendentes (tributos a recolher)
4. Balanço final (data de encerramento)
5. Acervo a distribuir (sobras de bens, dinheiro)
6. Pendências fiscais e CADIN
7. Empregados e rescisões (se ainda houver)

## Tipos de encerramento

### 1. Baixa regular
- Empresa sem dívidas
- Todas as obrigações acessórias entregues
- Tributos pagos ou parcelados
- Empregados desligados ou inexistentes

### 2. Baixa com débito (Lei 11.598/2007 art. 7º-A)
- Empresa pode dar baixa mesmo com débitos
- Os débitos passam a ser **dos sócios** (responsabilidade pessoal pelo que dependia da empresa para apurar/pagar)
- Não exige certidão negativa para a baixa em si
- Empresa fica baixada; dívida segue

### 3. Dissolução judicial
- Quando há litígio entre sócios
- Sentença declara dissolução

### 4. Falência (skill advogado 36 cobre o lado processual)
- Decretada por insolvência
- LEC 11.101/2005

## Fluxo de baixa regular (REDESIM)

### 1. Distrato social
- Cláusula de dissolução com motivo
- Designação do liquidante (geralmente um dos sócios)
- Aprovação unânime
- Assinatura digital de todos

### 2. Encerramento contábil
- Levantar balanço final na data de encerramento
- Realizar ativo (vender estoque, receber clientes)
- Pagar passivo (fornecedores, tributos, folha)
- O que sobrar: distribuir aos sócios proporcionalmente (acervo líquido)

### 3. Apurações finais
- ECD final (período até a baixa)
- ECF final (anual fracionada — Bloco específico ECF "Encerramento")
- DEFIS (Simples) ou demais declarações fracionadas
- DCTFWeb e EFDs até a competência da baixa
- DIRF/R-4000 do período

### 4. Rescisão de contratos
- Empregados (skill 24 e 29)
- Aluguel
- Fornecedores
- Empréstimos (negociar quitação ou transferir aos sócios)

### 5. Cancelamento de inscrições
- Estadual (SEFAZ)
- Municipal
- Alvarás
- Conselho profissional (se aplicável)

### 6. Baixa Federal via REDESIM
- DBE de baixa
- Distrato + balanço final
- Receita comunica estados/municípios automaticamente

### 7. Junta Comercial
- Registro do distrato

### 8. Emitir certidão de baixa
- Cartão CNPJ atualizado mostrando "baixado por encerramento das atividades"

### 9. Arquivar documentos por 5 anos (decadência tributária) e 10 anos (alguns casos)
- Livros contábeis e fiscais
- Documentos suporte
- Folha e eSocial
- Notas fiscais

## Distribuição do acervo (efeitos no IRPF do sócio)

Quando empresa baixa e sobra acervo a distribuir:

```
Acervo líquido = Ativo realizado − Passivo pago
Distribuição por sócio = Acervo × % participação

GANHO DE CAPITAL (sócio PF) = Distribuído − Custo de aquisição (capital integralizado)
```

Se Distribuído > Capital integralizado: ganho de capital, IR 15-22,5%, DARF 4600.
Se Distribuído < Capital: prejuízo (não dedutível, mas não tributa).

## Templates

### Distrato social (cláusula essencial)

```
DISTRATO SOCIAL DA __________________

Pelo presente instrumento, os sócios [Nome A], CPF __________, e [Nome B], CPF __________, na qualidade de sócios da [empresa] CNPJ __________, NIRE __________, resolvem dissolver a sociedade com base nas seguintes condições:

1. Data de encerramento: __/__/____.

2. Liquidante: [nome do sócio] CPF __________, com poderes para realizar o ativo, pagar o passivo e distribuir o acervo nos termos do art. 1.103 do CC.

3. Balanço final levantado em __/__/____, anexo, apresenta:
   Ativo: R$ __________
   Passivo: R$ __________
   Acervo líquido: R$ __________

4. O acervo será distribuído na proporção das cotas: Sócio A R$ __________, Sócio B R$ __________.

5. Os sócios declaram não haver pendências entre si nem perante a sociedade, salvo as expressas neste instrumento.

6. Documentos contábeis e fiscais ficarão arquivados em [endereço], pelo prazo de 5 anos.

[Local], [data]
__________
Sócio A
__________
Sócio B
```

### Checklist de baixa

```
EMPRESA __________ CNPJ __________ Encerramento previsto: __/__/____

PRÉ-BAIXA
[ ] Distrato elaborado e assinado
[ ] Balanço final
[ ] Realizar ativo (estoque, clientes a receber)
[ ] Pagar passivo (fornecedores, folha, tributos)
[ ] Empregados rescindidos
[ ] Aluguel encerrado / contratos rescindidos

OBRIGAÇÕES FISCAIS FINAIS
[ ] DCTFWeb da última competência
[ ] EFDs da última competência
[ ] DEFIS (Simples) ou ECF/ECD fracionadas (Real/Presumido)
[ ] DIRF/R-4000 fracionada
[ ] eSocial S-1299 final + S-2299 dos empregados
[ ] FGTS quitado / parcelado
[ ] CND federal, estadual, municipal (se for baixa regular)

CANCELAMENTOS
[ ] Inscrição estadual cancelada
[ ] Inscrição municipal e alvará cancelados
[ ] Conselho profissional (se aplicável)
[ ] e-CNPJ revogado
[ ] eSocial S-1000 desativado

REDESIM
[ ] DBE de baixa
[ ] Junta Comercial: registro do distrato
[ ] Cartão CNPJ baixado
[ ] Comprovante arquivado

PÓS-BAIXA
[ ] Comunicação aos bancos (encerrar conta PJ)
[ ] Comunicação aos clientes/fornecedores
[ ] Distribuição de acervo + DARF GCAP (se houver ganho)
[ ] Documentos arquivados por 5 anos
```

## Erros comuns

- Empresa parada que continua gerando obrigações acessórias e multa por omissão (DCTFWeb sem débito ainda obriga transmissão).
- Tentar baixa sem rescindir empregados — eSocial trava.
- Esquecer entrega de declarações fracionadas (ECF/ECD parciais).
- Estoque distribuído aos sócios sem NF — autuação por saída sem documento fiscal.
- Imobilizado ainda em nome da empresa, mas distribuído — atualizar registro/RENAVAM em nome do sócio.
- Não pagar parcelamento ativo → débito vai para PGFN e impacta sócios.
- Sócio sem renda compatível para receber acervo: variação patrimonial a justificar no IRPF.

## Checklist final

- [ ] Distrato registrado
- [ ] CNPJ baixado (Cartão CNPJ "baixado por encerramento")
- [ ] Inscrições canceladas
- [ ] Documentos arquivados
- [ ] Cliente com cópia da baixa
- [ ] DARFs do encerramento pagos

## Referências

- Lei 11.598/2007 art. 7º (baixa REDESIM)
- Lei 14.195/2021 (REDESIM consolidado)
- Código Civil arts. 1.033-1.038 (dissolução), 1.102-1.112 (liquidação)
- Lei 8.934/1994 (Junta Comercial)
- Lei 9.249/1995 (capital e ganho de capital na restituição)
- Decreto 9.580/2018 (RIR)
