---
agent-notes:
  ctx: "codebase structural overview for humans and agents"
  deps: []
  state: stub
  last: "ines@2026-08-08"
  key: ["UPDATE when adding packages, modules, or changing public APIs"]
---
# Code Map

Structural overview of the codebase. Use this to orient yourself before diving into code. **Keep this up to date** — when you add a package, module, or significantly change a public API, update this file.

Read this file at the start of every session instead of exploring the codebase from scratch.

## Architecture at a Glance

<!-- Add an ASCII diagram showing data flow and high-level component relationships -->
<!-- Example:
```
Input → Processing → Output
  │         │          │
  └── storage ─────────┘
```
-->

## Dependency Graph

<!-- Show which packages/modules depend on which -->
<!-- Example:
```
core ────── (no deps — foundational types)
  ├── api ─── (HTTP layer)
  ├── db ──── (data access)
  └── cli ─── (depends on all packages)
```
-->

## Package / Module Summaries

<!-- For each package or major module, document:
### @scope/package-name — Short Description

**Purpose:** What it does.

| Module | Key Exports | Notes |
|--------|------------|-------|
| `src/foo.ts` | `FooClass`, `fooHelper()` | Entry point |
| `src/bar.ts` | `BarSchema`, `BarType` | Zod schemas |

**External deps:** list key dependencies
**Internal deps:** list workspace dependencies
-->

## Test Inventory

<!-- List test files, counts, and focus areas -->
<!-- Example:
| Package | Test Files | Tests | Focus |
|---------|-----------|-------|-------|
| core | 3 | 24 | Schema validation, config loading |
| api | 5 | 41 | Route handlers, middleware |
-->

## Key Type Flow

<!-- Document how data flows through the system's type hierarchy -->
<!-- Example: RawInput → ValidatedInput → ProcessedResult → OutputFormat -->

## Deployment & Infrastructure

- **Skill**: `.agents/skills/deploy/SKILL.md` — multi-target deployment automation & pre-flight checks.
- **Pre-flight Check Script**: `.agents/skills/deploy/scripts/preflight-check.sh`
- **Docker Production Setup**: `Dockerfile` (multi-stage build) & `nginx.conf` (SPA fallback & headers).
- **CI/CD Pipeline**: `.github/workflows/deploy.yml` (GitHub Actions linting, building & container validation).
- **Vercel Config**: `vercel.json` & `frontend/vercel.json` (SPA rewrites and build paths).

