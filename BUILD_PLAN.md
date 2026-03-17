# Build Plan: SBS Pi Package (Option D — Full Hybrid)

> This document is the step-by-step build plan for the SBS pi package.
> Each step produces files that are validated before moving to the next.

## Package Structure

```
salesforce-security-benchmark/
├── package.json                          # Pi package manifest
├── README.md                             # Package docs
├── ARCHITECTURE_EVALUATION.md            # Decision record
├── SBS_CONTROL_INVENTORY.md              # Control reference
├── BUILD_PLAN.md                         # This file
│
├── skills/                               # Layer 1: Knowledge Base
│   ├── sbs-access-controls/
│   │   └── SKILL.md
│   ├── sbs-code-security/
│   │   └── SKILL.md
│   ├── sbs-deployments/
│   │   └── SKILL.md
│   ├── sbs-file-security/
│   │   └── SKILL.md
│   └── sbs-overview/
│       └── SKILL.md
│
├── extensions/                           # Layer 2: Intelligence
│   └── sbs/
│       ├── index.ts                      # Extension entry point
│       ├── controls.ts                   # Control metadata registry
│       └── detector.ts                   # Salesforce file pattern detection
│
├── agents/                               # Layer 3: Workflows
│   ├── sbs-auditor.md
│   ├── sbs-implementer.md
│   └── sbs-reviewer.md
│
└── prompts/                              # Layer 3: Workflow templates
    ├── sbs-audit.md
    ├── sbs-fix.md
    └── sbs-review.md
```

---

## Step 1: Package Manifest

**File:** `package.json`

Pi package manifest declaring all resource directories. This enables
`pi install` to discover skills, extensions, agents, and prompts.

**Validation:** `cat package.json | jq .` (valid JSON with `pi` key)

---

## Step 2: Skills — sbs-overview

**File:** `skills/sbs-overview/SKILL.md`

**Content scope:**
- SBS purpose, scope, and audience
- Control structure explanation (statement → audit → remediation → risk)
- 4 domains with control counts and risk distribution
- Relationship to NIST, ISO 27001, SOC 2, HIPAA, GDPR, CCPA
- When to use: General SBS questions, compliance mapping, onboarding

**Validation:**
- Frontmatter: `name: sbs-overview`, description ≤ 1024 chars
- Name matches parent directory
- Description is specific (not "helps with security")

---

## Step 3: Skills — sbs-access-controls

**File:** `skills/sbs-access-controls/SKILL.md`

**Content scope:**
- All 12 SBS-ACS-* controls (001–012)
- Each control: ID, title, risk level, control statement, audit procedure, remediation
- Salesforce metadata types: Profiles, Permission Sets, PSGs, Users, Roles, etc.
- Cross-references to regulations per control

**Validation:**
- All 12 control IDs present (SBS-ACS-001 through SBS-ACS-012)
- Frontmatter valid
- File patterns mentioned: `.profile-meta.xml`, `.permissionset-meta.xml`, `.permissionsetgroup-meta.xml`

---

## Step 4: Skills — sbs-code-security

**File:** `skills/sbs-code-security/SKILL.md`

**Content scope:**
- All 4 SBS-CODE-* controls (001–004)
- Each control: ID, title, risk level, control statement, audit procedure, remediation
- Salesforce metadata types: Apex Classes, Apex Triggers, LWC, Aura, Custom Objects
- CI/CD pipeline context (branch protection, SAST, secret scanning)

**Validation:**
- All 4 control IDs present (SBS-CODE-001 through SBS-CODE-004)
- Frontmatter valid
- File patterns mentioned: `.cls`, `.trigger`, LWC directories

---

## Step 5: Skills — sbs-deployments

**File:** `skills/sbs-deployments/SKILL.md`

**Content scope:**
- All 6 SBS-DEP-* controls (001–006)
- Each control: ID, title, risk level, control statement, audit procedure, remediation
- Salesforce metadata types: All deployable metadata, CI/CD configs, Connected Apps
- Source-driven development, deployment identity, secret scanning

**Validation:**
- All 6 control IDs present (SBS-DEP-001 through SBS-DEP-006)
- Frontmatter valid
- References to SFDX project structure, `sfdx-project.json`

---

## Step 6: Skills — sbs-file-security

**File:** `skills/sbs-file-security/SKILL.md`

**Content scope:**
- All 3 SBS-FILE-* controls (001–003)
- Each control: ID, title, risk level, control statement, audit procedure, remediation
- Salesforce objects: ContentDistribution, content classification
- Public link governance

**Validation:**
- All 3 control IDs present (SBS-FILE-001 through SBS-FILE-003)
- Frontmatter valid

---

## Step 7: Extension — controls.ts

**File:** `extensions/sbs/controls.ts`

**Content scope:**
- TypeScript module exporting structured control metadata
- Every control as a typed object: `{ id, title, domain, risk, statement, filePatterns, metadataTypes, regulations }`
- Lookup functions: `getControlById()`, `getControlsByDomain()`, `getControlsByRisk()`, `getControlsByFilePattern()`
- File pattern → control mapping (e.g., `*.cls` → CODE-001, CODE-002, CODE-003, CODE-004)
- Metadata type → control mapping (e.g., `Profile` → ACS-001 through ACS-012)

**Validation:**
- TypeScript compiles: `npx tsc --noEmit extensions/sbs/controls.ts` (or syntax check)
- All 25 control IDs present
- `getControlsByFilePattern("*.cls")` returns CODE-001..004
- `getControlsByDomain("access-controls")` returns 12 controls

---

## Step 8: Extension — detector.ts

**File:** `extensions/sbs/detector.ts`

**Content scope:**
- Salesforce file pattern detection from prompt text and file paths
- Patterns: `.cls`, `.trigger`, `.component`, `.page`, `.js` (in lwc/), `.html` (in lwc/), `-meta.xml` variants
- Metadata type detection from `*-meta.xml` filenames
- SFDX project detection (`sfdx-project.json`, `force-app/`)
- Returns: `{ detectedPatterns, applicableControlIds, applicableDomains }`

**Validation:**
- TypeScript compiles
- Detection of sample paths returns correct controls

---

## Step 9: Extension — index.ts

**File:** `extensions/sbs/index.ts`

**Content scope:**
- Extension entry point: `export default function(pi: ExtensionAPI)`
- **`before_agent_start` handler**: Calls detector on user prompt + context. If Salesforce patterns found, injects one-line hint into system prompt listing applicable control IDs.
- **`sbs_check` tool**: LLM-callable tool. Parameters: `{ query, domain?, controlId?, filePattern? }`. Returns structured control metadata. LLM can use this to look up controls before/during implementation.
- **`/sbs` command**: Interactive entry point.
  - `/sbs` — list all domains with control counts and risk summary
  - `/sbs <domain>` — list controls in domain
  - `/sbs <control-id>` — show specific control details
- **`tool_result` handler**: When agent writes to a Salesforce metadata path (`.cls`, `-meta.xml`, etc.), emit a notification with applicable control IDs.

**Validation:**
- TypeScript compiles
- Extension exports a default function
- Tool schema is valid (uses `Type.Object`, `StringEnum` where needed)
- All event handlers are properly typed

---

## Step 10: Agents — sbs-auditor.md

**File:** `agents/sbs-auditor.md`

**Content scope:**
- Frontmatter: `name: sbs-auditor`, `description`, `tools: read, grep, find, ls, bash`, `model: claude-sonnet-4-5`
- System prompt: Systematic auditor that checks a Salesforce project/org against SBS controls
- Workflow: Enumerate metadata types → map to applicable controls → check each control's audit procedure → report compliant/noncompliant with evidence
- Output format: Structured report with control ID, status, evidence, remediation needed

**Validation:**
- Frontmatter has required fields (name, description, tools, model)
- Prompt references specific SBS control IDs
- Output format is actionable

---

## Step 11: Agents — sbs-implementer.md

**File:** `agents/sbs-implementer.md`

**Content scope:**
- Frontmatter: `name: sbs-implementer`, `tools: read, write, edit, bash`, `model: claude-sonnet-4-5`
- System prompt: Security-aware implementer that writes/modifies Salesforce code and config following SBS controls
- Takes audit findings or implementation requirements as input
- Always references applicable SBS controls in code comments
- Follows specific control guidance (e.g., SBS-CODE-001 → peer review setup, SBS-ACS-001 → permission set model)

**Validation:**
- Frontmatter valid
- Prompt includes concrete implementation patterns per domain

---

## Step 12: Agents — sbs-reviewer.md

**File:** `agents/sbs-reviewer.md`

**Content scope:**
- Frontmatter: `name: sbs-reviewer`, `tools: read, grep, find, ls, bash`, `model: claude-sonnet-4-5`
- System prompt: Reviews code/config changes against applicable SBS controls
- Checks: Does the change comply with applicable controls? Are there regressions?
- Output format: Pass/Fail per applicable control, with specific findings

**Validation:**
- Frontmatter valid
- Review criteria map to specific control audit procedures

---

## Step 13: Prompts — sbs-audit.md

**File:** `prompts/sbs-audit.md`

**Content scope:**
- Workflow template for `/sbs-audit`
- Chain: scout → sbs-auditor
- Instructs the LLM to use the subagent tool with a chain of scout (discover project structure) then sbs-auditor (systematic control check)

**Validation:**
- Valid markdown
- References agent names that exist in `agents/`

---

## Step 14: Prompts — sbs-fix.md

**File:** `prompts/sbs-fix.md`

**Content scope:**
- Workflow template for `/sbs-fix`
- Chain: sbs-auditor → sbs-implementer → sbs-reviewer
- Takes a control ID or domain as input
- Auditor identifies gaps → implementer remediates → reviewer validates

**Validation:**
- Valid markdown
- Chain references valid agent names

---

## Step 15: Prompts — sbs-review.md

**File:** `prompts/sbs-review.md`

**Content scope:**
- Workflow template for `/sbs-review`
- Single agent: sbs-reviewer
- Reviews recent changes (git diff or specified files) against SBS controls

**Validation:**
- Valid markdown
- References sbs-reviewer agent

---

## Step 16: Package README

**File:** `README.md`

**Content scope:**
- What the package does
- Installation: `pi install <source>`
- Usage: skills, commands, tools, agent workflows
- Control reference summary
- Contributing / updating when SBS spec changes

**Validation:**
- Covers all three layers
- Installation instructions are correct
- Examples are accurate

---

## Build Order & Dependencies

```
Step 1:  package.json          (no deps)
Step 2:  sbs-overview          (no deps)
Step 3:  sbs-access-controls   (no deps)
Step 4:  sbs-code-security     (no deps)
Step 5:  sbs-deployments       (no deps)
Step 6:  sbs-file-security     (no deps)
Step 7:  controls.ts           (needs SBS_CONTROL_INVENTORY.md for data)
Step 8:  detector.ts           (needs controls.ts types)
Step 9:  index.ts              (needs controls.ts + detector.ts)
Step 10: sbs-auditor.md        (needs skill content for reference)
Step 11: sbs-implementer.md    (needs skill content for reference)
Step 12: sbs-reviewer.md       (needs skill content for reference)
Step 13: sbs-audit.md          (needs agent names)
Step 14: sbs-fix.md            (needs agent names)
Step 15: sbs-review.md         (needs agent names)
Step 16: README.md             (needs everything)
```

Steps 2–6 are independent (skills can be built in parallel).
Steps 10–12 are independent (agents can be built in parallel).
Steps 13–15 are independent (prompts can be built in parallel).
