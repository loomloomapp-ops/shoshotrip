# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

A **design/build workspace** for the **ShoSho Trip** travel-agency website — not a conventional
code project. There is no git repository, no `package.json`, no build/lint/test tooling, and no
application source yet. The workspace currently holds two things:

1. A large **design-skill rule system** in `.claude/rules/` (the real "architecture" here).
2. **Reference assets** in `assets/`: media (photos, `.MOV` clips) and an exported Webflow
   template used as visual reference.

Because there is no build system, there are **no build/test/run commands**. When asked to produce
the site, generate frontend code (React/Next.js + Tailwind is the skills' default stack) into the
workspace; confirm the intended output location and stack with the user before scaffolding, since
none exists yet.

## The design-skill rule system (`.claude/rules/`)

Every `SKILL.md` under `.claude/rules/` is auto-loaded as a project instruction and **overrides
default behavior**. They are opinionated frontend/design directives ("anti-slop" rules, banned
patterns, motion specs). `.claude/rules/llms.txt` is the index describing each skill's purpose.

Key relationships (from `llms.txt`):

- **taste-skill** — the default design skill (v2 experimental). Brief inference, three dials
  (VARIANCE / MOTION / DENSITY), design-system map, hard-rules pre-flight check. This is the one
  to follow by default for landing pages, portfolios, and redesigns.
- **taste-skill-v1** / **taste-skill-v1 (SKILL.md)** — the original v1, preserved for exact
  legacy behavior. Baseline dials there: DESIGN_VARIANCE 8, MOTION_INTENSITY 6, VISUAL_DENSITY 4.
- **gpt-tasteskill** — Awwwards-level GSAP-heavy variant with a mandatory `<design_plan>` step.
- **image-to-code-skill** — image-first workflow: generate design reference images, analyze, then
  implement to match.
- **imagegen-frontend-web / imagegen-frontend-mobile / brandkit** — image-generation-only skills
  (produce reference images, do **not** write code).
- **redesign-skill** — audit-and-fix an existing project without rewriting it.
- **soft-skill / minimalist-skill / brutalist-skill / stitch-skill** — alternate aesthetic
  directions (soft/premium, editorial-monochrome, Swiss-brutalist, Google-Stitch semantic).
- **output-skill** — enforces complete output (no `// ...` placeholders, no truncation).

These skills share a consistent set of hard rules worth internalizing across all of them: no
emojis in code/markup, `Inter` banned as default font, no pure `#000000`, no AI-purple gradients,
`min-h-[100dvh]` never `h-screen`, CSS Grid over flexbox percentage math, and the em-dash ban.
When two skills conflict, prefer the one matching the user's stated aesthetic; default to
`taste-skill`.

## Reference assets (`assets/`)

- `assets/Tripvana Agency Webflow/` — an **exported Webflow template** (`index.html` +
  `css/tripvana-agency.shared.*.css` + `js/` bundles + `images/`). Treat this as **read-only
  visual/structural reference**, not source to edit or build on. It is minified/hashed Webflow
  output, not authored code.
- Photos (`.jpeg`) and video clips (`.MOV`) at the top level of `assets/` are content/media
  references for the site.

## Notes

- `.DS_Store` files are present throughout; ignore them.
- Filenames and paths contain Cyrillic and spaces (e.g. `проєкти Claud/ShoSho Trip`) — always
  quote paths in shell commands.
