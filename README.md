# Salesforce Security Benchmark (SBS) — Pi Package

A [pi coding agent](https://github.com/badlogic/pi-mono) package that integrates the [Security Benchmark for Salesforce](https://www.securitybenchmark.org/) specification into your development workflow.

When you work on Salesforce projects, the agent automatically detects security-relevant files, surfaces applicable SBS controls, and provides audit, implementation, and review workflows — all grounded in the 25 controls defined by the SBS specification.

## Installation

```bash
pi install git:github.com/sanchezcodes/pi-salesforce-security-benchmark
```

Or project-local:

```bash
pi install git:github.com/sanchezcodes/pi-salesforce-security-benchmark -l
```

### Agent Workflows (Optional)

The subagent workflows (`/sbs-audit`, `/sbs-fix`, `/sbs-review`) require the [subagent extension](https://github.com/badlogic/pi-mono/tree/main/packages/coding-agent/examples/extensions/subagent). Copy the agent definitions to your agents directory:

```bash
cp agents/*.md ~/.pi/agent/agents/
```

## What's Included

### Layer 1: Skills (Knowledge Base)

Five domain skills loaded on-demand when the agent needs SBS reference material:

| Skill | Controls | Description |
|-------|----------|-------------|
| `sbs-overview` | — | SBS structure, domains, risk levels, regulation mapping |
| `sbs-access-controls` | SBS-ACS-001 – 012 | Permission sets, profiles, RBAC, NHIs, access reviews |
| `sbs-code-security` | SBS-CODE-001 – 004 | Peer review, SAST, persistent logging, sensitive data |
| `sbs-deployments` | SBS-DEP-001 – 006 | Deployment identity, metadata protection, secret scanning |
| `sbs-file-security` | SBS-FILE-001 – 003 | Public content links, expiry, passwords, periodic review |

Use directly: `/skill:sbs-access-controls` or let the agent load them automatically.

### Layer 2: Extension (Intelligence)

A TypeScript extension providing active detection and tooling:

| Feature | Description |
|---------|-------------|
| **Auto-detection** | Detects Salesforce files in your prompt and injects applicable control IDs into context |
| **`sbs_check` tool** | LLM-callable tool to look up controls by ID, domain, risk level, or file pattern |
| **`/sbs` command** | Interactive browser: `/sbs`, `/sbs access-controls`, `/sbs SBS-ACS-001` |
| **Write monitoring** | Notifies you of applicable controls when the agent writes Salesforce metadata |

### Layer 3: Agents & Prompts (Workflows)

Specialized agents for formal security workflows (requires subagent extension):

| Prompt | Workflow | Description |
|--------|----------|-------------|
| `/sbs-audit` | scout → sbs-auditor | Full audit of all 25 controls against a project |
| `/sbs-fix` | sbs-auditor → sbs-implementer → sbs-reviewer | Find gaps, remediate, and validate |
| `/sbs-review` | sbs-reviewer | Review recent changes for SBS compliance |

## Usage Examples

### Passive — Just Start Working

Edit a `.permissionset-meta.xml` and the agent automatically knows SBS-ACS-001 through SBS-ACS-012 may apply. It loads the relevant skill and follows the controls.

### Active — Ask Questions

```
What SBS controls apply to Apex classes?
```

The agent calls `sbs_check` with the file pattern, finds CODE-001 through CODE-004, and loads the code security skill for details.

### Command — Browse Controls

```
/sbs                          # Overview of all domains
/sbs access-controls          # List 12 access control controls
/sbs SBS-DEP-005              # Full details for secret scanning control
```

### Workflow — Full Audit

```
/sbs-audit Check all access controls against this org
/sbs-fix Remediate SBS-CODE-004 findings in the logging module
/sbs-review Review the changes in the last commit
```

## SBS Control Summary

**25 controls** across 4 domains:

| Risk | Count | Controls |
|------|-------|----------|
| Critical | 4 | SBS-ACS-003, SBS-ACS-006, SBS-CODE-004, SBS-DEP-005 |
| High | 15 | SBS-ACS-001, 002, 004, 005, 007, 008, 011; SBS-CODE-003; SBS-DEP-001–004, 006; SBS-FILE-002 |
| Moderate | 6 | SBS-ACS-009, 010, 012; SBS-CODE-001, 002; SBS-FILE-001, 003 |

**Regulation coverage:** ISO 27001 (all 25), SOC 2 (17), NIST (15), HIPAA (7), GDPR (11), CCPA/CPRA (7)

## Architecture

This package follows a composable hybrid architecture:

- **Skills** are the single source of truth for SBS content
- **Extension** provides intelligence (detection, routing, tooling) — zero context cost
- **Agents** provide isolated workflows with their own context windows
- Each layer works independently — use only what you need

See [docs/ARCHITECTURE_EVALUATION.md](docs/ARCHITECTURE_EVALUATION.md) for the full design rationale.

## Updating

When the SBS specification is updated:

1. Re-scrape: `firecrawl download https://docs.securitybenchmark.org/ --format markdown --only-main-content --allow-subdomains -y`
2. Update skills with new/modified control content
3. Update `extensions/sbs/controls.ts` with new control metadata
4. Update agent prompts if new domains are added

## Credits

The [Security Benchmark for Salesforce](https://www.securitybenchmark.org/) is maintained by an editorial board and contributors from the Salesforce and security practitioner communities. SBS is an independent initiative, not affiliated with Salesforce.

## License

ISC
