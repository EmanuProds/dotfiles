---
name: revisao-fiscal-cruzamento-sped"
description: Cruza ECD, ECF, EFD ICMS/IPI, EFD-Contribuições, eSocial, EFD-Reinf e DCTFWeb identificando divergências antes da malha fina e construindo plano de ajuste.
allowed-tools: Read Grep Bash Edit Write
user-invocable: true
---

## Quando usar

- Antes de transmitir a ECF (após ECD).
- Auditoria interna trimestral em clientes com volume relevante.
- Em diligência prévia / due diligence (skill 47).
- Quando há intimação ou suspeita de divergência (malha PJ — skill 46).

## Inputs necessários

1. ECD do ano (X-1)
2. ECF do ano (X-1)
3. EFD ICMS/IPI 12 meses
4. EFD-Contribuições 12 meses
5. eSocial (S-1299) e EFD-Reinf (R-2099, R-4099)
6. DCTFWeb mensal
7. Apurações internas

## Cruzamentos críticos

### 1. Receita: ECD × ECF × EFD-Contribuições × DCTFWeb

| Origem | O que olhar |
|---|---|
| ECD | Receita líquida + bruta no DRE |
| ECF Bloco N | Receita base de IRPJ/CSLL |
| EFD-Contribuições Bloco M | Receita base PIS/COFINS |
| DCTFWeb | Receita declarada (quando aplicável) |

**Esperado**: bater com tolerância < 0,1%. Diferença > 1% acende alerta.

Causas comuns:
- ICMS Tema 69 excluído na contribuição mas não na contábil
- Receita de exportação com tratamento diferente
- Receita financeira composta diferente

### 2. CMV / Custo dos serviços / Custo dos produtos: ECD × ECF Bloco N × Bloco K

- ECD: 4.1 CMV
- ECF: linha CMV
- Bloco K (EFD ICMS): consumo de insumos × produção × estoque

### 3. Folha: eSocial × DCTFWeb × Despesa de pessoal na ECD

- eSocial S-5011 (totalizador INSS) = DCTFWeb débito INSS
- Folha total no eSocial = despesa de pessoal na ECD ± provisões mensais
- INSS retido na fonte (R-2010) = INSS retido confessado em DCTFWeb

### 4. Retenções: NFs × EFD-Reinf × DCTFWeb × DIRF/R-4000

- IRRF retido nas NFs/folha = R-4010/R-4020 = DCTFWeb cód 1708/0561 = DIRF (≤ 2023) / R-4000 (≥ 2024)
- CSRF: idem cód 5952

### 5. ICMS: EFD ICMS/IPI × balancete × pagamentos

- E110 (apuração) saldo a pagar = ICMS a recolher na ECD = guias pagas

### 6. PIS/COFINS: EFD-Contribuições × ECD × DCTFWeb

- M200/M600 = PIS/COFINS a recolher ECD = DCTFWeb débitos
- M100/M500 = créditos: bater com NFs de entrada CST 50

### 7. IRPJ/CSLL: ECF Bloco N × DCTFWeb × DARFs pagos

### 8. Imobilizado: ECD × Bloco G EFD ICMS/IPI (CIAP)

- Aquisições no exercício × G125
- Depreciação × Anexo III IN RFB 1.700

## Processo de revisão

### 1. Montagem do espelho de cruzamento

```
                  Mensal             Anual
Receita Bruta    ECD × Contrib       ECF × ECD
ICMS débito      EFD ICMS × ECD      ECF anual
PIS/COFINS       Contrib × ECD       ECF × Contrib
INSS folha       eSocial × DCTFWeb   ECD × Contrib
IRPJ pago        DCTFWeb × ECF       Apuração × DARFs
```

### 2. Identificar divergências
- Ranking por valor + criticidade
- Hipótese de causa (erro contábil, fiscal, de leiaute)

### 3. Investigar e documentar
- Para cada divergência: causa raiz + valor + período + risco

### 4. Plano de ação
- Retificar SPED?
- Pagar diferença com Selic?
- Documentar fundamento (se for diferença legítima)?
- Provisionar contingência?

### 5. Memória do trabalho
- Documento PDF assinado, anexos, cálculos.
- Útil em auditoria, fiscalização, M&A.

## Templates

### Espelho de divergências

```
EMPRESA __________ CNPJ __________ Período: __

LEGENDA: ✅ ok / ⚠️ revisar / ❌ urgente

DIMENSÃO              ECD       ECF       EFD-C      DCTFWeb    OUTRA       STATUS
Receita bruta         _____     _____     _____      _____      _____       ⚠️
Receita exp.          _____     _____     _____      n/a        _____       ✅
CMV                   _____     _____     _____      n/a        _____       ✅
Folha total           _____     _____     n/a        _____      eSocial     ❌
INSS retido fonte     n/a       _____     n/a        _____      Reinf       ✅
PIS                   _____     _____     _____      _____      n/a         ⚠️
COFINS                _____     _____     _____      _____      n/a         ⚠️
ICMS débito           _____     n/a       n/a        n/a        EFD-ICMS    ✅
IRPJ                  _____     _____     n/a        _____      DARF        ✅

DIVERGÊNCIAS PRIORITÁRIAS:
1. Folha eSocial × ECD: R$ _____ — causa: provisão de férias não lançada → ajuste no balancete
2. Receita ECD × Contribuições: R$ _____ — causa: receita financeira não tributada na contribuição
3. PIS DCTFWeb × Contribuições: R$ _____ — causa: PIS retificado sem retificar DCTFWeb

PLANO DE AÇÃO:
[ ] Retificar Contribuições (mês X)
[ ] Retificar DCTFWeb correspondente
[ ] Lançar provisão férias na ECD do mês Y
[ ] Pagar diferença IRPJ Z com Selic
[ ] Documentar exclusão ICMS Tema 69
```

## Erros comuns

- Concluir que está tudo ok porque DCTFWeb foi entregue — DCTFWeb pode ter sido transmitida com débito errado.
- Considerar diferença "imaterial" sem definir critério — definir tolerância por receita (ex.: 0,1%).
- Retificar SPED de meses antigos sem retificar DCTFWeb — gera nova divergência.
- Cruzamento manual em planilha sem validador — risco de fórmula errada.
- Não documentar a causa da divergência — em fiscalização posterior fica difícil defender.

## Checklist

- [ ] Todos os SPEDs e declarações coletados
- [ ] Espelho de cruzamento montado
- [ ] Divergências classificadas por valor + criticidade
- [ ] Cada divergência com causa raiz mapeada
- [ ] Plano de ação por divergência
- [ ] Retificações executadas
- [ ] Pagamento de diferença com Selic (quando aplicável)
- [ ] Memória do trabalho arquivada
- [ ] Cliente ciente e documento assinado

## Referências

- IN RFB 2.003/2021 (ECD)
- IN RFB 2.004/2021 (ECF)
- IN RFB 2.043/2021 (EFD-Reinf)
- IN RFB 2.005/2021 (DCTFWeb)
- IN RFB 1.252/2012 (EFD-Contribuições)
- Convênio ICMS 143/2006 (EFD ICMS/IPI)
