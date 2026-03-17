// SBS Control Metadata Registry
// All 25 Salesforce Security Benchmark controls as structured data with lookup functions.
// No external dependencies — standalone TypeScript module.

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Domain = "access-controls" | "code-security" | "deployments" | "file-security";
export type RiskLevel = "critical" | "high" | "moderate";

export interface SbsControl {
  id: string;
  title: string;
  domain: Domain;
  risk: RiskLevel;
  statement: string;
  filePatterns: string[];
  metadataTypes: string[];
  regulations: string[];
  skillName: string;
}

// ---------------------------------------------------------------------------
// Control definitions
// ---------------------------------------------------------------------------

export const SBS_CONTROLS: SbsControl[] = [
  // ── Access Controls (ACS) ───────────────────────────────────────────────
  {
    id: "SBS-ACS-001",
    title: "Enforce a Documented Permission Set Model",
    domain: "access-controls",
    risk: "high",
    statement:
      "All access grants must follow a documented permission-set-based model with minimised profile permissions.",
    filePatterns: [
      "*.profile-meta.xml",
      "*.permissionset-meta.xml",
      "*.permissionsetgroup-meta.xml",
    ],
    metadataTypes: ["Profiles", "Permission Sets", "PSGs"],
    regulations: ["ISO 27001", "SOC 2", "NIST"],
    skillName: "sbs-acs-001",
  },
  {
    id: "SBS-ACS-002",
    title: "Documented Justification for All API-Enabled Authorizations",
    domain: "access-controls",
    risk: "high",
    statement:
      "Every profile or permission set granting API Enabled must have a documented business justification.",
    filePatterns: [
      "*.profile-meta.xml",
      "*.permissionset-meta.xml",
      "*.permissionsetgroup-meta.xml",
    ],
    metadataTypes: ["Profiles", "Permission Sets", "PSGs"],
    regulations: ["ISO 27001", "SOC 2", "NIST"],
    skillName: "sbs-acs-002",
  },
  {
    id: "SBS-ACS-003",
    title:
      "Documented Justification for Approve Uninstalled Connected Apps Permission",
    domain: "access-controls",
    risk: "critical",
    statement:
      "The PermissionApproveUninstalledConnectedApps permission must not be granted without documented justification and compensating controls.",
    filePatterns: [
      "*.profile-meta.xml",
      "*.permissionset-meta.xml",
      "*.permissionsetgroup-meta.xml",
    ],
    metadataTypes: ["Profiles", "Permission Sets", "PSGs"],
    regulations: [
      "ISO 27001",
      "SOC 2",
      "NIST",
      "HIPAA",
      "GDPR",
      "CCPA/CPRA",
    ],
    skillName: "sbs-acs-003",
  },
  {
    id: "SBS-ACS-004",
    title: "Documented Justification for All Super Admin-Equivalent Users",
    domain: "access-controls",
    risk: "high",
    statement:
      "All users with super-admin-equivalent permissions must be individually justified and periodically recertified.",
    filePatterns: ["*.profile-meta.xml", "*.permissionset-meta.xml"],
    metadataTypes: ["User records", "Profiles", "Permission Sets", "PSGs"],
    regulations: [
      "ISO 27001",
      "SOC 2",
      "NIST",
      "HIPAA",
      "GDPR",
      "CCPA/CPRA",
    ],
    skillName: "sbs-acs-004",
  },
  {
    id: "SBS-ACS-005",
    title: "Only Use Custom Profiles for Active Users",
    domain: "access-controls",
    risk: "high",
    statement:
      "Active users must be assigned custom profiles; standard profiles must not be used for active user assignments.",
    filePatterns: ["*.profile-meta.xml"],
    metadataTypes: ["Profiles", "User records"],
    regulations: ["ISO 27001", "SOC 2", "NIST"],
    skillName: "sbs-acs-005",
  },
  {
    id: "SBS-ACS-006",
    title: "Documented Justification for Use Any API Client Permission",
    domain: "access-controls",
    risk: "critical",
    statement:
      "The UseAnyApiClient permission must not be granted without documented justification and compensating controls.",
    filePatterns: [
      "*.profile-meta.xml",
      "*.permissionset-meta.xml",
      "*.permissionsetgroup-meta.xml",
    ],
    metadataTypes: ["Profiles", "Permission Sets", "PSGs"],
    regulations: [
      "ISO 27001",
      "SOC 2",
      "NIST",
      "HIPAA",
      "GDPR",
      "CCPA/CPRA",
    ],
    skillName: "sbs-acs-006",
  },
  {
    id: "SBS-ACS-007",
    title: "Maintain Inventory of Non-Human Identities",
    domain: "access-controls",
    risk: "high",
    statement:
      "All non-human identities (integration users, API-only users) must be inventoried with documented ownership and purpose.",
    filePatterns: ["*.profile-meta.xml"],
    metadataTypes: ["User records", "Profiles"],
    regulations: ["ISO 27001", "SOC 2", "NIST"],
    skillName: "sbs-acs-007",
  },
  {
    id: "SBS-ACS-008",
    title: "Restrict Broad Privileges for Non-Human Identities",
    domain: "access-controls",
    risk: "high",
    statement:
      "Non-human identities must follow least-privilege principles and must not hold broad administrative permissions.",
    filePatterns: [
      "*.profile-meta.xml",
      "*.permissionset-meta.xml",
      "*.permissionsetgroup-meta.xml",
    ],
    metadataTypes: ["User records", "Profiles", "Permission Sets", "PSGs"],
    regulations: ["ISO 27001", "SOC 2", "NIST"],
    skillName: "sbs-acs-008",
  },
  {
    id: "SBS-ACS-009",
    title: "Implement Compensating Controls for Privileged NHIs",
    domain: "access-controls",
    risk: "moderate",
    statement:
      "Privileged non-human identities must have compensating controls such as IP restrictions, connected app policies, and monitoring.",
    filePatterns: ["*.profile-meta.xml", "*.connectedApp-meta.xml"],
    metadataTypes: ["Profiles", "Connected Apps"],
    regulations: ["ISO 27001", "SOC 2", "NIST"],
    skillName: "sbs-acs-009",
  },
  {
    id: "SBS-ACS-010",
    title: "Enforce Periodic Access Review and Recertification",
    domain: "access-controls",
    risk: "moderate",
    statement:
      "All user access grants must be reviewed and recertified on a periodic schedule with documented evidence.",
    filePatterns: [
      "*.profile-meta.xml",
      "*.permissionset-meta.xml",
      "*.role-meta.xml",
    ],
    metadataTypes: [
      "User records",
      "Profiles",
      "Permission Sets",
      "PSGs",
      "Roles",
      "Public Groups",
    ],
    regulations: ["ISO 27001", "SOC 2", "NIST", "HIPAA", "GDPR"],
    skillName: "sbs-acs-010",
  },
  {
    id: "SBS-ACS-011",
    title: "Enforce Governance of Access and Authorization Changes",
    domain: "access-controls",
    risk: "high",
    statement:
      "All access and authorization changes must follow a governed change management process with audit trails.",
    filePatterns: [
      "*.profile-meta.xml",
      "*.permissionset-meta.xml",
      "*.role-meta.xml",
      "*.sharingRules-meta.xml",
    ],
    metadataTypes: [
      "User records",
      "Profiles",
      "Permission Sets",
      "PSGs",
      "Roles",
      "Sharing Rules",
    ],
    regulations: ["ISO 27001", "SOC 2", "NIST", "HIPAA", "GDPR"],
    skillName: "sbs-acs-011",
  },
  {
    id: "SBS-ACS-012",
    title: "Classify Users for Login Hours Restrictions",
    domain: "access-controls",
    risk: "moderate",
    statement:
      "Profiles must enforce login-hour restrictions appropriate to user classification and business requirements.",
    filePatterns: ["*.profile-meta.xml"],
    metadataTypes: ["Profiles"],
    regulations: ["ISO 27001", "SOC 2", "NIST"],
    skillName: "sbs-acs-012",
  },

  // ── Code Security (CODE) ───────────────────────────────────────────────
  {
    id: "SBS-CODE-001",
    title: "Mandatory Peer Review for Salesforce Code Changes",
    domain: "code-security",
    risk: "moderate",
    statement:
      "All Salesforce code changes (Apex, LWC, Aura) must receive peer review approval before merge.",
    filePatterns: [
      "*.cls",
      "*.trigger",
      "lwc/**/*.js",
      "lwc/**/*.html",
      "aura/**/*.cmp",
    ],
    metadataTypes: ["Apex Classes", "Apex Triggers", "LWC", "Aura"],
    regulations: ["ISO 27001"],
    skillName: "sbs-code-001",
  },
  {
    id: "SBS-CODE-002",
    title: "Pre-Merge Static Code Analysis for Apex and LWC",
    domain: "code-security",
    risk: "moderate",
    statement:
      "Automated static code analysis must pass before any Apex or LWC code is merged to a protected branch.",
    filePatterns: ["*.cls", "*.trigger", "lwc/**/*.js"],
    metadataTypes: ["Apex Classes", "Apex Triggers", "LWC"],
    regulations: ["ISO 27001"],
    skillName: "sbs-code-002",
  },
  {
    id: "SBS-CODE-003",
    title: "Implement Persistent Apex Application Logging",
    domain: "code-security",
    risk: "high",
    statement:
      "Apex applications must implement persistent structured logging to a custom object for security-relevant events.",
    filePatterns: ["*.cls"],
    metadataTypes: ["Apex Classes", "Custom Objects"],
    regulations: ["ISO 27001", "GDPR"],
    skillName: "sbs-code-003",
  },
  {
    id: "SBS-CODE-004",
    title: "Prevent Sensitive Data in Application Logs",
    domain: "code-security",
    risk: "critical",
    statement:
      "Application logs must never contain PII, credentials, session tokens, or other sensitive data.",
    filePatterns: ["*.cls"],
    metadataTypes: ["Apex Classes", "Custom Objects", "Debug Logs"],
    regulations: ["ISO 27001", "HIPAA", "GDPR", "CCPA/CPRA"],
    skillName: "sbs-code-004",
  },

  // ── Deployments (DEP) ──────────────────────────────────────────────────
  {
    id: "SBS-DEP-001",
    title:
      "Require a Designated Deployment Identity for Metadata Changes",
    domain: "deployments",
    risk: "high",
    statement:
      "All metadata deployments to production must use a designated deployment identity — not individual user credentials.",
    filePatterns: ["sfdx-project.json", "*.yml", "*.yaml"],
    metadataTypes: ["All deployable metadata", "CI/CD configs"],
    regulations: ["ISO 27001", "SOC 2", "NIST"],
    skillName: "sbs-dep-001",
  },
  {
    id: "SBS-DEP-002",
    title:
      "Establish High-Risk Metadata Types Prohibited from Direct Production Editing",
    domain: "deployments",
    risk: "high",
    statement:
      "High-risk metadata types must be deployed only through the CI/CD pipeline and never edited directly in production.",
    filePatterns: [
      "*.cls",
      "*.trigger",
      "*.profile-meta.xml",
      "*.permissionset-meta.xml",
      "*.remoteSite-meta.xml",
      "*.namedCredential-meta.xml",
    ],
    metadataTypes: [
      "Apex",
      "LWC",
      "Aura",
      "Profiles",
      "Permission Sets",
      "Remote Site Settings",
      "Named Credentials",
    ],
    regulations: ["ISO 27001", "SOC 2", "NIST"],
    skillName: "sbs-dep-002",
  },
  {
    id: "SBS-DEP-003",
    title:
      "Monitor and Alert on Unauthorized High-Risk Metadata Modifications",
    domain: "deployments",
    risk: "high",
    statement:
      "Unauthorised modifications to high-risk metadata types must trigger automated alerts and be investigated.",
    filePatterns: [
      "*.cls",
      "*.trigger",
      "*.profile-meta.xml",
      "*.permissionset-meta.xml",
      "*.remoteSite-meta.xml",
      "*.namedCredential-meta.xml",
    ],
    metadataTypes: ["Setup Audit Trail", "all DEP-002 types"],
    regulations: ["ISO 27001", "SOC 2"],
    skillName: "sbs-dep-003",
  },
  {
    id: "SBS-DEP-004",
    title: "Establish Source-Driven Development Process",
    domain: "deployments",
    risk: "high",
    statement:
      "All Salesforce development must follow a source-driven process where version control is the source of truth.",
    filePatterns: ["sfdx-project.json", "force-app/**/*"],
    metadataTypes: ["All deployable metadata", "VCS repos"],
    regulations: ["ISO 27001"],
    skillName: "sbs-dep-004",
  },
  {
    id: "SBS-DEP-005",
    title:
      "Implement Secret Scanning for Salesforce Source Repositories",
    domain: "deployments",
    risk: "critical",
    statement:
      "Source repositories must have automated secret scanning to prevent credentials and tokens from being committed.",
    filePatterns: [
      "sfdx-project.json",
      "*.yml",
      "*.yaml",
      "*.env",
      "*.sh",
    ],
    metadataTypes: ["Source repos", "OAuth tokens", "credentials"],
    regulations: ["ISO 27001"],
    skillName: "sbs-dep-005",
  },
  {
    id: "SBS-DEP-006",
    title:
      "Configure Salesforce CLI Connected App with Token Expiration Policies",
    domain: "deployments",
    risk: "high",
    statement:
      "The Salesforce CLI connected app must enforce token expiration and refresh-token rotation policies.",
    filePatterns: ["*.connectedApp-meta.xml"],
    metadataTypes: ["Connected Apps", "CLI tokens"],
    regulations: ["ISO 27001", "SOC 2", "NIST"],
    skillName: "sbs-dep-006",
  },

  // ── File Security (FILE) ───────────────────────────────────────────────
  {
    id: "SBS-FILE-001",
    title: "Require Expiry Dates on Public Content Links",
    domain: "file-security",
    risk: "moderate",
    statement:
      "All public content distribution links must have an expiration date set at creation time.",
    filePatterns: [],
    metadataTypes: ["ContentDistribution"],
    regulations: ["ISO 27001", "GDPR", "CCPA/CPRA"],
    skillName: "sbs-file-001",
  },
  {
    id: "SBS-FILE-002",
    title:
      "Require Passwords on Public Content Links for Sensitive Content",
    domain: "file-security",
    risk: "high",
    statement:
      "Public content distribution links for sensitive content must require a password for access.",
    filePatterns: [],
    metadataTypes: ["ContentDistribution"],
    regulations: [
      "ISO 27001",
      "SOC 2",
      "NIST",
      "HIPAA",
      "GDPR",
      "CCPA/CPRA",
    ],
    skillName: "sbs-file-002",
  },
  {
    id: "SBS-FILE-003",
    title: "Periodic Review and Cleanup of Public Content Links",
    domain: "file-security",
    risk: "moderate",
    statement:
      "Public content distribution links must be periodically reviewed and stale or unnecessary links must be revoked.",
    filePatterns: [],
    metadataTypes: ["ContentDistribution"],
    regulations: ["ISO 27001", "GDPR", "CCPA/CPRA"],
    skillName: "sbs-file-003",
  },
];

// ---------------------------------------------------------------------------
// Lookup helpers
// ---------------------------------------------------------------------------

/** Return a single control by its full ID (e.g. "SBS-ACS-001"). Case-insensitive. */
export function getControlById(id: string): SbsControl | undefined {
  const upper = id.toUpperCase();
  return SBS_CONTROLS.find((c) => c.id.toUpperCase() === upper);
}

/** Return all controls in a given domain. */
export function getControlsByDomain(domain: Domain): SbsControl[] {
  return SBS_CONTROLS.filter((c) => c.domain === domain);
}

/** Return all controls at a given risk level. */
export function getControlsByRisk(risk: RiskLevel): SbsControl[] {
  return SBS_CONTROLS.filter((c) => c.risk === risk);
}

/**
 * Return every control whose `filePatterns` match the given file path.
 *
 * Matching rules (intentionally simple — no external deps):
 *  - A pattern like "*.ext" matches any path ending in ".ext"
 *  - A pattern like "dir&#47;**&#47;*.ext" matches any path that contains "/dir/" (or starts
 *    with "dir/") AND ends with ".ext"
 *  - A pattern like "filename.json" matches any path ending in "/filename.json" or
 *    equal to "filename.json"
 *  - A pattern like "dir&#47;**&#47;*" matches any path that contains "/dir/" or starts with "dir/"
 */
export function getControlsForFile(filePath: string): SbsControl[] {
  // Normalise to forward slashes
  const normalized = filePath.replace(/\\/g, "/");

  return SBS_CONTROLS.filter((control) =>
    control.filePatterns.some((pattern) => globMatch(pattern, normalized)),
  );
}

/** Summary statistics per domain. */
export function getAllDomains(): {
  domain: Domain;
  controlCount: number;
  critical: number;
  high: number;
  moderate: number;
}[] {
  const domains: Domain[] = [
    "access-controls",
    "code-security",
    "deployments",
    "file-security",
  ];

  return domains.map((domain) => {
    const controls = getControlsByDomain(domain);
    return {
      domain,
      controlCount: controls.length,
      critical: controls.filter((c) => c.risk === "critical").length,
      high: controls.filter((c) => c.risk === "high").length,
      moderate: controls.filter((c) => c.risk === "moderate").length,
    };
  });
}

// ---------------------------------------------------------------------------
// Internal glob-matching helper
// ---------------------------------------------------------------------------

function globMatch(pattern: string, filePath: string): boolean {
  // Case 1: pattern contains "**" — e.g. "lwc/**/*.js" or "force-app/**/*"
  if (pattern.includes("**")) {
    const [prefix, suffix] = pattern.split("**");
    // The directory segment must appear in the path
    const dirSegment = prefix.replace(/\/$/, ""); // e.g. "lwc"

    const dirMatches =
      dirSegment === ""
        ? true // "**/*.ext" matches everything with that ext
        : filePath === dirSegment ||
          filePath.startsWith(dirSegment + "/") ||
          filePath.includes("/" + dirSegment + "/");

    if (!dirMatches) return false;

    // If suffix is "/*" or empty, any file under the dir matches
    if (!suffix || suffix === "/*" || suffix === "/") return true;

    // Otherwise suffix is like "/*.js" — check the extension
    const extPart = suffix.replace(/^\/?\*/, ""); // e.g. ".js"
    if (extPart && !filePath.endsWith(extPart)) return false;

    return true;
  }

  // Case 2: pattern starts with "*." — extension match, e.g. "*.cls"
  if (pattern.startsWith("*.")) {
    const ext = pattern.slice(1); // e.g. ".cls"
    return filePath.endsWith(ext);
  }

  // Case 3: exact filename match — e.g. "sfdx-project.json"
  return filePath === pattern || filePath.endsWith("/" + pattern);
}
