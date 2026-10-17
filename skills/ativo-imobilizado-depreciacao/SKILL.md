---
name: ativo-imobilizado-depreciacao
description: Controla ativo imobilizado (CPC 27), aplica taxas fiscais e contábeis de depreciação, faz teste de impairment, segrega valor residual e amortiza intangíveis (CPC 4).
allowed-tools: Read Grep Bash Edit Write
user-invocable: true
---

## Quando usar

Empresas com imobilizado relevante. Mensalmente para depreciação; anualmente para revisão de vida útil, valor residual e teste de impairment (CPC 1).

## Inputs necessários

1. Cadastro de bens (data de aquisição, fornecedor, valor, NCM, descrição)
2. Vida útil contábil (CPC 27 — econômica) e fiscal (RIR/2018, IN RFB 1.700)
3. Valor residual (CPC 27)
4. Local físico e centro de custo
5. Bens recebidos em arrendamento (IFRS 16) — direito de uso
6. Imobilizações em andamento (obras)

## Reconhecimento (CPC 27)

```
Custo do imobilizado = Preço de aquisição
                      + Frete, instalação, montagem
                      + Tributos não-recuperáveis (ICMS recupera no Real; IPI recupera para indústria)
                      + Custos de teste antes de uso
                      + Encargos financeiros até a data em que o bem está pronto (Lei 11.638)
                      − Descontos comerciais
```

Itens de pequeno valor (RIR/2018 art. 313, II + IN RFB 1.700): bens com custo < R$ 1.200 ou vida útil < 1 ano podem ir direto para despesa.

## Depreciação

### Taxas fiscais (Anexo III IN RFB 1.700)

| Bem | Vida útil | Taxa anual |
|---|---|---|
| Edificações | 25 anos | 4% |
| Máquinas e equipamentos | 10 anos | 10% |
| Veículos | 5 anos | 20% |
| Móveis e utensílios | 10 anos | 10% |
| Computadores e periféricos | 5 anos | 20% |
| Software (intangível) | 5 anos | 20% |
| Instalações industriais | 10 anos | 10% |
| Ferramentas | 5 anos | 20% |

### Depreciação contábil (CPC 27)
Pode divergir da fiscal — usa **vida útil econômica real**. Diferença é ajustada na Parte A do LALUR (skill 03).

### Métodos
- **Linear** (regra geral): valor / vida útil.
- **Soma dos dígitos**: acelerada nos primeiros anos.
- **Unidades produzidas**: quando dependente de uso (ex.: máquina por hora-máquina).

### Depreciação acelerada
- **Turno**: 1,5x para 2 turnos diários, 2x para 3 turnos (RIR art. 322).
- **Incentivada**: programas específicos (Lei do Bem 11.196/2005 — P&D; Sudam/Sudene; etc.).

### Lançamento mensal
```
D 5.5 Despesa depreciação        R$ X
   C 1.2.3.99 Depreciação acumulada R$ X
```

## Valor residual (CPC 27)

Valor estimado que se obteria ao alienar o bem ao fim da vida útil. Reduz a base de depreciação:

```
Depreciação anual = (Custo − Valor residual) / Vida útil
```

Em 2026, comum revisar valor residual de veículos e máquinas (anos com inflação alta podem alterar significativamente).

## Teste de impairment (CPC 1 / IFRS 36)

Anualmente verificar se o valor contábil > valor recuperável (maior entre valor de uso e valor justo líquido).

Se valor contábil > recuperável:
```
D 5.5 Perda por impairment       R$ X
   C 1.2.3.99 Provisão impairment R$ X
```

## CIAP (crédito ICMS)

Aquisição de imobilizado para a atividade gera crédito de ICMS em 48 parcelas mensais (Lei Kandir):

```
Crédito ICMS mensal = (Valor ICMS × Receita tributada do mês) / Receita total / 48
```

Skill 16 (EFD ICMS/IPI) detalha o controle CIAP.

## Intangíveis (CPC 4)

Software adquirido, marcas, patentes:
- **Vida útil definida**: amortização linear (geralmente 5-10 anos).
- **Vida útil indefinida** (ex.: marca consagrada): NÃO amortiza, mas testa impairment anual.

Goodwill (apenas em combinações de negócio, CPC 15): teste anual obrigatório.

## Arrendamento (CPC 6 R2 / IFRS 16) — locatário

Reconhece **direito de uso** no ativo + **passivo de arrendamento**:

```
Inicial (presente valor das parcelas):
D 1.2.5 Direito de uso          R$ 200.000
   C 2.2.4 Passivo arrendamento R$ 200.000

Mensal:
D 5.5 Amortização direito uso   R$ 3.333
   C 1.2.5 (-) Amortização       R$ 3.333

D 2.2.4 Passivo (principal)     R$ 4.500
D 5.4 Despesa financeira (juros) R$ 1.500
   C 1.1.1.02 Banco              R$ 6.000
```

Exceções (não aplicar IFRS 16): contratos de curto prazo (até 12 meses) e bens de baixo valor (~US$ 5.000).

## Templates

### Cadastro do bem

```
N° patrimônio: _____ Descrição: __________
Data aquisição: __/__/____ Fornecedor: __________
NF: ____ Valor: R$ _________
Local: __________ Centro de custo: __________
Vida útil contábil: ___ anos
Vida útil fiscal: ___ anos
Valor residual: R$ _________
Taxa anual depreciação: ___%
Depreciação mensal: R$ _________
Depreciação acumulada (atual): R$ _________
Valor contábil líquido: R$ _________
CIAP (crédito ICMS): em ___/48 parcelas
```

## Erros comuns

- Capitalizar item < R$ 1.200 quando RIR permite despesa.
- Não revisar vida útil/valor residual anualmente.
- Depreciar a partir da data de compra (correto: a partir da entrada em uso).
- Bem em obra em andamento sendo depreciado (não inicia depreciação até estar pronto).
- Esquecer impairment em anos de queda de mercado.
- Usar vida útil fiscal como contábil sem análise — distorce DRE.
- Arrendamento operacional ainda como aluguel (a partir de IFRS 16 / CPC 6 R2 vai para o ativo).
- Software customizado interno (fase de pesquisa) capitalizado — tratamento diferente para pesquisa (despesa) e desenvolvimento (capitalização sob condições).

## Checklist

### Cadastro inicial
- [ ] Custo total com frete/instalação
- [ ] Tributos recuperáveis identificados
- [ ] Vida útil contábil ≠ fiscal documentada

### Mensal
- [ ] Depreciação calculada e lançada
- [ ] Bens novos cadastrados
- [ ] Bens baixados/vendidos com cálculo de ganho/perda
- [ ] CIAP atualizado

### Anual
- [ ] Revisão de vida útil e valor residual
- [ ] Teste de impairment
- [ ] Inventário físico × inventário contábil

## Referências

- CPC 27 (Imobilizado)
- CPC 4 (Intangível)
- CPC 1 / IFRS 36 (Impairment)
- CPC 6 R2 / IFRS 16 (Arrendamento)
- IN RFB 1.700/2017 (taxas fiscais — Anexo III)
- RIR/2018 (Decreto 9.580) arts. 312-323
- Lei 11.638/2007
