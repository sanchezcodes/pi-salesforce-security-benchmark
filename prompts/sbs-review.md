Review Salesforce code and configuration changes for SBS compliance.

**Task:** {{task:Review recent changes against applicable SBS controls}}

Use the `sbs-reviewer` agent to evaluate the changes:

1. **Identify scope** — Determine what to review:
   - If a specific file or path is given in the task, review that
   - Otherwise, review uncommitted changes (`git diff`) and the most recent commit
   - List all changed files with their modification type (added, modified, deleted)

2. **Map and evaluate controls** — The reviewer will:
   - Map each changed file to its applicable SBS controls based on file type
   - Evaluate each applicable control as PASS, FAIL, or WARN
   - Perform additional security checks (CRUD/FLS, SOQL injection, hardcoded credentials)
   - Flag any Critical-risk control failures as blocking

3. **Produce review report** — Output includes:
   - Files reviewed with line change counts
   - Per-control PASS/FAIL/WARN findings with evidence and line numbers
   - Overall PASS or FAIL determination
   - Required actions for any FAIL findings, prioritized by risk level

A FAIL on any Critical-risk control (SBS-ACS-003, SBS-ACS-006, SBS-CODE-004, SBS-DEP-005) should be treated as blocking — the changes should not be merged until resolved.
