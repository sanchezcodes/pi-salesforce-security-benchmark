# Architecture Evaluation: SBS Integration into Pi Coding Agent

## Context

The **Security Benchmark for Salesforce (SBS)** specification defines ~1,429 lines of security controls across 5 domains. The goal is to make this specification actionable within the pi coding agent—so developers working on Salesforce projects get relevant security guidance, audit procedures, and remediation steps at the right moment.

### SBS Specification Profile

| Domain | Lines | Controls | Content Nature |
|--------|-------|----------|----------------|
| Access Controls | 486 | ~8 controls (SBS-ACS-*) | Permission sets, profiles, RBAC, session security |
| Deployments | 229 | ~4 controls (SBS-DEP-*) | CI/CD pipelines, metadata validation, change management |
| Code Security | 193 | ~4 controls (SBS-CODE-*) | Peer review, static analysis, Apex/LWC security |
| File Security | 104 | ~2 controls (SBS-FILE-*) | File upload restrictions, content scanning |
| Introduction | 178 | — | Spec overview, compliance mapping (NIST, SOC 2, ISO 27001) |
| Regulations | 25 | — | Regulatory framework references |

Each control follows a consistent structure: Control Statement → Description → Risk Level → Audit Procedure → Remediation → Default Value. This regularity is important for the architecture decision.

### Pi Extension Mechanisms

| Mechanism | Nature | Context Cost | Code Required | Composability |
|-----------|--------|-------------|---------------|---------------|
| **Skills** | Markdown files, loaded on-demand by LLM | Only description in system prompt (~100 chars each). Full content loaded only when needed. | None | Low (independent files) |
| **Extensions** | TypeScript modules | Zero (runs as code, not in prompt) | Yes (TypeScript) | High (tools, events, commands) |
| **Agents** | Markdown + frontmatter, isolated pi subprocesses | Independent context window per agent | Requires subagent extension | High (chain, parallel) |

---

## Option A: Pure Skills

**Design:** One `SKILL.md` per SBS domain. Place them in `.pi/skills/` or distribute as a package.

```
.pi/skills/
├── sbs-access-controls/
│   └── SKILL.md              # 486 lines of access control guidance
├── sbs-code-security/
│   └── SKILL.md              # 193 lines of code security guidance
├── sbs-deployments/
│   └── SKILL.md              # 229 lines of deployment controls
├── sbs-file-security/
│   └── SKILL.md              # 104 lines of file security guidance
└── sbs-overview/
    └── SKILL.md              # Intro + regulations + cross-references
```

The LLM sees 5 short descriptions in the system prompt. When a task touches Apex code, it loads `sbs-code-security`. When reviewing permission sets, it loads `sbs-access-controls`.

### Evaluation

| Criterion | Rating | Analysis |
|-----------|--------|----------|
| **Build Complexity** | ★★★★★ Trivial | No code at all. Write 5 markdown files with frontmatter. A few hours of work, mostly editorial. |
| **Developer UX** | ★★★☆☆ Adequate | Developers can ask questions and get guidance. The agent loads relevant controls and explains them. But it's fully passive—the developer must know to ask, or the LLM must decide to load the skill. No proactive detection. `/skill:sbs-access-controls` works as a manual trigger. |
| **Composability** | ★★☆☆☆ Limited | Skills are standalone markdown. They can't trigger each other, can't detect file types, can't run audits. They exist independently—no orchestration. |
| **Maintenance Burden** | ★★★★★ Minimal | Update markdown when the spec changes. No build step, no dependencies, no tests to run. |
| **Context Efficiency** | ★★★★☆ Good | Only ~500 chars of descriptions always in context. Full domain content (100-486 lines) loaded only when relevant. However, loading Access Controls dumps 486 lines into context even if only one control is relevant. |
| **Workflow Fit** | ★★★☆☆ Partial | Good for "tell me about SBS-ACS-001" or "what are the code security requirements?" Poor for "audit this org" or "check this PR against SBS." No active workflow support. |
| **Zero-Config Benefit** | ★★★★★ Excellent | Drop files in `.pi/skills/`, done. Works immediately in any Salesforce project. No setup, no commands to learn. |

### Verdict

**Best for: Quick start, reference-only use cases, teams that just need the spec accessible.**
Skills are the right foundation but not sufficient alone for teams wanting active security enforcement.

---

## Option B: Extension + Skills

**Design:** A TypeScript extension provides active tooling (`/sbs` command, `sbs_check` tool, Salesforce file auto-detection). Skills remain as domain-specific reference material the extension can point the LLM to.

```
.pi/
├── extensions/
│   └── sbs/
│       ├── index.ts          # Extension entry point
│       ├── detector.ts       # Salesforce file pattern detection
│       └── controls.ts       # Control metadata (IDs, domains, risk levels)
└── skills/
    ├── sbs-access-controls/
    │   └── SKILL.md
    ├── sbs-code-security/
    │   └── SKILL.md
    ├── sbs-deployments/
    │   └── SKILL.md
    └── sbs-file-security/
        └── SKILL.md
```

The extension:
- Registers `/sbs` command for interactive security queries
- Registers `sbs_check` tool that the LLM can call to identify which controls apply to a file or metadata type
- Uses `before_agent_start` to detect Salesforce file patterns (`.cls`, `.trigger`, `*-meta.xml`, `permissionset-meta.xml`) and inject relevant control hints into the system prompt
- Uses `tool_call` events to monitor file writes to Salesforce paths and surface relevant controls
- Skills provide the deep reference content when the LLM needs full control details

### Evaluation

| Criterion | Rating | Analysis |
|-----------|--------|----------|
| **Build Complexity** | ★★★☆☆ Moderate | TypeScript extension requires actual development. File detection patterns, control metadata mapping, event handlers. Estimated 2-4 days of focused work. Needs testing. |
| **Developer UX** | ★★★★★ Excellent | Proactive: editing a `.permissionset-meta.xml` file triggers a context injection like "SBS-ACS-001 through SBS-ACS-004 may apply." `/sbs audit access-controls` runs targeted checks. The LLM can call `sbs_check` to look up controls by ID or domain. Reactive use also works via skills. |
| **Composability** | ★★★★☆ Good | Extension tools compose with built-in tools. The `sbs_check` tool returns structured data the LLM can reason over. Event hooks layer non-invasively over normal workflows. However, it's a single extension—can't easily swap parts in and out. |
| **Maintenance Burden** | ★★★☆☆ Moderate | Two things to maintain: TypeScript code + skill content. Extension code needs updates when pi's API changes or when new SBS domains are added. Skills still just need markdown edits. |
| **Context Efficiency** | ★★★★★ Excellent | Extension logic runs as code—zero prompt tokens. Only injects small, targeted hints via `before_agent_start` (e.g., "Controls SBS-CODE-001, SBS-CODE-002 apply to this Apex class"). Skills loaded on-demand for deep reference. Best possible token economy. |
| **Workflow Fit** | ★★★★★ Excellent | Matches real Salesforce development workflows: write code → get security guidance; review metadata → get access control checks; deploy → get deployment control reminders. The active detection layer makes SBS part of the development flow rather than a separate step. |
| **Zero-Config Benefit** | ★★★★☆ Good | Once installed, auto-detection works without commands. Developer doesn't need to know about SBS to get value—the extension surfaces controls contextually. Slight setup friction for the extension itself (install package or copy files). |

### Verdict

**Best for: Teams that want SBS integrated into their daily Salesforce development workflow.**
This is the sweet spot of effort vs. value. Extension provides the intelligence; skills provide the knowledge base.

---

## Option C: Subagent Workflow

**Design:** Specialized agents (auditor, implementer, reviewer) orchestrated via the subagent extension in chains and parallel patterns.

```
~/.pi/agent/agents/
├── sbs-auditor.md            # Audits a Salesforce org/codebase against SBS controls
├── sbs-implementer.md        # Implements remediation for specific controls
└── sbs-reviewer.md           # Reviews code/config changes against SBS controls

~/.pi/agent/prompts/
├── sbs-audit.md              # auditor chain: scout → sbs-auditor
├── sbs-fix.md                # remediation chain: sbs-auditor → sbs-implementer → sbs-reviewer
└── sbs-review.md             # review chain: sbs-reviewer
```

Usage:
```
/sbs-audit check all access controls against this org
/sbs-fix remediate SBS-ACS-003 findings
/sbs-review check this PR for SBS compliance
```

### Evaluation

| Criterion | Rating | Analysis |
|-----------|--------|----------|
| **Build Complexity** | ★★★★☆ Low-Moderate | Agent definitions are markdown with frontmatter—fairly simple. The subagent extension must already be installed (it's an example, not built-in). Prompt templates define workflows. ~1-2 days of work, mostly prompt engineering. |
| **Developer UX** | ★★★☆☆ Specialized | Powerful for formal audit workflows: "audit this org" spawns a chain that systematically checks each domain. But heavy for everyday development. Running a subagent chain to check one Apex class is overkill. No passive detection—developer must explicitly invoke workflows. |
| **Composability** | ★★★★★ Excellent | Chains (auditor → implementer → reviewer) and parallel patterns (audit all 4 domains simultaneously) are first-class. Agents compose naturally. New agents or workflows can be added without touching existing ones. |
| **Maintenance Burden** | ★★★★☆ Low | Agent definitions are markdown. Workflow templates are markdown. Updating SBS content means updating agent system prompts. However, the subagent extension itself is a complex dependency you don't control. |
| **Context Efficiency** | ★★★★★ Excellent | Each agent runs in an isolated pi subprocess with its own context window. The auditor can load the entire 486-line access controls spec without affecting the main session's context. This is the only option where loading the full spec has zero cost to the primary conversation. |
| **Workflow Fit** | ★★☆☆☆ Narrow | Perfect for formal security audits and structured remediation campaigns. Poor for the common case: a developer editing an Apex class who should be reminded about SBS-CODE-002. Subagents are heavy machinery for lightweight guidance. |
| **Zero-Config Benefit** | ★★☆☆☆ Poor | Requires subagent extension installed, agents in the right directory, prompts in the right directory. Multiple moving parts. Developer must know the `/sbs-audit` and `/sbs-fix` commands exist. |

### Verdict

**Best for: Formal security audit campaigns and structured remediation projects.**
Subagents solve a real problem (context isolation for full-spec analysis) but are the wrong tool for day-to-day security guidance.

---

## Option D: Composable Hybrid

**Design:** All three mechanisms—skills + extension + agents—deployed independently but designed to work together.

```
.pi/
├── extensions/
│   └── sbs/
│       ├── index.ts          # Core: detection, /sbs command, sbs_check tool
│       ├── detector.ts       # File pattern detection
│       └── controls.ts       # Control metadata
├── skills/
│   ├── sbs-access-controls/
│   │   └── SKILL.md
│   ├── sbs-code-security/
│   │   └── SKILL.md
│   ├── sbs-deployments/
│   │   └── SKILL.md
│   └── sbs-file-security/
│       └── SKILL.md
└── agents/
    ├── sbs-auditor.md
    ├── sbs-implementer.md
    └── sbs-reviewer.md

~/.pi/agent/prompts/
├── sbs-audit.md
├── sbs-fix.md
└── sbs-review.md
```

The idea: skills work alone for quick reference. The extension works alone for active detection and tooling. Agents work alone for formal audits. Together, the extension can suggest "Run `/sbs-audit` for a full audit" when it detects a complex security scenario, or the auditor agent can reference skill content.

### Evaluation

| Criterion | Rating | Analysis |
|-----------|--------|----------|
| **Build Complexity** | ★★☆☆☆ High | Everything from Options A, B, and C combined. Skills (1 day) + Extension (2-4 days) + Agents (1-2 days) + integration testing (1-2 days). At least a full week of work. Must ensure all pieces work independently AND together. |
| **Developer UX** | ★★★★★ Excellent | Every use case covered: casual reference, active detection, formal audits, structured remediation. Developer gets exactly the right level of help for each situation. |
| **Composability** | ★★★★★ Excellent | Maximum flexibility. Skills compose with anything (LLM loads them). Extension tools compose with built-in tools and agent workflows. Agents compose in chains and parallel. Users can adopt the pieces they want. |
| **Maintenance Burden** | ★★☆☆☆ High | Three layers to maintain: skill markdown, extension TypeScript, agent/prompt markdown. Changes to the SBS spec ripple across all three. Risk of inconsistency between layers (e.g., extension references a control ID that was renamed in the skill). |
| **Context Efficiency** | ★★★★★ Excellent | Inherits the best of each: extension code = zero tokens; skills = on-demand loading; agents = isolated context windows. |
| **Workflow Fit** | ★★★★★ Excellent | Covers the full spectrum: browsing the spec → active development → formal audits → remediation campaigns. |
| **Zero-Config Benefit** | ★★★☆☆ Decent | Skills work out of the box. Extension auto-detects. But agents require subagent extension setup. Full value requires understanding all three layers. |

### Verdict

**Best for: A mature, fully-featured SBS integration serving multiple team roles and workflows.**
This is the end-state architecture, but building it all at once is overengineering for a v1.

---

## Comparison Matrix

| Criterion | A: Pure Skills | B: Extension+Skills | C: Subagents | D: Full Hybrid |
|-----------|:-:|:-:|:-:|:-:|
| Build Complexity | ★★★★★ | ★★★☆☆ | ★★★★☆ | ★★☆☆☆ |
| Developer UX | ★★★☆☆ | ★★★★★ | ★★★☆☆ | ★★★★★ |
| Composability | ★★☆☆☆ | ★★★★☆ | ★★★★★ | ★★★★★ |
| Maintenance Burden | ★★★★★ | ★★★☆☆ | ★★★★☆ | ★★☆☆☆ |
| Context Efficiency | ★★★★☆ | ★★★★★ | ★★★★★ | ★★★★★ |
| Workflow Fit | ★★★☆☆ | ★★★★★ | ★★☆☆☆ | ★★★★★ |
| Zero-Config Benefit | ★★★★★ | ★★★★☆ | ★★☆☆☆ | ★★★☆☆ |

---

## Recommendation (Revised — LLM-Built)

> **Key assumption change:** The builder is an LLM (Claude), not a human developer.
> Build complexity is no longer a meaningful constraint. An LLM generates TypeScript,
> markdown, and agent definitions with equal ease. Consistency across layers is trivially
> enforced in a single pass. Maintenance updates to all three layers happen atomically.

### Previous recommendation: Option B → D phased. New recommendation: **Option D, built in one shot.**

The original phasing existed because human developers face real constraints: TypeScript is harder than markdown, testing takes time, cognitive load across three layers is high. None of those apply when the builder is an LLM.

### Revised Comparison Matrix (LLM as Builder)

| Criterion | A: Pure Skills | B: Extension+Skills | C: Subagents | D: Full Hybrid |
|-----------|:-:|:-:|:-:|:-:|
| Build Complexity | ★★★★★ | ★★★★★ | ★★★★★ | ★★★★★ |
| Developer UX | ★★★☆☆ | ★★★★★ | ★★★☆☆ | ★★★★★ |
| Composability | ★★☆☆☆ | ★★★★☆ | ★★★★★ | ★★★★★ |
| Maintenance Burden | ★★★★★ | ★★★★☆ | ★★★★☆ | ★★★★☆ |
| Context Efficiency | ★★★★☆ | ★★★★★ | ★★★★★ | ★★★★★ |
| Workflow Fit | ★★★☆☆ | ★★★★★ | ★★☆☆☆ | ★★★★★ |
| Zero-Config Benefit | ★★★★★ | ★★★★☆ | ★★☆☆☆ | ★★★★☆ |

With build complexity neutralized, Option D dominates on every axis that matters. The only trade-off is maintenance burden (★★★★☆ vs ★★★★★ for pure skills), but even that is mitigated: the LLM that built all three layers can update all three layers atomically when the spec changes.

### Build Option D: Full Composable Hybrid — Everything At Once

#### Layer 1: Skills (Knowledge Base)

5 domain skills as the single source of truth for SBS content:

```
.pi/skills/
├── sbs-access-controls/SKILL.md     # SBS-ACS-* controls
├── sbs-code-security/SKILL.md       # SBS-CODE-* controls
├── sbs-deployments/SKILL.md         # SBS-DEP-* controls
├── sbs-file-security/SKILL.md       # SBS-FILE-* controls
└── sbs-overview/SKILL.md            # Intro, regulations, cross-domain guidance
```

Each skill contains the full SBS controls for its domain, structured for LLM consumption: control ID, statement, audit procedure, remediation, risk level.

#### Layer 2: Extension (Intelligence)

TypeScript extension providing active detection, tooling, and commands:

```
.pi/extensions/sbs/
├── index.ts              # Entry point: event handlers, commands
├── detector.ts           # Salesforce file pattern detection
├── controls.ts           # Control metadata registry (IDs, domains, risk levels, file patterns)
└── package.json          # If external deps needed
```

**Capabilities:**
1. **Auto-detection** (`before_agent_start`): Detect Salesforce file patterns in the user's prompt/context. Inject a surgical one-line hint: `"SBS controls SBS-CODE-001, SBS-CODE-002 apply to Apex files."` (~50 tokens)
2. **`sbs_check` tool**: LLM-callable. Look up controls by ID, domain, risk level, or file type. Returns structured metadata; LLM decides whether to load the full skill.
3. **`/sbs` command**: Interactive entry point. `/sbs audit`, `/sbs controls <domain>`, `/sbs status`.
4. **Write monitoring** (`tool_result`): When agent writes to a Salesforce metadata path, surface a non-blocking note about relevant controls.
5. **`/sbs-audit` command**: Trigger a full subagent audit workflow (bridges to Layer 3).

#### Layer 3: Agents (Workflows)

Specialized agents for formal audit and remediation workflows:

```
.pi/agents/
├── sbs-auditor.md        # Reads code/config, maps to SBS controls, reports gaps
├── sbs-implementer.md    # Writes secure code following SBS controls
└── sbs-reviewer.md       # Reviews changes against SBS controls

.pi/prompts/
├── sbs-audit.md          # scout → sbs-auditor (full org audit)
├── sbs-fix.md            # sbs-auditor → sbs-implementer → sbs-reviewer (remediation)
└── sbs-review.md         # sbs-reviewer (PR/change review)
```

**Workflow chains:**
- `/sbs-audit` → scout discovers Salesforce project structure → sbs-auditor systematically checks each domain
- `/sbs-fix <control-id>` → sbs-auditor identifies gap → sbs-implementer remediates → sbs-reviewer validates
- `/sbs-review` → sbs-reviewer checks recent changes against applicable controls

#### How The Layers Compose

```
Developer types: "add a permission set for sales users"

Layer 2 (Extension):
  → before_agent_start detects "permission set" in prompt
  → injects: "SBS-ACS-001, SBS-ACS-002, SBS-ACS-003 may apply"

LLM decides to load Layer 1 (Skill):
  → reads sbs-access-controls/SKILL.md
  → follows SBS-ACS-001: uses permission sets (not profiles)
  → follows SBS-ACS-003: applies principle of least privilege
  → writes compliant metadata

Layer 2 (Extension):
  → tool_result detects write to *.permissionset-meta.xml
  → surfaces: "✓ SBS-ACS-001 aligned (permission set, not profile)"

Later, security team runs:
  /sbs-audit

Layer 3 (Agents):
  → scout maps the Salesforce project
  → sbs-auditor checks all domains in parallel
  → reports: "12/18 controls compliant, 6 gaps found"
```

### Key Design Principles

- **Skills are the single source of truth** for SBS content. Extension and agents reference controls by ID but never duplicate spec text. Zero sync issues.
- **The extension is surgical, not chatty.** Auto-detection injects a single line (~50 tokens). The LLM decides whether to load the full skill. No context waste.
- **Everything works independently.** Skills work without the extension. The extension works without agents. Agents work without the extension. Users adopt what fits their workflow.
- **Context efficiency is paramount.** The SBS spec is ~1,429 lines. Never dump it all into context. The extension routes the LLM to the right 50-100 lines at the right moment.
- **The package is installable in one command.** `pi install <source>` drops skills, extension, agents, and prompts into place. Zero manual setup.
