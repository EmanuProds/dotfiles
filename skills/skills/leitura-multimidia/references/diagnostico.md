# Diagnóstico de leitura de mídia

Sintoma → causa provável → o que fazer.

## `pdftotext` devolve vazio ou lixo (`□ □ □ /1 /2 /3`)

PDF escaneado, ou fonte com cmap quebrada. Renderize e use OCR:

```bash
pdftotext "x.pdf" - | wc -c     # confirma que o texto nativo não existe
pdftoppm -r 200 -png "x.pdf" p
tesseract p-1.png - -l por --psm 4
```

Sintoma de cmap quebrada sai como sequência de barras e números soltos — é o
mesmo caso, o OCR resolve igual.

## OCR de PDF funciona, OCR de frame de vídeo não

O frame tem ruído que o PDF não tem: barra de navegador, abas do Meet, ícones
da barra de tarefas, mouse. Recorte a área da aplicação antes:

```bash
ffmpeg -ss 300 -i v.mkv -frames:v 1 -vf "crop=1040:520:8:78" f.jpg
tesseract f.jpg - -l por --psm 4
```

Itere o `crop` até o texto sair limpo. Verifique conferindo se aparecem os
mesmos termos de navegação que você vê na tela.

## `TypeError: open() got an unexpected keyword argument 'metadata_errors'`

Incompatibilidade PyAV 19 × faster-whisper 1.2.1. Monkey-patch antes do import
do faster_whisper. Ver SKILL.md, seção 3.

## Transcrição com nomes próprios errados

Modelo `tiny` ou `small` com `beam_size` baixo. Suba para `medium`, ou
transcreva de novo o trecho afetado. Numero de telefone e CPF quase sempre saem
errados em `small` — nunca copie número de um transcript sem conferir no
documento original.

## Tesseract devolve texto sem sentido

Modo de segmentação errado:

| psm | Quando usar                              |
| --- | ---------------------------------------- |
| 3   | Padrão, página inteira                   |
| 4   | Coluna única, formulário de duas colunas |
| 6   | Bloco uniforme de texto                  |
| 11  | Texto esparso, números isolados          |

Documento com números em coluna ao lado do rótulo (cartão CNPJ, comprovante de
IE) responde melhor a `--psm 4` e a um recorte na coluna dos valores.

## Idioma do OCR

Tesseract não detecta idioma. `-l por` explícito sempre. `por+eng` quando há
muito código, CNPJ ou texto em inglês. Sem `-l`, ele assume inglês e acerta
apenas maiúsculas.

## WeasyPrint não encontra a imagem

Caminho relativo quebrado. O HTML é renderizado com `filename=`, então o `src`
é resolvido a partir do **diretório do HTML**, não do diretório de execução.
`../../assets/img.jpg` funciona se o HTML está em `docs/x/` e a imagem em
`assets/`.

## WeasyPrint mostra aviso de `sys.prefix`

Inofensivo quando se invoca o Python pelo caminho relativo
(`../../.venv/bin/python`). Use o caminho absoluto do venv para silenciar.

## Aviso de RuntimeWarning em `<frozen site>`

Idem acima. Não é erro.

## Substituição de template não substitui nada

Duas causas frequentes:

1. **Divergência de tipo** — o valor está como texto puro no HTML mas o matcher
   procura `<td class="mock">`. Com marcador `{{CHAVE}}` isso não acontece, e é
   o motivo de preferir placeholders explícitos.
2. **Regex com `@`** — `\d+` casa, mas `rpartition("@")` numa chave sem `@`
   devolve `(chave, "", "")` e o índice vira `""`, que não é dígito. Trate
   explicitamente.

Sempre valide depois de gerar:

```bash
grep -oE '\{\{[A-Z0-9_@]+\}\}' saida.html | sort -u
```

Saída vazia = substituiu tudo. É o único teste confiável; o retorno da função
pode mentir sobre chaves opcionais.

## Prefixos de chave colidem

Se o template tem `{{X}}` e `{{XY}}`, um matcher mal feito substitui `{{X}}`
dentro de `{{XY}}` e corrompe. Use `re.escape` + fronteira explícita, ou
placeholders com prefixo inequívoco como `«X»`.

## Mesma chave repetida com valores diferentes

Numere a ocorrência: `{{FONTE@1}}`, `{{FONTE@2}}`. Substitua por índice na
ordem em que aparecem no template. Vários dados preenchem a mesma coluna de
forma repetida, então é comum precisar disso.
