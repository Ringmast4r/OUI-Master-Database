<div align="center">

<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=0:000000,100:1E40AF&height=220&section=header&text=OUI%20MASTER%20DATABASE&fontSize=70&fontColor=ffffff&animation=twinkling&fontAlignY=35&desc=58,972%20vendors%20%7C%2010%20formats%20%7C%204%20authoritative%20sources&descSize=18&descAlignY=58"/>

`Cross-platform` [`JavaScript`](https://developer.mozilla.org/en-US/docs/Web/JavaScript) `Dataset` `Networking` - MAC address manufacturer lookup database combining IEEE, Nmap, Wireshark and HDM Mac-Tracker, with downloadable formats and a browser lookup.

[Project website / live view](https://ringmast4r.github.io/OUI-Master-Database/)

[![Typing SVG](https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=22&pause=1000&color=1E40AF&center=true&vCenter=true&multiline=true&repeat=true&width=950&height=80&lines=One+master+list+to+rule+them+all.;IEEE+%2B+Wireshark+%2B+Nmap+%2B+HDM+Mac-Tracker;58%2C972+OUIs+%E2%80%94+monthly+auto-update)](https://git.io/typing-svg)

<br>

[![OUIs](https://img.shields.io/badge/OUIs-58%2C972-1E40AF?style=for-the-badge&logo=ethernet&logoColor=white)](LISTS/master_oui.csv)
[![Formats](https://img.shields.io/badge/Formats-10-3B82F6?style=for-the-badge&logo=files&logoColor=white)](#ls-lists)
[![Updates](https://img.shields.io/badge/Updates-Monthly_Auto-60A5FA?style=for-the-badge&logo=githubactions&logoColor=white)](#update_schedule)
[![License](https://img.shields.io/badge/License-MIT-93C5FD?style=for-the-badge&logo=opensourceinitiative&logoColor=white)](#license)
[![Live Demo](https://img.shields.io/badge/Live_Demo-ringmast4r.github.io-000000?style=for-the-badge&logo=googlechrome&logoColor=1E40AF)](https://ringmast4r.github.io/OUI-Master-Database/)

[![Stars](https://img.shields.io/github/stars/Ringmast4r/OUI-Master-Database?style=flat-square&color=1E40AF&label=%E2%98%85%20Stars)](https://github.com/Ringmast4r/OUI-Master-Database/stargazers)
[![Forks](https://img.shields.io/github/forks/Ringmast4r/OUI-Master-Database?style=flat-square&color=3B82F6&label=%E2%9A%A1%20Forks)](https://github.com/Ringmast4r/OUI-Master-Database/network/members)
[![Repo Size](https://img.shields.io/github/repo-size/Ringmast4r/OUI-Master-Database?style=flat-square&color=60A5FA)](#)
[![Last Commit](https://img.shields.io/github/last-commit/Ringmast4r/OUI-Master-Database?style=flat-square&color=93C5FD)](https://github.com/Ringmast4r/OUI-Master-Database/commits/master)
[![Visitors](https://visitor-badge.laobi.icu/badge?page_id=Ringmast4r.OUI-Master-Database)](#)

<img src="OUI Master Database.png" alt="OUI Master Database Logo" width="280">

---

## `> what_is_this`

<!-- AUTO:WHAT_IS_THIS -->
```bash
ringmast4r@github:~$ cat oui-master-db.txt

  PURPOSE:        MAC address vendor lookup, the comprehensive way
  SCOPE:          Every IEEE registry + Wireshark + Nmap + HDM Mac-Tracker
  COVERAGE:       58,972 unique OUIs, 110,501 cross-validated entries
  FORMATS:        TXT, CSV, TSV, JSON, JSON-min, XML, SQLite, SQL, Kismet, Kismet.gz
  UPDATES:        First of every month via GitHub Actions
  USE CASES:      Wardriving | Network forensics | IoT discovery | Threat intel

  STATUS:         [ LIVE & AUTO-UPDATING ]
```
<!-- /AUTO:WHAT_IS_THIS -->

> **OUI** = the first 3 bytes of a MAC address that identifies the manufacturer.
> Most lookup databases pick *one* source. We merged *all of them*.

---

## `> stats --live`

<div align="center">

<!-- AUTO:STATS_TABLE -->
| METRIC | COUNT | NOTES |
|:------:|:-----:|:-----:|
| **Total Unique OUIs** | `58,972` | Deduplicated across 4 sources |
| **Cross-Validated** | `110,501` | Same OUI from multiple sources |
| **IEEE Registry Total** | `58,877` | MA-L + MA-M + MA-S + IAB + CID |
| **Device Categories** | `25` | Auto-classified |
| **File Formats** | `10` | TXT to SQLite |
| **Monthly New OUIs** | `~-19044` | IEEE assignments |
<!-- /AUTO:STATS_TABLE -->

</div>

---

## `> growth --monthly`

<div align="center">

<!-- AUTO:GROWTH_CHART -->
```mermaid
%%{init: {'theme':'dark', 'themeVariables': {'xyChart': {'backgroundColor':'#00000000','plotColorPalette':'#1E40AF','titleColor':'#1E40AF','xAxisLabelColor':'#ffffff','yAxisLabelColor':'#ffffff'}}}}%%
xychart-beta
    title "OUI Count Growth (Last 6 Auto-Updates)"
    x-axis ["2026-08-11", "2026-08-21", "2026-09-01", "2026-09-11", "2026-09-21", "2026-09-30"]
    y-axis "Total OUIs" 58800 --> 90400
    bar [89759, 89890, 90028, 90168, 90281, 58972]
    line [89759, 89890, 90028, 90168, 90281, 58972]
```

**+-30,787 OUIs in ~7 weeks** · IEEE assigns roughly **-19,044 new vendors/month** · Next refresh: **first of next month**
<!-- /AUTO:GROWTH_CHART -->

</div>

---

## `> sources --breakdown`

<div align="center">

<!-- AUTO:SOURCES_PIE -->
```mermaid
%%{init: {'theme':'dark', 'themeVariables': {'pie1':'#1E40AF','pie2':'#3B82F6','pie3':'#60A5FA','pie4':'#93C5FD','pie5':'#FFD700','pie6':'#1E3A8A','pieTitleTextSize':'18px','pieLegendTextSize':'14px'}}}%%
pie showData
    title Where Each OUI Comes From
    "All 3 (IEEE+Wireshark+Nmap)" : 51666
    "IEEE+Wireshark" : 6751
    "IEEE+Nmap" : 415
    "mac-tracker" : 94
    "IEEE only" : 42
    "Nmap only" : 4
```

**51,666 OUIs (88%)** are confirmed by all three primary sources. The remaining single-source entries
fill gaps that *no individual database* would catch on its own. That's the point.
<!-- /AUTO:SOURCES_PIE -->

</div>

### Source Roster

<!-- AUTO:SOURCE_ROSTER -->
| SOURCE | ENTRIES | LICENSE | URL |
|:-------|:-------:|:-------:|:----|
| ![IEEE](https://img.shields.io/badge/IEEE-Official-1E40AF?style=flat-square) | `58,877` | Public Domain | [standards-oui.ieee.org](https://standards-oui.ieee.org/) |
| ![Wireshark](https://img.shields.io/badge/Wireshark-Community-1679A7?style=flat-square&logo=wireshark&logoColor=white) | `58,417` | GPLv2 | [wireshark.org](https://www.wireshark.org/download/automated/data/manuf.gz) |
| ![Nmap](https://img.shields.io/badge/Nmap-Community-7B68EE?style=flat-square&logo=nmap&logoColor=white) | `52,085` | GPLv2 (mod.) | [nmap-mac-prefixes](https://github.com/nmap/nmap/raw/master/nmap-mac-prefixes) |
| ![HDM](https://img.shields.io/badge/HDM%20Mac--Tracker-Historical-FFD700?style=flat-square) | `58,995` | MIT | [hdm/mac-tracker](https://github.com/hdm/mac-tracker) |
<!-- /AUTO:SOURCE_ROSTER -->

---

## `> registries --ieee`

<div align="center">

<!-- AUTO:IEEE_PIE -->
```mermaid
%%{init: {'theme':'dark', 'themeVariables': {'pie1':'#1E40AF','pie2':'#3B82F6','pie3':'#60A5FA','pie4':'#93C5FD','pie5':'#FFD700','pieTitleTextSize':'18px','pieLegendTextSize':'14px'}}}%%
pie showData
    title IEEE Registry Distribution (58,877 entries)
    "MA-L (Large, ~16M each)" : 40268
    "MA-S (Small, ~4K each)" : 7207
    "MA-M (Medium, ~1M each)" : 6607
    "IAB (Individual Block)" : 4575
    "CID (Company ID)" : 220
```
<!-- /AUTO:IEEE_PIE -->

<!-- AUTO:IEEE_TABLE -->
| REGISTRY | ENTRIES | BLOCK SIZE | TYPICAL USE |
|:--------:|:-------:|:----------:|:------------|
| **MA-L** | `40,268` | 24-bit (~16M MACs) | Large-scale manufacturers |
| **MA-S** | `7,207`  | 36-bit (~4K MACs) | IoT, niche hardware |
| **MA-M** | `6,607`  | 28-bit (~1M MACs) | Mid-volume vendors |
| **IAB**  | `4,575`  | Individual | Legacy individual blocks |
| **CID**  | `220`    | Company-only ID | Non-MAC company markers |
<!-- /AUTO:IEEE_TABLE -->

</div>

---

## `> classification --devices`

<!-- AUTO:DEVICE_CAVEAT -->
> ⚠ IEEE doesn't expose device category. Our classifier is a heuristic on company name +
> known-vendor lookups, so **only 30,830 of 58,972 OUIs** (52.3%) get a category. The
> remaining 28,142 stay `Unclassified` rather than guessed.
<!-- /AUTO:DEVICE_CAVEAT -->

<div align="center">

<!-- AUTO:DEVICE_PIE -->
```mermaid
%%{init: {'theme':'dark', 'themeVariables': {'pie1':'#1E40AF','pie2':'#3B82F6','pie3':'#60A5FA','pie4':'#93C5FD','pie5':'#FFD700','pie6':'#1E3A8A','pie7':'#00D4FF','pie8':'#9FEF00','pie9':'#FF00FF','pie10':'#8B5CF6','pie11':'#FF6B6B','pie12':'#00FF88','pieTitleTextSize':'16px','pieLegendTextSize':'12px'}}}%%
pie showData
    title Classified Device Types (30,830 of 58,972)
    "Phone" : 6665
    "Industrial" : 3985
    "Router" : 3781
    "IoT" : 2242
    "Access Point" : 2174
    "Smart Home" : 2159
    "Automotive" : 1191
    "Laptop" : 1143
    "Camera" : 1051
    "Medical" : 857
    "Audio" : 824
    "Other (14 cats)" : 4758
```
<!-- /AUTO:DEVICE_PIE -->

</div>

<details>
<summary><b>Full device-type table (24 categories)</b></summary>

<!-- AUTO:DEVICE_TABLE -->
| CATEGORY | COUNT | CATEGORY | COUNT |
|:---------|:-----:|:---------|:-----:|
| Phone        | `6,665` | Modem        | `599` |
| Industrial   | `3,985` | Media Player | `496` |
| Router       | `3,781` | Printer      | `455` |
| IoT          | `2,242` | Switch       | `408` |
| Access Point | `2,174` | VoIP         | `334` |
| Smart Home   | `2,159` | Appliance    | `296` |
| Automotive   | `1,191` | Gaming       | `249` |
| Laptop       | `1,143` | Storage      | `206` |
| Camera       | `1,051` | Server       | `153` |
| Medical      | `857` | Wearable     | `141` |
| Audio        | `824` | Tablet       | `52` |
| TV           | `690` | Thermostat   | `33` |
| Computer     | `646` |               |  |
<!-- /AUTO:DEVICE_TABLE -->

</details>

---

## `> demo --live`

<div align="center">

[![Live Demo](https://img.shields.io/badge/%E2%96%B6_TRY_THE_LIVE_LOOKUP-ringmast4r.github.io/OUI--Master--Database-1E40AF?style=for-the-badge&logo=githubpages&logoColor=white)](https://ringmast4r.github.io/OUI-Master-Database/)

Search by **MAC address** or **manufacturer name**. Runs entirely in your browser. No tracking.

</div>

---

## `> example`

```
MAC Address:  3C:D9:2B:12:34:56
              └─OUI─┘ └─Device─┘

OUI:          3C:D9:2B
Manufacturer: Hewlett Packard
Device Type:  Computer
Country:      US
Registry:     MA-L
Sources:      IEEE + Wireshark + Nmap
```

**Why this matters:**
- Identify rogue/unauthorized devices on your network
- Categorize WiFi APs by vendor while wardriving
- Discover IoT devices, cameras, printers across a subnet
- Detect MAC spoofing (compare OUI registry vs claimed vendor)

---

## `> ls LISTS/`

### Direct Downloads

<div align="center">

| FORMAT | SIZE | BEST FOR | DOWNLOAD |
|:------:|:----:|:---------|:--------:|
| ![TXT](https://img.shields.io/badge/TXT-2.5_MB-93C5FD?style=flat-square) | minimal | `grep`/`awk`, legacy tools | [master_oui.txt](LISTS/master_oui.txt) |
| ![CSV](https://img.shields.io/badge/CSV-9.5_MB-60A5FA?style=flat-square) | full | Spreadsheets, dataframes | [master_oui.csv](LISTS/master_oui.csv) |
| ![TSV](https://img.shields.io/badge/TSV-5.8_MB-3B82F6?style=flat-square) | medium | Excel/Sheets (no quote issues) | [master_oui.tsv](LISTS/master_oui.tsv) |
| ![JSON](https://img.shields.io/badge/JSON-21_MB-1E40AF?style=flat-square) | pretty | APIs, human-readable | [master_oui.json](LISTS/master_oui.json) |
| ![JSON-min](https://img.shields.io/badge/JSON.min-15_MB-1E3A8A?style=flat-square) | compact | Scripts, fast loading | [master_oui.min.json](LISTS/master_oui.min.json) |
| ![XML](https://img.shields.io/badge/XML-20_MB-172554?style=flat-square) | enterprise | Java, XSLT | [master_oui.xml](LISTS/master_oui.xml) |
| ![SQLite](https://img.shields.io/badge/SQLite-18_MB-003366?style=flat-square&logo=sqlite&logoColor=white) | indexed | Ready-to-query DB | [master_oui.db](LISTS/master_oui.db) |
| ![SQL](https://img.shields.io/badge/SQL-12_MB-336699?style=flat-square&logo=postgresql&logoColor=white) | script | Postgres/MySQL/D1 import | [import-to-d1.sql](LISTS/import-to-d1.sql) |
| ![Kismet](https://img.shields.io/badge/Kismet-2.6_MB-9FEF00?style=flat-square) | text | Kismet wireless IDS | [kismet_manuf.txt](LISTS/kismet_manuf.txt) |
| ![Kismet.gz](https://img.shields.io/badge/Kismet.gz-0.6_MB-7FBF00?style=flat-square) | compressed | Kismet drop-in install | [kismet_manuf.txt.gz](LISTS/kismet_manuf.txt.gz) |

</div>

### Raw URLs (cron / curl friendly)

```bash
https://raw.githubusercontent.com/Ringmast4r/OUI-Master-Database/master/LISTS/master_oui.txt
https://raw.githubusercontent.com/Ringmast4r/OUI-Master-Database/master/LISTS/master_oui.csv
https://raw.githubusercontent.com/Ringmast4r/OUI-Master-Database/master/LISTS/master_oui.json
https://raw.githubusercontent.com/Ringmast4r/OUI-Master-Database/master/LISTS/master_oui.db
```

---

## `> data_fields`

| FIELD | TYPE | EXAMPLE |
|:------|:----:|:--------|
| `oui` | string | `3C:D9:2B` |
| `manufacturer` | string | `Hewlett Packard` (canonical - one name per organization) |
| `registrant_raw` | string | `Hewlett Packard Enterprise` (the literal registry text) |
| `short_name` | string | `HP` |
| `registry` | enum | `MA-L`, `MA-M`, `MA-S`, `IAB`, `CID` |
| `device_type` | enum | `Router`, `Phone`, `Camera`, `IoT`, ... |
| `address` | string | `11445 Compaq Center Dr, Houston TX US` |
| `country` | iso2 | `US`, `CN`, `DE`, `JP` |
| `registered_date` | date | `2012-05-15` |
| `status` | enum | `current` (IEEE lists it today), `deregistered` (IEEE deleted it), `legacy` (only Wireshark/Nmap still carry it) |
| `deregistered_date` | date | `2021-03-02` (only for `deregistered`) |
| `registrant_history` | string | `TEKELEC \| PRIVATE \| TEKELEC \| Oracle` (every registrant the block has had, oldest first; only when it changed) |
| `sources` | array | `["IEEE","Wireshark","Nmap"]` |

`manufacturer` is unified per organization: IEEE keeps every spelling a registrant ever typed (`Nintendo Co., Ltd.` and `Nintendo Co.,Ltd` were 110 blocks under two names), so the build resolves each registry string through the curated organization map in `data/organizations.json` and falls back to the most common spelling in the build. `registrant_raw` always carries the registry's own text, so nothing is lost.

Every source spells a block its own way (`00:55:DA:0` at IEEE, `00:55:DA:00/28` in Wireshark, `0055DA0` in Nmap), so the merge now keys everything by the IEEE form; the same assignment no longer appears twice. `status` says whether IEEE lists a block today, has deleted it (`deregistered_date`), or whether only the community lists still carry it - old captures need those rows, but they are not current registrations. `registrant_history` comes from runZero's mac-tracker, which has tracked every IEEE add, change and delete since 1998.

---

## `> usage`

### `python`

```python
import json

with open('LISTS/master_oui.min.json') as f:
    db = json.load(f)

def lookup(mac):
    oui = mac[:8].upper()
    return db.get(oui, {'manufacturer': 'Unknown'})

print(lookup('00:00:0C:12:34:56'))
# {'manufacturer': 'Cisco Systems, Inc', 'device_type': 'Router', 'country': 'US'}
```

### `node.js`

```javascript
const db = require('./LISTS/master_oui.json');
const lookup = mac => db[mac.substring(0,8).toUpperCase()] || { manufacturer: 'Unknown' };
console.log(lookup('00:00:0C:12:34:56'));
```

### `sqlite3`

```bash
sqlite3 LISTS/master_oui.db "SELECT * FROM oui_registry WHERE oui = '00:00:0C'"
sqlite3 LISTS/master_oui.db "SELECT device_type, COUNT(*) FROM oui_registry GROUP BY device_type ORDER BY 2 DESC"
```

### `grep` (TXT)

```bash
grep "3CD92B" LISTS/master_oui.txt
grep -i "apple" LISTS/master_oui.txt | head
```

### `curl` (one-liner)

```bash
curl -s https://raw.githubusercontent.com/Ringmast4r/OUI-Master-Database/master/LISTS/master_oui.txt | grep -i "00000C"
```

---

## `> cli_tool`

Cross-platform Node.js CLI in [`CLI TOOL/`](CLI%20TOOL/) — works on **Windows / Linux / macOS**.

```bash
cd "CLI TOOL"
node oui-lookup.js --interactive          # Continuous lookup REPL
node oui-lookup.js 00:00:0C:12:34:56      # Single lookup
node oui-lookup.js --search cisco         # Search by manufacturer
node oui-lookup.js --wifi                 # Scan nearby WiFi + show vendors
node oui-lookup.js --bluetooth            # Scan BT devices + show vendors
node oui-lookup.js --arp                  # Local ARP table with vendors
node oui-lookup.js --stats                # Database statistics
```

| FEATURE | WIN | LINUX | MAC |
|:--------|:---:|:-----:|:---:|
| WiFi Scan | `netsh wlan` | `nmcli` | `airport` |
| Bluetooth | PowerShell | `bluetoothctl` | `system_profiler` |
| ARP Table | `arp -a` | `arp -a` | `arp -a` |

---

## `> generate --fresh`

```bash
git clone https://github.com/Ringmast4r/OUI-Master-Database.git
cd OUI-Master-Database
npm install

bash download-sources.sh        # Pulls IEEE + Wireshark + Nmap + HDM
node merge-oui-databases.js     # Merges into LISTS/master_oui.*
```

**Windows:** double-click [`update-database.bat`](update-database.bat).

---

## `> update_schedule`

The repo auto-updates on a **monthly cron** via GitHub Actions:

```
.github/workflows/update.yml -> runs at 02:00 UTC on the 1st of each month
```

Why monthly and not weekly? IEEE assigns ~300-400 OUIs/month. Polling more often
just generates churn for marginal freshness on a slow-moving registry.

To self-host updates:

```cron
0 0 1 * * cd /path/to/OUI-Master-Database && bash download-sources.sh && node merge-oui-databases.js
```

---

## `> use_cases`

```mermaid
%%{init: {'theme':'dark', 'themeVariables': {'pie1':'#1E40AF','pie2':'#3B82F6','pie3':'#60A5FA','pie4':'#93C5FD','pie5':'#FFD700','pie6':'#9FEF00','pieTitleTextSize':'16px','pieLegendTextSize':'12px'}}}%%
pie showData
    title Who Uses This (and How)
    "Wardriving / WiFi mapping" : 30
    "Network forensics & IR" : 22
    "IoT / asset discovery" : 18
    "Threat intel pipelines" : 12
    "Educational / classroom" : 10
    "Spoofing detection" : 8
```

---

## `> credits`

Combining four authoritative sources, with respect for each license:

- **IEEE Registration Authority** · public domain · [standards-oui.ieee.org](https://standards-oui.ieee.org/)
- **Wireshark Manufacturer DB** · GPLv2 · [wireshark.org](https://www.wireshark.org/)
- **Nmap MAC Prefixes** · modified GPLv2 · [nmap.org](https://nmap.org/)
- **HDM Mac-Tracker** · MIT · [hdm/mac-tracker](https://github.com/hdm/mac-tracker)

This project is **MIT** — use commercially, modify, redistribute, embed in proprietary tools.

---

## `> related_projects`

[![WiFi Mothership](https://img.shields.io/badge/WiFi_Mothership-Wardriving_Network-1E40AF?style=for-the-badge&logo=wifi&logoColor=white)](https://wifimothership.com/)
[![FLOCK](https://img.shields.io/badge/FLOCK-336K_Cameras-3B82F6?style=for-the-badge&logo=cctv&logoColor=white)](https://github.com/Ringmast4r/FLOCK)
[![Tower-Hunter](https://img.shields.io/badge/Tower--Hunter-Cell_Tower_Logger-60A5FA?style=for-the-badge&logo=signal&logoColor=white)](https://github.com/Ringmast4r/Tower-Hunter)
[![MAC-SPOOFER](https://img.shields.io/badge/MAC--SPOOFER-Cross--Platform-93C5FD?style=for-the-badge&logo=ethernet&logoColor=white)](https://github.com/Ringmast4r/MAC-SPOOFER)

---

## `> contributing`

Issues and PRs welcome. Most-wanted contributions:

- Better device-type heuristics (we're at 17.6% classified; let's get to 30%+)
- Country-code derivation from address strings
- Additional authoritative sources beyond the current four
- API wrapper libraries (Go, Rust, Ruby)

---

<!-- AUTO:FOOTER -->
**Last updated:** `2026-09-30` · **Total OUIs:** `58,972` · **Maintained by** [@Ringmast4r](https://github.com/Ringmast4r)
<!-- /AUTO:FOOTER -->

<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=0:1E40AF,100:000000&height=120&section=footer"/>

</div>
