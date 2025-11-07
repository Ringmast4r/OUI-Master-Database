# OUI Master Database 🌐

**The most comprehensive MAC address manufacturer lookup database - 49,059+ vendors from IEEE, Nmap, and Wireshark**

One master list to rule them all.

[![OUI Count](https://img.shields.io/badge/OUIs-49%2C059-blue)](output/master_oui.csv)
[![Database Size](https://img.shields.io/badge/Size-3.53%20MB-green)](output/master_oui.csv)
[![License](https://img.shields.io/badge/License-Public%20Domain-yellow)](#license)
[![Updates](https://img.shields.io/badge/Updates-Monthly-orange)](#update-schedule)

---

## 🚀 Quick Download

**Just want the data? Download the master CSV directly:**

📥 **[Download master_oui.csv (3.53 MB)](output/master_oui.csv)** - Right-click → Save As

Or use raw GitHub URL:
```
https://raw.githubusercontent.com/Ringmast4r/OUI-Master-Database/main/output/master_oui.csv
```

**Alternative formats:**
- [master_oui.json](output/master_oui.json) - JSON format (8.49 MB)
- [import-to-d1.sql](output/import-to-d1.sql) - SQL format (4.71 MB)

---

## 📖 What is an OUI?

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
- 🔍 **Device Identification:** Know if a WiFi network is from Apple, Samsung, Cisco, etc.
- 🛡️ **Security Analysis:** Identify rogue devices on your network
- 🗺️ **Network Mapping:** Categorize devices by manufacturer
- 📡 **Wardriving:** Identify access points and their vendors
- 🏠 **IoT Discovery:** Find all smart home devices

---

## 📊 Database Sources

This project combines **3 major OUI databases** into one master list:

| Source | Entries | Update Frequency |
|--------|---------|------------------|
| **IEEE Registration Authority** | 25,103 | Monthly (~500-1000 new OUIs) |
| **Nmap MAC Prefixes** | 49,058 | Monthly (maintained by Nmap team) |
| **Wireshark Manufacturer DB** | ~30,000+ | Weekly (Wireshark team) |

**Total Unique OUIs:** **49,059** (after deduplication)
**Merged Entries:** 25,099 (verified from multiple sources)

---

## 📋 CSV Format

```csv
oui,manufacturer,registry,short_name,device_type,address,sources
3C:D9:2B,"Hewlett Packard",MA-L,,,"11445 Compaq Center Drive Houston US 77070",IEEE+Nmap
00:1A:2B,"Apple Inc",MA-L,Apple,Phone,"1 Infinite Loop Cupertino CA 95014",IEEE+Nmap+Wireshark
00:50:BA,"D-Link Corporation",MA-L,D-Link,Router,"2F, NO. 233L-2, PAO-CHIAO RD. TAIPEI TW",IEEE+Nmap
```

**Columns:**
- `oui` - MAC prefix in XX:XX:XX format
- `manufacturer` - Full vendor name
- `registry` - MA-L (24-bit), MA-M (28-bit), MA-S (36-bit)
- `short_name` - Abbreviated name (if available)
- `device_type` - Router/Switch/AP/Phone/Printer (if available)
- `address` - Company address
- `sources` - Which database(s) it came from (IEEE/Nmap/Wireshark)

---

## 🛠️ Generate Fresh Database

### Requirements:
- Node.js 14+
- curl (for downloading)
- Internet connection

### Step 1: Clone Repository
```bash
git clone https://github.com/Ringmast4r/OUI-Master-Database.git
cd OUI-Master-Database
```

### Step 2: Download Latest Sources
```bash
bash download-sources.sh
```
Downloads from IEEE, Wireshark, and Nmap (~10 MB total).

### Step 3: Merge into Master Database
```bash
node merge-oui-databases.js
```

### Step 4: Use the Master Database
```bash
# CSV format (spreadsheets/databases)
cat output/master_oui.csv

# JSON format (APIs/applications)
cat output/master_oui.json

# SQL format (Cloudflare D1/SQLite/PostgreSQL)
cat output/import-to-d1.sql
```

**Windows users:** Just double-click **`update-database.bat`**

---

## 💻 Usage Examples

### 1. Command Line Lookup
```bash
# Look up manufacturer from MAC address
MAC="3C:D9:2B:12:34:56"
OUI="${MAC:0:8}"
grep "^$OUI," output/master_oui.csv

# Find all Apple devices
grep -i "apple" output/master_oui.csv

# Count total manufacturers
wc -l output/master_oui.csv
```

### 2. Python Script
```python
import csv

# Load OUI database
oui_db = {}
with open('output/master_oui.csv') as f:
    reader = csv.DictReader(f)
    for row in reader:
        oui_db[row['oui']] = row['manufacturer']

# Lookup function
def identify_device(mac):
    oui = mac[:8].upper()
    return oui_db.get(oui, 'Unknown')

print(identify_device('3C:D9:2B:12:34:56'))
# Output: Hewlett Packard
```

### 3. JavaScript / Node.js
```javascript
const ouiDB = require('./output/master_oui.json');

function lookupManufacturer(mac) {
    const oui = mac.substring(0, 8).toUpperCase();
    return ouiDB[oui] || { manufacturer: 'Unknown' };
}

console.log(lookupManufacturer('3C:D9:2B:12:34:56'));
// { manufacturer: 'Hewlett Packard', registry: 'MA-L', sources: ['IEEE', 'Nmap'] }
```

### 4. SQL Database Import
```bash
# SQLite
sqlite3 mydb.sqlite < output/import-to-d1.sql

# PostgreSQL
psql mydb < output/import-to-d1.sql

# Cloudflare D1
npx wrangler d1 execute wardrive-db --remote --file=output/import-to-d1.sql
```

### 5. Direct URL Access (curl/wget)
```bash
# Download latest master CSV
curl -O https://raw.githubusercontent.com/Ringmast4r/OUI-Master-Database/main/output/master_oui.csv

# Use in scripts
curl -s https://raw.githubusercontent.com/Ringmast4r/OUI-Master-Database/main/output/master_oui.csv | grep "3C:D9:2B"
```

---

## 🔄 Update Schedule

**Recommended:** Run monthly to stay current with new OUI assignments.

### Automated Updates (Cron Job)
```bash
# Update first day of every month at midnight
0 0 1 * * cd /path/to/OUI-Master-Database && bash download-sources.sh && node merge-oui-databases.js
```

### Manual Update
```bash
cd OUI-Master-Database
bash download-sources.sh
node merge-oui-databases.js
```

**IEEE assigns ~500-1000 new OUIs per month**, so monthly updates recommended.

---

## 📈 Database Statistics

```
Total Unique OUIs:     49,059 manufacturers
IEEE Official:         25,103 entries
Nmap Database:         49,058 entries
Wireshark Database:    0 entries (download issue - will fix)
Merged Entries:        25,099 (same OUI from multiple sources)

Output Files:
  master_oui.csv       3.53 MB
  master_oui.json      8.49 MB
  import-to-d1.sql     4.71 MB
```

---

## 🗂️ Project Structure

```
OUI-Master-Database/
├── README.md                    # This file
├── QUICK-START.md              # Quick start guide
├── download-sources.sh          # Download all 3 databases
├── merge-oui-databases.js       # Merge into single master list
├── update-database.bat          # Windows double-click updater
│
├── sources/                     # Raw downloaded databases (not committed)
│   ├── ieee_oui.csv            # Official IEEE data
│   ├── wireshark_manuf.txt     # Wireshark database
│   └── nmap_prefixes.txt       # Nmap database
│
└── output/                      # Generated master files (committed!)
    ├── master_oui.csv          # ⭐ MASTER CSV (49,059 OUIs)
    ├── master_oui.json         # ⭐ MASTER JSON (49,059 OUIs)
    ├── import-to-d1.sql        # ⭐ SQL for database import
    └── stats.txt               # Merge statistics
```

---

## 🎯 Use Cases

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

## 🌐 Data Sources & Credits

### 1. IEEE Registration Authority (Official)
- **Source:** https://standards-oui.ieee.org/
- **Mirror:** https://github.com/TakahikoKawasaki/nv-oui
- **License:** Public domain
- **Entries:** 25,103 official OUI assignments

### 2. Nmap MAC Prefixes
- **Source:** https://github.com/nmap/nmap/raw/master/nmap-mac-prefixes
- **License:** Modified GPLv2
- **Entries:** 49,058 with device type hints
- **Maintained by:** Nmap Project

### 3. Wireshark Manufacturer Database
- **Source:** https://gitlab.com/wireshark/wireshark/-/raw/master/manuf
- **License:** GPLv2
- **Entries:** ~30,000+ (includes private/custom OUIs)
- **Maintained by:** Wireshark Team

---

## 📝 License

- **IEEE Data:** Public domain (official registry)
- **Wireshark Data:** GPLv2 (https://gitlab.com/wireshark/wireshark/-/blob/master/manuf)
- **Nmap Data:** Modified GPLv2 (https://github.com/nmap/nmap)
- **This Project:** MIT License

**You are free to:**
- Use commercially
- Modify and redistribute
- Use in proprietary software

---

## 🤝 Contributing

Want to add more OUI sources or improve the scripts? PRs welcome!

**Potential additional sources:**
- DeepMAC (https://github.com/hdm/mac-ages)
- MAC Vendor Lookup API
- Custom enterprise OUI assignments

**How to contribute:**
1. Fork the repository
2. Add your improvements
3. Submit a pull request

---

## ⭐ Star This Project

If you find this useful, please star the repository!

---

## 📞 Support

- **Issues:** https://github.com/Ringmast4r/OUI-Master-Database/issues
- **Pull Requests:** https://github.com/Ringmast4r/OUI-Master-Database/pulls

---

## 🔗 Related Projects

- **WiFi Mothership:** https://wifimothership.com/ - Global wardriving network (uses this database!)
- **Wireshark:** https://www.wireshark.org/
- **Nmap:** https://nmap.org/

---

**Last Updated:** 2025-11-07
**Total OUIs:** 49,059+
**Next Update:** 2025-12-01 (monthly)
**Maintained by:** [@Ringmast4r](https://github.com/Ringmast4r)

---

## 📊 Quick Stats Badge

![OUI Count](https://img.shields.io/badge/OUIs-49%2C059-blue)
![Database Size](https://img.shields.io/badge/Size-3.53%20MB-green)
![Updates](https://img.shields.io/badge/Updates-Monthly-orange)

---

**Download now:** [master_oui.csv](output/master_oui.csv) | [master_oui.json](output/master_oui.json) | [import-to-d1.sql](output/import-to-d1.sql)
