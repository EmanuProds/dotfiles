# Skills Provenance

Pin record for third-party skills installed from the internet.
Skills are snapshots taken at install time — to update, re-clone at a pinned commit and re-copy, then update this file.

## Installed 2026-09-22

| Skill | Upstream repo | Pinned commit | Installed files |
|-------|---------------|---------------|-----------------|
| bash-secure-scripting | konstruktoid/agent-instructions-skills | `84acef2cef00b7d19c9fabd25ab883599dd2f532` | SKILL.md, references/{environment,error-handling,filesystem,secrets,strict-mode,untrusted-input}.md, instructions/bash_coding_instructions.md (copied from repo root so the relative reference resolves) |
| arch-linux | bolens/agent-skills | `e7c49bfa5b71c3bf3ebf97f090aab78842b0e63d` | SKILL.md, UPSTREAM.md |
| cachyos | bolens/agent-skills | `e7c49bfa5b71c3bf3ebf97f090aab78842b0e63d` | SKILL.md, UPSTREAM.md, references/settings-and-tuning.md |
| omarchy | bolens/agent-skills | `e7c49bfa5b71c3bf3ebf97f090aab78842b0e63d` | SKILL.md, UPSTREAM.md, LICENSE, {theming,plugins,hyprland,hooks,desktop-session,contributing,capture}.md |
| managed-config-drift | bolens/agent-skills | `e7c49bfa5b71c3bf3ebf97f090aab78842b0e63d` | SKILL.md, UPSTREAM.md, scripts/compare-trees.py, agents/openai.yaml |
| ci-maintenance | bolens/agent-skills | `e7c49bfa5b71c3bf3ebf97f090aab78842b0e63d` | SKILL.md, UPSTREAM.md, references/{setup-contracts,github-actions,development-environments,command-evidence}.md |

## Audit notes

- No executables/scripts shipped untrusted code: `compare-trees.py` is 77 lines, stdlib only (`argparse`, `hashlib`, `os`, `pathlib`), no network/eval/exec/subprocess.
- `arch-linux/SKILL.md` still references 3 sibling skills that are NOT public: `arch-package-maintenance`, `arch-update-recovery`, `workstation-health-triage` (private upstream). Known dead links, do not block usage.
- Gradience is archived (2024-06-29) — do not recommend for new setups, per gnome-gtk4 skill.

## Update procedure

```bash
git clone https://github.com/konstruktoid/agent-instructions-skills.git /tmp/opencode/agent-instructions-skills
git -C /tmp/opencode/agent-instructions-skills checkout <new-commit>
# copy skill dir + instructions/ into ~/.agents/skills/bash-secure-scripting/

git clone https://github.com/bolens/agent-skills.git /tmp/opencode/bolens-agent-skills
git -C /tmp/opencode/bolens-agent-skills checkout <new-commit>
# copy skills/{arch-linux,cachyos,omarchy,managed-config-drift,ci-maintenance} into ~/.agents/skills/

# then update this file
```

## Authored locally (no upstream pin; sources in SKILL.md)

- gnome-gtk4 — written from adw-gtk3, adw-colors, ArchWiki GTK, ArchWiki "Uniform look for Qt and GTK", libadwaita docs
- limine — written from Limine CONFIG.md (limine-bootloader/limine trunk) + ArchWiki Limine