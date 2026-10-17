"""Gera vários PDFs de cadastro do Calima a partir do template e um módulo de dados."""
import re
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
from motor_calima import gerar

template_path, modulo_path, saida = sys.argv[1], sys.argv[2], Path(sys.argv[3])

ns = {}
exec(compile(Path(modulo_path).read_text(encoding="utf-8"), modulo_path, "exec"), ns)
template_html = Path(template_path).read_text(encoding="utf-8")

for slug, nome_pdf, sub in ns["EMPRESES"]:
    faltando = gerar(
        template_html, sub,
        saida / f"cadastro-{slug}.html",
        saida / nome_pdf,
        titulo=sub.get("TITULO"),
        badge=sub.get("BADGE"),
    )
    # Verifica de verdade: sobrou marcador no HTML gerado?
    html = (saida / f"cadastro-{slug}.html").read_text(encoding="utf-8")
    restantes = sorted(set(re.findall(r"\{\{[A-Z0-9_@]+\}\}", html)))
    print(f"{nome_pdf}: {'OK' if not restantes else 'MARCADORES: ' + ', '.join(restantes)}")
