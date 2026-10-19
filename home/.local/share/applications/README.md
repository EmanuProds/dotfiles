# GNOME launcher overrides.
#
# A .desktop file in ~/.local/share/applications OVERRIDES the one with the
# same name in /usr/share/applications, so every file here must keep the exact
# appID of the package it replaces — extensions and integrations locate the
# app through it.
#
# net.nokyan.Resources.Devel — "Resources" (COPR atim/resources) renamed to
#   "System Monitor" with the GNOME icon. Keeps the package appID so the
#   extension does not break; the original launcher in /usr/share gets
#   NoDisplay=true (done by phase 11 of the fedorapi) so both do not show up
#   in the menu.
#
# FFPWA-*.desktop — webapps (PWA) for Firefox/Zen via the PWAsForFirefox
#   extension (firefoxpwa). Each file carries a site ID (e.g.
#   01M378YQ4QKC77CY8TDRSTRW09) bound to the browser PROFILE: the ID only
#   exists on the machine that installed the webapp. On another machine the
#   launcher shows up, but `firefoxpwa site launch <id>` fails until the site
#   is reinstalled through Firefox/Zen.
#   Icons live in ~/.local/share/icons/hicolor/*/apps/FFPWA-*.png; the ones
#   pointing at MoreWaita names (telegram, whatsapp, google-sheets/docs,
#   proton-mail) resolve through the system theme.
#   The "WebApps" folder of the GNOME overview (app-folder) references these
#   files — the list is in dconf/gnome-settings.ini.
