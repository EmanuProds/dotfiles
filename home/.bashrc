#
# ~/.bashrc — fedorapi skeleton (genérico: sem paths por usuário)
#

# Mise ANTES do return interativo (ver comentário abaixo).
# Usa o caminho absoluto: ~/.local/bin não está no PATH antes da ativação.
if [ -x "$HOME/.local/bin/mise" ]; then
    eval "$("$HOME/.local/bin/mise" activate bash)"
fi

# Se não for interativo, para aqui.
# A ativação do mise fica ACIMA deste return de propósito: `mise activate bash`
# exporta o PATH (shims + bins das tools) na hora, sem depender do prompt. Shell
# não-interativo (bash -c, scripts, cron, e o shell que um LLM abre para rodar
# `npm ...`) já entra com npm/node/omniroute/etc. resolvidos.
[[ $- != *i* ]] && return

# Custom aliases
if [ -f ~/.shell_aliases ]; then
    . ~/.shell_aliases
fi

alias ls='ls --color=auto'
alias grep='grep --color=auto'

# Starship
command -v starship >/dev/null 2>&1 && eval "$(starship init bash)"
