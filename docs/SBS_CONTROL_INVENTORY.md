# SBS Control Inventory

> **Security Benchmark for Salesforce — Structured Control Analysis**
>
> Extracted from SBS specification v0.x (draft phase). This inventory covers all controls
> found in the published specification files for Access Controls, Code Security, Deployments,
> and File Security domains.
>
> **Note:** The SBS regulations index references up to 50 controls (ISO 27001 view).
> Additional domains (e.g., Authentication, Data Security, Integration) may exist beyond the
> files analyzed here. This inventory covers the **25 controls** present in the provided files.

---

## Summary

| Domain | Controls | Critical | High | Moderate |
|---|---|---|---|---|
| Access Controls (ACS) | 12 | 2 | 8 | 2 |
| Code Security (CODE) | 4 | 1 | 1 | 2 |
| Deployments (DEP) | 6 | 1 | 5 | 0 |
| File Security (FILE) | 3 | 0 | 1 | 2 |
| **Total** | **25** | **4** | **15** | **6** |

---

## Regulation Tag Distribution

| Regulation | Controls Tagged |
|---|---|
| HIPAA | SBS-ACS-003, SBS-ACS-004, SBS-ACS-006, SBS-ACS-010, SBS-ACS-011, SBS-CODE-004, SBS-FILE-002 |
| GDPR | SBS-ACS-003, SBS-ACS-004, SBS-ACS-006, SBS-ACS-010, SBS-ACS-011, SBS-CODE-003, SBS-CODE-004, SBS-FILE-001, SBS-FILE-002, SBS-FILE-003 |
| NIST | SBS-ACS-001, SBS-ACS-002, SBS-ACS-003, SBS-ACS-004, SBS-ACS-005, SBS-ACS-006, SBS-ACS-007, SBS-ACS-008, SBS-ACS-009, SBS-ACS-010, SBS-ACS-012, SBS-DEP-001, SBS-DEP-002, SBS-DEP-006, SBS-FILE-002 |
| CCPA/CPRA | SBS-ACS-003, SBS-ACS-004, SBS-ACS-006, SBS-CODE-004, SBS-FILE-001, SBS-FILE-002, SBS-FILE-003 |
| SOC 2 | SBS-ACS-001, SBS-ACS-002, SBS-ACS-003, SBS-ACS-004, SBS-ACS-005, SBS-ACS-006, SBS-ACS-007, SBS-ACS-008, SBS-ACS-009, SBS-ACS-010, SBS-ACS-011, SBS-ACS-012, SBS-DEP-001, SBS-DEP-002, SBS-DEP-003, SBS-DEP-006, SBS-FILE-002 |
| ISO 27001 | All 25 controls |

---

## Domain 1: Access Controls (ACS)

| Control ID | Title | Risk | Salesforce Metadata / File Types | Audit Summary | Remediation Summary |
|---|---|---|---|---|---|
| SBS-ACS-001 | Enforce a Documented Permission Set Model | **High** | Profiles, Permission Sets, Permission Set Groups | Obtain documented model from system of record; enumerate all Profiles/PermSets/PSGs via Metadata API; compare each against model; verify continuous enforcement automation. | Update/deprecate noncompliant constructs; migrate users off legacy authorizations; implement automated enforcement; keep documentation current. |
| SBS-ACS-002 | Documented Justification for All `API-Enabled` Authorizations | **High** | Profiles, Permission Sets, Permission Set Groups (ApiEnabled permission) | Enumerate all constructs granting `API Enabled` via Setup/Metadata API/Tooling API; compare against system of record; verify each has business justification. | Remove `API Enabled` from unjustified constructs; document rationale for legitimate ones; reconcile system of record. |
| SBS-ACS-003 | Documented Justification for `Approve Uninstalled Connected Apps` Permission | **Critical** | Profiles, Permission Sets, Permission Set Groups | Enumerate constructs with the permission; verify documented justification exists; confirm not assigned to end-users; verify limited to admin/dev roles. | Remove from unjustified/end-user assignments; document rationale for legitimate use; install and allowlist required connected apps instead. |
| SBS-ACS-004 | Documented Justification for All Super Admin–Equivalent Users | **High** | User records, Profiles, Permission Sets, Permission Set Groups (ViewAllData + ModifyAllData + ManageUsers) | Enumerate users with simultaneous ViewAllData, ModifyAllData, ManageUsers; compare against system of record; verify documented justification for each. | Remove excess permissions from unjustified users; document rationale for legitimate super admins; reassess against least privilege. |
| SBS-ACS-005 | Only Use Custom Profiles for Active Users | **High** | Profiles (Profile metadata — `IsCustom` flag), User records (`IsActive` flag) | Enumerate all active human users; flag any assigned to standard profiles (`IsCustom = false`). | Create custom profiles mirroring each standard profile in use; assign users to custom profiles following least privilege. |
| SBS-ACS-006 | Documented Justification for `Use Any API Client` Permission | **Critical** | Profiles, Permission Sets, Permission Set Groups | Enumerate constructs granting `Use Any API Client`; verify documented justification; confirm not assigned to end-users. | Remove from unjustified/end-user assignments; vet and allowlist connected apps; document rationale for legitimate use. |
| SBS-ACS-007 | Maintain Inventory of Non-Human Identities | **High** | User records (integration/bot/API/automation users), Profiles | Query all active users matching NHI patterns (username, profile, API Only permission); compare against maintained inventory; verify inventory completeness and quarterly review. | Query and document all NHI accounts with name, type, purpose, owner, creation date; establish update process; implement quarterly reviews. |
| SBS-ACS-008 | Restrict Broad Privileges for Non-Human Identities | **High** | User records (NHIs), Profiles, Permission Sets, Permission Set Groups | Using NHI inventory, query assigned permissions; flag NHIs with ViewAllData, ModifyAllData, ManageUsers, AuthorApex, CustomizeApplication; verify documented justification. | Evaluate necessity of broad privileges; replace with granular permissions where possible; document justifications; implement formal approval process and annual reviews. |
| SBS-ACS-009 | Implement Compensating Controls for Privileged Non-Human Identities | **Moderate** | Profiles (IP restrictions), Connected Apps (OAuth scopes), Event Monitoring logs | For privileged NHIs, verify ≥2 compensating controls: IP restrictions, OAuth scope limits, activity monitoring, credential rotation (≤90 days), dedicated identity per integration. | Implement IP restrictions, configure minimal OAuth scopes with token expiry, set up automated monitoring, establish 90-day credential rotation, use dedicated identities per integration. |
| SBS-ACS-010 | Enforce Periodic Access Review and Recertification | **Moderate** | User records, Profiles, Permission Sets, Permission Set Groups, Roles, Public Groups, Queues, Territories | Verify documented access review policy; assess recency/regularity of execution; sample review documentation for stakeholder sign-off; verify findings tracked and remediated within SLA. | Establish formal review policy (min annual); conduct initial comprehensive review; implement system of record for tracking; schedule recurring reviews with quarterly cadence for sensitive roles. |
| SBS-ACS-011 | Enforce Governance of Access and Authorization Changes | **High** | User records, Profiles, Permission Sets, Permission Set Groups, Roles, Sharing Rules, Restriction Rules, Public Groups, Queues, Territories | Retrieve documented governance process; sample access changes for approval records, business justification, and audit traceability; flag undocumented changes. | Establish formal governance process requiring approval and justification; ensure all changes recorded in auditable system of record. |
| SBS-ACS-012 | Classify Users for Login Hours Restrictions | **Moderate** | Profiles (Login Hours settings) | Verify documented classification of users requiring login hours restrictions or monitoring; verify implementation for classified users; if zero classified, verify documented justification. | Perform risk-based user classification; configure login hours on profiles or implement off-hours monitoring with alerting; document in system of record. |

---

## Domain 2: Code Security (CODE)

| Control ID | Title | Risk | Salesforce Metadata / File Types | Audit Summary | Remediation Summary |
|---|---|---|---|---|---|
| SBS-CODE-001 | Mandatory Peer Review for Salesforce Code Changes | **Moderate** | Apex Classes, Apex Triggers, Lightning Web Components (LWC), Aura Components (source control branches) | Inspect source control branch protection rules; review merge history for recorded peer approvals; confirm security checks (e.g., sensitive data in logs); flag repos allowing unapproved merges. | Update branch protection to require peer review; train developers on security-aware review workflow; block direct commits to production branches. |
| SBS-CODE-002 | Pre-Merge Static Code Analysis for Apex and LWC | **Moderate** | Apex Classes, Apex Triggers, Lightning Web Components (CI/CD pipeline config) | Inspect CI/CD pipeline for SAST step before merge; verify security rulesets cover Apex & LWC; review pipeline logs for scan execution; flag pipelines missing enforcement. | Integrate SAST into CI/CD for production branches; enable Apex/LWC security rulesets; configure merge blocking on scan failure. |
| SBS-CODE-003 | Implement Persistent Apex Application Logging | **High** | Apex Classes (logging framework), Custom Objects (log storage), Custom Metadata Types | Review org for dedicated Apex logging framework classes; verify logs written to durable storage (custom objects); confirm investigations use persistent logs, not debug logs; inspect recent log records. | Implement/install Apex logging framework; create custom object for log storage; update Apex code to route events through framework; train teams to use persistent logs. |
| SBS-CODE-004 | Prevent Sensitive Data in Application Logs | **Critical** | Apex Classes (logging calls, `System.debug()` statements), Custom Objects (log records), Debug Logs | Sample Apex classes in high-risk areas for logging statements; examine log construction for sensitive data patterns (PII, tokens, credentials); query log records and debug logs for actual sensitive content; verify sanitization mechanisms exist. | Implement log sanitization functions (redact passwords, tokens, PII); audit and purge existing logs containing sensitive data; update logging calls to use IDs/counts instead of full records; add automated testing and code review checks for log security. |

---

## Domain 3: Deployments (DEP)

| Control ID | Title | Risk | Salesforce Metadata / File Types | Audit Summary | Remediation Summary |
|---|---|---|---|---|---|
| SBS-DEP-001 | Require a Designated Deployment Identity for Metadata Changes | **High** | All deployable metadata (via Metadata API), User records (deployment identity), CI/CD pipeline configs | Identify designated deployment user; enumerate recent metadata deployments via Deployment Status/audit logs; verify all performed by deployment identity; flag human-user deployments. | Create dedicated deployment identity; reconfigure CI/CD to authenticate exclusively via it; revoke deployment permissions from human users; re-deploy metadata to restore provenance. |
| SBS-DEP-002 | Establish High-Risk Metadata Types Prohibited from Direct Production Editing | **High** | Apex Classes, Apex Triggers, LWC, Aura Components, Profiles, Permission Sets, Remote Site Settings, Named Credentials, Session/Auth settings | Obtain documented list of prohibited metadata types; confirm SBS baseline types included; review exceptions; verify only deployment identity has modify permissions on listed types. | Adopt SBS baseline list; add org-specific items; remove modify permissions for listed types from human users; deploy all changes via deployment identity. |
| SBS-DEP-003 | Monitor and Alert on Unauthorized High-Risk Metadata Modifications | **High** | Setup Audit Trail, all high-risk metadata types per SBS-DEP-002 | Interview system owners on monitoring method; review documentation of monitoring process; verify coverage of all SBS-DEP-002 types with defined review interval; examine historical monitoring records. | Implement monitoring mechanism (Setup Audit Trail review, API/CLI queries, vendor tools); cover all high-risk metadata types; define review interval and assign ownership; document approach and maintain review records. |
| SBS-DEP-004 | Establish Source-Driven Development Process | **High** | All programmatically deployable Salesforce metadata, Version Control repositories (SFDX projects) | Identify standard deployment process and deployment identity; review recent production changes for version control origin; verify manual changes limited to non-programmable metadata types; flag avoidable manual changes. | Establish centralized version control repo for metadata; implement automated deployment pipeline from VCS; restrict direct production changes for supported metadata; document required manual exceptions. |
| SBS-DEP-005 | Implement Secret Scanning for Salesforce Source Repositories | **Critical** | Source control repositories (SFDX projects, deployment scripts, CI/CD configs), OAuth tokens, refresh tokens, consumer secrets, session IDs | Identify all repos with Salesforce metadata/scripts; verify automated secret scanning enabled; confirm Salesforce-specific patterns included; review scanning logs; verify detected secrets block merges. | Enable secret scanning on all Salesforce repos; configure Salesforce-specific credential patterns; implement pre-commit hooks; rotate any previously committed credentials; migrate to secure secrets management; establish rotation schedule. |
| SBS-DEP-006 | Configure Salesforce CLI Connected App with Token Expiration Policies | **High** | Connected Apps (OAuth Policies), Salesforce CLI token files | In Setup, navigate to Connected Apps OAuth Usage; identify CLI-related Connected App(s); verify refresh token ≤90 days and access token timeout ≤15 minutes; flag non-expiring tokens. | Configure or create CLI Connected App with refresh token expiry ≤90 days and session timeout ≤15 minutes; distribute Consumer Key to developers; implement compensating controls (disk encryption, remote wipe, token cleanup in offboarding). |

---

## Domain 4: File Security (FILE)

| Control ID | Title | Risk | Salesforce Metadata / File Types | Audit Summary | Remediation Summary |
|---|---|---|---|---|---|
| SBS-FILE-001 | Require Expiry Dates on Public Content Links | **Moderate** | `ContentDistribution` records (via SOAP/REST API or Apex) | Enumerate all `ContentDistribution` records; identify records where `PreferencesExpires = false`; flag links without expiry dates. | Set appropriate expiry dates on flagged `ContentDistribution` records based on content classification; establish policy defining max link lifetimes by data classification. |
| SBS-FILE-002 | Require Passwords on Public Content Links for Sensitive Content | **High** | `ContentDistribution` records (Password field), content classification metadata | Enumerate all `ContentDistribution` records; identify where `Password` is null; cross-reference with content classification; flag sensitive content without password protection. | Set passwords on ContentDistribution records for sensitive content; communicate passwords via separate secure channel; establish policy requiring password protection for sensitive public links. |
| SBS-FILE-003 | Periodic Review and Cleanup of Public Content Links | **Moderate** | `ContentDistribution` records | Verify documented review process exists with defined cadence; obtain evidence of recent execution; verify all active records included; confirm issues tracked through remediation/deletion. | Establish documented periodic review process (quarterly recommended); create scanning mechanism for active links; define review criteria (missing expiry, missing passwords, stale links); assign ownership and maintain records. |

---

## Risk Classification Reference

| Level | Meaning | Threshold |
|---|---|---|
| **Critical** | Establishes a security boundary; failure directly enables unauthorized access without requiring other controls to also fail. | 4 controls |
| **High** | Provides visibility or response capability; failure prevents detection, investigation, or response to security events. | 15 controls |
| **Moderate** | Provides assurance / defense-in-depth; other controls still provide coverage if this control fails. | 6 controls |

---

## Metadata Type Cross-Reference

The following Salesforce metadata types and objects are referenced across SBS controls:

| Metadata Type / Object | Referenced By |
|---|---|
| Profiles | ACS-001, ACS-002, ACS-003, ACS-004, ACS-005, ACS-006, ACS-007, ACS-008, ACS-009, ACS-012, DEP-002 |
| Permission Sets | ACS-001, ACS-002, ACS-003, ACS-004, ACS-006, ACS-008, ACS-009, ACS-010, ACS-011, DEP-002 |
| Permission Set Groups | ACS-001, ACS-002, ACS-003, ACS-004, ACS-006, ACS-008, ACS-010, ACS-011 |
| User records | ACS-004, ACS-005, ACS-007, ACS-008, ACS-010, ACS-011, DEP-001 |
| Apex Classes | CODE-001, CODE-002, CODE-003, CODE-004, DEP-002 |
| Apex Triggers | CODE-001, CODE-002, DEP-002 |
| Lightning Web Components (LWC) | CODE-001, CODE-002, DEP-002 |
| Aura Components | CODE-001, DEP-002 |
| Custom Objects (log storage) | CODE-003, CODE-004 |
| Connected Apps | ACS-009, DEP-006 |
| ContentDistribution | FILE-001, FILE-002, FILE-003 |
| Remote Site Settings | DEP-002 |
| Named Credentials | DEP-002 |
| Session / Auth Settings | DEP-002 |
| Roles / Role Hierarchy | ACS-010, ACS-011 |
| Sharing Rules / Restriction Rules | ACS-011 |
| Public Groups / Queues / Territories | ACS-010, ACS-011 |
| Setup Audit Trail | DEP-003 |
| Source Control / CI/CD Config | CODE-001, CODE-002, DEP-004, DEP-005 |

---

*Generated from SBS specification files on 2026-03-17.*
