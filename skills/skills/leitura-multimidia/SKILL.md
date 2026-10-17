---
name: leitura-multimidia
description: Extrai conteudo de video (frames), audio (transcricao) e imagem (OCR) para alimentar documentacao. Use quando precisar lervideo de reuniao/aula, transcrever audio, ou ler texto de PDF/imagem digitalizada. Cobre o caminho completo: descobrir trechos relevantes -> extrair -> transcrever/OCR -> consolidar em texto citavel com timestamps.
---

# Leitura multimídia

Extrai conteúdo de vídeo, áudio e imagem quando o arquivo é a única fonte da
informação. Use antes de afirmar que "não tem como ler" — quase sempre tem, com
as ferramentas certas.

## Ordem de decisão

| Fonte do dado    | Caminho                                        | Quando                            |
| ---------------- | ---------------------------------------------- | --------------------------------- |
| PDF com texto    | `pdftotext -layout`                            | Primeiro passo, sempre            |
| PDF digitalizado | `pdftoppm` + `tesseract`                       | Se `pdftotext` vier vazio ou lixo |
| Fonte quebrada   | `pdftoppm` + ler a imagem                      | Se texto e OCR falharem juntos    |
| Vídeo            | `ffprobe` → `ffmpeg` frames + `faster-whisper` | Aulas, reuniões gravadas          |
| Imagem           | `tesseract` direto                             | Print, documento escaneado        |

## Fonte quebrada: leia a imagem, não o texto

Alguns PDFs de certidão usam glyph Type 3 com encoding corrompido. Nesses,
`pdftotext` devolve sequências sem sentido e o `tesseract` também falha, porque
os caracteres já estão errados na própria imagem rasterizada.

**Sinal disso:** `pdftoppm` emite `Syntax Warning: Bad bounding box in Type 3 glyph`
repetidamente e o OCR devolve lixo sem número nem palavra reconhecível.

Neste caso, renderize e **leia a imagem diretamente**:

```bash
pdftoppm -r 150 -png -f 1 -l 1 "doc.pdf" prefixo   # 2>/devFB suprime os avisos
```

Depois use a ferramenta de leitura de imagem sobre o PNG. Funcionou em cartões de
CNPJ que nem o OCR conseguia extrair: saiu CNPJ, CNAE, natureza jurídica, endereço
e nome fantasia, completos.

Use sempre `2>/dev/null` no `pdftoppm` quando houver Type 3, senão a enxurrada de
erro de glifo enche o terminal e esconde o resultado real.

É mais lento de fazer, mas é o único caminho que funciona. Ir direto para ele
depois de ver o aviso de Type 3 economiza duas tentativas inúteis.

## 1. PDF

```bash
pdftotext -layout "doc.pdf" - | head -80     # texto nativo
pdftotext "doc.pdf" - | wc -c               #Measure antes; 0 = escaneado
```

PDF escaneado vira imagem..Renderize e aplique OCR:

```bash
pdftoppm -r 200 -png "doc.pdf" prefixo        # 200 dpi é o ponto ideal
tesseract prefixo-1.png - -l por --psm 4     # psm 4 = coluna; psm 6 = bloco
```

`--psm 4` funciona melhor para formulário em duas colunas (cartão CNPJ,
comprovante de IE). `--psm 6` para texto corrido.

**OCR de frame de vídeo funciona mal.** Um frame tem muito ruído visual: barra
do navegador, ícones, janela do Meet. Recorte a área útil antes:

```bash
ffmpeg -ss 300 -i video.mkv -frames:v 1 -vf "crop=1040:520:8:78" frame.jpg
tesseract frame.jpg - -l por --psm 4
```

Descubra o recorte certo empiricamente: extraia 2 frames distantes, rode OCR,
veja se sai texto útil, ajuste o `crop` e confirme.

## 2. Vídeo

### Mapear antes de transcrever

Transcrever 10 horas é desperdício. Descubra a duração e onde está o conteúdo:

```bash
ffprobe -v error -show_entries format=duration \
  -show_entries stream=codec_type,width,height -of default=noprint_wrappers=1 video.mkv
```

### Varredura grossa por OCR

Extraia 1 frame a cada 20 ou 30 segundos, recortando a área do sistema, e
aplique OCR em lote. Isso revela a estrutura do vídeo sem transcrever nada:

```bash
ffmpeg -v error -i video.mkv -vf "fps=1/30,crop=1040:520:8:78,scale=1248:-1" -q:v 5 scan/f_%04d.jpg
for p in scan/*.jpg; do
  echo "$p :: $(tesseract "$p" - -l por --psm 4 2>/dev/null | tr -s ' \n' ' ')"
done > ocr.txt
grep -iE "cadastro|manutenção|empresa" ocr.txt | head -40
```

Com o índice de frames em mãos, `frame N` ≈ `N × intervalo`. Descubra o
trecho relevante e só então transcreva.

### Transcrever só o trecho

```bash
ffmpeg -ss INICIO -to FIM -i video.mkv -vn -ac 1 -ar 16000 -c:a pcm_s16le trecho.wav
.venv/bin/python scripts/transcrever_trecho.py trecho.wav small saida.txt INICIO
```

O quarto argumento é o deslocamento em segundos, para os timestamps saírem na
hora original do vídeo em vez de começarem em zero.

Modelo `small` é o equilíbrio para português. `medium` é melhor mas bem mais
lento; `tiny` erra nome próprio e número.

## 3. Transcrição: o bug do PyAV 19

`faster-whisper` 1.2.1 chama `av.open(..., metadata_errors="ignore")`, mas o
PyAV 19 removeu esse parâmetro. Em Python 3.14 o resultado é:

```
TypeError: open() got an unexpected keyword argument 'metadata_errors'
```

Não reverta versão — faça monkey-patch antes do import:

```python
import av
_orig = av.open
def _open(*a, **kw):
    kw.pop("metadata_errors", None)
    return _orig(*a, **kw)
av.open = _open
from faster_whisper import WhisperModel  # depois do patch
```

## 4. Imagem

```bash
tesseract imagem.png - -l por --psm 6
```

Para documento em branco e preto, `--psm 6` (bloco) ou `--psm 4` (coluna).
`-l por+eng` quando há mistura de português com números e códigos.

## Instalação

Num projeto com Python moderno, isole em venv — não toque no sistema:

```bash
python3 -m venv .venv
.venv/bin/pip install faster-whisper pytesseract
# tesseract e ffmpeg são binários do sistema (pacman/pacman -S tesseract ffmpeg)
```

## O que fazer com o resultado

Sempre registrar de onde veio cada informação. Documento contábil que vira
campo de sistema precisa de rastreio: de qual arquivo, de qual página, de qual
certidão. Guarde o arquivo bruto ao lado — o PDF do cliente pode ser atualizado
no Drive e o valor mudado precisa ser rastreável.

Ao transcrever, o conteúdo verbal do instrutor frequentemente traz algo que não
está em documentação nenhuma. Trate a transcrição como fonte primária e cite o
horário, para quem conferir possa pular direto ao trecho.

## Antes de afirmar que não dá para ler

Verifique nesta ordem:

1. A ferramenta devolveu vazio — será que é escaneado?
2. Faltou o recorte / a escala?
3. Falta a linguagem do OCR (`-l por`)?
4. Só depois conclua que o conteúdo não existe no arquivo.

Um relatório de CNPJ lido por OCR entregou CNPJ, CNAE, natureza jurídica e
endereço que o extrator de texto tinha devolvido vazio. Quase sempre é ajuste de
pipeline, não ausência de dado.

## Referência

- `references/diagnostico.md` — erros comuns e como diagnosticar
- `scripts/transcrever_trecho.py` — wrapper do faster-whisper com o patch do PyAV
