# Dotfiles

Single source of truth for dotfiles, GNOME dconf dump and OpenCode workspace
skeleton. Consumed by `fedorapi` (Fedora 44+) via `git clone --depth 1`.

## Layout

```
dotfiles/
├── home/                     # mirrors $HOME
│   ├── .bashrc               # mise activate + starship
│   ├── .shell_aliases
│   ├── gdm/watermark.png
│   ├── .config/              # ghostty, zed, gamemode, topgrade, watermark
│   └── .local/share/         # applications (webapps PWA), icons, themes
├── dconf/
│   └── gnome-settings.ini    # filtered GNOME dump (no secrets, no machine state)
├── skills/                   # 185 skills → ~/.agents/skills
└── opencode/                 # OpenCode skeleton
    ├── config/
    │   ├── opencode.json     # profile: instructions, skills, lsp, mcp context7
    │   ├── AGENTS.md         # slim rules
    │   ├── env.example       # placeholders only
    │   └── package.json
    ├── commands/             # custom commands
    ├── plugins/              # memory-store.ts (SQLite)
    └── tests/
```

## Webapps ("WebApps" folder)

`home/.local/share/applications/FFPWA-*.desktop` are the launchers of the
Firefox/Zen PWA webapps (PWAsForFirefox extension, `firefoxpwa`). Icons live
in `home/.local/share/icons/hicolor/*/apps/FFPWA-*.png`; the ones pointing at
MoreWaita names (telegram, whatsapp, google-sheets/docs, proton-mail) resolve
through the system theme.

The **"WebApps"** folder of the GNOME overview (app-folder) and the launcher
order inside it live in `dconf/gnome-settings.ini`
(`org/gnome/desktop/app-folders/folders/WebApps`). The dock lives in
`org/gnome/shell/favorite-apps`.

> Each webapp has a site ID bound to the **browser profile**: on another
> machine the launcher shows up, but `firefoxpwa site launch <id>` fails until
> the site is reinstalled through Firefox/Zen.

## Using on Fedora

`install.sh` (fedorapi) does this automatically (phases 9, 10, 12).

## GNOME dconf dump

Filtered dump of the reference machine. Excludes personal state, absolute paths,
schemas of uninstalled apps, portal/flatpak permissions and custom keybindings.
Keeps: interface/GTK/cursor, GNOME shortcuts, keyboard layouts, power/battery,
extension options and dock order.

## OpenCode

`config/opencode.json` — portable profile:

| Block | Contents |
|---|---|
| `instructions` | `~/.config/opencode/AGENTS.md` |
| `skills` | `~/.agents/skills` |
| `lsp` | go (gopls), python (ty), github-actions, typescript (vtsls), yaml, sql (sqls), markdown (markdown-oxide) |
| `mcp` | context7 (remote, `{env:CONTEXT7_API_KEY}`) |
| `snapshots` | `true` |

## Requirements

- gnome-shell with D-Bus (for extensions)
- `starship` and `mise` on PATH (installed by fedorapi)
- LSP binaries come from fedorapi's toolchain lists (npm.txt, mise.txt)

## License

MIT — Emanuel Pereira