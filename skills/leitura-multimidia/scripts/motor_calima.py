"""Motor de geração dos PDFs de cadastro de empresa do Calima.

Substitui marcadores {{CHAVE}} no template HTML pelos valores reais de cada
empresa e renderiza o PDF com WeasyPrint.

Regras de substituição:
    {{CHAVE}}      substitui todas as ocorrências de {{CHAVE}}.
    {{CHAVE@N}}    substitui somente a N-ésima ocorrência de {{CHAVE}} (1-based).
                   Várias chaves {{CHAVE@1}}, {{CHAVE@2}}... permitem valores
                   distintos na mesma chave que se repete no template.
"""

import html as htmlmod
import re
from collections import OrderedDict
from pathlib import Path

RE_MARCADOR = re.compile(r"\{\{([A-Z0-9_]+)(?:@(\d+))?\}\}")


def _coletar(sub: dict) -> "OrderedDict[str, list[tuple[int | None, str]]]":
    """Agrupa as substituições por chave base, preservando a ordem de entrada."""
    grupos: "OrderedDict[str, list[tuple[int | None, str]]]" = OrderedDict()
    for chave, valor in sub.items():
        if chave.startswith("__"):
            continue
        base, sep, indice = chave.rpartition("@")
        if not sep or not indice.isdigit():
            base, indice = chave, None
        grupos.setdefault(base, []).append(
            (int(indice) if indice is not None else None, str(valor))
        )
    return grupos


def aplicar_substituicoes(template_html: str, sub: dict) -> tuple[str, list[str]]:
    """Substitui os marcadores e devolve (html, marcadores_que_nao_apareceram)."""
    html = template_html
    faltando: list[str] = []

    for base, alvos in _coletar(sub).items():
        re_marcador = re.compile(
            r"\{\{" + re.escape(base) + r"(?:@(\d+))?\}\}"
        )
        por_indice = {i: v for i, v in alvos if i is not None}
        sequencia = [v for i, v in alvos if i is None]
        estado = {"n": 0}

        def troca(match, por_indice=por_indice, sequencia=sequencia,
                  estado=estado, base=base, faltando=faltando):
            estado["n"] += 1
            n = estado["n"]
            if por_indice:
                if n in por_indice:
                    return htmlmod.escape(por_indice[n])
                faltando.append(f"{base}@{n}")
                return match.group(0)
            # Sem índice: consome a sequência, se houver; senão usa o primeiro valor.
            if sequencia:
                valor = sequencia[n - 1] if n <= len(sequencia) else sequencia[-1]
            else:
                valor = alvos[0][1]
            return htmlmod.escape(valor)

        html, trocas = re_marcador.subn(troca, html)
        if trocas == 0:
            faltando.append(base)

    return html, faltando


def gerar(template_html: str, sub: dict, saida_html, saida_pdf,
          titulo: str | None = None, badge: str | None = None) -> list[str]:
    """Aplica as substituições e grava o HTML e o PDF. Devolve as pendências."""
    if titulo:
        template_html = re.sub(
            r"<title>.*?</title>",
            f"<title>{htmlmod.escape(titulo)}</title>",
            template_html,
            flags=re.DOTALL,
        )
        template_html = template_html.replace(
            "Calima ERP · Cadastro de empresa", htmlmod.escape(titulo)
        )
    if badge:
        template_html = re.sub(
            r'<span class="badge">.*?</span>',
            f'<span class="badge">{htmlmod.escape(badge)}</span>',
            template_html,
            flags=re.DOTALL,
        )

    html, faltando = aplicar_substituicoes(template_html, sub)
    Path(saida_html).write_text(html, encoding="utf-8")

    from weasyprint import HTML

    HTML(filename=str(saida_html)).write_pdf(str(saida_pdf))
    return sorted(set(faltando))