#!/usr/bin/env node
// Merge IEEE, Wireshark, and Nmap OUI databases into one master list

const fs = require('fs');
const path = require('path');

const SOURCES_DIR = 'sources';
const OUTPUT_DIR = 'output';

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
  ieee: 0,
  wireshark: 0,
  nmap: 0,
  merged: 0,
  unique: 0
};

// =====================
// 1. Parse IEEE CSV
// =====================
console.log('📖 [1/3] Parsing IEEE OUI database...');

const ieeeCSV = fs.readFileSync(path.join(SOURCES_DIR, 'ieee_oui.csv'), 'utf8');
const ieeeLines = ieeeCSV.split('\n');

for (let i = 1; i < ieeeLines.length; i++) {  // Skip header
  const line = ieeeLines[i].trim();
  if (!line) continue;

  try {
    // Parse CSV: Registry,Assignment,Organization Name,Organization Address
    const matches = line.match(/([^,]*),([^,"]*|"[^"]*"),("(?:[^"]|"")*"|[^,]*),("(?:[^"]|"")*"|[^,]*)/);
    if (!matches) continue;

    const registry = matches[1].trim();
    let assignment = matches[2].trim().replace(/"/g, '');
    let orgName = matches[3].trim().replace(/"/g, '').replace(/""/g, '"');
    const orgAddress = matches[4].trim().replace(/"/g, '').replace(/""/g, '"');

    if (!assignment || !orgName) continue;

    // Convert to XX:XX:XX format
    assignment = assignment.toUpperCase();
    if (assignment.length === 6) {
      assignment = `${assignment.substr(0,2)}:${assignment.substr(2,2)}:${assignment.substr(4,2)}`;
    }

    // Clean up org name
    orgName = orgName.replace(/,$/, '').replace(/\s+/g, ' ').trim();

    masterDB.set(assignment, {
      oui: assignment,
      manufacturer: orgName,
      registry: registry || 'MA-L',
      short_name: null,
      device_type: null,
      address: orgAddress,
      sources: ['IEEE']
    });

    stats.ieee++;
  } catch (err) {
    // Skip malformed lines
  }
}

console.log(`✅ IEEE: ${stats.ieee} entries parsed\n`);

// =====================
// 2. Parse Wireshark
// =====================
console.log('📖 [2/3] Parsing Wireshark manufacturer database...');

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
// 3. Parse Nmap
// =====================
console.log('📖 [3/3] Parsing Nmap MAC prefixes...');

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
const csvLines = ['oui,manufacturer,registry,short_name,device_type,address,sources'];
for (const [oui, entry] of masterDB) {
  const escapedManufacturer = entry.manufacturer.replace(/"/g, '""');
  const escapedAddress = (entry.address || '').replace(/"/g, '""');
  const sources = entry.sources.join('+');
  csvLines.push(
    `${entry.oui},"${escapedManufacturer}",${entry.registry},${entry.short_name || ''},${entry.device_type || ''},"${escapedAddress}",${sources}`
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
  '  address TEXT,',
  '  sources TEXT,',
  '  last_updated TEXT DEFAULT CURRENT_TIMESTAMP',
  ');',
  '',
  'CREATE INDEX IF NOT EXISTS idx_oui_manufacturer ON oui_registry(manufacturer);',
  'CREATE INDEX IF NOT EXISTS idx_oui_short_name ON oui_registry(short_name);',
  ''
];

// Batch INSERT (500 entries per batch for D1)
const BATCH_SIZE = 500;
const ouiArray = Array.from(masterDB.values());

for (let i = 0; i < ouiArray.length; i += BATCH_SIZE) {
  const batch = ouiArray.slice(i, i + BATCH_SIZE);
  sqlLines.push(`-- Batch ${Math.floor(i / BATCH_SIZE) + 1} (${batch.length} entries)`);
  sqlLines.push('INSERT OR IGNORE INTO oui_registry (oui, manufacturer, registry, short_name, device_type, address, sources) VALUES');

  const values = batch.map(entry => {
    const escapedManuf = entry.manufacturer.replace(/'/g, "''");
    const escapedAddr = (entry.address || '').replace(/'/g, "''");
    const sources = entry.sources.join('+');
    return `  ('${entry.oui}', '${escapedManuf}', '${entry.registry}', ${entry.short_name ? "'" + entry.short_name.replace(/'/g, "''") + "'" : 'NULL'}, ${entry.device_type ? "'" + entry.device_type + "'" : 'NULL'}, '${escapedAddr}', '${sources}')`;
  });

  sqlLines.push(values.join(',\n') + ';');
  sqlLines.push('');
}

fs.writeFileSync(path.join(OUTPUT_DIR, 'import-to-d1.sql'), sqlLines.join('\n'));
console.log(`✅ SQL: ${OUTPUT_DIR}/import-to-d1.sql (${Math.ceil(ouiArray.length / BATCH_SIZE)} batches)`);

// 4.4: Statistics Report
const statsReport = `OUI Database Merge Statistics
==============================

Sources Processed:
  IEEE Official:      ${stats.ieee.toLocaleString()} entries
  Wireshark:          ${stats.wireshark.toLocaleString()} entries
  Nmap:               ${stats.nmap.toLocaleString()} entries

Results:
  Unique OUIs:        ${stats.unique.toLocaleString()} entries
  Merged Entries:     ${stats.merged.toLocaleString()} (same OUI from multiple sources)

Output Files:
  master_oui.csv      ${(fs.statSync(path.join(OUTPUT_DIR, 'master_oui.csv')).size / 1024 / 1024).toFixed(2)} MB
  master_oui.json     ${(fs.statSync(path.join(OUTPUT_DIR, 'master_oui.json')).size / 1024 / 1024).toFixed(2)} MB
  import-to-d1.sql    ${(fs.statSync(path.join(OUTPUT_DIR, 'import-to-d1.sql')).size / 1024 / 1024).toFixed(2)} MB

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
