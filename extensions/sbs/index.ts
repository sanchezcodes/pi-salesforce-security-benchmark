/**
 * SBS Extension — Security Benchmark for Salesforce
 *
 * Pi coding agent extension that:
 * - Detects Salesforce files in prompts and hints applicable security controls
 * - Provides an `sbs_check` tool for LLM-driven control lookups
 * - Registers a `/sbs` command for interactive browsing
 * - Monitors write/edit operations and notifies on Salesforce file changes
 */

import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { Type } from "@sinclair/typebox";
import { StringEnum } from "@mariozechner/pi-ai";

import {
  SBS_CONTROLS,
  getControlById,
  getControlsByDomain,
  getControlsByRisk,
  getControlsForFile,
  getAllDomains,
} from "./controls.js";
import type { Domain, RiskLevel, SbsControl } from "./controls.js";
import { detectSalesforceContext, isSalesforceFile } from "./detector.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatControl(c: SbsControl): string {
  return [
    `${c.id}: ${c.title}`,
    `  Domain: ${c.domain} | Risk: ${c.risk}`,
    `  ${c.statement}`,
    `  File patterns: ${c.filePatterns.length > 0 ? c.filePatterns.join(", ") : "(none)"}`,
    `  Metadata: ${c.metadataTypes.join(", ")}`,
    `  Regulations: ${c.regulations.join(", ")}`,
    `  Skill: ${c.skillName}`,
  ].join("\n");
}

function formatControlList(controls: SbsControl[]): string {
  if (controls.length === 0) return "No matching controls found.";
  return controls.map(formatControl).join("\n\n");
}

// ---------------------------------------------------------------------------
// Extension
// ---------------------------------------------------------------------------

export default function (pi: ExtensionAPI) {
  // ── before_agent_start: detect Salesforce context and hint controls ──

  pi.on("before_agent_start", async (event) => {
    const result = detectSalesforceContext(event.prompt);
    if (result.applicableControls.length === 0) return undefined;

    const ids = result.applicableControls.map((c) => c.id).join(", ");
    const hint = `\n\n[SBS] Salesforce security controls may apply: ${ids}. Load the relevant SBS skill for full control details.`;

    return { systemPrompt: event.systemPrompt + hint };
  });

  // ── sbs_check tool ───────────────────────────────────────────────────

  pi.registerTool({
    name: "sbs_check",
    label: "SBS Check",
    description:
      "Look up Security Benchmark for Salesforce (SBS) controls by ID, domain, risk level, or file pattern. Returns structured control metadata.",
    parameters: Type.Object({
      query: Type.Optional(
        Type.String({ description: "Free text query (control ID or domain name)" }),
      ),
      domain: Type.Optional(
        StringEnum(
          ["access-controls", "code-security", "deployments", "file-security"] as const,
          { description: "Filter by domain" },
        ),
      ),
      controlId: Type.Optional(
        Type.String({ description: "Specific control ID, e.g. SBS-ACS-001" }),
      ),
      risk: Type.Optional(
        StringEnum(["critical", "high", "moderate"] as const, {
          description: "Filter by risk level",
        }),
      ),
      filePath: Type.Optional(
        Type.String({ description: "File path to match against control patterns" }),
      ),
    }),

    async execute(_toolCallId, params, _signal, _onUpdate, _ctx) {
      const { controlId, domain, risk, filePath, query } = params as {
        controlId?: string;
        domain?: Domain;
        risk?: RiskLevel;
        filePath?: string;
        query?: string;
      };

      let controls: SbsControl[] = [];
      let label = "";

      // Priority: controlId > domain > risk > filePath > query
      if (controlId) {
        const c = getControlById(controlId);
        controls = c ? [c] : [];
        label = `Control ${controlId}`;
      } else if (domain) {
        controls = getControlsByDomain(domain);
        label = `Domain: ${domain}`;
      } else if (risk) {
        controls = getControlsByRisk(risk);
        label = `Risk: ${risk}`;
      } else if (filePath) {
        controls = getControlsForFile(filePath);
        label = `File: ${filePath}`;
      } else if (query) {
        // Try as control ID first
        const byId = getControlById(query);
        if (byId) {
          controls = [byId];
          label = `Control ${query}`;
        } else {
          // Try as domain name
          const domainNames: Domain[] = [
            "access-controls",
            "code-security",
            "deployments",
            "file-security",
          ];
          const matchedDomain = domainNames.find(
            (d) => d === query.toLowerCase() || d.includes(query.toLowerCase()),
          );
          if (matchedDomain) {
            controls = getControlsByDomain(matchedDomain);
            label = `Domain: ${matchedDomain}`;
          } else {
            // Full-text search across titles and statements
            const q = query.toLowerCase();
            controls = SBS_CONTROLS.filter(
              (c) =>
                c.title.toLowerCase().includes(q) ||
                c.statement.toLowerCase().includes(q) ||
                c.id.toLowerCase().includes(q),
            );
            label = `Search: "${query}"`;
          }
        }
      } else {
        // No params — return overview
        const domains = getAllDomains();
        const overview = domains
          .map(
            (d) =>
              `${d.domain}: ${d.controlCount} controls (${d.critical} critical, ${d.high} high, ${d.moderate} moderate)`,
          )
          .join("\n");
        return {
          content: [
            {
              type: "text" as const,
              text: `SBS Overview — ${SBS_CONTROLS.length} controls across ${domains.length} domains:\n\n${overview}`,
            },
          ],
          details: {},
        };
      }

      const text =
        controls.length > 0
          ? `${label} — ${controls.length} control(s):\n\n${formatControlList(controls)}`
          : `${label} — no matching controls found.`;

      return { content: [{ type: "text" as const, text }], details: {} };
    },
  });

  // ── /sbs command ─────────────────────────────────────────────────────

  pi.registerCommand("sbs", {
    description: "Browse SBS security controls",
    async handler(args, ctx) {
      const trimmed = args.trim();

      if (!trimmed) {
        // Overview of all domains
        const domains = getAllDomains();
        const lines = [
          `Security Benchmark for Salesforce — ${SBS_CONTROLS.length} controls\n`,
          ...domains.map(
            (d) =>
              `  ${d.domain}: ${d.controlCount} controls (${d.critical} critical, ${d.high} high, ${d.moderate} moderate)`,
          ),
          `\nUsage: /sbs <domain> or /sbs <control-id>`,
        ];
        ctx.ui.notify(lines.join("\n"), "info");
        return;
      }

      // Check if it looks like a control ID (SBS-XXX-NNN)
      if (/^SBS-/i.test(trimmed)) {
        const control = getControlById(trimmed);
        if (control) {
          ctx.ui.notify(formatControl(control), "info");
        } else {
          ctx.ui.notify(`Control "${trimmed}" not found.`, "warning");
        }
        return;
      }

      // Try as domain name
      const domainNames: Domain[] = [
        "access-controls",
        "code-security",
        "deployments",
        "file-security",
      ];
      const matchedDomain = domainNames.find(
        (d) => d === trimmed.toLowerCase() || d.startsWith(trimmed.toLowerCase()),
      );

      if (matchedDomain) {
        const controls = getControlsByDomain(matchedDomain);
        const lines = [
          `${matchedDomain} — ${controls.length} controls:\n`,
          ...controls.map((c) => `  ${c.id}: ${c.title} [${c.risk}]`),
        ];
        ctx.ui.notify(lines.join("\n"), "info");
      } else {
        ctx.ui.notify(
          `Unknown argument "${trimmed}". Use a domain name or control ID.`,
          "warning",
        );
      }
    },
  });

  // ── tool_result: monitor write/edit to Salesforce files ──────────────

  pi.on("tool_result", async (event, ctx) => {
    if (event.toolName !== "write" && event.toolName !== "edit") return;

    const filePath =
      (event.input as Record<string, unknown>)?.path as string | undefined;
    if (!filePath || !isSalesforceFile(filePath)) return;

    const controls = getControlsForFile(filePath);
    if (controls.length === 0) return;

    const ids = controls.map((c) => c.id).join(", ");
    ctx.ui.notify(`[SBS] ${ids} may apply to ${filePath}`, "info");
  });
}
