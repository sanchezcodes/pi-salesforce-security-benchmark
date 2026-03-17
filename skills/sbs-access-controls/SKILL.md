---
name: sbs-access-controls
description: "Security Benchmark for Salesforce (SBS) access controls. 12 controls covering permission sets, profiles, permission set groups, RBAC, non-human identities, access reviews, and authorization governance. Use when working with Salesforce permission sets, profiles, users, roles, sharing rules, or access governance."
---

# SBS Access Controls

This skill defines 12 controls (SBS-ACS-001 through SBS-ACS-012) related to permission sets, permission set groups, profiles, and access governance within Salesforce environments. These controls ensure organizations maintain a structured, documented, and enforced approach to authorization management, reducing privilege sprawl and unauthorized access risks.

## Applicable Metadata Types and File Patterns

| Metadata Type | File Pattern | Relevant Controls |
|---|---|---|
| Profiles | `*.profile-meta.xml` | SBS-ACS-001 through SBS-ACS-006, SBS-ACS-009, SBS-ACS-012 |
| Permission Sets | `*.permissionset-meta.xml` | SBS-ACS-001 through SBS-ACS-004, SBS-ACS-006, SBS-ACS-008 |
| Permission Set Groups | `*.permissionsetgroup-meta.xml` | SBS-ACS-001 through SBS-ACS-004, SBS-ACS-006, SBS-ACS-008 |
| Users | User records (queried via SOQL/API: `SELECT Id, Username, ProfileId, IsActive, ... FROM User`) | SBS-ACS-004, SBS-ACS-005, SBS-ACS-007 through SBS-ACS-012 |
| Connected Apps | `*.connectedApp-meta.xml` | SBS-ACS-003, SBS-ACS-006, SBS-ACS-009 |

---

## SBS-ACS-001: Enforce a Documented Permission Set Model

**Risk Level:** High

### Control Statement

All permission sets, permission set groups, and profiles must conform to a documented model maintained in a system of record and enforced continuously.

### Description

The organization must define, document, and enforce a standardized permission set model within its system of record. A permission set model defines how the organization structures permissions—for example, using permission set groups to represent personas or departments, and permission sets to represent specific actions or capabilities. The specific structure is determined by the organization, but all profiles, permission sets, and permission set groups must conform to the documented model. No permission constructs may exist outside the defined model, and compliance must be evaluated and enforced on a near real-time basis.

Example models:
- Permission set groups represent job roles (Sales Rep, Service Agent), and individual permission sets represent capabilities (View Reports, Edit Accounts)
- Permission set groups represent departments (Sales, Marketing), and permission sets represent access tiers (Standard, Advanced)
- Permission sets represent business functions with no grouping hierarchy

### Audit Procedure

1. Obtain the organization's documented permission set model from the designated system of record.
2. Enumerate all Profiles, Permission Sets, and Permission Set Groups using Salesforce Setup, Metadata API, or Tooling API.
3. Compare each enumerated item against the documented model to determine whether:
   - Its purpose or persona aligns with the model.
   - Its included permissions conform to the model's structure and boundaries.
   - Its naming and classification match the documented conventions.
4. Identify any profiles, permission sets, or permission set groups that do not conform to the model.
5. Verify that the organization has a process or automation that enforces model compliance in near real time (e.g., continuous scanning, pipelines, or governance workflows).

### Remediation

1. Update or deprecate noncompliant profiles, permission sets, and permission set groups to align with the documented permission set model.
2. Migrate users off legacy or misaligned authorization constructs.
3. Implement or enhance automated enforcement to ensure continuous alignment with the defined model.
4. Update the system-of-record documentation as the model changes.

### Applicable Metadata

- `*.profile-meta.xml`
- `*.permissionset-meta.xml`
- `*.permissionsetgroup-meta.xml`

---

## SBS-ACS-002: Documented Justification for All `API-Enabled` Authorizations

**Risk Level:** High

### Control Statement

Every authorization granting the `API Enabled` permission must have documented business or technical justification recorded in a system of record.

### Description

All profiles, permission sets, and permission set groups that grant the `API Enabled` permission must be recorded in a designated system of record with a documented business or technical justification for requiring API access. Any authorization lacking documented rationale is noncompliant.

### Audit Procedure

1. Enumerate all profiles, permission sets, and permission set groups that include the `API Enabled` permission using Salesforce Setup, Metadata API, Tooling API, or an automated scanner.
2. Compare the enumerated list against the organization's designated system of record for API-enabled authorizations.
3. Verify that every profile, permission set, and permission set group granting `API Enabled` has a corresponding entry in the system of record.
4. Confirm that each entry includes:
   - A clear business or technical justification for API access, and
   - Any applicable exception or approval documentation.
5. Flag as noncompliant any authorizations lacking documentation or justification.

### Remediation

1. Remove the `API Enabled` permission from any profile, permission set, or permission set group that lacks a documented justification and is not required for business operations.
2. For any authorization that legitimately requires API access, add or update the rationale in the system of record to clearly justify the need.
3. Reconcile and update the system of record to ensure complete and accurate inventory of all API-enabled authorizations.

### Applicable Metadata

- `*.profile-meta.xml` — look for `<userPermissions>` with `<name>ApiEnabled</name>` and `<enabled>true</enabled>`
- `*.permissionset-meta.xml` — look for `<userPermissions>` with `<name>ApiEnabled</name>` and `<enabled>true</enabled>`
- `*.permissionsetgroup-meta.xml` — check member permission sets

---

## SBS-ACS-003: Documented Justification for `Approve Uninstalled Connected Apps` Permission

**Risk Level:** Critical

### Control Statement

The `Approve Uninstalled Connected Apps` permission must only be assigned to highly trusted users with documented justification and must not be granted to end-users.

### Description

All profiles, permission sets, and permission set groups that grant the `Approve Uninstalled Connected Apps` permission must be recorded in a designated system of record with a documented business or technical justification. This permission should only be assigned to highly trusted users, such as administrators and developers involved in managing or testing connected app integrations. Any authorization lacking documented rationale is noncompliant.

### Audit Procedure

1. Enumerate all profiles, permission sets, and permission set groups that include the `Approve Uninstalled Connected Apps` permission using Salesforce Setup, Metadata API, Tooling API, or an automated scanner.
2. Compare the enumerated list against the organization's designated system of record for this permission.
3. Verify that every profile, permission set, and permission set group granting `Approve Uninstalled Connected Apps` has a corresponding entry in the system of record.
4. Confirm that each entry includes:
   - A clear business or technical justification for requiring this permission,
   - Identification of the user role or persona (e.g., administrator, developer, integration manager),
   - Any applicable exception or approval documentation, and
   - Confirmation that the use case is limited to testing or managing connected app integrations.
5. Verify that the permission is not assigned to end-user profiles or permission sets intended for general business users.
6. Flag as noncompliant any authorizations lacking documentation, justification, or assigned to unauthorized user populations.

### Remediation

1. Remove the `Approve Uninstalled Connected Apps` permission from any profile, permission set, or permission set group that lacks a documented justification or is assigned to end-users.
2. For any authorization that legitimately requires this permission (e.g., administrators or developers testing connected apps), add or update the rationale in the system of record to clearly justify the need and identify the specific role or use case.
3. Ensure that connected apps required for business operations are properly installed and allowlisted rather than relying on this permission for end-user access.
4. Reconcile and update the system of record to ensure complete and accurate inventory of all assignments of this permission.

### Applicable Metadata

- `*.profile-meta.xml` — look for `<userPermissions>` with `<name>ApproveUninstalledConnectedApps</name>` and `<enabled>true</enabled>`
- `*.permissionset-meta.xml` — look for `<userPermissions>` with `<name>ApproveUninstalledConnectedApps</name>` and `<enabled>true</enabled>`
- `*.permissionsetgroup-meta.xml` — check member permission sets
- `*.connectedApp-meta.xml` — review installed connected apps for proper allowlisting

---

## SBS-ACS-004: Documented Justification for All Super Admin–Equivalent Users

**Risk Level:** High

### Control Statement

All users with simultaneous `View All Data`, `Modify All Data`, and `Manage Users` permissions must be documented in a system of record with clear business or technical justification.

### Description

All users who hold _simultaneous_ authorization for `View All Data`, `Modify All Data`, and `Manage Users`—collectively constituting Super Admin–level access—must be identified and documented in the system of record with a clear business or technical justification. Any user with this combination of permissions who lacks documented rationale is noncompliant.

### Audit Procedure

1. Enumerate all users who simultaneously possess the following permissions through any profile, permission set, or permission set group:
   - `View All Data`
   - `Modify All Data`
   - `Manage Users`
2. Compile a list of all users meeting the criteria for Super Admin–equivalent access.
3. Compare the list against the organization's system of record.
4. Verify that each Super Admin–equivalent user has corresponding documentation that includes:
   - A clear business or technical justification for requiring this level of access, and
   - Any relevant exception or approval records.
5. Flag as noncompliant any users with Super Admin–equivalent access lacking documentation or justification.

### Remediation

1. Remove one or more of the Super Admin–equivalent permissions from any user who does not have a documented business or technical justification.
2. For users who legitimately require this level of access, add or update rationale within the system of record.
3. Reassess user access to ensure alignment with least privilege, reducing broad permissions where narrower privileges are sufficient.

### Applicable Metadata

- `*.profile-meta.xml` — look for `<userPermissions>` with `<name>ViewAllData</name>`, `<name>ModifyAllData</name>`, `<name>ManageUsers</name>` all `<enabled>true</enabled>`
- `*.permissionset-meta.xml` — same permission names
- `*.permissionsetgroup-meta.xml` — check member permission sets for combined effect
- User records (queried via API) — identify users assigned to flagged profiles/permission sets

---

## SBS-ACS-005: Only Use Custom Profiles for Active Users

**Risk Level:** High

### Control Statement

All active users must be assigned custom profiles. The out-of-the-box standard profiles must not be used.

### Description

Any regular user that can access the org must use a custom profile. If a user has one of the standard profiles (e.g., "System Administrator", "Standard User", "Salesforce - Minimum Access"), the user is non-compliant. This only affects personal users, not machine users that use the default "API Only" permission sets.

Standard profiles are managed by Salesforce, not the organization—meaning Salesforce can enable permissions and object access on these profiles when features are released or platform updates occur without administrator approval. This creates an uncontrolled change vector.

### Audit Procedure

1. Enumerate all **human** users that are "Active" (`IsActive = true` on the user flag).
2. Flag all users noncompliant that use a standard profile (`IsCustom = false` on the profile metadata).

### Remediation

1. Set up a custom profile for each standard profile that is used.
2. Manage permissions and object access on these profiles to be compliant with the other controls of the SBS.
3. Assign the new custom profiles to your active users, following the principle of least privilege access.

### Applicable Metadata

- `*.profile-meta.xml` — check `<custom>true</custom>` vs `<custom>false</custom>` to distinguish custom from standard
- User records (queried via API) — `SELECT Id, Username, Profile.Name, Profile.IsCustom, IsActive FROM User WHERE IsActive = true`

---

## SBS-ACS-006: Documented Justification for `Use Any API Client` Permission

**Risk Level:** Critical

### Control Statement

The `Use Any API Client` permission, which bypasses default behavior in orgs with "API Access Control" enabled, must only be assigned to highly trusted users with documented justification and must not be granted to end-users.

### Description

All profiles, permission sets, and permission set groups that grant the `Use Any API Client` permission must be recorded in a designated system of record with a documented business or technical justification. This permission should only be assigned to highly trusted users, such as administrators and developers involved in managing or testing connected app integrations. Any authorization lacking documented rationale is noncompliant.

The `Use Any API Client` permission allows users to bypass API Access Control entirely, authorizing any OAuth-connected application without requiring it to be pre-vetted or allowlisted.

### Audit Procedure

1. Enumerate all profiles, permission sets, and permission set groups that include the `Use Any API Client` permission using Salesforce Setup, Metadata API, Tooling API, or an automated scanner.
2. Compare the enumerated list against the organization's designated system of record for this permission.
3. Verify that every profile, permission set, and permission set group granting `Use Any API Client` has a corresponding entry in the system of record.
4. Confirm that each entry includes:
   - A clear business or technical justification for requiring this permission,
   - Identification of the user role or persona (e.g., administrator, developer, integration manager),
   - Any applicable exception or approval documentation, and
   - Confirmation that the use case is limited to testing or managing connected app integrations.
5. Verify that the permission is not assigned to end-user profiles or permission sets intended for general business users.
6. Flag as noncompliant any authorizations lacking documentation, justification, or assigned to unauthorized user populations.

### Remediation

1. Remove the `Use Any API Client` permission from any profile, permission set, or permission set group that lacks a documented justification or is assigned to end-users.
2. For any authorization that legitimately requires this permission (e.g., administrators or developers testing connected apps), add or update the rationale in the system of record to clearly justify the need and identify the specific role or use case.
3. Ensure that connected apps required for business operations are properly vetted and allowlisted rather than relying on this permission for end-user access.
4. Reconcile and update the system of record to ensure complete and accurate inventory of all assignments of this permission.

### Applicable Metadata

- `*.profile-meta.xml` — look for `<userPermissions>` with `<name>UseAnyApiClient</name>` and `<enabled>true</enabled>`
- `*.permissionset-meta.xml` — look for `<userPermissions>` with `<name>UseAnyApiClient</name>` and `<enabled>true</enabled>`
- `*.permissionsetgroup-meta.xml` — check member permission sets
- `*.connectedApp-meta.xml` — review connected app configurations and OAuth scopes

---

## SBS-ACS-007: Maintain Inventory of Non-Human Identities

**Risk Level:** High

### Control Statement

Organizations must maintain an authoritative inventory of all non-human identities, including integration users, automation users, bot users, and API-only accounts.

### Description

Non-human identities operate without direct human oversight and often possess persistent credentials with elevated access. Organizations must maintain a complete and current inventory of all such identities to enable effective governance, access reviews, and incident response. The inventory must include identity type, purpose, owner, creation date, and last activity date.

### Audit Procedure

1. Request the organization's inventory of non-human identities.
2. Query Salesforce for all users where `IsActive = true` and any of the following conditions apply:
   - Username contains "integration", "api", "bot", "automation", or "service"
   - Profile name contains "Integration", "API", or similar indicators
   - User has "API Only User" permission enabled
   - User is associated with Einstein Bot or Flow automation
3. Compare the inventory to the query results to identify discrepancies.
4. Verify the inventory includes: identity name, type, purpose, business owner, creation date, and last login date.
5. Confirm the inventory is reviewed and updated at least quarterly.

### Remediation

1. Query Salesforce to identify all potential non-human identities using the criteria in the audit procedure.
2. For each identified identity, document: name, type (integration/bot/API), purpose, business owner, creation date.
3. Establish a process to update the inventory when non-human identities are created, modified, or deactivated.
4. Implement quarterly reviews of the inventory to identify and deactivate unused accounts.
5. Store the inventory in an authoritative system of record accessible to security and compliance teams.

### Applicable Metadata

- User records (queried via API) — `SELECT Id, Username, Profile.Name, IsActive, LastLoginDate, CreatedDate FROM User WHERE IsActive = true`
- `*.profile-meta.xml` — profiles associated with non-human identities (e.g., API-only profiles)
- `*.permissionset-meta.xml` — permission sets granting `ApiUserOnly` or similar

---

## SBS-ACS-008: Restrict Broad Privileges for Non-Human Identities

**Risk Level:** High

### Control Statement

Non-human identities must not be assigned permissions that bypass sharing rules or grant administrative capabilities unless documented business justification exists.

### Description

Non-human identities should follow the principle of least privilege and be granted only the minimum permissions necessary to perform their intended function. Permissions that bypass object-level or record-level security (such as `View All Data`, `Modify All Data`) or grant administrative capabilities (such as `Manage Users`, `Modify Metadata`) create significant security risk when assigned to automated accounts. Organizations must document a specific business justification for any non-human identity that requires such permissions.

### Audit Procedure

1. Using the non-human identity inventory from SBS-ACS-007, identify all non-human identities.
2. For each non-human identity, query assigned permissions through profiles, permission sets, and permission set groups.
3. Flag any non-human identity with one or more of the following permissions:
   - `View All Data`
   - `Modify All Data`
   - `Manage Users`
   - `Author Apex`
   - `Customize Application`
   - Any permission that bypasses sharing rules or grants administrative access
4. For each flagged identity, verify that documented business justification exists explaining why the permission is required.
5. Confirm the justification was approved by appropriate stakeholders (security, compliance, or management).

### Remediation

1. For each non-human identity with broad privileges, evaluate whether the permission is genuinely required for the identity's function.
2. Remove broad privileges that are not necessary; replace with more granular permissions where possible.
3. For non-human identities that legitimately require broad privileges, document:
   - Specific business function requiring the permission
   - Why more granular permissions cannot satisfy the requirement
   - Business owner and technical owner
   - Approval from security or compliance team
4. Implement a formal approval process for granting broad privileges to non-human identities.
5. Establish periodic review (at least annually) of all non-human identities with broad privileges.

### Applicable Metadata

- `*.profile-meta.xml` — look for `<userPermissions>` with `<name>ViewAllData</name>`, `<name>ModifyAllData</name>`, `<name>ManageUsers</name>`, `<name>AuthorApex</name>`, `<name>CustomizeApplication</name>`
- `*.permissionset-meta.xml` — same permission names
- `*.permissionsetgroup-meta.xml` — check member permission sets for combined effect
- User records (queried via API) — cross-reference non-human identity inventory with permission assignments

---

## SBS-ACS-009: Implement Compensating Controls for Privileged Non-Human Identities

**Risk Level:** Moderate

### Control Statement

Non-human identities with permissions that bypass sharing rules or grant administrative capabilities must have compensating controls implemented to mitigate risk.

### Description

When non-human identities require broad privileges for legitimate business purposes, organizations must implement defense-in-depth protections to reduce the risk of credential compromise or misuse. Compensating controls include IP address restrictions, OAuth scope limitations, activity monitoring and alerting, credential rotation policies, and dedicated identities per integration. Multiple compensating controls should be implemented based on the sensitivity of accessible data and the scope of granted permissions.

### Audit Procedure

1. Using the results from SBS-ACS-008, identify all non-human identities with broad privileges that have documented business justification.
2. For each privileged non-human identity, verify that at least two of the following compensating controls are implemented:
   - **IP Address Restrictions:** Profile or permission set restricts login to specific IP ranges.
   - **OAuth Scope Limitations:** Connected app uses minimal OAuth scopes; refresh tokens have expiration.
   - **Activity Monitoring:** Automated monitoring alerts on unusual activity (off-hours access, high volume, geographic anomalies).
   - **Credential Rotation:** Credentials are rotated at least every 90 days.
   - **Dedicated Identity:** Separate identity per integration (not shared across multiple systems).
3. Verify that monitoring alerts are actively reviewed and responded to.
4. Confirm that compensating controls are documented in the justification for the privileged access.

### Remediation

1. For each privileged non-human identity, implement IP address restrictions in the assigned profile or permission set to limit access to known integration sources.
2. For OAuth-based integrations, configure connected apps with minimal required scopes and enable refresh token expiration.
3. Implement automated monitoring for privileged non-human identity activity using Event Monitoring, Shield Event Monitoring, or third-party SSPM tools.
4. Establish credential rotation policies requiring API keys, passwords, and certificates to be rotated at least every 90 days.
5. Ensure each integration uses a dedicated non-human identity rather than sharing credentials across multiple systems.
6. Document all implemented compensating controls in the access justification.

### Applicable Metadata

- `*.profile-meta.xml` — check `<loginIpRanges>` for IP restrictions on non-human identity profiles
- `*.connectedApp-meta.xml` — check `<oauthConfig>` for scope limitations and refresh token policies
- User records (queried via API) — verify dedicated identity per integration

---

## SBS-ACS-010: Enforce Periodic Access Review and Recertification

**Risk Level:** Moderate

### Control Statement

All user access and configuration influencing permissions and sharing must be formally reviewed and recertified at least annually by designated business stakeholders, with documented approval and remediation of unauthorized or excessive access.

### Description

The organization must implement a periodic access review process that ensures all active user access (human and non-human) is intentional, necessary, and aligned with current job responsibilities. An access review encompasses all authorization constructs including user profiles, permission set assignments, permission set group memberships, and role hierarchies. A designated business stakeholder (typically a manager, department lead, or data owner) must certify that each user's access is appropriate, with documented evidence of review and approval. Any access identified as excessive, outdated, or no longer required must be documented and remediated within a defined timeframe.

Example implementations:
- Annual access reviews conducted by department managers in Q1, with remediation required within 30 days
- Rolling quarterly reviews where each business unit certifies access for their users on a rotating schedule
- Role-based reviews where each application owner certifies all users assigned to specific permission sets or profiles
- Sensitive role reviews conducted semi-annually (e.g., System Administrator, Finance, HR users) while standard users are reviewed annually

### Audit Procedure

1. Understand the organization's documented access review policy, including:
   - Defined frequency and review cycle
   - Designated reviewers and escalation path
   - Intended coverage scope and access types included
   - Expected remediation timeframe for findings
   - System of record for tracking review activity and findings
2. Assess the recency and regularity of access review execution. Locate the most recent completed access review cycle and evaluate whether it aligns with the organization's stated review frequency.
3. Examine a representative sample of access review documentation to assess consistency of execution:
   - Evidence of review and approval by the designated stakeholder
   - Documentation of review date and scope
   - Any findings, exceptions, or questions raised during the review
   - Appropriateness of sample size relative to the organization's user population and complexity
4. For any access identified as excessive, unauthorized, or not recertified:
   - Assess whether the finding was documented
   - Evaluate what remediation action was taken or whether exceptions were formally approved
   - Compare remediation timing against the defined SLA
5. Assess whether the organization maintains a traceable system of record that documents:
   - Who reviewed what access
   - When the review occurred
   - What was approved or questioned
   - What remediation was required and its completion status
6. Evaluate whether the access review process adequately addresses the organization's primary access constructs, which may include:
   - User profiles
   - Permission sets
   - Permission set groups
   - Role and role hierarchies
   - Public groups
   - Queues
   - Sales Territories
   - Delegated administration or elevated permissions

### Remediation

1. If no access review process exists, establish documented policy including frequency, reviewers, scope, and remediation SLAs.
2. Conduct an initial comprehensive access review of all active users, with business unit or department ownership of sign-off.
3. Identify and remediate all access determined excessive, unauthorized, or inappropriate during the initial review.
4. Implement a system of record (spreadsheet, governance tool, or integrated platform) to track reviews, findings, and remediation.
5. Schedule recurring access reviews at minimum annual frequency, with quarterly reviews for sensitive roles or high-risk data.
6. Document the review process, including templates, stakeholder roles, and escalation procedures.
7. Establish accountability for reviewers and tie review completion to performance management or audit requirements.

### Applicable Metadata

- User records (queried via API) — all active users, their profile/permission set/permission set group assignments
- `*.profile-meta.xml` — profiles assigned to users under review
- `*.permissionset-meta.xml` — permission sets assigned to users under review
- `*.permissionsetgroup-meta.xml` — permission set groups assigned to users under review

---

## SBS-ACS-011: Enforce Governance of Access and Authorization Changes

**Risk Level:** High

### Control Statement

All changes to Salesforce user access and authorization must be governed through a documented process that requires approval, records business justification, and produces an auditable record of the change.

### Description

Organizations must enforce governance over all changes that grant, modify, or revoke access within Salesforce. Access and authorization changes must be requested, approved prior to implementation, and traceable to a documented business justification.

This control applies to changes including, but not limited to:
- User creation, modification, or deactivation
- Assignment or removal of profiles, permission sets, or permission set groups
- Changes to profile or permission set permissions
- Role hierarchy changes
- Public group, queue, or territory access changes
- Sharing rule or restriction rule changes affecting access

Access changes must be auditable and aligned to the organization's documented access model. Unauthorized or undocumented changes represent control failure.

### Audit Procedure

1. Retrieve evidence of the organization's documented process governing access and authorization changes.
2. Identify access-related changes made during a representative review period.
3. For a sample of changes, verify:
   - An approval record exists prior to implementation
   - Business justification is documented
   - The change is traceable to an identifiable request
   - The implemented change is recorded in available audit or change history records
4. Identify any access changes lacking approval, justification, or auditability as noncompliant.

### Remediation

1. Establish and document a formal governance process for access and authorization changes.
2. Require approval and business justification for all access modifications.
3. Ensure access changes are recorded in an auditable system of record.

### Applicable Metadata

- `*.profile-meta.xml` — changes to profile permissions
- `*.permissionset-meta.xml` — changes to permission set definitions or assignments
- `*.permissionsetgroup-meta.xml` — changes to permission set group composition
- User records (queried via API) — user creation, modification, deactivation, profile/permission changes

---

## SBS-ACS-012: Classify Users for Login Hours Restrictions

**Risk Level:** Moderate

### Control Statement

Organizations must maintain a documented classification of users requiring login hours restrictions or equivalent off-hours authentication monitoring.

### Description

Organizations must perform risk-based classification to identify users for whom off-hours authentication poses elevated security risk. For each classified user, organizations must either configure login hours restrictions on their profile or implement monitoring and alerting for off-hours authentication. Organizations may classify zero users if documented and reviewed periodically.

### Audit Procedure

1. Verify the organization maintains a documented classification identifying users requiring login hours restrictions or monitoring.
2. For classified users, verify login hours are configured or off-hours authentication monitoring is implemented.
3. If zero users are classified, verify this decision is documented with justification and reviewed periodically.

### Remediation

1. Perform risk-based user classification based on privileges and data access.
2. For classified users, either configure login hours on profiles or implement off-hours authentication monitoring with alerting.
3. Document classification and implementation decisions in a system of record.
4. Review during periodic access reviews (SBS-ACS-010).

### Applicable Metadata

- `*.profile-meta.xml` — check `<loginHours>` element for configured login hour restrictions
- User records (queried via API) — identify users assigned to profiles with or without login hour restrictions

---

## Quick Reference: Controls by Risk Level

### Critical
| Control | Title |
|---|---|
| SBS-ACS-003 | Documented Justification for `Approve Uninstalled Connected Apps` Permission |
| SBS-ACS-006 | Documented Justification for `Use Any API Client` Permission |

### High
| Control | Title |
|---|---|
| SBS-ACS-001 | Enforce a Documented Permission Set Model |
| SBS-ACS-002 | Documented Justification for All `API-Enabled` Authorizations |
| SBS-ACS-004 | Documented Justification for All Super Admin–Equivalent Users |
| SBS-ACS-005 | Only Use Custom Profiles for Active Users |
| SBS-ACS-007 | Maintain Inventory of Non-Human Identities |
| SBS-ACS-008 | Restrict Broad Privileges for Non-Human Identities |
| SBS-ACS-011 | Enforce Governance of Access and Authorization Changes |

### Moderate
| Control | Title |
|---|---|
| SBS-ACS-009 | Implement Compensating Controls for Privileged Non-Human Identities |
| SBS-ACS-010 | Enforce Periodic Access Review and Recertification |
| SBS-ACS-012 | Classify Users for Login Hours Restrictions |

## Key Permission API Names

| Permission (UI Label) | API Name in Metadata |
|---|---|
| API Enabled | `ApiEnabled` |
| Approve Uninstalled Connected Apps | `ApproveUninstalledConnectedApps` |
| Use Any API Client | `UseAnyApiClient` |
| View All Data | `ViewAllData` |
| Modify All Data | `ModifyAllData` |
| Manage Users | `ManageUsers` |
| Author Apex | `AuthorApex` |
| Customize Application | `CustomizeApplication` |
