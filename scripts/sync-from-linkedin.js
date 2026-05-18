#!/usr/bin/env node
/**
 * sync-from-linkedin.js
 *
 * Parses your LinkedIn data export ZIP and rewrites the three content
 * components that contain career data:
 *   - components/expBox.js
 *   - components/educationBox.js
 *   - components/skillsetBox.js
 *
 * Usage:
 *   node scripts/sync-from-linkedin.js <path-to-linkedin-export.zip>
 *
 * Requirements (all built-in to Node 18+, or install adm-zip):
 *   npm install adm-zip --save-dev
 *
 * After running, do your normal:
 *   npm run build && npm run export
 *   then push the out/ folder to GitHub Pages.
 */

"use strict";

const AdmZip = require("adm-zip");
const path = require("path");
const fs = require("fs");

// ── Paths ────────────────────────────────────────────────────────────────────
const ROOT = path.resolve(__dirname, "..");
const COMPONENTS = path.join(ROOT, "components");

// ── CLI arg ──────────────────────────────────────────────────────────────────
const zipPath = process.argv[2];
if (!zipPath) {
  console.error(
    "\nUsage: node scripts/sync-from-linkedin.js <path-to-linkedin-export.zip>\n"
  );
  process.exit(1);
}
if (!fs.existsSync(zipPath)) {
  console.error(`\nFile not found: ${zipPath}\n`);
  process.exit(1);
}

console.log(`\n📦 Reading ZIP: ${zipPath}`);
const zip = new AdmZip(zipPath);

// ── Helper: read a CSV from the ZIP ─────────────────────────────────────────
function readCsv(filename) {
  // LinkedIn sometimes nests files in a subfolder inside the ZIP
  const entry =
    zip.getEntry(filename) ||
    zip.getEntries().find((e) => e.entryName.endsWith("/" + filename));

  if (!entry) {
    console.warn(`  ⚠️  ${filename} not found in ZIP — skipping.`);
    return [];
  }

  const text = entry.getData().toString("utf8");
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];

  // Parse header row
  const headers = parseCsvLine(lines[0]);

  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const obj = {};
    headers.forEach((h, i) => {
      obj[h.trim()] = (values[i] || "").trim();
    });
    return obj;
  });
}

// Naive but sufficient CSV line parser (handles quoted fields with commas)
function parseCsvLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

// ── Helper: format a LinkedIn date like "Jan 2023" → "Jan 2023"
//    LinkedIn exports dates as "Month Year" or just "Year"
function fmtDate(raw) {
  if (!raw || raw.trim() === "") return "Present";
  return raw.trim();
}

// ── Helper: escape JSX special chars ─────────────────────────────────────────
function esc(str) {
  return (str || "")
    .replace(/&/g, "&amp;")
    .replace(/'/g, "&apos;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// ── Write helper ─────────────────────────────────────────────────────────────
function write(filename, content) {
  const dest = path.join(COMPONENTS, filename);
  fs.writeFileSync(dest, content, "utf8");
  console.log(`  ✅ Written: components/${filename}`);
}

// ════════════════════════════════════════════════════════════════════════════
// 1. EXPERIENCE  (Positions.csv)
// ════════════════════════════════════════════════════════════════════════════
(function syncExperience() {
  const rows = readCsv("Positions.csv");
  if (!rows.length) return;

  // Columns LinkedIn uses: "Company Name", "Title", "Description",
  // "Location", "Started On", "Finished On"
  const entries = rows
    .filter((r) => r["Company Name"] || r["Title"])
    .map((r) => ({
      role: esc(r["Title"] || ""),
      company: esc(r["Company Name"] || ""),
      period:
        fmtDate(r["Started On"]) +
        " — " +
        fmtDate(r["Finished On"]),
      location: esc(r["Location"] || ""),
      desc: esc(r["Description"] || ""),
    }));

  const entriesJsx = entries
    .map(
      (e) => `
      <div className="timeline-entry">
        <div className="timeline-role">${e.role}</div>
        <div className="timeline-company">${e.company}${e.location ? ` · ${e.location}` : ""}</div>
        <div className="timeline-period">${e.period}</div>
        ${e.desc ? `<div className="timeline-desc">${e.desc}</div>` : ""}
      </div>`
    )
    .join("\n");

  write(
    "expBox.js",
    `import * as React from "react";
import "aos/dist/aos.css";

const ExpBox = () => {
  return (
    <section id="experience" data-aos="fade-up" data-aos-duration="700" className="glass-card">
      <p className="section-label">03 — Experience</p>
      <h2
        style={{
          margin: "0 0 20px",
          fontSize: "1.6rem",
          fontWeight: 700,
          fontFamily: "Dosis, sans-serif",
          borderBottom: "1px solid rgba(0,0,0,0.15)",
          paddingBottom: 10,
        }}
      >
        Experience
      </h2>
      ${entriesJsx}
    </section>
  );
};

export default ExpBox;
`
  );
})();

// ════════════════════════════════════════════════════════════════════════════
// 2. EDUCATION  (Education.csv)
// ════════════════════════════════════════════════════════════════════════════
(function syncEducation() {
  const rows = readCsv("Education.csv");
  if (!rows.length) return;

  // Columns: "School Name", "Start Date", "End Date", "Notes",
  //          "Degree Name", "Activities"
  const entries = rows
    .filter((r) => r["School Name"])
    .map((r) => ({
      school: esc(r["School Name"] || ""),
      degree: esc(r["Degree Name"] || ""),
      period:
        fmtDate(r["Start Date"]) +
        " — " +
        fmtDate(r["End Date"]),
      notes: esc(r["Notes"] || ""),
      activities: esc(r["Activities"] || ""),
    }));

  const entriesJsx = entries
    .map(
      (e) => `
      <div className="timeline-entry">
        <div className="timeline-role">${e.degree || e.school}</div>
        <div className="timeline-company">${e.school}</div>
        <div className="timeline-period">${e.period}</div>
        ${e.notes ? `<div className="timeline-desc">${e.notes}</div>` : ""}
        ${e.activities ? `<div className="timeline-desc"><em>Activities:</em> ${e.activities}</div>` : ""}
      </div>`
    )
    .join("\n");

  write(
    "educationBox.js",
    `import * as React from "react";
import "aos/dist/aos.css";

const EducationBox = () => {
  return (
    <section id="education" data-aos="fade-up" data-aos-duration="700" className="glass-card">
      <p className="section-label">02 — Education</p>
      <h2
        style={{
          margin: "0 0 20px",
          fontSize: "1.6rem",
          fontWeight: 700,
          fontFamily: "Dosis, sans-serif",
          borderBottom: "1px solid rgba(0,0,0,0.15)",
          paddingBottom: 10,
        }}
      >
        Education
      </h2>
      ${entriesJsx}
    </section>
  );
};

export default EducationBox;
`
  );
})();

// ════════════════════════════════════════════════════════════════════════════
// 3. SKILLS  (Skills.csv)
// ════════════════════════════════════════════════════════════════════════════
(function syncSkills() {
  const rows = readCsv("Skills.csv");
  if (!rows.length) return;

  // LinkedIn's Skills.csv has a single column: "Name"
  const allSkills = rows
    .map((r) => (r["Name"] || r["Skill"] || Object.values(r)[0] || "").trim())
    .filter(Boolean);

  // Auto-bucket skills into groups by keyword matching
  const groups = {
    "Data Science & ML": [],
    "Backend & APIs": [],
    Frontend: [],
    Languages: [],
    Other: [],
  };

  const matchers = {
    "Data Science & ML": /python|machine.?learn|data|ml|ai|nlp|scikit|pandas|numpy|tensorflow|keras|r\b|visuali|jupyter|statistics/i,
    "Backend & APIs": /node|fastapi|api|rest|graphql|c#|\.net|express|sql|database|mongo|postgres|back.?end/i,
    Frontend: /react|next|html|css|javascript|typescript|js\b|tsx?|front.?end|vue|angular|ui\b/i,
    Languages: /english|greek|spanish|french|italian|croatian|german|language/i,
  };

  allSkills.forEach((skill) => {
    let placed = false;
    for (const [group, regex] of Object.entries(matchers)) {
      if (regex.test(skill)) {
        groups[group].push(skill);
        placed = true;
        break;
      }
    }
    if (!placed) groups["Other"].push(skill);
  });

  // Remove empty groups
  const activeGroups = Object.entries(groups).filter(([, v]) => v.length > 0);

  const groupsCode = JSON.stringify(
    activeGroups.map(([category, chips]) => ({ category, chips })),
    null,
    2
  );

  write(
    "skillsetBox.js",
    `import * as React from "react";
import "aos/dist/aos.css";

const SKILL_GROUPS = ${groupsCode};

const SkillsetBox = () => {
  return (
    <section id="skills" data-aos="fade-up" data-aos-duration="700" className="glass-card">
      <p className="section-label">04 — Skills</p>
      <h2
        style={{
          margin: "0 0 20px",
          fontSize: "1.6rem",
          fontWeight: 700,
          fontFamily: "Dosis, sans-serif",
          borderBottom: "1px solid rgba(0,0,0,0.15)",
          paddingBottom: 10,
        }}
      >
        Skillset
      </h2>
      {SKILL_GROUPS.map((group) => (
        <div key={group.category} style={{ marginBottom: 18 }}>
          <div
            style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(0,0,0,0.45)",
              marginBottom: 8,
              fontFamily: "Dosis, sans-serif",
            }}
          >
            {group.category}
          </div>
          <div>
            {group.chips.map((chip) => (
              <span key={chip} className="skill-chip">
                {chip}
              </span>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

export default SkillsetBox;
`
  );
})();

console.log("\n🎉 Done! Now run:\n   npm run build && npm run export\n   then push out/ to GitHub Pages.\n");
