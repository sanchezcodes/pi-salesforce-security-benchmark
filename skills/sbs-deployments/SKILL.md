---
name: sbs-deployments
description: Security Benchmark for Salesforce (SBS) deployment controls. 6 controls covering deployment identity, high-risk metadata protection, unauthorized change monitoring, source-driven development, secret scanning, and CLI token policies. Use when configuring CI/CD pipelines, deploying Salesforce metadata, managing deployment users, or working with SFDX projects.
---

# SBS Deployments

This skill covers the **Deployments** section of the Security Benchmark for Salesforce (SBS). It defines controls related to metadata deployment practices, configuration change governance, and production environment integrity. These controls ensure organizations establish clear provenance for production changes, restrict high-risk metadata modifications to controlled deployment processes, and maintain continuous monitoring to detect unauthorized configuration drift.

---

## SBS-DEP-001: Require a Designated Deployment Identity for Metadata Changes

**Risk Level:** High

**Control Statement:** Salesforce production orgs must designate a single deployment identity that is exclusively used for all metadata deployments and high-risk configuration changes performed through automated or scripted release processes.

A dedicated deployment identity (integration user) must be created and used as the sole account for CI/CD, metadata deployments, and automated release tooling. No human user—regardless of administrative privilege—may deploy metadata or execute automated deployment operations using their personal account.

### Audit Procedure

1. Identify the user account designated as the deployment identity.
2. Enumerate all recent metadata deployments using tooling such as Deployment Status, Metadata API logs, or audit logs.
3. Verify that all deployments were executed by the designated deployment identity.
4. Flag any metadata deployment performed by a human user or non-deployment identity.

### Remediation

1. Create or identify a dedicated deployment identity.
2. Reconfigure CI/CD pipelines, release management tooling, and automated deployment scripts to authenticate exclusively with the deployment identity.
3. Revoke deployment permissions from all human users.
4. Re-deploy any metadata last deployed by a human user to restore provenance.

### Applicable Metadata Types and File Patterns

- All deployable metadata types (any content under `force-app/`, `src/`, or package directories)
- CI/CD pipeline configurations (`.github/workflows/*.yml`, `.gitlab-ci.yml`, `Jenkinsfile`, `bitbucket-pipelines.yml`)
- SFDX auth files and deployment scripts (`sfdx-project.json`, `*.sh`, `*.ps1`)

---

## SBS-DEP-002: Establish and Maintain a List of High-Risk Metadata Types Prohibited from Direct Production Editing

**Risk Level:** High

**Control Statement:** Salesforce production orgs must maintain an explicit list of high-risk metadata types that must never be edited directly in production by human users, defaulting at minimum to the SBS baseline list while allowing organizations to extend or refine it as needed.

### SBS Baseline List of Prohibited Direct-in-Production Metadata Types

The following metadata types **must** be included at minimum:

| Category | Metadata Types | File Patterns |
|---|---|---|
| Apex Code | Apex Classes, Apex Triggers | `classes/*.cls`, `triggers/*.trigger` |
| UI Components | Lightning Web Components (LWC), Aura Components | `lwc/**/*`, `aura/**/*` |
| Permissions | Profiles, Permission Set definitions | `profiles/*.profile-meta.xml`, `permissionsets/*.permissionset-meta.xml` |
| Outbound Connectivity | Remote Site Settings, Named Credentials | `remoteSiteSettings/*.remoteSite-meta.xml`, `namedCredentials/*.namedCredential-meta.xml` |
| Authentication & Session Security | Core authentication settings, session security settings | `settings/Security.settings-meta.xml`, `settings/Session.settings-meta.xml` |

Organizations **may** extend this list with additional metadata types but must not remove baseline items without a documented and formally approved exception.

### Audit Procedure

1. Obtain the organization's documented list of high-risk metadata types prohibited from direct production editing.
2. Confirm that the list, at minimum, includes all SBS baseline categories listed above.
3. Review the list for any documented exceptions and verify they are formally approved.
4. Verify that only the deployment identity has modify permissions for metadata types on the list.

### Remediation

1. Adopt the SBS baseline list of prohibited direct-in-production metadata changes.
2. Add any organization-specific items or exceptions as needed.
3. Remove modify permissions for these metadata types from all human users.
4. Ensure all future changes to listed metadata types are performed exclusively by the deployment identity.

### Applicable Metadata Types and File Patterns

All types listed in the baseline table above, plus any organization-defined extensions.

---

## SBS-DEP-003: Monitor and Alert on Unauthorized Modifications to High-Risk Metadata

**Risk Level:** High

**Control Statement:** Salesforce production orgs must implement a monitoring capability that detects and reports any modification to high-risk metadata performed by a user other than the designated deployment identity.

Organizations must maintain a monitoring process—manual or automated—that reviews administrative and metadata changes and identifies when high-risk metadata (as defined in SBS-DEP-002) is modified by a human user instead of the designated deployment identity.

### Audit Procedure

1. Interview system owners to identify the monitoring method(s) used for detecting changes to high-risk metadata.
2. Review documentation describing how the monitoring process works—whether manual log review, automated scripts, API queries, CLI workflows, scheduled exports, or vendor tools.
3. Verify that the monitoring process includes:
   - Coverage of all high-risk metadata types defined by the organization and required by SBS-DEP-002.
   - A review interval appropriate to the organization's change-management expectations (e.g., daily, weekly, or aligned with release cycles).
   - A method for identifying the user who performed each change.
4. Examine historical monitoring records or logs to confirm the process has been performed consistently.
5. Flag noncompliance if no monitoring system exists or if the system cannot detect unauthorized human modifications to high-risk metadata.

### Remediation

1. Implement a monitoring mechanism capable of identifying modifications to high-risk metadata and attributing them to the responsible user. Acceptable approaches include:
   - Manual periodic review of the Salesforce Setup Audit Trail
   - Exporting audit logs for review
   - Scheduled API or CLI queries comparing metadata changes
   - Custom scripts
   - Vendor-based monitoring tools
2. Ensure the monitoring method covers all high-risk metadata types listed in the organization's defined prohibited-direct-edit list.
3. Define a repeatable review interval and assign responsibility for conducting the review.
4. Document the monitoring approach and maintain records of reviews and findings.

### Applicable Metadata Types and File Patterns

- All metadata types listed in the SBS-DEP-002 baseline and any organization extensions
- Setup Audit Trail logs (`SetupAuditTrail` object)
- Metadata API retrieval results for drift comparison

---

## SBS-DEP-004: Establish Source-Driven Development Process

**Risk Level:** High

**Control Statement:** Meaningful Salesforce metadata changes must be deployed through a source-driven, automated, and deterministic deployment process, except where the platform does not provide programmatic deployment support.

Organizations must track all meaningful metadata changes in a centralized version control system and deploy them using an automated, repeatable, and deterministic process. Manual changes in production are permitted only for metadata types that Salesforce does not expose for programmatic deployment.

### Audit Procedure

1. Identify the organization's standard deployment process and designated deployment identity as defined in SBS-DEP-001.
2. Review recent production metadata changes and their associated deployment records.
3. Verify that changes deployable through Salesforce's programmatic deployment mechanisms originated from centralized version control.
4. Confirm that any manual production changes are limited to metadata types that Salesforce does not support for programmatic deployment.
5. Flag any manually applied changes that could have been deployed through the source-driven process.

### Remediation

1. Establish and maintain a centralized version control repository for Salesforce metadata.
2. Implement or enforce an automated deployment pipeline that deploys changes exclusively from version control.
3. Restrict direct production changes for metadata types that support programmatic deployment.
4. Document and periodically review any required manual production changes for metadata types lacking deployment support.

### Applicable Metadata Types and File Patterns

- All programmatically deployable Salesforce metadata types
- SFDX project structure: `sfdx-project.json`, `force-app/**/*`, `manifest/package.xml`
- CI/CD pipeline configurations (`.github/workflows/*.yml`, `.gitlab-ci.yml`, `Jenkinsfile`, `bitbucket-pipelines.yml`)
- Version control artifacts (`.gitignore`, `.forceignore`)

---

## SBS-DEP-005: Implement Secret Scanning for Salesforce Source Repositories

**Risk Level:** Critical

**Control Statement:** Organizations using source-driven development for Salesforce must implement automated secret scanning on all repositories containing Salesforce metadata, configuration, or deployment scripts to detect and prevent the exposure of credentials, access tokens, and other sensitive authentication material.

CI/CD pipelines for Salesforce deployments typically require long-lived access tokens, refresh tokens, or other credentials to authenticate as the designated deployment identity. If these credentials are hardcoded in scripts, configuration files, or committed to version control, they become accessible to anyone with repository access. Organizations must implement automated secret scanning that runs on every commit and pull request to detect Salesforce-specific secrets (such as access tokens, refresh tokens, consumer secrets, and session IDs) as well as general credential patterns.

### Audit Procedure

1. Identify all repositories containing Salesforce metadata, SFDX projects, deployment scripts, or CI/CD pipeline configurations.
2. Verify that automated secret scanning is enabled on each repository—either through the source control platform's native capabilities (e.g., GitHub Secret Scanning, GitLab Secret Detection) or through third-party tooling.
3. Confirm that the scanning configuration includes patterns for Salesforce-specific secrets (access tokens, refresh tokens, consumer keys/secrets, session IDs).
4. Review scanning logs or dashboards to verify the tool is actively running and producing results.
5. Verify that detected secrets trigger alerts and block merges or deployments until remediated.
6. Flag noncompliance if any Salesforce-related repository lacks active secret scanning coverage.

### Remediation

1. Enable secret scanning on all repositories containing Salesforce code, metadata, or deployment configurations using platform-native tools or third-party secret scanning solutions.
2. Configure scanning rules to detect Salesforce-specific credential patterns in addition to general secrets.
3. Implement pre-commit hooks or CI checks that block commits containing detected secrets.
4. Immediately rotate any Salesforce access tokens, refresh tokens, or credentials that have been committed to version control—even if subsequently removed, as they persist in git history.
5. Migrate credential storage to secure secrets management solutions (e.g., CI/CD platform secrets, vault systems) and remove all hardcoded credentials from repositories.
6. Establish a periodic rotation schedule for Salesforce deployment credentials to limit the window of exposure if a secret is leaked.

### Applicable Metadata Types and File Patterns

- SFDX auth files and token storage (`authUrl`, `sfdxAuthUrl`, `.sfdx/`, `.sf/`)
- CI/CD pipeline configurations (`.github/workflows/*.yml`, `.gitlab-ci.yml`, `Jenkinsfile`)
- Deployment and automation scripts (`*.sh`, `*.ps1`, `*.py`, `*.js`)
- Environment and configuration files (`.env`, `*.config`, `*.json`)
- Named Credential and Connected App metadata (`namedCredentials/*.namedCredential-meta.xml`, `connectedApps/*.connectedApp-meta.xml`)

---

## SBS-DEP-006: Configure Salesforce CLI Connected App with Token Expiration Policies

**Risk Level:** High

**Control Statement:** Organizations must configure the Connected App used for Salesforce CLI authentication with refresh token expiration of 90 days or less and access token timeout of 15 minutes or less.

Salesforce CLI stores OAuth tokens locally on developer workstations to enable command-line access to orgs. The default "Salesforce CLI" Connected App ships with refresh tokens and access tokens set to never expire, meaning stolen or leaked token files provide indefinite access to authorized orgs. Organizations must either create a dedicated Connected App for CLI usage or install and configure the default Connected App with appropriate token expiration policies. When using a dedicated Connected App, organizations should use the `--client-id` flag with CLI authentication commands.

### Audit Procedure

1. From Setup, navigate to **Connected Apps OAuth Usage** (or Apps → Connected Apps → Connected Apps OAuth Usage).
2. Identify the Connected App(s) used for Salesforce CLI authentication—either the default "Salesforce CLI" app or a custom Connected App.
3. Review the OAuth Policies for each CLI-related Connected App:
   - Verify that **Refresh Token Policy** is set to "Expire refresh token after" with a value of **90 days or less**.
   - Verify that **Session Policies Timeout Value** is set to **15 minutes or less**.
4. If a custom Connected App is used, verify that developers are instructed to use the `--client-id` flag when authenticating.
5. Flag noncompliance if any CLI-related Connected App has tokens set to never expire or exceeds the maximum allowed durations.

### Remediation

1. Determine whether to use the default "Salesforce CLI" Connected App or create a dedicated Connected App for CLI authentication.
2. **If using the default app:**
   - From Setup, navigate to Connected Apps OAuth Usage.
   - Locate "Salesforce CLI" and click Install (if not already installed), then Edit Policies.
   - Set Refresh Token Policy to "Expire refresh token after: 90 Days" (or less).
   - Set Session Policies Timeout Value to "15 minutes" (or less).
3. **If creating a dedicated Connected App:**
   - Create a new Connected App with OAuth enabled and appropriate callback URL.
   - Configure refresh token expiry to 90 days or less and access token timeout to 15 minutes or less.
   - Distribute the Consumer Key to developers and require use of `--client-id` flag.
4. Communicate to developers that they will need to re-authenticate periodically when refresh tokens expire.
5. Consider implementing compensating controls to protect locally stored token files:
   - Require full disk encryption (FileVault, BitLocker) on developer workstations.
   - Enable remote wipe capability for managed devices.
   - Include Salesforce CLI token file cleanup in device offboarding procedures.
   - Train developers to run `sf org logout --all` before returning or transferring devices.

### Applicable Metadata Types and File Patterns

- Connected App metadata: `connectedApps/*.connectedApp-meta.xml`
- Local CLI token storage: `~/.sfdx/`, `~/.sf/`
- SFDX project config: `sfdx-project.json`
- Auth-related CLI commands: `sf org login`, `sfdx auth:web:login`, `sfdx auth:jwt:grant`

---

## Control Summary

| Control ID | Title | Risk |
|---|---|---|
| SBS-DEP-001 | Require a Designated Deployment Identity for Metadata Changes | High |
| SBS-DEP-002 | Establish and Maintain a List of High-Risk Metadata Types Prohibited from Direct Production Editing | High |
| SBS-DEP-003 | Monitor and Alert on Unauthorized Modifications to High-Risk Metadata | High |
| SBS-DEP-004 | Establish Source-Driven Development Process | High |
| SBS-DEP-005 | Implement Secret Scanning for Salesforce Source Repositories | Critical |
| SBS-DEP-006 | Configure Salesforce CLI Connected App with Token Expiration Policies | High |
