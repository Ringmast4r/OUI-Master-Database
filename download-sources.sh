#!/bin/bash
# Download all OUI databases from multiple sources

set -e  # Exit on error

SOURCES_DIR="sources"
mkdir -p "$SOURCES_DIR"

echo "🌐 OUI Database Downloader"
echo "=========================="
echo ""

# 1. IEEE MA-L (Large - Traditional OUI, 24-bit)
echo "📥 [1/7] Downloading IEEE MA-L (OUI) database..."
curl -L -o "$SOURCES_DIR/ieee_mal.csv" \
    "https://standards-oui.ieee.org/oui/oui.csv" \
    --progress-bar
echo "✅ IEEE MA-L: $(wc -l < "$SOURCES_DIR/ieee_mal.csv") lines downloaded"
echo ""

# 2. IEEE MA-M (Medium - 28-bit)
echo "📥 [2/7] Downloading IEEE MA-M database..."
curl -L -o "$SOURCES_DIR/ieee_mam.csv" \
    "https://standards-oui.ieee.org/oui28/mam.csv" \
    --progress-bar
echo "✅ IEEE MA-M: $(wc -l < "$SOURCES_DIR/ieee_mam.csv") lines downloaded"
echo ""

# 3. IEEE MA-S (Small - 36-bit, formerly OUI-36)
echo "📥 [3/7] Downloading IEEE MA-S database..."
curl -L -o "$SOURCES_DIR/ieee_mas.csv" \
    "https://standards-oui.ieee.org/oui36/oui36.csv" \
    --progress-bar
echo "✅ IEEE MA-S: $(wc -l < "$SOURCES_DIR/ieee_mas.csv") lines downloaded"
echo ""

# 4. IEEE IAB (Individual Address Blocks - legacy)
echo "📥 [4/7] Downloading IEEE IAB database..."
curl -L -o "$SOURCES_DIR/ieee_iab.csv" \
    "https://standards-oui.ieee.org/iab/iab.csv" \
    --progress-bar
echo "✅ IEEE IAB: $(wc -l < "$SOURCES_DIR/ieee_iab.csv") lines downloaded"
echo ""

# 5. IEEE CID (Company ID - no MAC addresses, for reference)
echo "📥 [5/7] Downloading IEEE CID database..."
curl -L -o "$SOURCES_DIR/ieee_cid.csv" \
    "https://standards-oui.ieee.org/cid/cid.csv" \
    --progress-bar
echo "✅ IEEE CID: $(wc -l < "$SOURCES_DIR/ieee_cid.csv") lines downloaded"
echo ""

# 6. Wireshark Manufacturer Database (now distributed as gzip)
echo "📥 [6/7] Downloading Wireshark manufacturer database..."
curl -L -o "$SOURCES_DIR/wireshark_manuf.gz" \
    "https://www.wireshark.org/download/automated/data/manuf.gz" \
    --progress-bar
gunzip -f "$SOURCES_DIR/wireshark_manuf.gz"
mv "$SOURCES_DIR/wireshark_manuf" "$SOURCES_DIR/wireshark_manuf.txt"
echo "✅ Wireshark: $(wc -l < "$SOURCES_DIR/wireshark_manuf.txt") lines downloaded"
echo ""

# 7. Nmap MAC Prefixes
echo "📥 [7/8] Downloading Nmap MAC prefixes..."
curl -L -o "$SOURCES_DIR/nmap_prefixes.txt" \
    "https://raw.githubusercontent.com/nmap/nmap/master/nmap-mac-prefixes" \
    --progress-bar
echo "✅ Nmap: $(wc -l < "$SOURCES_DIR/nmap_prefixes.txt") lines downloaded"
echo ""

# 8. HDM Mac-Tracker Historical Data (registration dates)
echo "📥 [8/8] Downloading HDM mac-tracker historical data..."
curl -L -o "$SOURCES_DIR/mac_tracker_history.json" \
    "https://raw.githubusercontent.com/hdm/mac-tracker/main/data/macs.json" \
    --progress-bar
echo "✅ Mac-Tracker: Historical registration dates downloaded"
echo ""

echo "🎉 All sources downloaded successfully!"
echo ""
echo "IEEE Registries:"
echo "  MA-L: Large blocks (24-bit OUI) - ~16M addresses each"
echo "  MA-M: Medium blocks (28-bit) - ~1M addresses each"
echo "  MA-S: Small blocks (36-bit) - ~4K addresses each"
echo "  IAB:  Individual Address Blocks (legacy)"
echo "  CID:  Company ID (reference only)"
echo ""
echo "Next step: Run merge script"
echo "  node merge-oui-databases.js"
