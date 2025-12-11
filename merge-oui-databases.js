#!/usr/bin/env node
// Merge IEEE, Wireshark, and Nmap OUI databases into one master list

const fs = require('fs');
const path = require('path');

const SOURCES_DIR = 'sources';
const OUTPUT_DIR = 'LISTS';

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log('🔀 OUI Database Merger');
console.log('======================\n');

// Master database (Map for deduplication)
const masterDB = new Map();

// Statistics
const stats = {
  ieee_mal: 0,
  ieee_mam: 0,
  ieee_mas: 0,
  ieee_iab: 0,
  ieee_cid: 0,
  wireshark: 0,
  nmap: 0,
  mac_tracker: 0,
  merged: 0,
  unique: 0
};

// =====================
// Load HDM Mac-Tracker Historical Data
// =====================
let macTrackerHistory = {};
const macTrackerPath = path.join(SOURCES_DIR, 'mac_tracker_history.json');
if (fs.existsSync(macTrackerPath)) {
  console.log('📖 Loading HDM mac-tracker historical data...');
  try {
    const rawData = fs.readFileSync(macTrackerPath, 'utf8');
    const macTrackerData = JSON.parse(rawData);

    // Build a lookup map: OUI -> first registration date
    for (const [key, history] of Object.entries(macTrackerData)) {
      // Key format: "000000000000/24" -> extract first 6 hex chars for MA-L
      const hexPart = key.split('/')[0].toLowerCase();
      const prefixLength = parseInt(key.split('/')[1]) || 24;

      // Find the first "add" entry for registration date
      const addEntry = history.find(h => h.t === 'add');
      if (addEntry && addEntry.d) {
        let ouiKey;
        if (prefixLength === 24) {
          // MA-L: first 6 hex chars
          const oui = hexPart.substring(0, 6).toUpperCase();
          ouiKey = `${oui.substr(0,2)}:${oui.substr(2,2)}:${oui.substr(4,2)}`;
        } else if (prefixLength === 28) {
          // MA-M: first 7 hex chars
          const oui = hexPart.substring(0, 7).toUpperCase();
          ouiKey = `${oui.substr(0,2)}:${oui.substr(2,2)}:${oui.substr(4,2)}:${oui.substr(6,1)}`;
        } else if (prefixLength === 36) {
          // MA-S/IAB: first 9 hex chars
          const oui = hexPart.substring(0, 9).toUpperCase();
          ouiKey = `${oui.substr(0,2)}:${oui.substr(2,2)}:${oui.substr(4,2)}:${oui.substr(6,2)}:${oui.substr(8,1)}`;
        }

        if (ouiKey && !macTrackerHistory[ouiKey]) {
          macTrackerHistory[ouiKey] = addEntry.d;
          stats.mac_tracker++;
        }
      }
    }
    console.log(`✅ Mac-Tracker: ${stats.mac_tracker} registration dates loaded\n`);
  } catch (err) {
    console.log(`⚠️  Mac-Tracker: Failed to parse (${err.message}), continuing without historical dates...\n`);
  }
} else {
  console.log('⚠️  Mac-Tracker: File not found, run download-sources.sh first\n');
}

// =====================
// Helper: Parse IEEE CSV format
// =====================
function parseIEEECSV(filePath, registryType, statKey) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${registryType}: File not found, skipping...`);
    return;
  }

  const csvContent = fs.readFileSync(filePath, 'utf8');
  const lines = csvContent.split('\n');

  for (let i = 1; i < lines.length; i++) {  // Skip header
    const line = lines[i].trim();
    if (!line) continue;

    try {
      // Parse CSV: Registry,Assignment,Organization Name,Organization Address
      const matches = line.match(/([^,]*),([^,"]*|"[^"]*"),("(?:[^"]|"")*"|[^,]*),("(?:[^"]|"")*"|[^,]*)/);
      if (!matches) continue;

      const registry = matches[1].trim() || registryType;
      let assignment = matches[2].trim().replace(/"/g, '');
      let orgName = matches[3].trim().replace(/"/g, '').replace(/""/g, '"');
      const orgAddress = matches[4].trim().replace(/"/g, '').replace(/""/g, '"');

      if (!assignment || !orgName) continue;

      // Normalize assignment to uppercase
      assignment = assignment.toUpperCase();

      // Store the full assignment for MA-M (7 chars), MA-S (9 chars), IAB (9 chars)
      // But also create a normalized key for lookups
      let ouiKey = assignment;
      let ouiDisplay = assignment;

      // Format based on length
      if (assignment.length === 6) {
        // MA-L: 6 hex chars -> XX:XX:XX
        ouiKey = `${assignment.substr(0,2)}:${assignment.substr(2,2)}:${assignment.substr(4,2)}`;
        ouiDisplay = ouiKey;
      } else if (assignment.length === 7) {
        // MA-M: 7 hex chars -> XX:XX:XX:X (28-bit)
        ouiKey = `${assignment.substr(0,2)}:${assignment.substr(2,2)}:${assignment.substr(4,2)}:${assignment.substr(6,1)}`;
        ouiDisplay = ouiKey;
      } else if (assignment.length === 9) {
        // MA-S/IAB: 9 hex chars -> XX:XX:XX:XX:X (36-bit)
        ouiKey = `${assignment.substr(0,2)}:${assignment.substr(2,2)}:${assignment.substr(4,2)}:${assignment.substr(6,2)}:${assignment.substr(8,1)}`;
        ouiDisplay = ouiKey;
      }

      // Clean up org name
      orgName = orgName.replace(/,$/, '').replace(/\s+/g, ' ').trim();

      if (masterDB.has(ouiKey)) {
        // Merge with existing entry
        const existing = masterDB.get(ouiKey);
        if (!existing.sources.includes('IEEE')) {
          existing.sources.push('IEEE');
        }
        stats.merged++;
      } else {
        masterDB.set(ouiKey, {
          oui: ouiDisplay,
          manufacturer: orgName,
          registry: registry,
          short_name: null,
          device_type: null,
          address: orgAddress,
          registered_date: macTrackerHistory[ouiKey] || null,
          sources: ['IEEE']
        });
      }

      stats[statKey]++;
    } catch (err) {
      // Skip malformed lines
    }
  }
}

// =====================
// 1. Parse IEEE MA-L (Large - Traditional OUI)
// =====================
console.log('📖 [1/7] Parsing IEEE MA-L (OUI) database...');
parseIEEECSV(path.join(SOURCES_DIR, 'ieee_mal.csv'), 'MA-L', 'ieee_mal');
console.log(`✅ IEEE MA-L: ${stats.ieee_mal} entries parsed\n`);

// =====================
// 2. Parse IEEE MA-M (Medium - 28-bit)
// =====================
console.log('📖 [2/7] Parsing IEEE MA-M database...');
parseIEEECSV(path.join(SOURCES_DIR, 'ieee_mam.csv'), 'MA-M', 'ieee_mam');
console.log(`✅ IEEE MA-M: ${stats.ieee_mam} entries parsed\n`);

// =====================
// 3. Parse IEEE MA-S (Small - 36-bit)
// =====================
console.log('📖 [3/7] Parsing IEEE MA-S database...');
parseIEEECSV(path.join(SOURCES_DIR, 'ieee_mas.csv'), 'MA-S', 'ieee_mas');
console.log(`✅ IEEE MA-S: ${stats.ieee_mas} entries parsed\n`);

// =====================
// 4. Parse IEEE IAB (Individual Address Blocks)
// =====================
console.log('📖 [4/7] Parsing IEEE IAB database...');
parseIEEECSV(path.join(SOURCES_DIR, 'ieee_iab.csv'), 'IAB', 'ieee_iab');
console.log(`✅ IEEE IAB: ${stats.ieee_iab} entries parsed\n`);

// =====================
// 5. Parse IEEE CID (Company ID)
// =====================
console.log('📖 [5/7] Parsing IEEE CID database...');
parseIEEECSV(path.join(SOURCES_DIR, 'ieee_cid.csv'), 'CID', 'ieee_cid');
console.log(`✅ IEEE CID: ${stats.ieee_cid} entries parsed\n`);

// =====================
// 6. Parse Wireshark
// =====================
console.log('📖 [6/7] Parsing Wireshark manufacturer database...');

const wiresharkTXT = fs.readFileSync(path.join(SOURCES_DIR, 'wireshark_manuf.txt'), 'utf8');
const wiresharkLines = wiresharkTXT.split('\n');

for (const line of wiresharkLines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;

  try {
    // Format: XX:XX:XX	ShortName	LongName # Comment
    // Or:     XX:XX:XX	ShortName
    const parts = trimmed.split('\t');
    if (parts.length < 2) continue;

    let oui = parts[0].trim().toUpperCase();
    const shortName = parts[1].trim();
    const longName = parts[2]?.split('#')[0].trim();

    // Normalize OUI format (handle 6-digit, 7-digit, 9-digit formats)
    if (oui.includes(':')) {
      // Already in XX:XX:XX format
    } else if (oui.length === 6) {
      oui = `${oui.substr(0,2)}:${oui.substr(2,2)}:${oui.substr(4,2)}`;
    } else if (oui.length === 7) {
      // 28-bit OUI (MA-M): XX:XX:XX:X
      oui = `${oui.substr(0,2)}:${oui.substr(2,2)}:${oui.substr(4,2)}`;
    } else if (oui.length === 9) {
      // 36-bit OUI (MA-S): XX:XX:XX:XX:X
      oui = `${oui.substr(0,2)}:${oui.substr(2,2)}:${oui.substr(4,2)}`;
    }

    const manufacturer = longName || shortName;

    if (masterDB.has(oui)) {
      // Merge with existing entry
      const existing = masterDB.get(oui);
      existing.short_name = existing.short_name || shortName;
      if (longName) existing.manufacturer = longName;  // Prefer longer name
      existing.sources.push('Wireshark');
      stats.merged++;
    } else {
      // New entry
      masterDB.set(oui, {
        oui,
        manufacturer,
        registry: 'MA-L',
        short_name: shortName,
        device_type: null,
        address: null,
        registered_date: macTrackerHistory[oui] || null,
        sources: ['Wireshark']
      });
    }

    stats.wireshark++;
  } catch (err) {
    // Skip malformed lines
  }
}

console.log(`✅ Wireshark: ${stats.wireshark} entries parsed\n`);

// =====================
// 7. Parse Nmap
// =====================
console.log('📖 [7/7] Parsing Nmap MAC prefixes...');

const nmapTXT = fs.readFileSync(path.join(SOURCES_DIR, 'nmap_prefixes.txt'), 'utf8');
const nmapLines = nmapTXT.split('\n');

for (const line of nmapLines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;

  try {
    // Format: XXXX Manufacturer Name
    const parts = trimmed.split(' ');
    if (parts.length < 2) continue;

    let prefix = parts[0].trim().toUpperCase();
    const manufacturer = parts.slice(1).join(' ').trim();

    // Convert to XX:XX:XX format
    if (prefix.length === 6) {
      prefix = `${prefix.substr(0,2)}:${prefix.substr(2,2)}:${prefix.substr(4,2)}`;
    }

    if (masterDB.has(prefix)) {
      // Merge with existing entry
      const existing = masterDB.get(prefix);
      existing.sources.push('Nmap');
      stats.merged++;
    } else {
      // New entry
      masterDB.set(prefix, {
        oui: prefix,
        manufacturer,
        registry: 'MA-L',
        short_name: null,
        device_type: null,
        address: null,
        registered_date: macTrackerHistory[prefix] || null,
        sources: ['Nmap']
      });
    }

    stats.nmap++;
  } catch (err) {
    // Skip malformed lines
  }
}

console.log(`✅ Nmap: ${stats.nmap} entries parsed\n`);

// =====================
// 4. Generate Outputs
// =====================
console.log('💾 Generating output files...\n');

stats.unique = masterDB.size;

// 4.1: CSV Output
const csvLines = ['oui,manufacturer,registry,short_name,device_type,registered_date,address,sources'];
for (const [oui, entry] of masterDB) {
  const escapedManufacturer = entry.manufacturer.replace(/"/g, '""');
  const escapedAddress = (entry.address || '').replace(/"/g, '""');
  const sources = entry.sources.join('+');
  csvLines.push(
    `${entry.oui},"${escapedManufacturer}",${entry.registry},${entry.short_name || ''},${entry.device_type || ''},${entry.registered_date || ''},"${escapedAddress}",${sources}`
  );
}
fs.writeFileSync(path.join(OUTPUT_DIR, 'master_oui.csv'), csvLines.join('\n'));
console.log(`✅ CSV: ${OUTPUT_DIR}/master_oui.csv (${stats.unique} entries)`);

// 4.2: JSON Output (compact lookup format)
const jsonDB = {};
for (const [oui, entry] of masterDB) {
  jsonDB[oui] = {
    manufacturer: entry.manufacturer,
    registry: entry.registry,
    short_name: entry.short_name,
    device_type: entry.device_type,
    registered_date: entry.registered_date,
    sources: entry.sources
  };
}
fs.writeFileSync(
  path.join(OUTPUT_DIR, 'master_oui.json'),
  JSON.stringify(jsonDB, null, 2)
);
console.log(`✅ JSON: ${OUTPUT_DIR}/master_oui.json (${stats.unique} entries)`);

// 4.3: SQL Output (Cloudflare D1 / SQLite format)
const sqlLines = [
  '-- Master OUI Database Import',
  '-- Generated: ' + new Date().toISOString(),
  '-- Total Entries: ' + stats.unique,
  '',
  'CREATE TABLE IF NOT EXISTS oui_registry (',
  '  oui TEXT PRIMARY KEY,',
  '  manufacturer TEXT NOT NULL,',
  '  registry TEXT,',
  '  short_name TEXT,',
  '  device_type TEXT,',
  '  registered_date TEXT,',
  '  address TEXT,',
  '  sources TEXT,',
  '  last_updated TEXT DEFAULT CURRENT_TIMESTAMP',
  ');',
  '',
  'CREATE INDEX IF NOT EXISTS idx_oui_manufacturer ON oui_registry(manufacturer);',
  'CREATE INDEX IF NOT EXISTS idx_oui_short_name ON oui_registry(short_name);',
  'CREATE INDEX IF NOT EXISTS idx_oui_registered_date ON oui_registry(registered_date);',
  ''
];

// Batch INSERT (500 entries per batch for D1)
const BATCH_SIZE = 500;
const ouiArray = Array.from(masterDB.values());

for (let i = 0; i < ouiArray.length; i += BATCH_SIZE) {
  const batch = ouiArray.slice(i, i + BATCH_SIZE);
  sqlLines.push(`-- Batch ${Math.floor(i / BATCH_SIZE) + 1} (${batch.length} entries)`);
  sqlLines.push('INSERT OR IGNORE INTO oui_registry (oui, manufacturer, registry, short_name, device_type, registered_date, address, sources) VALUES');

  const values = batch.map(entry => {
    const escapedManuf = entry.manufacturer.replace(/'/g, "''");
    const escapedAddr = (entry.address || '').replace(/'/g, "''");
    const sources = entry.sources.join('+');
    return `  ('${entry.oui}', '${escapedManuf}', '${entry.registry}', ${entry.short_name ? "'" + entry.short_name.replace(/'/g, "''") + "'" : 'NULL'}, ${entry.device_type ? "'" + entry.device_type + "'" : 'NULL'}, ${entry.registered_date ? "'" + entry.registered_date + "'" : 'NULL'}, '${escapedAddr}', '${sources}')`;
  });

  sqlLines.push(values.join(',\n') + ';');
  sqlLines.push('');
}

fs.writeFileSync(path.join(OUTPUT_DIR, 'import-to-d1.sql'), sqlLines.join('\n'));
console.log(`✅ SQL: ${OUTPUT_DIR}/import-to-d1.sql (${Math.ceil(ouiArray.length / BATCH_SIZE)} batches)`);

// 4.4: TXT Output (Nmap-style simple format: AABBCC<tab>Vendor Name)
const txtLines = [
  '# OUI Master Database - Simple Format',
  '# Generated: ' + new Date().toISOString(),
  '# Total Entries: ' + stats.unique,
  '# Format: OUI<tab>Manufacturer',
  '#'
];
for (const [oui, entry] of masterDB) {
  // Convert XX:XX:XX to XXXXXX for compatibility with grep/awk tools
  const ouiCompact = entry.oui.replace(/:/g, '').substring(0, 6);
  txtLines.push(`${ouiCompact}\t${entry.manufacturer}`);
}
fs.writeFileSync(path.join(OUTPUT_DIR, 'master_oui.txt'), txtLines.join('\n'));
console.log(`✅ TXT: ${OUTPUT_DIR}/master_oui.txt (${stats.unique} entries)`);

// 4.5: TSV Output (Tab-separated, clean import to Excel/Sheets)
const tsvLines = ['OUI\tManufacturer\tRegistry\tShort_Name\tRegistered_Date\tSources'];
for (const [oui, entry] of masterDB) {
  const sources = entry.sources.join('+');
  tsvLines.push(`${entry.oui}\t${entry.manufacturer}\t${entry.registry}\t${entry.short_name || ''}\t${entry.registered_date || ''}\t${sources}`);
}
fs.writeFileSync(path.join(OUTPUT_DIR, 'master_oui.tsv'), tsvLines.join('\n'));
console.log(`✅ TSV: ${OUTPUT_DIR}/master_oui.tsv (${stats.unique} entries)`);

// 4.6: Compact JSON (single-line, faster loading for scripts)
fs.writeFileSync(
  path.join(OUTPUT_DIR, 'master_oui.min.json'),
  JSON.stringify(jsonDB)
);
console.log(`✅ JSON (compact): ${OUTPUT_DIR}/master_oui.min.json (${stats.unique} entries)`);

// 4.7: XML Output (Enterprise/Java applications)
const xmlLines = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<!-- OUI Master Database -->',
  '<!-- Generated: ' + new Date().toISOString() + ' -->',
  '<!-- Total Entries: ' + stats.unique + ' -->',
  '<oui_database>'
];
for (const [oui, entry] of masterDB) {
  const escapeXml = (str) => (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
  xmlLines.push('  <entry>');
  xmlLines.push(`    <oui>${escapeXml(entry.oui)}</oui>`);
  xmlLines.push(`    <manufacturer>${escapeXml(entry.manufacturer)}</manufacturer>`);
  xmlLines.push(`    <registry>${escapeXml(entry.registry)}</registry>`);
  if (entry.short_name) xmlLines.push(`    <short_name>${escapeXml(entry.short_name)}</short_name>`);
  if (entry.registered_date) xmlLines.push(`    <registered_date>${entry.registered_date}</registered_date>`);
  xmlLines.push(`    <sources>${entry.sources.join(',')}</sources>`);
  xmlLines.push('  </entry>');
}
xmlLines.push('</oui_database>');
fs.writeFileSync(path.join(OUTPUT_DIR, 'master_oui.xml'), xmlLines.join('\n'));
console.log(`✅ XML: ${OUTPUT_DIR}/master_oui.xml (${stats.unique} entries)`);

// 4.8: SQLite Database (ready-to-query, no import needed)
const Database = require('better-sqlite3');
const dbPath = path.join(OUTPUT_DIR, 'master_oui.db');
if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
const db = new Database(dbPath);
db.exec(`
  CREATE TABLE oui_registry (
    oui TEXT PRIMARY KEY,
    manufacturer TEXT NOT NULL,
    registry TEXT,
    short_name TEXT,
    device_type TEXT,
    registered_date TEXT,
    address TEXT,
    sources TEXT
  );
  CREATE INDEX idx_manufacturer ON oui_registry(manufacturer);
  CREATE INDEX idx_short_name ON oui_registry(short_name);
  CREATE INDEX idx_registry ON oui_registry(registry);
  CREATE INDEX idx_registered_date ON oui_registry(registered_date);
`);
const insertStmt = db.prepare('INSERT INTO oui_registry (oui, manufacturer, registry, short_name, device_type, registered_date, address, sources) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
const insertMany = db.transaction((entries) => {
  for (const entry of entries) {
    insertStmt.run(entry.oui, entry.manufacturer, entry.registry, entry.short_name, entry.device_type, entry.registered_date, entry.address || '', entry.sources.join('+'));
  }
});
insertMany(Array.from(masterDB.values()));
db.close();
console.log(`✅ SQLite: ${OUTPUT_DIR}/master_oui.db (${stats.unique} entries)`);

// 4.9: Statistics Report
const totalIEEE = stats.ieee_mal + stats.ieee_mam + stats.ieee_mas + stats.ieee_iab + stats.ieee_cid;
const statsReport = `OUI Database Merge Statistics
==============================

IEEE Registries Processed:
  MA-L (Large/OUI):   ${stats.ieee_mal.toLocaleString()} entries
  MA-M (Medium):      ${stats.ieee_mam.toLocaleString()} entries
  MA-S (Small):       ${stats.ieee_mas.toLocaleString()} entries
  IAB (Individual):   ${stats.ieee_iab.toLocaleString()} entries
  CID (Company ID):   ${stats.ieee_cid.toLocaleString()} entries
  ─────────────────────────────────
  IEEE Total:         ${totalIEEE.toLocaleString()} entries

Community Sources:
  Wireshark:          ${stats.wireshark.toLocaleString()} entries
  Nmap:               ${stats.nmap.toLocaleString()} entries

Historical Data:
  Mac-Tracker:        ${stats.mac_tracker.toLocaleString()} registration dates

Results:
  Unique OUIs:        ${stats.unique.toLocaleString()} entries
  Merged Entries:     ${stats.merged.toLocaleString()} (same OUI from multiple sources)

Output Files:
  master_oui.txt      ${(fs.statSync(path.join(OUTPUT_DIR, 'master_oui.txt')).size / 1024 / 1024).toFixed(2)} MB  (simple grep/awk format)
  master_oui.csv      ${(fs.statSync(path.join(OUTPUT_DIR, 'master_oui.csv')).size / 1024 / 1024).toFixed(2)} MB  (full data with addresses)
  master_oui.tsv      ${(fs.statSync(path.join(OUTPUT_DIR, 'master_oui.tsv')).size / 1024 / 1024).toFixed(2)} MB  (Excel/Sheets import)
  master_oui.json     ${(fs.statSync(path.join(OUTPUT_DIR, 'master_oui.json')).size / 1024 / 1024).toFixed(2)} MB  (pretty-printed)
  master_oui.min.json ${(fs.statSync(path.join(OUTPUT_DIR, 'master_oui.min.json')).size / 1024 / 1024).toFixed(2)} MB  (compact for scripts)
  master_oui.xml      ${(fs.statSync(path.join(OUTPUT_DIR, 'master_oui.xml')).size / 1024 / 1024).toFixed(2)} MB  (enterprise/Java)
  master_oui.db       ${(fs.statSync(path.join(OUTPUT_DIR, 'master_oui.db')).size / 1024 / 1024).toFixed(2)} MB  (SQLite ready-to-query)
  import-to-d1.sql    ${(fs.statSync(path.join(OUTPUT_DIR, 'import-to-d1.sql')).size / 1024 / 1024).toFixed(2)} MB  (SQL import script)

Generated: ${new Date().toISOString()}
`;

fs.writeFileSync(path.join(OUTPUT_DIR, 'stats.txt'), statsReport);
console.log(`✅ Stats: ${OUTPUT_DIR}/stats.txt\n`);

// Print summary
console.log('📊 Summary');
console.log('==========');
console.log(`Total Unique OUIs: ${stats.unique.toLocaleString()}`);
console.log(`Merged Entries: ${stats.merged.toLocaleString()}`);
console.log('');
console.log('🎉 Master database created successfully!');
console.log('');
console.log('Next steps:');
console.log('  1. Review: cat output/stats.txt');
console.log('  2. Use CSV: cat output/master_oui.csv');
console.log('  3. Import to D1: npx wrangler d1 execute ... --file=output/import-to-d1.sql');
