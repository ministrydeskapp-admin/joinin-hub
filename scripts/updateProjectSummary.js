const fs = require("fs/promises");
const path = require("path");

const root = process.cwd();
const summaryPath = path.join(root, "PROJECT_SUMMARY.md");
const featuresPath = path.join(root, "features.md");
const schemaPath = path.join(root, "prisma", "schema.prisma");
const appPath = path.join(root, "app");

function formatRoute(routePath) {
  if (routePath === "") return "/";
  return `/${routePath}`;
}

function parseFeatures(text) {
  const sections = {
    mvp: [],
    highPriority: [],
    mediumPriority: [],
    future: [],
    publicPageCleanup: [],
  };

  const sectionRegex = /##\s+([^\n]+)\n([\s\S]*?)(?=##\s+|$)/g;
  let match;
  while ((match = sectionRegex.exec(text))) {
    const heading = match[1].trim();
    const body = match[2].trim();
    const items = body
      .split("\n")
      .map((line) => line.trim().replace(/^[-*]\s*/, ""))
      .filter((line) => line.length > 0);

    if (heading === "MVP Completed") {
      sections.mvp.push(...items);
    } else if (heading === "High Priority") {
      sections.highPriority.push(...items);
    } else if (heading === "Medium Priority") {
      sections.mediumPriority.push(...items);
    } else if (heading === "Future") {
      sections.future.push(...items);
    } else if (heading === "Public Page Cleanup") {
      sections.publicPageCleanup.push(...items);
    }
  }

  return sections;
}

function parsePrismaModels(text) {
  const models = [];
  const regex = /model\s+(\w+)\s*{([\s\S]*?)}/g;
  let match;

  while ((match = regex.exec(text))) {
    const name = match[1];
    const body = match[2]
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.startsWith("//"));

    models.push({ name, body });
  }

  return models;
}

async function scanRoutes() {
  const routes = [];

  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.isFile() && entry.name === "page.tsx") {
        const relative = path.relative(appPath, fullPath);
        const route = relative
          .replace(/\\/g, "/")
          .replace(/(^|\/)page\.tsx$/, "")
          .replace(/(^|\/)index$/, "");

        const routePath = route === "" ? "" : route;
        const pageDir = path.dirname(fullPath);
        const extras = [];

        for (const file of ["actions.ts", "page.tsx", "layout.tsx", "CopyLinkButton.tsx"]) {
          if (file !== "page.tsx") {
            const candidate = path.join(pageDir, file);
            try {
              await fs.access(candidate);
              extras.push(file);
            } catch {
              // ignore
            }
          }
        }

        routes.push({ routePath, pageFile: fullPath, extras });
      }
    }
  }

  await walk(appPath);
  routes.sort((a, b) => a.routePath.localeCompare(b.routePath));
  return routes;
}

function buildMarkdown({ routes, models, features, preserved }) {
  const lines = [];

  lines.push("# Current Architecture", "", "## Routes");
  for (const route of routes) {
    lines.push(`- \`${formatRoute(route.routePath)}\` — \`${path.relative(root, route.pageFile).replace(/\\/g, "/")}\``);
    for (const extra of route.extras) {
      lines.push(`  - \`app/${path.relative(appPath, path.dirname(route.pageFile)).replace(/\\/g, "/")}/${extra}\``);
    }
  }

  lines.push("", "## Prisma Schema", "- `prisma/schema.prisma`", "", "### Models");
  for (const model of models) {
    lines.push(`- \`${model.name}\``);
    for (const line of model.body) {
      lines.push(`  - ${line}`);
    }
    lines.push("");
  }

  lines.push("## Features Completed");
  if (features.mvp.length > 0) {
    for (const item of features.mvp) {
      lines.push(`- ${item}`);
    }
  }

  lines.push("", "## Features Planned", "### High Priority");
  for (const item of features.highPriority) {
    lines.push(`- ${item}`);
  }
  lines.push("", "### Medium Priority");
  for (const item of features.mediumPriority) {
    lines.push(`- ${item}`);
  }
  lines.push("", "### Future");
  for (const item of features.future) {
    lines.push(`- ${item}`);
  }
  lines.push("", "### Public Page Cleanup");
  for (const item of features.publicPageCleanup) {
    lines.push(`- ${item}`);
  }

  lines.push(
    "",
    "## Current Data Flow",
    "1. A creator fills `/create`",
    "2. `createSignupSheet` stores `Event` and `SignupSlot` records",
    "3. Public users visit `/e/[publicSlug]`",
    "4. They select open slots and submit `claimSlots`",
    "5. Admins manage events via `/admin/[adminKey]`",
    ""
  );

  if (preserved) {
    lines.push(
      "## Recent Changes",
      "",
      ...preserved.recentChanges,
      "",
      "## Notes",
      "",
      ...preserved.notes,
      "",
      "## Source of Truth",
      "- Planned feature work is maintained in `features.md`",
      "- Current implementation and architecture are documented in `PROJECT_SUMMARY.md`"
    );
  } else {
    lines.push(
      "## Recent Changes",
      "- UPDATE: Run `npm run update-summary` to refresh this section with the latest project state.",
      "",
      "## Notes",
      "- `DATABASE_URL` is required for Prisma and must point to a reachable Postgres-compatible database.",
      "- The admin key currently functions as the authorization token for admin operations.",
      "- Additional future improvements could include:",
      "  - a dedicated authentication layer for admin users",
      "  - better user-facing validation errors on forms",
      "  - more robust duplicate-claim handling with transactions",
      "  - server-side pagination or filtering for dashboard results",
      "",
      "## Source of Truth",
      "- Planned feature work is maintained in `features.md`",
      "- Current implementation and architecture are documented in `PROJECT_SUMMARY.md"
    );
  }

  return lines.join("\n");
}

function preserveSections(existing) {
  const recentMatch = existing.match(/## Recent Changes[\s\S]*?(?=## Notes|$)/);
  const notesMatch = existing.match(/## Notes[\s\S]*?(?=## Source of Truth|$)/);

  return {
    recentChanges: recentMatch
      ? recentMatch[0].split("\n").slice(1).map((line) => line)
      : [],
    notes: notesMatch
      ? notesMatch[0].split("\n").slice(1).map((line) => line)
      : [],
  };
}

async function main() {
  const [featuresText, schemaText, existingSummary] = await Promise.all([
    fs.readFile(featuresPath, "utf8"),
    fs.readFile(schemaPath, "utf8"),
    fs.readFile(summaryPath, "utf8").catch(() => ""),
  ]);

  const features = parseFeatures(featuresText);
  const models = parsePrismaModels(schemaText);
  const routes = await scanRoutes();
  const preserved = existingSummary ? preserveSections(existingSummary) : null;

  const output = buildMarkdown({ routes, models, features, preserved });
  await fs.writeFile(summaryPath, output, "utf8");

  console.log("PROJECT_SUMMARY.md has been updated.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
