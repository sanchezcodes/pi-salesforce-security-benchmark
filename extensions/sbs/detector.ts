// SBS Salesforce File Pattern Detector
// Detects Salesforce-related file patterns from text and maps them to applicable SBS controls.

import {
  SBS_CONTROLS,
  type SbsControl,
  type Domain,
  getControlsForFile,
} from "./controls.js";

// ---------------------------------------------------------------------------
// Recognised Salesforce file extensions and path patterns
// ---------------------------------------------------------------------------

export const SALESFORCE_PATTERNS: readonly string[] = [
  ".cls",
  ".trigger",
  ".page",
  ".component",
  "-meta.xml",
  "lwc/",
  "aura/",
  "force-app/",
  "sfdx-project.json",
  ".permissionset",
  ".profile",
  ".connectedApp",
] as const;

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface DetectionResult {
  detectedFiles: string[];
  applicableControls: SbsControl[];
  applicableDomains: Domain[];
  hint: string;
}

// ---------------------------------------------------------------------------
// Regex built from SALESFORCE_PATTERNS — matches file paths containing any
// of the known patterns. We look for contiguous non-whitespace sequences
// that include at least one pattern.
// ---------------------------------------------------------------------------

const FILE_PATH_RE = /\S+/g;

function containsSalesforcePattern(token: string): boolean {
  return SALESFORCE_PATTERNS.some((p) => token.includes(p));
}

// ---------------------------------------------------------------------------
// Core detection
// ---------------------------------------------------------------------------

/**
 * Scan `text` (and optional `filePaths`) for Salesforce file patterns and
 * return the matching SBS controls, domains, and a one-line hint.
 */
export function detectSalesforceContext(
  text: string,
  filePaths?: string[],
): DetectionResult {
  const detectedSet = new Set<string>();

  // Scan text tokens
  for (const match of text.matchAll(FILE_PATH_RE)) {
    const token = match[0];
    if (containsSalesforcePattern(token)) {
      detectedSet.add(token);
    }
  }

  // Scan explicit file paths
  if (filePaths) {
    for (const fp of filePaths) {
      if (containsSalesforcePattern(fp)) {
        detectedSet.add(fp);
      }
    }
  }

  const detectedFiles = [...detectedSet];

  if (detectedFiles.length === 0) {
    return {
      detectedFiles: [],
      applicableControls: [],
      applicableDomains: [],
      hint: "",
    };
  }

  // Gather controls for each detected file, deduplicated by control id
  const controlMap = new Map<string, SbsControl>();
  for (const file of detectedFiles) {
    for (const control of getControlsForFile(file)) {
      controlMap.set(control.id, control);
    }
  }

  const applicableControls = [...controlMap.values()].sort((a, b) =>
    a.id.localeCompare(b.id),
  );

  const applicableDomains = [
    ...new Set(applicableControls.map((c) => c.domain)),
  ].sort() as Domain[];

  const controlIds = applicableControls.map((c) => c.id).join(", ");
  const domainNames = applicableDomains.join(", ");
  const hint =
    applicableControls.length > 0
      ? `SBS controls ${controlIds} may apply (${domainNames} domains)`
      : "";

  return { detectedFiles, applicableControls, applicableDomains, hint };
}

// ---------------------------------------------------------------------------
// Simple predicate
// ---------------------------------------------------------------------------

/** Check whether a file path looks like a Salesforce-related file. */
export function isSalesforceFile(filePath: string): boolean {
  return containsSalesforcePattern(filePath);
}
