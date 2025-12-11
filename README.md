# OUI Master Database

**The most comprehensive MAC address manufacturer lookup database - 85,905+ vendors from IEEE, Nmap, and Wireshark**

One master list to rule them all.

[![OUI Count](https://img.shields.io/badge/OUIs-85%2C905-blue)](LISTS/master_oui.csv)
[![Formats](https://img.shields.io/badge/Formats-8-green)](#-available-formats)
[![License](https://img.shields.io/badge/License-MIT-yellow)](#license)
[![Updates](https://img.shields.io/badge/Updates-Monthly-orange)](#update-schedule)

---

## Quick Download

**Just want the data? Download directly:**

| Format | Size | Best For | Download |
|--------|------|----------|----------|
| **TXT** | 2.5 MB | grep/awk, legacy tools | [master_oui.txt](LISTS/master_oui.txt) |
| **CSV** | 8.4 MB | Spreadsheets, full data | [master_oui.csv](LISTS/master_oui.csv) |
| **TSV** | 4.9 MB | Excel/Sheets import | [master_oui.tsv](LISTS/master_oui.tsv) |
| **JSON** | 17 MB | APIs, human-readable | [master_oui.json](LISTS/master_oui.json) |
| **JSON (compact)** | 12 MB | Scripts, fast loading | [master_oui.min.json](LISTS/master_oui.min.json) |
| **XML** | 16 MB | Enterprise/Java apps | [master_oui.xml](LISTS/master_oui.xml) |
| **SQLite** | 16 MB | Ready-to-query database | [master_oui.db](LISTS/master_oui.db) |
| **SQL** | 11 MB | Database import script | [import-to-d1.sql](LISTS/import-to-d1.sql) |

**Raw GitHub URLs:**
```
https://raw.githubusercontent.com/Ringmast4r/OUI-Master-Database/main/LISTS/master_oui.csv
https://raw.githubusercontent.com/Ringmast4r/OUI-Master-Database/main/LISTS/master_oui.json
https://raw.githubusercontent.com/Ringmast4r/OUI-Master-Database/main/LISTS/master_oui.txt
```

---

## What is an OUI?

**OUI = Organizationally Unique Identifier**

The first 3 bytes (6 hex characters) of a MAC address that identifies the device manufacturer.

### Example:
```
MAC Address:  3C:D9:2B:12:34:56
              └─OUI─┘ └─Device─┘

OUI:          3C:D9:2B
Manufacturer: Hewlett Packard
```

### Why This Matters:
- **Device Identification:** Know if a WiFi network is from Apple, Samsung, Cisco, etc.
- **Security Analysis:** Identify rogue devices on your network
- **Network Mapping:** Categorize devices by manufacturer
- **Wardriving:** Identify access points and their vendors
- **IoT Discovery:** Find all smart home devices

---

## Database Sources

This project combines **all IEEE registries** plus community databases:

### IEEE Official Registries
| Registry | Entries | Description |
|----------|---------|-------------|
| **MA-L** (Large) | 38,545 | Traditional 24-bit OUI (~16M addresses each) |
| **MA-M** (Medium) | 6,154 | 28-bit blocks (~1M addresses each) |
| **MA-S** (Small) | 6,807 | 36-bit blocks (~4K addresses each) |
| **IAB** (Individual) | 4,575 | Individual Address Blocks (legacy) |
| **CID** (Company ID) | 208 | Company identifiers |
| **IEEE Total** | **56,289** | |

### Community Sources
| Source | Entries | Description |
|--------|---------|-------------|
| **Wireshark** | 55,825 | Cross-validated with short names |
| **Nmap** | 49,058 | Community-discovered vendors |

### Final Results
| Metric | Count |
|--------|-------|
| **Total Unique OUIs** | **85,905** |
| **Merged Entries** | 75,267 (verified from multiple sources) |

---

## Available Formats

### 1. TXT - Simple Format
```
# Format: OUI<tab>Manufacturer
286FB9	Nokia Shanghai Bell Co., Ltd.
08EA44	Extreme Networks Headquarters
```
Best for: `grep`, `awk`, legacy tools, minimal footprint

### 2. CSV - Full Data
```csv
oui,manufacturer,registry,short_name,device_type,address,sources
28:6F:B9,"Nokia Shanghai Bell Co., Ltd.",MA-L,NokiaShangha,,"Shanghai CN",IEEE+Wireshark+Nmap
```
Best for: Spreadsheets, databases, full address data

### 3. TSV - Tab-Separated
```
OUI	Manufacturer	Registry	Short_Name	Sources
28:6F:B9	Nokia Shanghai Bell Co., Ltd.	MA-L	NokiaShangha	IEEE+Wireshark+Nmap
```
Best for: Excel/Google Sheets (no CSV quoting issues)

### 4. JSON - Pretty Printed
```json
{
  "28:6F:B9": {
    "manufacturer": "Nokia Shanghai Bell Co., Ltd.",
    "registry": "MA-L",
    "short_name": "NokiaShangha",
    "sources": ["IEEE", "Wireshark", "Nmap"]
  }
}
```
Best for: APIs, human-readable config files

### 5. JSON (Compact) - Single Line
Same as JSON but minified for faster loading in scripts.

### 6. XML - Enterprise Format
```xml
<oui_database>
  <entry>
    <oui>28:6F:B9</oui>
    <manufacturer>Nokia Shanghai Bell Co., Ltd.</manufacturer>
    <registry>MA-L</registry>
    <sources>IEEE,Wireshark,Nmap</sources>
  </entry>
</oui_database>
```
Best for: Java applications, enterprise systems, XSLT transforms

### 7. SQLite - Ready to Query
Pre-built database file with indexes. Just download and query:
```bash
sqlite3 LISTS/master_oui.db "SELECT * FROM oui_registry WHERE oui = '28:6F:B9'"
sqlite3 LISTS/master_oui.db "SELECT * FROM oui_registry WHERE manufacturer LIKE '%Apple%'"
```

### 8. SQL - Import Script
```sql
CREATE TABLE oui_registry (...);
INSERT INTO oui_registry VALUES ...;
```
Best for: PostgreSQL, MySQL, Cloudflare D1, custom databases

---

## Generate Fresh Database

### Requirements:
- Node.js 14+
- curl (for downloading)
- Internet connection

### Step 1: Clone Repository
```bash
git clone https://github.com/Ringmast4r/OUI-Master-Database.git
cd OUI-Master-Database
npm install
```

### Step 2: Download Latest Sources
```bash
bash download-sources.sh
```
Downloads from IEEE (all 5 registries), Wireshark, and Nmap.

### Step 3: Merge into Master Database
```bash
node merge-oui-databases.js
```

**Windows users:** Just double-click **`update-database.bat`**

---

## Usage Examples

### 1. Command Line Lookup (TXT format)
```bash
# Simple grep lookup
grep "3CD92B" LISTS/master_oui.txt

# Find all Apple devices
grep -i "apple" LISTS/master_oui.txt | head -20

# Count entries
wc -l LISTS/master_oui.txt
```

### 2. SQLite Direct Query
```bash
# Lookup by OUI
sqlite3 LISTS/master_oui.db "SELECT manufacturer FROM oui_registry WHERE oui = '3C:D9:2B'"

# Find all Cisco devices
sqlite3 LISTS/master_oui.db "SELECT oui, manufacturer FROM oui_registry WHERE manufacturer LIKE '%Cisco%'"

# Count by registry type
sqlite3 LISTS/master_oui.db "SELECT registry, COUNT(*) FROM oui_registry GROUP BY registry"
```

### 3. Python Script
```python
import json

# Load OUI database
with open('LISTS/master_oui.min.json') as f:
    oui_db = json.load(f)

# Lookup function
def identify_device(mac):
    oui = mac[:8].upper()
    entry = oui_db.get(oui, {})
    return entry.get('manufacturer', 'Unknown')

print(identify_device('3C:D9:2B:12:34:56'))
# Output: Hewlett Packard
```

### 4. JavaScript / Node.js
```javascript
const ouiDB = require('./LISTS/master_oui.json');

function lookupManufacturer(mac) {
    const oui = mac.substring(0, 8).toUpperCase();
    return ouiDB[oui] || { manufacturer: 'Unknown' };
}

console.log(lookupManufacturer('3C:D9:2B:12:34:56'));
// { manufacturer: 'Hewlett Packard', registry: 'MA-L', sources: ['IEEE', 'Nmap'] }
```

### 5. SQL Database Import
```bash
# SQLite
sqlite3 mydb.sqlite < LISTS/import-to-d1.sql

# PostgreSQL
psql mydb < LISTS/import-to-d1.sql

# Cloudflare D1
npx wrangler d1 execute my-db --remote --file=LISTS/import-to-d1.sql
```

### 6. curl/wget Direct Access
```bash
# Download latest
curl -O https://raw.githubusercontent.com/Ringmast4r/OUI-Master-Database/main/LISTS/master_oui.txt

# Lookup in one command
curl -s https://raw.githubusercontent.com/Ringmast4r/OUI-Master-Database/main/LISTS/master_oui.txt | grep "3CD92B"
```

---

## Update Schedule

**Recommended:** Run monthly to stay current with new OUI assignments.

### Automated Updates (Cron Job)
```bash
# Update first day of every month at midnight
0 0 1 * * cd /path/to/OUI-Master-Database && bash download-sources.sh && node merge-oui-databases.js
```

**IEEE assigns ~500-1000 new OUIs per month**, so monthly updates recommended.

---

## Project Structure

```
OUI-Master-Database/
├── README.md                    # This file
├── QUICK-START.md              # Quick start guide
├── download-sources.sh          # Download all databases
├── merge-oui-databases.js       # Merge into master list
├── update-database.bat          # Windows updater
├── package.json                 # Node.js dependencies
│
├── sources/                     # Raw downloaded databases (gitignored)
│   ├── ieee_mal.csv            # IEEE MA-L (Large)
│   ├── ieee_mam.csv            # IEEE MA-M (Medium)
│   ├── ieee_mas.csv            # IEEE MA-S (Small)
│   ├── ieee_iab.csv            # IEEE IAB
│   ├── ieee_cid.csv            # IEEE CID
│   ├── wireshark_manuf.txt     # Wireshark database
│   └── nmap_prefixes.txt       # Nmap database
│
└── LISTS/                       # Generated master files
    ├── master_oui.txt          # Simple format (2.5 MB)
    ├── master_oui.csv          # Full CSV (8.4 MB)
    ├── master_oui.tsv          # Tab-separated (4.9 MB)
    ├── master_oui.json         # Pretty JSON (17 MB)
    ├── master_oui.min.json     # Compact JSON (12 MB)
    ├── master_oui.xml          # XML format (16 MB)
    ├── master_oui.db           # SQLite database (16 MB)
    ├── import-to-d1.sql        # SQL import script (11 MB)
    └── stats.txt               # Merge statistics
```

---

## Use Cases

### Network Security
- Identify unauthorized devices on your network
- Detect spoofed MAC addresses
- Audit network device inventory

### Wardriving
- Identify access point manufacturers
- Map network infrastructure by vendor
- Analyze WiFi network distribution

### IoT Discovery
- Find all smart home devices
- Identify security cameras
- Discover printers and networked appliances

### Network Analysis
- Categorize traffic by device manufacturer
- Generate vendor statistics
- Create network topology maps

---

## Data Sources & Credits

### IEEE Registration Authority (Official)
- **Source:** https://standards-oui.ieee.org/
- **License:** Public domain
- **Registries:** MA-L, MA-M, MA-S, IAB, CID

### Nmap MAC Prefixes
- **Source:** https://github.com/nmap/nmap/raw/master/nmap-mac-prefixes
- **License:** Modified GPLv2
- **Maintained by:** Nmap Project

### Wireshark Manufacturer Database
- **Source:** https://www.wireshark.org/download/automated/data/manuf.gz
- **License:** GPLv2
- **Maintained by:** Wireshark Team

---

## License

- **IEEE Data:** Public domain (official registry)
- **Wireshark Data:** GPLv2
- **Nmap Data:** Modified GPLv2
- **This Project:** MIT License

**You are free to:**
- Use commercially
- Modify and redistribute
- Use in proprietary software

---

## Contributing

Want to add more OUI sources or improve the scripts? PRs welcome!

**How to contribute:**
1. Fork the repository
2. Add your improvements
3. Submit a pull request

---

## Support

- **Issues:** https://github.com/Ringmast4r/OUI-Master-Database/issues
- **Pull Requests:** https://github.com/Ringmast4r/OUI-Master-Database/pulls

---

## Related Projects

- **WiFi Mothership:** https://wifimothership.com/ - Global wardriving network
- **Wireshark:** https://www.wireshark.org/
- **Nmap:** https://nmap.org/

---

**Last Updated:** 2025-12-11
**Total OUIs:** 85,905+
**Formats Available:** 8
**Maintained by:** [@Ringmast4r](https://github.com/Ringmast4r)

---

![OUI Count](https://img.shields.io/badge/OUIs-85%2C905-blue)
![Formats](https://img.shields.io/badge/Formats-8-green)
![Updates](https://img.shields.io/badge/Updates-Monthly-orange)
