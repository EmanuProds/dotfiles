# Dotfiles

Single source of truth for the dotfiles, the GNOME dconf dump and the OpenCode
workspace skeleton, consumed by `fedorapi` (Fedora 44) and usable on any Linux
system.

Pulled by `fedoraPI.sh` via `git clone --depth 1` — Fedora always gets the
latest published state, with zero duplicated files.

## Layout

```
dotfiles/
├── home/                     # mirrors $HOME (plain cp)
│   ├── .bashrc               # mise activate + starship
│   ├── .shell_aliases
│   ├── gdm/watermark.png
│   └── .config/
│       ├── gamemode.ini
│       ├── topgrade.toml
│       ├── ghostty/          # config, config.ghostty, themes/accent-sync-{dark,light}
│       └── zed/              # settings.json, themes/
├── dconf/
│   └── gnome-settings.ini    # filtered GNOME dump (no secrets, no machine state)
├── skills/                   # 185 skills → installed at ~/.agents/skills
│                              # (the path read by OpenCode via "skills")
└── opencode/                 # OpenCode skeleton
    ├── config/
    │   ├── opencode.json     # official profile: instructions, skills, portable lsp,
    │   │                     # mcp context7, snapshots (no fixed model)
    │   ├── AGENTS.md         # slim rules (language, security, research, memory)
    │   ├── env.example       # placeholders; a real .env NEVER enters the repo
    │   └── package.json
    ├── commands/             # custom commands (checkpoint, graphify, lembrar…)
    ├── plugins/              # memory-store.ts (SQLite-backed memory)
    ├── tests/
    └── README.md
```

## Using it on Fedora

```bash
git clone --depth 1 https://github.com/EmanuProds/dotfiles.git /tmp/dotfiles
cp -a /tmp/dotfiles/home/.config/. "$HOME/.config/"
install -m 644 /tmp/dotfiles/home/.bashrc "$HOME/.bashrc"
cp -a /tmp/dotfiles/skills "$HOME/.agents/skills"
dconf load / < /tmp/dotfiles/dconf/gnome-settings.ini
```

`fedoraPI.sh` does exactly this (phases 7, 8 and 11).

## GNOME dconf dump

`dconf/gnome-settings.ini` is a **filtered** dump of the reference machine.
It deliberately excludes:

- personal state and history (window geometry, tabs, recent files, usage stats)
- absolute `/home/*` paths (wallpaper, last-opened folders)
- schemas of apps that `fedoraPI.sh` does not install (virt-manager, Weather,
  Showtime, Papers, Ptyxis, Evolution, Boxes, Clocks…)
- portal/flatpak permission state (it would clash with freshly installed sandboxes)
- keybindings of apps that are not part of the setup

Kept: interface/GTK/cursor, GNOME shortcuts, keyboard layouts, power and
battery, installed-extension options, and the dock order (`favorite-apps`).

## OpenCode

`config/opencode.json` — the official, portable profile:

| Block | Contents |
|---|---|
| `instructions` | `~/.config/opencode/AGENTS.md` (slim) |
| `skills` | `~/.agents/skills` (the skills at this repo's root) |
| `lsp` | go (gopls), python (pyright), github-actions, typescript, yaml, sql (postgres-language-server), markdown (marksman) — commands by name, no absolute paths |
| `mcp` | context7 (remote) with `{env:CONTEXT7_API_KEY}` |
| `snapshots` | `true` |

## Requirements

- gnome-shell with D-Bus for extensions (`fedorapi` installs the UUIDs through
  `org.gnome.Shell.Extensions.InstallRemoteExtension`)
- `starship` and `mise` on PATH (both installed by `fedorapi`)
- the LSP binaries (`gopls`, `pyright`, `gh-actions-language-server`,
  `typescript-language-server`, `yaml-language-server`,
  `postgres-language-server`, `marksman`) come from `fedorapi`'s `npm.txt`
  and toolchain lists

## License

MIT — Emanuel Pereira