"""Gera o PDF de cadastro de uma empresa a partir do template HTML, substituindo
os dados mock (em laranja) pelos dados reais da empresa.

Uso:
    gerar_pdf_empresa.py <template.html> <dados.json> <saida.html> <saida.pdf>

O dados.json tem duas chaves:
    "substituicoes": {"texto mock exato": "valor real", ...}
    "titulo":       "Calima ERP - Cadastro - Nome Da Empresa"  (opcional)

A secao 7 do template (Checklist) e a secao 8 (Glossario) sao comuns a todas as
empresas e permanecem intactas. Os valores reais sao injetados com escape HTML.
"""

import html as htmlmod
import json
import re
import sys
from pathlib import Path

template_path, dados_path, saida_html, saida_pdf = sys.argv[1:5]

html = Path(template_path).read_text(encoding="utf-8")
dados = json.loads(Path(dados_path).read_text(encoding="utf-8"))

faltando = []
for mock, real in dados.get("substituicoes", {}).items():
    # Chave com sufixo "@N" substitui somente a N-esima ocorrencia (1-based).
    # Necessario quando o mesmo mock aparece varias vezes com valores diferentes.
    if "@" in mock:
        base, _, indice = mock.rpartition("@")
        if indice.isdigit():
            n_alvo = int(indice)
            esc = re.escape(base)
            novo_valor = ">" + htmlmod.escape(str(real)) + "<"
            for k in range(1, n_alvo + 1):
                alvo = re.compile(r">\s*" + esc + r"\s*<")
                html, n = alvo.subn(novo_valor, html, count=1)
                if k == n_alvo and n == 0:
                    faltando.append(mock)
            continue

    alvo = re.compile(r">\s*" + re.escape(mock) + r"\s*<")
    novo = ">" + htmlmod.escape(str(real)) + "<"
    html, n = alvo.subn(novo.replace("\\", "\\\\"), html)
    if n == 0:
        faltando.append(mock)

titulo = dados.get("titulo")
if titulo:
    html = html.replace(
        "<title>Calima ERP — Cadastro de Empresa — TEMPLATE</title>",
        f"<title>{htmlmod.escape(titulo)}</title>",
    )
    html = html.replace("Calima ERP · Cadastro de empresa", htmlmod.escape(titulo))

Path(saida_html).write_text(html, encoding="utf-8")
print(f"HTML: {saida_html}")

from weasyprint import HTML  # noqa: E402

HTML(saida_html).write_pdf(saida_pdf)
print(f"PDF:  {saida_pdf}")