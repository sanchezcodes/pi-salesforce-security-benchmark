Identify and remediate SBS compliance gaps in this Salesforce project.

**Task:** {{task:Find all SBS control violations and fix them}}

Use a three-stage subagent chain to audit, remediate, and validate:

1. **Audit phase** — Use the `sbs-auditor` agent to identify compliance gaps:
   - Scan the project for all 25 SBS controls
   - Produce a full audit report identifying NONCOMPLIANT controls
   - Prioritize findings by risk level (Critical > High > Moderate)

2. **Remediation phase** — Use the `sbs-implementer` agent to fix identified gaps:
   - Pass the NONCOMPLIANT findings from the audit as input
   - The implementer will write or modify code and configuration to satisfy each control
   - All changes will include SBS control ID references in comments
   - Focus on controls that can be addressed from source (code, config, CI/CD, metadata)

3. **Validation phase** — Use the `sbs-reviewer` agent to verify the fixes:
   - Review all files changed by the implementer
   - Confirm each previously NONCOMPLIANT control is now satisfied
   - Identify any regressions or remaining gaps
   - Produce a final review report with PASS/FAIL status per control

The final output should include:
- Summary of what was found, what was fixed, and what was validated
- List of controls that remain NOT ASSESSABLE (require org-level access)
- Any controls that could not be fully remediated from source alone
