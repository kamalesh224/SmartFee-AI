# VTeam for Antigravity

*This framework is a direct port and adaptation of the brilliant [vteam-hybrid](https://github.com/noodlefrenzy/vteam-hybrid) project by noodlefrenzy, tailored specifically for the Antigravity IDE.*

**A virtual development team for Antigravity.** One template. A team of specialists that enforces TDD, challenges architecture decisions, and gets smarter the more you use it.

> Antigravity is powerful, but on a real project it drifts. You ask it to implement a feature and it skips tests. You ask for architecture advice and it writes code instead. Reviews are inconsistent. Context evaporates between sessions.
>
> This framework fixes this with 19 specialized agents — each with a defined role, clear boundaries, and rules about when they activate. You talk in natural language. The template handles the discipline.

---

## Quick Start

### 1. Create from template

Click **"Use this template"** on GitHub, or:

```bash
git clone <this-repo> my-project && cd my-project
rm -rf .git && git init && git add -A
git commit -m "chore: initialize from vteam template"
```

**Validate:** `ls .agents/agents/` — you should see 19 agent files (18 personas + 1 composite reviewer).

### 2. Open in Antigravity

Open the project directory in your Antigravity IDE.

### 3. Scaffold your stack (optional)

| Command | What it sets up |
|---------|----------------|
| `/scaffold-cli` | Python or Rust CLI tool |
| `/scaffold-web-monorepo` | TypeScript monorepo (Next.js, React) |
| `/scaffold-ai-tool` | Python AI/ML tool (FastAPI, Streamlit) |
| `/scaffold-static-site` | Static site for GitHub Pages |

No scaffold fits? Skip this — the template works with any tech stack.

**Validate:** `ls docs/code-map.md` exists (moved from `docs/scaffolds/`).

### 4. Run discovery

**Fast path (~5 min):**
```
/quickstart I want to build <your project description>
```
Cam asks 3 questions, creates a backlog, and starts your first TDD cycle immediately. Best for getting started quickly — you can add the full methodology later.

**Full path (~30-60 min):**
```
/kickoff I want to build <your project description>
```
Five interactive phases: vision elicitation, product philosophy, design exploration, architecture with adversarial debate, and project board setup.

**Validate (quickstart):** `AGENTS.md` has your project name, `docs/plans/quickstart-backlog.md` exists, and your first test is written.

**Validate (kickoff):** You should have `docs/product-context.md`, at least one ADR in `docs/adrs/`, and issues on your GitHub Projects board.

### 5. Start building

```
/tdd <feature-name>
```

Tara writes failing tests first. Sato makes them pass. The `/code-review` runs automatically with three parallel lenses generating interactive Antigravity UI Artifacts.

**Validate:** A new test file, implementation code, and the issue moved to "In Review."

---

## Antigravity Native Features

Unlike standard text-based workflows, VTeam for Antigravity leverages native IDE features:
- **UI Artifacts:** Code reviews and plans generate rich, interactive artifacts (Carousels, GitHub Alerts).
- **Background Tasks:** Skills like `/dev-server` dynamically spin up development environments in the background without blocking your workflow.
- **MVP Deployments:** The `/deploy` skill generates ready-to-go deployment infrastructure.
- **Orchestration:** The `/vteam-preview` skill acts as an Orchestrator Agent to simulate multiple specialized agents consecutively in a single session.

## How It Works

```
You:  I want to build a CLI tool that converts markdown to PDF

Cam:  Let me explore that with you. Who's the target user —
      developers or non-technical users? And what's your priority:
      fidelity to the markdown spec, or speed of conversion?

You:  Developers, and speed matters more than fidelity.

Cam:  Got it. Let me probe a few more things before we commit to
      an approach...
```

After discovery, the system hands off to Tara (failing tests) then Sato (implementation). You stay in control — the agents do the structured work.

**The five core agents** (always available):

| Agent | Role | When they activate |
|-------|------|--------------------|
| **Cam** | Vision and elicitation | When you describe a new idea or vague requirement |
| **Sato** | Implementation | When code needs to be written |
| **Tara** | Testing (TDD) | Before Sato — writes failing tests first |
| **Pat** | Product and priorities | When requirements need defining or priorities need setting |
| **Grace** | Tracking and coordination | When work needs to be organized or status tracked |

**Additional agents** activate when the work demands it — Archie for architecture, Vik for code review, Pierrot for security, Wei for devil's advocacy, Dani for design.
