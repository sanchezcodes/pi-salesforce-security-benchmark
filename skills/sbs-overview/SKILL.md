---
name: sbs-overview
description: >
  Provides general orientation about the Security Benchmark for Salesforce (SBS).
  Use this skill when a user asks what SBS is, how it is structured, which domains
  and controls it covers, what risk levels exist, how it maps to compliance
  frameworks (ISO 27001, SOC 2, NIST, HIPAA, GDPR, CCPA/CPRA), or how SBS
  relates to other security standards. Also use when the user needs a high-level
  summary before diving into a specific domain skill.
---

# Security Benchmark for Salesforce (SBS) — Overview

## What SBS Is

An **independent, prescriptive, auditable security benchmark** for Salesforce environments. It defines the conditions required for secure Salesforce operation and addresses the gap between what Salesforce makes possible and what organizations consistently implement.

SBS is **not** a replacement for NIST, ISO 27001, or other general frameworks. It is **complementary** — providing platform-specific, actionable controls that map back to those frameworks.

## Who It's For

- **CISOs** — governance visibility across Salesforce orgs
- **Security architects** — concrete control requirements
- **Auditors** — audit procedures with pass/fail criteria
- **System integrators** — secure implementation guidance
- **Security tooling** — machine-readable control definitions for automation

## Control Structure

Every control contains:

| Field             | Description                                      |
|-------------------|--------------------------------------------------|
| **Statement**     | What must be true (the requirement)              |
| **Description**   | Context and rationale                            |
| **Risk Level**    | `Critical` · `High` · `Moderate`                 |
| **Audit Procedure** | Steps to verify compliance                     |
| **Remediation**   | How to fix non-compliance                        |
| **Default Value** | Salesforce out-of-box state for this setting     |

## Domains & Controls (25 total)

### 1. Access Controls — `SBS-ACS-001` to `SBS-ACS-012` (12 controls)
Permission sets, profiles, RBAC, non-human identities (NHIs), access reviews.
→ Skill: **sbs-access-controls**

### 2. Code Security — `SBS-CODE-001` to `SBS-CODE-004` (4 controls)
Peer review, SAST, logging standards, sensitive data handling in code.
→ Skill: **sbs-code-security**

### 3. Deployments — `SBS-DEP-001` to `SBS-DEP-006` (6 controls)
Deployment identity, metadata protection, source-driven development, secrets management.
→ Skill: **sbs-deployments**

### 4. File Security — `SBS-FILE-001` to `SBS-FILE-003` (3 controls)
Public link governance for files and attachments.
→ Skill: **sbs-file-security**

## Risk Distribution

| Risk Level | Count | Percentage |
|------------|-------|------------|
| Critical   | 4     | 16%        |
| High       | 15    | 60%        |
| Moderate   | 6     | 24%        |

## Regulation & Framework Coverage

SBS controls map to:

- **ISO 27001** — Annex A control mapping
- **SOC 2** — Trust Services Criteria (CC6, CC7, CC8)
- **NIST 800-53** — AC, CM, SA, SI families
- **HIPAA** — Technical safeguards
- **GDPR** — Article 32 (security of processing)
- **CCPA / CPRA** — Reasonable security measures

## Cross-References

For domain-specific controls, audit procedures, and remediation steps, load the relevant skill:

- `sbs-access-controls` — Access control domain (SBS-ACS-*)
- `sbs-code-security` — Code security domain (SBS-CODE-*)
- `sbs-deployments` — Deployment domain (SBS-DEP-*)
- `sbs-file-security` — File security domain (SBS-FILE-*)
