Perform a comprehensive SBS security audit on this Salesforce project.

**Task:** {{task:Audit all 25 SBS controls against the current project}}

Use subagent chaining to complete the audit:

1. **Scout phase** — Use a subagent with `read, find, ls, bash` tools to discover the project structure:
   - Locate `sfdx-project.json`, `force-app/`, metadata directories, CI/CD config
   - List all Salesforce metadata types present (Profiles, Permission Sets, Apex classes, LWC, etc.)
   - Identify CI/CD pipelines, branch protection, secret scanning configuration
   - Output a project structure summary for the auditor

2. **Audit phase** — Use the `sbs-auditor` agent to perform the systematic audit:
   - Pass the project structure summary from step 1 as context
   - The auditor will evaluate all 25 SBS controls across 4 domains:
     - Access Controls (SBS-ACS-001 through SBS-ACS-012)
     - Code Security (SBS-CODE-001 through SBS-CODE-004)
     - Deployments (SBS-DEP-001 through SBS-DEP-006)
     - File Security (SBS-FILE-001 through SBS-FILE-003)
   - Each control will be marked COMPLIANT, NONCOMPLIANT, or NOT ASSESSABLE with evidence

The final output should be the full SBS Audit Report with a summary table and prioritized recommendations.
