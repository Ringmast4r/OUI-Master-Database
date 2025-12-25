<p align="center">
  <img src="OUI Master Database.png" alt="OUI Master Database Logo" width="300">
</p>

# OUI Master Database

**The most comprehensive MAC address manufacturer lookup database - 86,098+ vendors from IEEE, Nmap, Wireshark, and HDM Mac-Tracker**

One master list to rule them all.

[![OUI Count](https://img.shields.io/badge/OUIs-86%2C098-blue)](LISTS/master_oui.csv)
[![Formats](https://img.shields.io/badge/Formats-8-green)](#-available-formats)
[![License](https://img.shields.io/badge/License-MIT-yellow)](#license)
[![Updates](https://img.shields.io/badge/Updates-Monthly-orange)](#update-schedule)
![Repo Size](https://img.shields.io/github/repo-size/Ringmast4r/OUI-Master-Database)
![Visitors](https://visitor-badge.laobi.icu/badge?page_id=Ringmast4r.OUI-Master-Database)

---

## Live Demo

**Try the online lookup tool:** [OUI Master Database Lookup](https://ringmast4r.github.io/OUI-Master-Database/)

Search by MAC address or manufacturer name - works entirely in your browser!

---

## Quick Download

**Just want the data? Download directly:**

| Format | Size | Best For | Download |
|--------|------|----------|----------|
| **TXT** | 2.5 MB | grep/awk, legacy tools | [master_oui.txt](LISTS/master_oui.txt) |
| **CSV** | 9.5 MB | Spreadsheets, full data | [master_oui.csv](LISTS/master_oui.csv) |
| **TSV** | 5.8 MB | Excel/Sheets import | [master_oui.tsv](LISTS/master_oui.tsv) |
| **JSON** | 21 MB | APIs, human-readable | [master_oui.json](LISTS/master_oui.json) |
| **JSON (compact)** | 15 MB | Scripts, fast loading | [master_oui.min.json](LISTS/master_oui.min.json) |
| **XML** | 20 MB | Enterprise/Java apps | [master_oui.xml](LISTS/master_oui.xml) |
| **SQLite** | 18 MB | Ready-to-query database | [master_oui.db](LISTS/master_oui.db) |
| **SQL** | 12 MB | Database import script | [import-to-d1.sql](LISTS/import-to-d1.sql) |

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
Device Type:  Computer
Country:      US
```

### Why This Matters:
- **Device Identification:** Know if a WiFi network is from Apple, Samsung, Cisco, etc.
- **Security Analysis:** Identify rogue devices on your network
- **Network Mapping:** Categorize devices by manufacturer and type
- **Wardriving:** Identify access points and their vendors
- **IoT Discovery:** Find all smart home devices, cameras, and appliances

---

## Data Fields

Each OUI entry includes:

| Field | Description | Example |
|-------|-------------|---------|
| **OUI** | MAC address prefix | `3C:D9:2B` |
| **Manufacturer** | Full company name | `Hewlett Packard` |
| **Short Name** | Abbreviated name | `HP` |
| **Registry** | IEEE assignment type | `MA-L`, `MA-M`, `MA-S`, `IAB`, `CID` |
| **Device Type** | Category classification | `Router`, `Phone`, `Camera`, `IoT`, etc. |
| **Address** | Company address | `11445 Compaq Center Drive, Houston TX US` |
| **Country** | Country code | `US`, `CN`, `DE`, `JP`, etc. |
| **Registered Date** | When OUI was first assigned | `2012-05-15` |
| **Sources** | Which databases confirmed it | `IEEE+Wireshark+Nmap` |

### Device Type Categories

The database automatically classifies manufacturers into device types:

- **Networking:** Router, Switch, Access Point, Modem
- **Consumer:** Phone, Computer, Tablet, TV, Gaming, Wearable
- **Smart Home:** IoT, Smart Home, Camera, Thermostat, Appliance
- **Enterprise:** Server, Storage, Industrial, VoIP
- **Other:** Medical, Automotive, Printer, Audio, Media Player

---

## Database Sources

This project combines **all IEEE registries** plus community databases:

### IEEE Official Registries
| Registry | Entries | Description |
|----------|---------|-------------|
| **MA-L** (Large) | 38,630 | Traditional 24-bit OUI (~16M addresses each) |
| **MA-M** (Medium) | 6,189 | 28-bit blocks (~1M addresses each) |
| **MA-S** (Small) | 6,827 | 36-bit blocks (~4K addresses each) |
| **IAB** (Individual) | 4,575 | Individual Address Blocks (legacy) |
| **CID** (Company ID) | 209 | Company identifiers |
| **IEEE Total** | **56,430** | |

### Community Sources
| Source | Entries | Description |
|--------|---------|-------------|
| **Wireshark** | 55,963 | Cross-validated with short names |
| **Nmap** | 49,058 | Community-discovered vendors |
| **HDM Mac-Tracker** | 56,543 | Historical registration dates |

### Final Results
| Metric | Count |
|--------|-------|
| **Total Unique OUIs** | **86,098** |
| **Merged Entries** | 75,353 (verified from multiple sources) |

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
oui,manufacturer,registry,short_name,device_type,registered_date,address,sources
00:00:0C,"Cisco Systems, Inc",MA-L,Cisco,Router,1998-04-22,"170 WEST TASMAN DRIVE SAN JOSE CA US 95134",IEEE+Wireshark+Nmap
```
Best for: Spreadsheets, databases, full data analysis

### 3. TSV - Tab-Separated
```
OUI	Manufacturer	Registry	Short_Name	Device_Type	Country	Sources
00:00:0C	Cisco Systems, Inc	MA-L	Cisco	Router	US	IEEE+Wireshark+Nmap
```
Best for: Excel/Google Sheets (no CSV quoting issues)

### 4. JSON - Pretty Printed
```json
{
  "00:00:0C": {
    "manufacturer": "Cisco Systems, Inc",
    "registry": "MA-L",
    "short_name": "Cisco",
    "device_type": "Router",
    "registered_date": "1998-04-22",
    "address": "170 WEST TASMAN DRIVE SAN JOSE CA US 95134",
    "country": "US",
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
    <oui>00:00:0C</oui>
    <manufacturer>Cisco Systems, Inc</manufacturer>
    <registry>MA-L</registry>
    <device_type>Router</device_type>
    <country>US</country>
    <sources>IEEE,Wireshark,Nmap</sources>
  </entry>
</oui_database>
```
Best for: Java applications, enterprise systems, XSLT transforms

### 7. SQLite - Ready to Query
Pre-built database file with indexes. Just download and query:
```bash
sqlite3 LISTS/master_oui.db "SELECT * FROM oui_registry WHERE oui = '00:00:0C'"
sqlite3 LISTS/master_oui.db "SELECT * FROM oui_registry WHERE device_type = 'Router'"
sqlite3 LISTS/master_oui.db "SELECT device_type, COUNT(*) FROM oui_registry GROUP BY device_type"
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
- curl/bash (for downloading)
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
Downloads from IEEE (all 5 registries), Wireshark, Nmap, and HDM Mac-Tracker.

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
sqlite3 LISTS/master_oui.db "SELECT * FROM oui_registry WHERE oui = '3C:D9:2B'"

# Find all routers
sqlite3 LISTS/master_oui.db "SELECT oui, manufacturer FROM oui_registry WHERE device_type = 'Router'"

# Count by device type
sqlite3 LISTS/master_oui.db "SELECT device_type, COUNT(*) FROM oui_registry GROUP BY device_type ORDER BY COUNT(*) DESC"

# Find all US companies
sqlite3 LISTS/master_oui.db "SELECT oui, manufacturer FROM oui_registry WHERE country = 'US' LIMIT 20"
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
    return {
        'manufacturer': entry.get('manufacturer', 'Unknown'),
        'device_type': entry.get('device_type'),
        'country': entry.get('country')
    }

result = identify_device('00:00:0C:12:34:56')
print(result)
# {'manufacturer': 'Cisco Systems, Inc', 'device_type': 'Router', 'country': 'US'}
```

### 4. JavaScript / Node.js
```javascript
const ouiDB = require('./LISTS/master_oui.json');

function lookupMAC(mac) {
    const oui = mac.substring(0, 8).toUpperCase();
    return ouiDB[oui] || { manufacturer: 'Unknown' };
}

console.log(lookupMAC('00:00:0C:12:34:56'));
// {
//   manufacturer: 'Cisco Systems, Inc',
//   device_type: 'Router',
//   country: 'US',
//   registered_date: '1998-04-22',
//   sources: ['IEEE', 'Wireshark', 'Nmap']
// }
```

### 5. curl/wget Direct Access
```bash
# Download latest
curl -O https://raw.githubusercontent.com/Ringmast4r/OUI-Master-Database/main/LISTS/master_oui.txt

# Lookup in one command
curl -s https://raw.githubusercontent.com/Ringmast4r/OUI-Master-Database/main/LISTS/master_oui.txt | grep "00000C"
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
├── index.html                   # Web lookup interface
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
│   ├── nmap_prefixes.txt       # Nmap database
│   └── mac_tracker_history.json # HDM registration dates
│
└── LISTS/                       # Generated master files
    ├── master_oui.txt          # Simple format
    ├── master_oui.csv          # Full CSV
    ├── master_oui.tsv          # Tab-separated
    ├── master_oui.json         # Pretty JSON
    ├── master_oui.min.json     # Compact JSON
    ├── master_oui.xml          # XML format
    ├── master_oui.db           # SQLite database
    ├── import-to-d1.sql        # SQL import script
    └── stats.txt               # Merge statistics
```

---

## Use Cases

### Network Security
- Identify unauthorized devices on your network
- Detect spoofed MAC addresses (check "Is Private" flag)
- Audit network device inventory by type

### Wardriving
- Identify access point manufacturers
- Map network infrastructure by vendor
- Analyze WiFi network distribution by country

### IoT Discovery
- Find all smart home devices
- Identify security cameras
- Discover printers and networked appliances

### Network Analysis
- Categorize traffic by device type
- Generate vendor and country statistics
- Create network topology maps

### Educational
- Learn about MAC address structure
- Understand IEEE OUI assignments
- Explore device manufacturer landscape

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

### HDM Mac-Tracker (Historical Data)
- **Source:** https://github.com/hdm/mac-tracker
- **License:** MIT
- **Provides:** Historical registration dates

---

## License

- **IEEE Data:** Public domain (official registry)
- **Wireshark Data:** GPLv2
- **Nmap Data:** Modified GPLv2
- **HDM Mac-Tracker:** MIT
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

**Ideas for contributions:**
- Add more device type classifications
- Improve country code detection
- Add new data sources
- Create API wrapper libraries

---

## Support

- **Issues:** https://github.com/Ringmast4r/OUI-Master-Database/issues
- **Pull Requests:** https://github.com/Ringmast4r/OUI-Master-Database/pulls

---

## Related Projects

- **WiFi Mothership:** https://wifimothership.com/ - Global wardriving network
- **Wireshark:** https://www.wireshark.org/
- **Nmap:** https://nmap.org/
- **HDM Mac-Tracker:** https://github.com/hdm/mac-tracker

---

**Last Updated:** 2025-12-25
**Total OUIs:** 86,098+
**Formats Available:** 8
**Device Types:** 20+ categories
**Maintained by:** [@Ringmast4r](https://github.com/Ringmast4r)

---

![OUI Count](https://img.shields.io/badge/OUIs-86%2C098-blue)
![Formats](https://img.shields.io/badge/Formats-8-green)
![Updates](https://img.shields.io/badge/Updates-Monthly-orange)
