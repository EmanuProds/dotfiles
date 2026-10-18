# Override de launchers do GNOME.
#
# Um .desktop em ~/.local/share/applications SOBRESCREVE o do mesmo nome em
# /usr/share/applications, entao cada arquivo aqui tem que manter o appID exato
# do pacote que ele substitui — é por ele que extensões e integrações acham o app.
#
# net.nokyan.Resources.Devel — "Resources" (COPR atim/resources) renomeado para
#   "Monitor do sistema" com o ícone do GNOME. Mantém o appID do pacote para não
#   quebrar a extensão; o launcher original em /usr/share fica com NoDisplay=true
#   (feito pela fase 11 do fedoraPI.sh) para não aparecerem os dois no menu.
