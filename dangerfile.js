// dangerfile.js
const prBody = (danger.github.pr.body || "").toLowerCase();

// Sections we require
const requiredSections = ["## ✨ summary", "## 🔄 changes"];

// Check that required headings exist
const missing = requiredSections.filter(h => !prBody.includes(h.toLowerCase()));

// Also check that "Changes" has at least one bullet point
let changesHasBullet = false;
const changesMatch = prBody.match(/## 🔄 changes([\s\S]*?)(##|$)/i);
if (changesMatch) {
  const changesContent = changesMatch[1] || "";
  changesHasBullet = /\*\*/.test(changesContent); // Looks for **Added**, **Changed**, etc.
}

if (missing.length > 0) {
  fail(`PR description is missing section(s): ${missing.join(", ")}`);
}

if (!changesHasBullet) {
  fail(`The "Changes" section must list at least one bullet (e.g., **Added**: ...)`);
}

// Optional: Warn if "Summary" is too short
const summaryMatch = prBody.match(/## ✨ summary([\s\S]*?)(##|$)/i);
if (summaryMatch) {
  const summaryText = (summaryMatch[1] || "").trim();
  if (summaryText.length < 30) {
    warn("The Summary section looks short — consider expanding for clarity.");
  }
}
