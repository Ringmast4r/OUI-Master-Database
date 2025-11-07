# 🚀 Quick Start - OUI Master Database

## What You Have

**A single master OUI database with 49,059 manufacturers!**

📁 **Location:** `C:\Users\Squir\Desktop\OUI-Master-Database`

---

## 📊 What Are OUIs?

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

## 📈 Database Stats

```
Total Unique OUIs:  49,059 manufacturers
IEEE Official:      25,103 entries
Nmap Database:      49,058 entries
Wireshark:          0 entries (download issue)
Merged Entries:     25,099 (same OUI from multiple sources)

Files Generated:
  master_oui.csv      3.53 MB  ← Use this for databases/spreadsheets
  master_oui.json     8.49 MB  ← Use this for applications/APIs
  import-to-d1.sql    4.71 MB  ← Use this for Cloudflare D1/SQLite
  stats.txt           Stats summary
```

---

## 📂 Project Structure

```
OUI-Master-Database/
├── README.md                 ← Full documentation (read this!)
├── QUICK-START.md           ← This file
├── download-sources.sh      ← Download fresh databases
├── merge-oui-databases.js   ← Merge into master list
│
├── sources/                 ← Raw downloaded databases
│   ├── ieee_oui.csv         (25,104 lines - IEEE official)
│   ├── nmap_prefixes.txt    (49,064 lines - Nmap database)
│   └── wireshark_manuf.txt  (88 lines - Wireshark)
│
└── output/                  ← Your master databases!
    ├── master_oui.csv       ← MASTER CSV (49,059 OUIs)
    ├── master_oui.json      ← MASTER JSON (49,059 OUIs)
    ├── import-to-d1.sql     ← SQL for database import
    └── stats.txt            ← Merge statistics
```

---

## 🎯 How to Use

### 1. View the Master Database

**CSV Format:**
```bash
cd C:\Users\Squir\Desktop\OUI-Master-Database
cat output/master_oui.csv | head -20
```

**JSON Format:**
```bash
cat output/master_oui.json | head -50
```

**Search for a manufacturer:**
```bash
grep -i "apple" output/master_oui.csv
grep -i "cisco" output/master_oui.csv
grep -i "samsung" output/master_oui.csv
```

### 2. Look Up a MAC Address

```bash
# Example MAC: 3C:D9:2B:12:34:56
OUI="3C:D9:2B"
grep "^$OUI," output/master_oui.csv

# Result:
# 3C:D9:2B,"Hewlett Packard",MA-L,,,"11445 Compaq Center Drive",IEEE+Nmap
```

### 3. Import to Database

**Cloudflare D1:**
```bash
cd cloudflare
npx wrangler d1 execute wardrive-db --remote --file=../OUI-Master-Database/output/import-to-d1.sql
```

**SQLite:**
```bash
sqlite3 mydb.sqlite < output/import-to-d1.sql
```

**PostgreSQL:**
```bash
psql mydb < output/import-to-d1.sql
```

### 4. Update with Fresh Data

Run monthly to get new OUI assignments:
```bash
cd C:\Users\Squir\Desktop\OUI-Master-Database
bash download-sources.sh
node merge-oui-databases.js
```

---

## 📋 CSV Format

```csv
oui,manufacturer,registry,short_name,device_type,address,sources
3C:D9:2B,"Hewlett Packard",MA-L,,,"11445 Compaq Center Drive...",IEEE+Nmap
00:1A:2B,"Apple Inc",MA-L,Apple,Phone,"1 Infinite Loop...",IEEE+Nmap+Wireshark
```

**Columns:**
- `oui` - MAC prefix (XX:XX:XX)
- `manufacturer` - Full vendor name
- `registry` - MA-L (24-bit), MA-M (28-bit), MA-S (36-bit)
- `short_name` - Abbreviated name (if available)
- `device_type` - Router/Switch/AP/Phone/etc (if available)
- `address` - Company address
- `sources` - Which databases it came from (IEEE+Nmap+Wireshark)

---

## 🔄 Update Process

**Automated monthly update:**
1. Download latest databases: `bash download-sources.sh`
2. Merge into master: `node merge-oui-databases.js`
3. Review stats: `cat output/stats.txt`
4. Re-import to production database

**Sources update frequency:**
- IEEE: ~500-1000 new OUIs per month
- Nmap: Updated monthly
- Wireshark: Updated weekly

---

## 🎓 Example Uses

### Find all Apple devices
```bash
grep -i "apple" output/master_oui.csv | wc -l
# Result: Shows how many OUI prefixes Apple owns
```

### Count manufacturers
```bash
wc -l < output/master_oui.csv
# Result: 49,060 (including header)
```

### Export to Excel
Open `output/master_oui.csv` in Excel/Google Sheets

### API Integration
```javascript
const ouiDB = require('./output/master_oui.json');

function lookupMAC(mac) {
  const oui = mac.substring(0, 8).toUpperCase();
  return ouiDB[oui] || { manufacturer: 'Unknown' };
}

console.log(lookupMAC('3C:D9:2B:12:34:56'));
// { manufacturer: 'Hewlett Packard', registry: 'MA-L', ... }
```

---

## 🌐 Sources

1. **IEEE Registration Authority** (Official)
   - https://standards-oui.ieee.org/
   - Mirror: https://github.com/TakahikoKawasaki/nv-oui
   - 25,103 official manufacturer assignments

2. **Nmap MAC Prefixes**
   - https://github.com/nmap/nmap/raw/master/nmap-mac-prefixes
   - 49,058 entries with device type hints

3. **Wireshark Manufacturer Database** (not downloaded yet)
   - https://gitlab.com/wireshark/wireshark/-/raw/master/manuf
   - ~30,000+ entries including custom/private OUIs

---

## ✅ What's Next?

1. ✅ **You have the master database** (49,059 OUIs)
2. ✅ **It's ready to use** (CSV, JSON, SQL formats)
3. ✅ **It can be updated** (run scripts monthly)

**For WiFi Mothership:**
- Import `output/import-to-d1.sql` to production
- Replaces the current 25,100 OUIs with 49,059 OUIs
- Almost double the coverage!

---

**Created:** 2025-11-07
**Location:** `C:\Users\Squir\Desktop\OUI-Master-Database`
**Size:** 16.7 MB (all files)
