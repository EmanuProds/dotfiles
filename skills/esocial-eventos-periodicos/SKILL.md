---
name: esocial-eventos-periodicos"
description: Coordena envio mensal dos eventos periódicos do eSocial — S-1200 remuneração, S-1210 pagamentos, S-1280/S-1295/S-1299 fechamento — com totalização e geração de DCTFWeb.
allowed-tools: Read Grep Bash Edit Write
user-invocable: true
---

## Quando usar

Todo fechamento de folha mensal (e do 13º). Requisito: cadastros prévios (S-1000 a S-1070) e tabela de rubricas atualizada.

## Inputs necessários

1. Folha de pagamento da competência fechada
2. Pagamentos efetuados a empregados, contribuintes individuais, autônomos
3. Tabela S-1010 (rubricas) com bases atualizadas e CST PIS/COFINS quando aplicável
4. Eventuais movimentações: admissões, rescisões, afastamentos do mês
5. Comissão de Conciliação Prévia, processos trabalhistas vinculados

## Eventos periódicos

| Evento | Conteúdo | Prazo |
|---|---|---|
| S-1200 | Remuneração de trabalhador (CLT) com vínculo | Até dia 15 do mês subsequente |
| S-1202 | Remuneração de servidores RPPS | idem |
| S-1207 | Benefícios previdenciários (RPPS) | idem |
| S-1210 | Pagamentos de rendimentos (CLT, contrib. individual, RPA, IRRF retido) | Até dia 15 do mês subsequente |
| S-1260 | Comercialização da produção rural por PF | idem |
| S-1270 | Contratação avulsos não portuários | idem |
| S-1280 | Informações complementares aos eventos periódicos (CPRB, prop. desoneração) | Antes do S-1299 |
| S-1295 | Solicitação de totalização para pagamento parcial | Antes do S-1299 (opcional) |
| S-1298 | Reabertura de eventos periódicos | A qualquer tempo |
| S-1299 | Fechamento dos eventos periódicos | Até dia 15 |
| S-5001 | Bases de cálculo INSS por trabalhador (totalizador) | Retorno após S-1200 |
| S-5002 | Bases IRRF por trabalhador | Retorno após S-1210 |
| S-5011 | Bases de cálculo INSS empresa (totalizador) | Retorno após S-1299 |
| S-5013 | Base FGTS | Retorno |

## Passo a passo

### 1. Fechar folha interna
- Calcular salários, HE, adicionais, descontos, INSS, IRRF
- Conferir batidas: bruto − descontos = líquido

### 2. Enviar S-1200 por trabalhador
- Detalhamento: rubricas (item da S-1010), valores, bases, lotação tributária
- Trabalhador com mais de uma fonte (cessão, concomitância): usar mesmo CPF/matrícula com vínculo correto

### 3. Enviar S-1210 (pagamentos)
- A partir de 2024 com IRRF dos pagamentos a empregados (substitui DIRF)
- Para autônomos (contribuintes individuais): valores, INSS retido, IRRF

### 4. S-1260, S-1270 quando aplicável

### 5. S-1280 (informações complementares)
- Empresa optante CPRB precisa enviar para apurar a redução da contribuição patronal por proporção da receita CPRB / receita total

### 6. Fechar com S-1299
- Após S-1299, eSocial gera S-5001/S-5002/S-5011/S-5013 (totalizadores)
- Esses totalizadores alimentam a DCTFWeb

### 7. Verificar totalizadores
- S-5011 = cota patronal + RAT × FAP + Terceiros — bater com cálculo interno
- Se totalizador divergente → reabrir com S-1298, corrigir e fechar de novo

### 8. Geração DCTFWeb
- Após S-1299 + R-2099 + R-4099, DCTFWeb está pronta no e-CAC

## Erros comuns

- Enviar S-1210 sem o S-1200 correspondente.
- Rubrica nova não cadastrada na S-1010 → S-1200 rejeitado.
- Lotação tributária errada (filial X recolhendo INSS por filial Y).
- CPRB sem S-1280 → totalizador incorreto (cobrança a maior).
- S-1295 (pagamento parcial) usado quando fluxo simples — não é necessário, apenas para pagamento antecipado.
- Reabrir S-1298 após DCTFWeb já transmitida → precisa retificar DCTFWeb.

## Checklist mensal

- [ ] Tabela S-1010 atualizada (novas rubricas)
- [ ] S-1200 por todos os empregados ativos no mês
- [ ] S-1210 com pagamentos efetuados
- [ ] S-1260/S-1270 quando aplicável
- [ ] S-1280 (CPRB) se for o caso
- [ ] S-1299 fechamento
- [ ] Totalizadores S-5001/S-5011 conferidos
- [ ] DCTFWeb gerada e fechada (skill 19)
- [ ] DARFs e GPS pagos no vencimento

## Referências

- Lei 13.467/2017 (eSocial obrigatório)
- IN MTP 5/2022 e ato declaratório eSocial
- Manual de Orientação eSocial S-1.5 (gov.br/esocial)
- Tabelas 03, 18, 21, 24 (rubricas, motivos afastamento, comércio, lotação)
