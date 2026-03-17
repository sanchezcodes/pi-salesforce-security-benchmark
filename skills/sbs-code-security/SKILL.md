---
name: sbs-code-security
description: "Security Benchmark for Salesforce (SBS) code security controls. 4 controls covering mandatory peer review, pre-merge static analysis, persistent Apex logging, and sensitive data prevention in logs. Use when writing or reviewing Apex classes, Apex triggers, Lightning Web Components, or configuring CI/CD pipelines for Salesforce."
---

# SBS Code Security Controls

This skill covers secure development practices for Salesforce code — Apex, Lightning Web Components, and Aura components. It enforces quality gates, peer review, automated security testing, persistent logging, and sensitive-data protection within the development lifecycle.

**Applicable file patterns:**
- `*.cls` — Apex classes
- `*.trigger` — Apex triggers
- `lwc/**/*.js` — Lightning Web Component JavaScript
- `lwc/**/*.html` — Lightning Web Component markup
- `aura/**/*.cmp` — Aura components

---

## SBS-CODE-001: Mandatory Peer Review for Salesforce Code Changes

**Risk Level:** Moderate

**Control Statement:** All Salesforce code changes must undergo peer review and receive approval before merging into any production-bound branch.

Organizations must configure their source control system to require at least one peer reviewer to approve all changes to Apex, Lightning Web Components, and other programmatic assets before those changes are merged into branches used for production deployments.

### Audit Procedure

1. Inspect source control settings to confirm merge rules require peer review on production-bound branches.
2. Review merge history or representative pull requests to verify peer approvals were recorded.
3. Confirm that peer review processes include security checks such as verifying logging statements do not expose sensitive data.
4. Flag any repositories or branches that allow merging without peer approval.

### Remediation

1. Update branch protection rules to require peer review before merge.
2. Train developers on the peer review workflow, including security checks such as identifying sensitive data in logging statements.
3. Block direct commits to production-bound branches.

### CI/CD Context

- Configure branch protection rules (GitHub, GitLab, Bitbucket) on `main`, `master`, or any production-bound branch to require at least one approving review.
- Disable force-push and direct commits to protected branches.
- Ensure CI status checks pass before the merge button is enabled.

**Default Value:** Salesforce does not enforce code review requirements; these controls depend on the organization's source control configuration.

---

## SBS-CODE-002: Pre-Merge Static Code Analysis for Apex and LWC

**Risk Level:** Moderate

**Control Statement:** Static code analysis with security checks for Apex and Lightning Web Components must execute successfully before any code change is merged into a production-bound branch.

Organizations must implement static application security testing (SAST) in their CI/CD pipeline and configure it to run prior to merge, enforcing security rulesets that detect vulnerabilities specific to Apex and LWC (e.g., SOQL injection, insecure data exposure, improper access control).

### Audit Procedure

1. Inspect CI/CD pipeline configuration to confirm a static code analysis step runs before merges.
2. Verify the SAST tool includes security rulesets for Apex and Lightning Web Components.
3. Review pipeline logs from representative merges to ensure scans executed and passed.
4. Flag pipelines or branches missing enforced pre-merge scanning.

### Remediation

1. Integrate static code analysis into the CI/CD pipeline for all production-bound branches.
2. Enable Apex and LWC security rulesets within the scanning tool.
3. Configure pipelines to block merges when static analysis fails.

### CI/CD Context

- Add a SAST step (e.g., Salesforce Code Analyzer / PMD / ESLint with security plugins) as a required status check on pull requests.
- Security rulesets must cover at minimum: SOQL injection, CRUD/FLS enforcement, XSS in LWC, open redirect, and hardcoded credentials.
- The pipeline must fail (non-zero exit) when security violations are detected, and this status check must be required for merge.

**Default Value:** Salesforce does not provide or enforce static code analysis; organizations must implement external SAST tooling.

---

## SBS-CODE-003: Implement Persistent Apex Application Logging

**Risk Level:** High

**Control Statement:** Organizations must implement an Apex-based logging framework that writes application log events to durable Salesforce storage and must not rely on transient Salesforce debug logs for operational or security investigations.

The organization must deploy a dedicated Apex logging framework — custom-built, open source, or vendor-provided — that programmatically captures application-level log events and stores them in durable Salesforce data structures (such as custom objects) to ensure logs persist beyond the limitations of Salesforce debug logs.

### Why This Matters

Salesforce debug logs are transient, size-limited, and automatically purged — making them unsuitable for forensic analysis or security investigations. Without persistent application logging, organizations cannot reliably reconstruct access patterns, detect anomalous behavior, or investigate security incidents.

### Audit Procedure

1. Review the Salesforce org for the presence of an Apex logging framework implemented as one or more Apex classes dedicated to log generation and persistence.
2. Verify that the framework writes logs to durable storage, such as a custom object purpose-built for log retention.
3. Confirm that operational and security investigations rely on this persistent logging mechanism rather than Salesforce debug logs.
4. Inspect recent log records to ensure the framework is actively capturing runtime events.

### Remediation

1. Implement or install an Apex logging framework designed for persistent log storage.
2. Create or configure a custom object (or equivalent durable storage) to store log records.
3. Update Apex code to route log events through the framework.
4. Train engineering and security teams to use persistent logs instead of debug logs for investigations.

### Applicable Patterns for Review

When reviewing `*.cls` and `*.trigger` files, check for:
- Presence of a logging framework (custom or third-party such as Nebula Logger).
- Log calls that persist to custom objects rather than relying solely on `System.debug()`.
- Consistent use of the logging framework across all Apex entry points (triggers, batch jobs, REST endpoints, invocable actions).

**Default Value:** Salesforce does not provide persistent application-level logging by default; debug logs are transient, size-limited, and automatically purged.

---

## SBS-CODE-004: Prevent Sensitive Data in Application Logs

**Risk Level:** Critical

**Control Statement:** Custom application logging frameworks and Salesforce system logging mechanisms must not capture, store, or transmit credentials, authentication tokens, personally identifiable information (PII), regulated data, or other sensitive values in log messages or structured log fields.

This applies to:
- Custom logging frameworks writing to custom objects or external systems
- `System.debug()` statements that write to Salesforce debug logs
- Error handling routines that log exception details

### Prohibited Data in Logs

Logging implementations must prevent the capture of:
- **Authentication credentials:** passwords, API keys, OAuth tokens, session identifiers, client secrets
- **PII and regulated data:** SSNs, financial account numbers, credit card details, protected health information (PHI)
- **Full SOQL query results** containing sensitive fields (log record IDs or counts instead)
- **Request/response payloads** containing authentication headers or authorization tokens
- **Unmasked field values** from high-sensitivity objects (mask or tokenize before logging)

### Audit Procedure

1. Sample representative Apex classes (`*.cls`) from high-risk areas (customer-facing functionality, payment processing, authentication flows) to identify logging statements in both custom frameworks and `System.debug()` calls.
2. Examine log message construction to detect patterns that may capture sensitive data listed above.
3. Query recent log records stored in custom objects and review Salesforce debug logs for sensitive data:
   - Search for patterns matching SSNs, credit card numbers, email addresses, phone numbers.
   - Identify authentication tokens, session IDs, or API keys in log messages.
   - Flag any log records containing regulated data or PII.
4. Verify that mechanisms exist to prevent sensitive data from being logged (sanitization functions, code review checks, or automated validation).

### Remediation

1. **Implement sanitization utilities.** Create a `SecureLogger` class (or equivalent) that redacts sensitive fields before persisting:

```apex
public class SecureLogger {
    public static void logInfo(String message, Map<String, Object> context) {
        Map<String, Object> sanitized = sanitizeContext(context);
        Logger.info(message, sanitized);
    }

    private static Map<String, Object> sanitizeContext(Map<String, Object> ctx) {
        Map<String, Object> result = new Map<String, Object>();
        for (String key : ctx.keySet()) {
            if (key.containsIgnoreCase('password') ||
                key.containsIgnoreCase('token') ||
                key.containsIgnoreCase('ssn')) {
                result.put(key, '***REDACTED***');
            } else if (ctx.get(key) instanceof SObject) {
                result.put(key, ((SObject)ctx.get(key)).Id);
            } else {
                result.put(key, ctx.get(key));
            }
        }
        return result;
    }
}
```

2. **Audit and purge** existing log records in custom objects and Salesforce debug logs containing sensitive data.

3. **Fix logging calls** to avoid capturing sensitive data:

```apex
// BAD — logs full account record including SSN field
System.debug('Processing: ' + acc);
Logger.info('Processing account', new Map<String, Object>{'account' => acc});

// GOOD — logs only record ID
System.debug('Processing account: ' + acc.Id);
SecureLogger.logInfo('Processing account', new Map<String, Object>{
    'accountId' => acc.Id,
    'recordCount' => 1
});
```

4. **Implement compensating controls:**
   - Automated tests that validate log outputs for sensitive data patterns.
   - Code review checklists that check for sensitive data exposure in logging calls.
   - Static analysis rules that detect common sensitive data exposure patterns in `System.debug()` and custom logger invocations.

### Applicable Patterns for Review

When reviewing `*.cls`, `*.trigger`, `lwc/**/*.js`, `lwc/**/*.html`, and `aura/**/*.cmp` files, flag:
- `System.debug()` calls that interpolate full SObject records or sensitive fields.
- Custom logger calls passing unsanitized maps, SObjects, or request/response bodies.
- `console.log()` or `console.error()` in LWC/Aura JS that output user data, tokens, or API responses.
- Exception handlers that log `e.getMessage()` where the message may contain user-supplied or sensitive input.
- Hardcoded sensitive field API names (`SSN__c`, `Credit_Card__c`, etc.) appearing in log string construction.

### CI/CD Context

- Add static analysis rules or custom PMD/ESLint rules to detect `System.debug()` / `console.log()` calls that reference sensitive field names or full SObject records.
- Require SBS-CODE-001 peer review to explicitly verify no sensitive data appears in new or modified logging statements.

**Default Value:** Salesforce does not prevent or sanitize sensitive data in custom application logs or system debug logs; developers bear full responsibility for ensuring log content complies with data protection requirements.

---

## Quick Reference

| Control | Title | Risk | Key Check |
|---|---|---|---|
| SBS-CODE-001 | Mandatory Peer Review | Moderate | Branch protection requires approving review |
| SBS-CODE-002 | Pre-Merge Static Analysis | Moderate | SAST runs as required CI status check |
| SBS-CODE-003 | Persistent Apex Logging | High | Logging framework writes to durable storage, not `System.debug()` only |
| SBS-CODE-004 | Sensitive Data in Logs | Critical | No PII, credentials, or regulated data in any log output |

**Compliance mappings:** ISO 27001 (all controls), GDPR (SBS-CODE-003, SBS-CODE-004), HIPAA (SBS-CODE-004), CCPA/CPRA (SBS-CODE-004).
