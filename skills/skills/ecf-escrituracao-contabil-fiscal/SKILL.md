---
name: ecf-escrituracao-contabil-fiscal"
description: Gera ECF (Escrituração Contábil Fiscal) anual com cálculo de IRPJ/CSLL no Real ou Presumido, LALUR/LACS Parte A e B, controle de prejuízo fiscal e amarração com a ECD.
allowed-tools: Read Grep Bash Edit Write
user-invocable: true
---

## Quando usar

Toda PJ tributada por Lucro Real, Presumido ou Arbitrado e imunes/isentas com receita > R$ 4,8 mi (DEFIS substituído pela ECF para Imune/Isenta desde 2017). Entrega anual até **31/07** referente ao ano-calendário anterior (IN RFB 2.004/2021). MEI e Simples não entregam ECF.

## Inputs necessários

1. ECD do ano-calendário transmitida e autenticada (entrada principal — recuperação de saldos)
2. Apuração de IRPJ/CSLL trimestral (Real) ou anual (Presumido/Real anual)
3. Saldos de prejuízo fiscal e base negativa CSLL (Parte B)
4. Adições e exclusões da Parte A do LALUR
5. JCP, equivalência patrimonial, ajustes IFRS (Lei 12.973/2014)
6. Pagamentos de IRPJ/CSLL feitos no ano (DARFs)
7. Quadros específicos: M-300 (Real), N-500 (Presumido), declarações complementares

## Estrutura de blocos da ECF

| Bloco | Conteúdo |
|---|---|
| 0 | Abertura, identificação |
| C | Recuperação de dados da ECD (plano de contas, balancetes) |
| E | Lançamentos da ECD recuperados |
| J | Plano de contas referencial e mapeamento |
| K | Saldos de contas/centros |
| L | Lucro Líquido (DRE para fins fiscais — automaticamente quando vinculado à ECD) |
| M | LALUR e LACS — adições, exclusões, compensações |
| N | Cálculo do IRPJ/CSLL (Lucro Real, Presumido, Arbitrado) |
| P | Demonstrações Real (DLPA, DLPL, DOAR) |
| Q | Demonstrações Presumido |
| T | Lucros e dividendos pagos |
| U | SCP |
| W | País a País (transfer pricing) |
| X | Operações com exterior |
| Y | Informações gerais (créditos fiscais, pesquisa, etc.) |
| 9 | Encerramento |

## Passo a passo

### 1. Recuperação da ECD
- Importar a ECD validada para a ECF (botão "Recuperar ECD" no PVA da ECF).
- Conferir saldos do plano de contas, lançamentos, balanço, DRE.

### 2. Mapeamento de contas para o referencial fiscal
- Cada conta da empresa precisa estar mapeada para conta do plano referencial fiscal (J050).
- ECF carrega o referencial automaticamente da ECD.

### 3. LALUR Parte A — adições e exclusões (Real)
Detalhar cada lançamento:
- Adições: multas indedutíveis, provisões, despesas com sócios, doações sem incentivo, JCP indedutível (excedente).
- Exclusões: dividendos recebidos, equivalência patrimonial positiva, reversões.

### 4. Compensação de prejuízo fiscal (Real)
- Conferir saldo na Parte B (movimentação do ano).
- Limite 30% do lucro líquido após adições/exclusões.

### 5. Cálculo IRPJ/CSLL
- Real anual: Bloco N apura sobre o lucro real anual + estimativas mensais lançadas.
- Real trimestral: 4 trimestres separadamente.
- Presumido: trimestral, % de presunção por atividade.

### 6. Pagamentos e antecipações
- Lançar DARFs pagos no Bloco N (compensação com saldo a pagar/restituir).
- IRRF retido por terceiros: lançado e abatido.

### 7. Demonstrações P/Q
- DLPA, DLPL, DOAR (Real) ou demonstrações simplificadas (Presumido).

### 8. Validação no PVA
- Validar ECF — PVA cruza com ECD recuperada.
- Erros comuns: contas sem mapeamento referencial, divergência de DRE, prejuízo fiscal acima do limite.

### 9. Assinatura e transmissão
- e-CPF do contador + e-CNPJ ou e-CPF do representante legal.
- Recibo guardado por 5 anos no mínimo.

### 10. Retificação
- Permitida a qualquer tempo, mas se houve fiscalização ou DCTFWeb retificada, atenção a multas.

## Templates

### Mapeamento de adições no Bloco M-300

```
|M300|001|Multas punitivas indedutíveis|||
|M310|001|2026-03-15|Multa Fazenda Estadual|N|3.500,00|
|M300|002|Provisões não autorizadas|||
|M310|002|2026-12-31|Provisão para perdas|N|18.000,00|
```

## Erros comuns

- Não recuperar ECD antes de iniciar a ECF.
- Conta contábil sem referencial — erro de bloqueio.
- Compensar prejuízo fiscal acima de 30%.
- LALUR Parte B com saldo negativo (impossível).
- Divergência entre receita declarada na ECF e EFD-Contribuições (alerta da malha PJ).
- JCP excedente do limite legal — adicionar na Parte A.
- ECF transmitida sem ECD (impossível para Real e Presumido com distribuição acima do presumido).

## Checklist

- [ ] ECD do ano-calendário transmitida e autenticada
- [ ] Recuperação da ECD funcionando sem erros
- [ ] Plano de contas 100% mapeado ao referencial
- [ ] Adições e exclusões com fundamento legal documentado
- [ ] Prejuízo fiscal: limite 30% respeitado
- [ ] Saldo Parte B atualizado
- [ ] DARFs do ano lançados
- [ ] PVA com 0 erros
- [ ] Recibo arquivado
- [ ] Cruzamento ECF x DCTFWeb x EFD-Contribuições x ECD: sem divergência

## Referências

- IN RFB 2.004/2021
- Manual de Orientação da ECF (versão vigente)
- Lei 12.973/2014 (convergência IFRS, lucros no exterior)
- Lei 14.789/2023 (subvenções)
- IN RFB 1.700/2017 (consolidação IRPJ/CSLL)
