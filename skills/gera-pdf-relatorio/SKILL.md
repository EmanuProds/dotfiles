---
name: gera-pdf-relatorio
description: Gera relatorios PDF a partir de template HTML com dados por empresa, em lote, usando WeasyPrint e substituicao de marcadores. Use para manuais, passo a passo por cliente, relatorios periodicos ou qualquer documento que se repete com dados diferentes. Cobre a regra de ouro do marcador={{CHAVE}}, a coluna repetida com @N, e a validacao de que nada ficou para trás.
---

# Gera PDF de relatório

Documento que se repete N vezes com dados diferentes: um manual por cliente, um
relatório por filial, uma ata por reunião. O template é escrito uma vez, os
dados entram por dicionário, o PDF sai validado.

## Arquitetura

```
template.html        uma vez, com marcadores {{CHAVE}}
dados/<slug>.py      EMPRESES = [(slug, "nome.pdf", {chave: valor}), ...]
scripts/gerar_lote.py  aplica as substituições e renderiza todos
```

Um único template para todos os clientes é o que garante consistência. Se cada
cliente ganhar seu HTML próprio, divergem na segunda geração.

## Marcadores, não mock de texto

Escreva o template com `{{CHAVE}}` dentro da tag, não com texto de exemplo:

```html
<td class="mock">{{RAZAO_SOCIAL}}</td>
```

Não use isto:

```html
<td class="mock">[RAZÃO SOCIAL]</td>
```

O texto de exemplo casa com o conteúdo de um cliente específico e não com os
outros, então a substituição em lote falha silenciosamente em parte dos
documentos. Placeholder explícito não tem ambiguidade.

## A mesma chave com valores diferentes

Coluna repetida dez vezes com fonte diferente por linha:

```
{{FONTE@1}} {{FONTE@2}} {{FONTE@3}} ... {{FONTE@10}}
```

O índice é a posição da ocorrência no template, 1-based. Sem o índice, a
substituição aplica o mesmo valor em todas as linhas.

## Instalação

```bash
python3 -m venv .venv
.venv/bin/pip install weasyprint
```

WeasyPrint puxa pydyf, tinycss2, cssselect2, Pyphen, Pillow. Em distro recente
pode faltar biblioteca de sistema:

```bash
pacman -S pango cairo gdk-pixbuf2 libffi
```

## Uso

```python
from pathlib import Path
from motor_calima import gerar          # scripts/motor_calima.py

template = Path("template.html").read_text(encoding="utf-8")
dados = {"RAZAO_SOCIAL": "EMPRESA LTDA", "FONTE@1": "Cartão CNPJ", ...}

pendentes = gerar(template, dados,
                  Path("saida.html"), Path("saida.pdf"),
                  titulo="Relatório", badge="INTERNO")
```

Para lote:

```bash
.venv/bin/python scripts/gerar_lote.py template.html dados.py saida/
```

## Validação é obrigatória

O retorno da função não é confiável. Depois de gerar, confira o HTML:

```bash
grep -oE '\{\{[A-Z0-9_@]+\}\}' saida.html | sort -u
```

Vazio = tudo substituído. Marker remanescente = valor faltando no dicionário,
e o PDF foi impresso com `{{CHAVE}}` visível na página.

Verifique também a contagem de páginas e **olhe o PDF renderizado**, pelo menos
a capa:

```bash
pdfinfo saida.pdf | grep Pages
pdftoppm -r 46 -png -f 1 -l 1 saida.pdf /tmp/check
```

## Valores default em lote

Campos que não variam entre clientes ficam num dicionário comum:

```python
COMUNS = {"ORGAO_REGISTRO": "JUCERJ", "SITUACAO": "Ativa"}
for _, _, dados in EMPRESES:
    dados.update(COMUNS)
```

Assim cada entrada da lista carrega só o que é próprio dela.

## Dado ausente: três saídas possíveis

Decida conscientemente, não por omissão:

1. **Dado real** — está no documento do cliente. Use.
2. **Fictício** — é obrigatório para o registro e não há documento. Marque
   visualmente no documento que o valor é fictício.
3. **Ignorar** — é contexto da empresa e não afeta o registro que se quer fazer.
   Não invente número que vai para o fisco.

Para o caso 2, use marcação explícita no próprio PDF, não um valor que parece
real. Um `(não localizado no acervo)` honesto é melhor que um número plausível
que ninguém vai conseguir confirmar.

## Sanidade do valor gerado

Se o PDF vai alimentar um sistema que valida, o valor precisa passar na validação
mesmo sendo fictício. Exemplo: CNPJ de exemplo com dígito verificador correto é
digitável no sistema para ensaio; CNPJ com DV errado trava o cadastro e faz o
usuário desconfiar do manual inteiro.

```python
def dv_cnpj(base8):
    p1 = [5,4,3,2,9,8,7,6,5,4,3,2]
    p2 = [6,5,4,3,2,9,8,7,6,5,4,3,2]
    n = [int(c) for c in base8 + "0001"]
    s = sum(n[i]*p1[i] for i in range(12)); r = s % 11
    d1 = 0 if r < 2 else 11 - r
    s = sum(n[i]*p2[i] for i in range(12)) + d1*2; r = s % 11
    d2 = 0 if r < 2 else 11 - r
    return d1, d2
```

Erro silencioso aqui: somar só os 8 dígitos da base em vez dos 12, e o DV sai
errado sem erro aparente. Sempre valide o resultado recalculando.

## CSS para A4

```css
@page {
  size: A4;
  margin: 18mm 16mm;
  @bottom-center {
    content: "... p. " counter(page) "/" counter(pages);
    font-size: 7.5pt;
    color: #7a8290;
  }
}
h2 {
  page-break-after: avoid;
}
figure {
  page-break-inside: avoid;
}
table {
  border-collapse: collapse;
  width: 100%;
}
tbody tr:nth-child(even) {
  background: #f6f8fa;
}
```

`page-break-after: avoid` no heading evita que ele fique sozinho no fim de uma
página. `page-break-inside: avoid` em figura impede que a imagem se parta.

Cor de fundo em caixa de destaque é mais forte que borda:

```css
.erro {
  background: #fdeeee;
  border-left: 1.6mm solid #c0392b;
  padding: 2mm 3mm;
}
.aviso {
  background: #fff8e6;
  border-left: 1.6mm solid #d99b1c;
  padding: 2mm 3mm;
}
.fonte {
  background: #f0f4f9;
  border-left: 1.6mm solid #4a6fa5;
  padding: 2mm 3mm;
}
.ok {
  background: #eef8f1;
  border-left: 1.6mm solid #1e7a46;
  padding: 2mm 3mm;
}
```

Use classes por severidade, não cores soltas: `.erro` significa "se ignorar,
quebra o sistema" e `.aviso` significa "revisar antes de usar".

## Rastreio do dado

Se o valor veio de um documento do cliente, registre a fonte no próprio PDF. Uma
tabela "campo / valor / fonte" na seção de conferência permite a quem confere
saber de onde sair cada número, e permite re-verificar quando o documento for
atualizado.

Isso não é burocracia: sem a fonte, um valor errado é indefensável.

## Arquivos

- `scripts/motor_calima.py` — motor de substituição e render
- `scripts/gerar_lote.py` — gerador em lote com validação
- `scripts/gerar_pdf_empresa.py` — versão JSON, para uso pontual
