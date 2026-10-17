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
command -v mise >/dev/null 2>&1 && eval "$("$(command -v mise)" activate bash)"

# Starship
command -v starship >/dev/null 2>&1 && eval "$(starship init bash)"
