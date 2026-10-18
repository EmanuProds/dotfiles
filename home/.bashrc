#
# ~/.bashrc — fedorapi skeleton (genérico: sem paths por usuário)
#

# If not running interactively, don't do anything
[[ $- != *i* ]] && return

# Custom aliases
if [ -f ~/.shell_aliases ]; then
    . ~/.shell_aliases
fi

alias ls='ls --color=auto'
alias grep='grep --color=auto'

# Mise (instalado em ~/.local/bin pelo mise.run)
# Usa o caminho absoluto: ~/.local/bin não está no PATH antes da ativação.
eval "$("$HOME/.local/bin/mise" activate bash)" 2>/dev/null || true

# Starship
command -v starship >/dev/null 2>&1 && eval "$(starship init bash)"
