---
name: deploy
description: Dynamically generate and execute deployment infrastructure for SmartFee-AI.
---

<!-- agent-notes: { ctx: "dynamic deployment skill for React/Vite/Supabase/Docker/Vercel", deps: [AGENTS.md, Dockerfile, nginx.conf, .github/workflows/deploy.yml], state: active, last: "ines@2026-08-08" } -->
Dynamically generate, validate, and execute deployment infrastructure when a project is release or MVP-ready.

This skill is owned by Ines (DevOps). When invoked, analyze the project's tech stack, execute pre-flight validation, and provide deployment target configurations (Vercel, Docker/Nginx, GitHub Actions, and Supabase backend integration).

## Steps

### 1. Pre-Flight Validation
Execute the pre-flight verification script to ensure build and code quality standards are met:
```bash
bash .agents/skills/deploy/scripts/preflight-check.sh
```
Check for:
- Workspace structure & `package.json` scripts (`npm run build`, `npm run lint`).
- Environment variable configuration (`.env.example` vs actual environment requirements).
- Supabase schema migrations in `supabase/schema.sql`.

### 2. Deployment Targets

#### Target A: Vercel (Recommended for SPA Frontend)
SmartFee-AI is pre-configured with root and frontend `vercel.json`.
- **Deploy Command**: `vercel --prod`
- **Output Directory**: `frontend/dist`
- **Build Command**: `npm --prefix frontend run build`

#### Target B: Docker / Containerized Production
Use the root multi-stage `Dockerfile` and custom `nginx.conf`:
- **Build Container**: `docker build -t smartfee-ai:latest .`
- **Run Container**: `docker run -d -p 8080:80 --name smartfee-app smartfee-ai:latest`
- Access at `http://localhost:8080`.

#### Target C: GitHub Actions CI/CD
Automated pipeline defined in `.github/workflows/deploy.yml`:
- Runs linting and Vite production bundle build on pull requests and pushes to `main`.
- Triggers production container or host deployment upon successful build.

#### Target D: Supabase Cloud / Database Backend
Deploy database schema and policies:
- Execute `supabase/schema.sql` against your Supabase project dashboard or via CLI:
  ```bash
  supabase db push
  ```

### 3. Generate Deployment Artifact Guide
Write an Antigravity UI Artifact (`deployment_guide.md`) in `<appDataDir>/brain/<conversation-id>/` summarizing:
- Current environment status.
- Exact commands to execute for chosen deployment target.
- Required production environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).

## Considerations

- Ensure environment variables starting with `VITE_` are injected at build time for Vite SPA static bundles.
- Keep Nginx SPA fallback routes (`try_files $uri $uri/ /index.html;`) active to handle HTML5 client-side routing.
