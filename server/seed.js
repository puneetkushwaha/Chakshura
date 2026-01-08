// server/seed.js
// Loads JSON files from server/chakshura_seed/*.json and inserts into MongoDB.
// Usage:
//   node seed.js            -> inserts (without dropping existing collections)
//   node seed.js --drop     -> clears collections first, then inserts
// Make sure these files exist in server/chakshura_seed:
//   companies.json
//   market_reports.json
//   patents.json
//   research_papers.json

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

dotenv.config();

const Company = require("./models/Company");
const Investment = require("./models/Investment");
const Patent = require("./models/Patent");
const ResearchPaper = require("./models/ResearchPaper");

const MONGO_URI = process.env.MONGO_URI;

// sanitize URI to remove legacy options if present
function sanitizeMongoUri(uri) {
  if (!uri) return uri;
  return uri
    .replace(/([?&])(useNewUrlParser|useUnifiedTopology)=(true|false)(&?)/gi, "$1")
    .replace(/[?&]$/, "");
}

// safer logging (hide credentials)
function safeLogUri(uri) {
  try {
    return uri.replace(/\/\/(.*@)/, "//****:****@");
  } catch {
    return uri;
  }
}

function loadJSON(filename) {
  const filePath = path.join(__dirname, "chakshura_seed", filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  Missing file: ${filename} (expected at ${filePath})`);
    return null;
  }
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    console.error(`❌ Failed to parse ${filename}:`, e.message);
    return null;
  }
}

async function seed() {
  const cleanUri = sanitizeMongoUri(MONGO_URI);
  console.log("Connecting to:", safeLogUri(cleanUri));
  try {
    await mongoose.connect(cleanUri);
    console.log("Connected ✔");
  } catch (e) {
    console.error("❌ MongoDB connection failed:", e);
    process.exit(1);
  }

  const shouldDrop = process.argv.includes("--drop");
  try {
    if (shouldDrop) {
      console.log("Dropping collections...");
      await Promise.all([
        Company.deleteMany({}),
        Investment.deleteMany({}),
        Patent.deleteMany({}),
        ResearchPaper.deleteMany({}),
      ]);
      console.log("Collections cleared.");
    }

    // Files to load
    const filesToLoad = [
      { filename: "companies.json", model: Company, label: "Companies" },
      { filename: "investments.json", model: Investment, label: "Investment" },
      { filename: "patents.json", model: Patent, label: "Patents" },
      { filename: "research_papers.json", model: ResearchPaper, label: "Research Papers" },
    ];

    for (const file of filesToLoad) {
      console.log(`Loading ${file.label} from ${file.filename} ...`);
      const data = loadJSON(file.filename);
      if (!data) {
        console.log(`Skipping ${file.filename} (file missing or parse error).`);
        continue;
      }
      if (!Array.isArray(data)) {
        console.warn(`⚠️  ${file.filename} is not an array — expected top-level array of objects. Skipping.`);
        continue;
      }
      if (data.length === 0) {
        console.log(`No records in ${file.filename} — skipping insert.`);
        continue;
      }

      // Insert in batches to avoid huge single inserts
      const BATCH = 1000;
      for (let i = 0; i < data.length; i += BATCH) {
        const batch = data.slice(i, i + BATCH);
        await file.model.insertMany(batch, { ordered: false }).catch((err) => {
          // ordered:false allows continuing on duplicate key errors
          console.error(`Warning during insert of ${file.filename} batch starting at ${i}:`, err.message);
        });
        console.log(`Inserted ${Math.min(i + BATCH, data.length)} / ${data.length}`);
      }
    }

    console.log("🌱 Seed complete!");
  } catch (err) {
    console.error("Seed Error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected");
    process.exit(0);
  }
}

seed();
