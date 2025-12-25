# Quick Start - OUI Master Database

## What You Have

**A single master OUI database with 86,098 manufacturers + device type classification!**

**Try the live demo:** [OUI Lookup Tool](https://ringmast4r.github.io/OUI-Master-Database/)

---

## What Are OUIs?

**OUI = Organizationally Unique Identifier**

The first 3 bytes (6 hex characters) of a MAC address that identifies the device manufacturer.

```
MAC Address:  00:00:0C:12:34:56
              └─OUI─┘ └─Device─┘

OUI:          00:00:0C
Manufacturer: Cisco Systems, Inc
Device Type:  Router
Country:      US
Registered:   1998-04-22
```

**Why this matters:**
- Identify device manufacturers from MAC addresses
- Classify devices by type (Router, Phone, Camera, IoT, etc.)
- Detect rogue devices on networks
- Security analysis and network mapping

---

## Database Stats

```
IEEE Registries Processed:
  MA-L (Large/OUI):   38,630 entries
  MA-M (Medium):      6,189 entries
  MA-S (Small):       6,827 entries
  IAB (Individual):   4,575 entries
  CID (Company ID):   209 entries
  IEEE Total:         56,430 entries

Community Sources:
  Wireshark:          55,963 entries
  Nmap:               49,058 entries

Historical Data:
  Mac-Tracker:        56,543 registration dates

Results:
  Unique OUIs:        86,098 entries
  Merged Entries:     75,353 (same OUI from multiple sources)

Output Files:
  master_oui.txt      2.43 MB  (simple grep/awk format)
  master_oui.csv      9.05 MB  (full data with addresses)
  master_oui.tsv      5.47 MB  (Excel/Sheets import)
  master_oui.json     25.52 MB (pretty-printed)
  master_oui.min.json 19.52 MB (compact for scripts)
  master_oui.xml      18.67 MB (enterprise/Java)
  master_oui.db       18.08 MB (SQLite ready-to-query)
  import-to-d1.sql    11.30 MB (SQL import script)
```

---

## Data Fields

Each OUI entry now includes:

| Field | Description | Example |
|-------|-------------|---------|
| OUI | MAC prefix | `00:00:0C` |
| Manufacturer | Full company name | `Cisco Systems, Inc` |
| Short Name | Abbreviated name | `Cisco` |
| Registry | IEEE assignment type | `MA-L` |
| **Device Type** | Category | `Router`, `Phone`, `Camera` |
| **Address** | Company address | `170 WEST TASMAN DRIVE...` |
| **Country** | Country code | `US`, `CN`, `DE` |
| Registered Date | First assigned | `1998-04-22` |
| Sources | Verification | `IEEE+Wireshark+Nmap` |

### Device Type Categories

- **Networking:** Router, Switch, Access Point, Modem
- **Consumer:** Phone, Computer, Tablet, TV, Gaming, Wearable
- **Smart Home:** IoT, Smart Home, Camera, Thermostat, Appliance
- **Enterprise:** Server, Storage, Industrial, VoIP
- **Other:** Medical, Automotive, Printer, Audio, Media Player

---

## Project Structure

```
OUI-Master-Database/
├── index.html               ← Web lookup interface
├── README.md                ← Full documentation
├── QUICK-START.md          ← This file
├── download-sources.sh      ← Download fresh databases
├── merge-oui-databases.js   ← Merge into master list
├── update-database.bat      ← Windows updater
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
    ├── master_oui.txt       ← Simple format (86,098 OUIs)
    ├── master_oui.csv       ← Full CSV with all fields
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

### 1. Web Lookup (Easiest)

Open `index.html` in a browser or visit the GitHub Pages site.

### 2. Command Line

**Simple TXT Format:**
```bash
grep "Apple" LISTS/master_oui.txt
grep "00000C" LISTS/master_oui.txt
```

**SQLite Query:**
```bash
# Find all routers
sqlite3 LISTS/master_oui.db "SELECT oui, manufacturer FROM oui_registry WHERE device_type = 'Router'"

# Find by country
sqlite3 LISTS/master_oui.db "SELECT oui, manufacturer FROM oui_registry WHERE country = 'US' LIMIT 10"

# Count by device type
sqlite3 LISTS/master_oui.db "SELECT device_type, COUNT(*) FROM oui_registry GROUP BY device_type ORDER BY COUNT(*) DESC"
```

### 3. Look Up a MAC Address

```bash
# Example MAC: 00:00:0C:12:34:56
grep "00000C" LISTS/master_oui.txt

# Or with SQLite:
sqlite3 LISTS/master_oui.db "SELECT * FROM oui_registry WHERE oui = '00:00:0C'"
```

### 4. API Integration

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

### 5. Python

```python
import json

with open('LISTS/master_oui.min.json') as f:
    oui_db = json.load(f)

def lookup(mac):
    oui = mac[:8].upper()
    return oui_db.get(oui, {'manufacturer': 'Unknown'})

result = lookup('00:00:0C:12:34:56')
print(f"Manufacturer: {result['manufacturer']}")
print(f"Device Type: {result.get('device_type', 'Unknown')}")
print(f"Country: {result.get('country', 'Unknown')}")
```

---

## Update with Fresh Data

Run monthly to get new OUI assignments:

```bash
# Download latest sources
bash download-sources.sh

# Regenerate database
node merge-oui-databases.js
```

**Windows users:** Just double-click `update-database.bat`

---

## CSV Format

```csv
oui,manufacturer,registry,short_name,device_type,registered_date,address,sources
00:00:0C,"Cisco Systems, Inc",MA-L,Cisco,Router,1998-04-22,"170 WEST TASMAN DRIVE SAN JOSE CA US 95134",IEEE+Wireshark+Nmap
```

---

## Sources

1. **IEEE Registration Authority** (Official)
   - https://standards-oui.ieee.org/
   - All 5 registries: MA-L, MA-M, MA-S, IAB, CID

2. **Nmap MAC Prefixes**
   - https://github.com/nmap/nmap/raw/master/nmap-mac-prefixes

3. **Wireshark Manufacturer Database**
   - https://www.wireshark.org/download/automated/data/manuf.gz

4. **HDM Mac-Tracker** (Historical Data)
   - https://github.com/hdm/mac-tracker

---

## What's Included

- **86,098 unique OUIs** (most comprehensive available)
- **Device type classification** (20+ categories)
- **Country codes** (40+ countries)
- **Registration dates** (historical data)
- **8 output formats** (TXT, CSV, TSV, JSON, XML, SQLite, SQL)
- **Web lookup interface** (works offline after loading)
- **5 theme options** (Dark Night, Sin City, Kill Bill, Grindhouse, From Dusk Till Dawn)

---

**Last Updated:** 2025-12-25
**Total OUIs:** 86,098
**Device Types:** 20+ categories
**Formats:** 8
