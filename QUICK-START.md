# Quick Start - OUI Master Database

## What You Have

**A single master OUI database with 85,905 manufacturers!**

---

## What Are OUIs?

**OUI = Organizationally Unique Identifier**

The first 3 bytes (6 hex characters) of a MAC address that identifies the device manufacturer.

```
MAC Address:  3C:D9:2B:12:34:56
              └─OUI─┘ └─Device─┘

OUI:          3C:D9:2B
Manufacturer: Hewlett Packard
```

**Why this matters:**
- Identify device manufacturers from MAC addresses
- Detect rogue devices on networks
- Classify WiFi access points by vendor
- Security analysis and network mapping

---

## Database Stats

```
IEEE Registries Processed:
  MA-L (Large/OUI):   38,545 entries
  MA-M (Medium):      6,154 entries
  MA-S (Small):       6,807 entries
  IAB (Individual):   4,575 entries
  CID (Company ID):   208 entries
  IEEE Total:         56,289 entries

Community Sources:
  Wireshark:          55,825 entries
  Nmap:               49,058 entries

Historical Data:
  Mac-Tracker:        56,401 registration dates

Results:
  Unique OUIs:        85,905 entries
  Merged Entries:     75,267 (same OUI from multiple sources)

Output Files:
  master_oui.txt      2.43 MB  (simple grep/awk format)
  master_oui.csv      8.94 MB  (full data with addresses)
  master_oui.tsv      5.46 MB  (Excel/Sheets import)
  master_oui.json     19.08 MB (pretty-printed)
  master_oui.min.json 14.07 MB (compact for scripts)
  master_oui.xml      18.63 MB (enterprise/Java)
  master_oui.db       18.02 MB (SQLite ready-to-query)
  import-to-d1.sql    11.21 MB (SQL import script)
```

---

## Project Structure

```
OUI-Master-Database/
├── README.md                 ← Full documentation (read this!)
├── QUICK-START.md           ← This file
├── download-sources.sh      ← Download fresh databases
├── merge-oui-databases.js   ← Merge into master list
│
├── sources/                 ← Raw downloaded databases
│   ├── ieee_mal.csv         (MA-L registry)
│   ├── ieee_mam.csv         (MA-M registry)
│   ├── ieee_mas.csv         (MA-S registry)
│   ├── ieee_iab.csv         (IAB registry)
│   ├── ieee_cid.csv         (CID registry)
│   ├── nmap_prefixes.txt    (Nmap database)
│   ├── wireshark_manuf.txt  (Wireshark database)
│   └── mac_tracker_history.json (Registration dates)
│
└── LISTS/                   ← Your master databases!
    ├── master_oui.txt       ← Simple format (85,905 OUIs)
    ├── master_oui.csv       ← Full CSV with addresses
    ├── master_oui.tsv       ← Tab-separated
    ├── master_oui.json      ← Pretty JSON
    ├── master_oui.min.json  ← Compact JSON
    ├── master_oui.xml       ← XML format
    ├── master_oui.db        ← SQLite database
    ├── import-to-d1.sql     ← SQL import script
    └── stats.txt            ← Merge statistics
```

---

## How to Use

### 1. View the Master Database

**Simple TXT Format:**
```bash
grep "Apple" LISTS/master_oui.txt
```

**CSV Format:**
```bash
grep -i "apple" LISTS/master_oui.csv
grep -i "cisco" LISTS/master_oui.csv
```

**SQLite Direct Query:**
```bash
sqlite3 LISTS/master_oui.db "SELECT * FROM oui_registry WHERE manufacturer LIKE '%Apple%'"
```

### 2. Look Up a MAC Address

```bash
# Example MAC: 3C:D9:2B:12:34:56
grep "3CD92B" LISTS/master_oui.txt

# Or with SQLite:
sqlite3 LISTS/master_oui.db "SELECT * FROM oui_registry WHERE oui = '3C:D9:2B'"
```

### 3. Import to Database

**SQLite:**
```bash
sqlite3 mydb.sqlite < LISTS/import-to-d1.sql
```

**PostgreSQL:**
```bash
psql mydb < LISTS/import-to-d1.sql
```

**Cloudflare D1:**
```bash
npx wrangler d1 execute my-db --remote --file=LISTS/import-to-d1.sql
```

### 4. Update with Fresh Data

Run monthly to get new OUI assignments:
```bash
bash download-sources.sh
node merge-oui-databases.js
```

---

## CSV Format

```csv
oui,manufacturer,registry,short_name,device_type,address,sources,registered_date
3C:D9:2B,"Hewlett Packard",MA-L,,,"11445 Compaq Center Drive...",IEEE+Nmap,2012-05-15
00:1A:2B,"Apple Inc",MA-L,Apple,,"1 Infinite Loop...",IEEE+Nmap+Wireshark,2008-03-20
```

**Columns:**
- `oui` - MAC prefix (XX:XX:XX)
- `manufacturer` - Full vendor name
- `registry` - MA-L (24-bit), MA-M (28-bit), MA-S (36-bit), IAB, CID
- `short_name` - Abbreviated name (if available)
- `device_type` - Router/Switch/AP/Phone/etc (if available)
- `address` - Company address
- `sources` - Which databases it came from (IEEE+Nmap+Wireshark)
- `registered_date` - When the OUI was first registered (if available)

---

## Update Process

**Automated monthly update:**
1. Download latest databases: `bash download-sources.sh`
2. Merge into master: `node merge-oui-databases.js`
3. Review stats: `cat LISTS/stats.txt`
4. Re-import to production database

**Sources update frequency:**
- IEEE: ~500-1000 new OUIs per month
- Nmap: Updated monthly
- Wireshark: Updated weekly

---

## Example Uses

### Find all Apple devices
```bash
grep -i "apple" LISTS/master_oui.txt | wc -l
```

### Count manufacturers
```bash
wc -l < LISTS/master_oui.txt
# Result: 85,905
```

### Export to Excel
Open `LISTS/master_oui.tsv` in Excel/Google Sheets (TSV avoids CSV quoting issues)

### API Integration
```javascript
const ouiDB = require('./LISTS/master_oui.json');

function lookupMAC(mac) {
  const oui = mac.substring(0, 8).toUpperCase();
  return ouiDB[oui] || { manufacturer: 'Unknown' };
}

console.log(lookupMAC('3C:D9:2B:12:34:56'));
// { manufacturer: 'Hewlett Packard', registry: 'MA-L', registered_date: '2012-05-15', ... }
```

---

## Sources

1. **IEEE Registration Authority** (Official)
   - https://standards-oui.ieee.org/
   - All 5 registries: MA-L, MA-M, MA-S, IAB, CID
   - 56,289 official manufacturer assignments

2. **Nmap MAC Prefixes**
   - https://github.com/nmap/nmap/raw/master/nmap-mac-prefixes
   - 49,058 entries with device type hints

3. **Wireshark Manufacturer Database**
   - https://www.wireshark.org/download/automated/data/manuf.gz
   - 55,825 entries with short names

4. **HDM Mac-Tracker** (Historical Data)
   - https://github.com/hdm/mac-tracker
   - 56,401 registration dates for OUI age estimation

---

## What's Next?

1. **You have the master database** (85,905 OUIs)
2. **It's ready to use** (8 formats: TXT, CSV, TSV, JSON, XML, SQLite, SQL)
3. **It can be updated** (run scripts monthly)
4. **Registration dates included** (for device age estimation)

---

**Last Updated:** 2025-12-11
**Total OUIs:** 85,905
**Formats:** 8
