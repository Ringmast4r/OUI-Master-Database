#!/bin/bash
# Download all OUI databases from multiple sources

set -e  # Exit on error

SOURCES_DIR="sources"
mkdir -p "$SOURCES_DIR"

echo "🌐 OUI Database Downloader"
echo "=========================="
echo ""

# 1. IEEE Official (via GitHub mirror - updated daily)
echo "📥 [1/3] Downloading IEEE OUI database (official)..."
curl -L -o "$SOURCES_DIR/ieee_oui.csv" \
    "https://raw.githubusercontent.com/TakahikoKawasaki/nv-oui/master/oui.csv" \
    --progress-bar
echo "✅ IEEE: $(wc -l < "$SOURCES_DIR/ieee_oui.csv") lines downloaded"
echo ""

# 2. Wireshark Manufacturer Database
echo "📥 [2/3] Downloading Wireshark manufacturer database..."
curl -L -o "$SOURCES_DIR/wireshark_manuf.txt" \
    "https://gitlab.com/wireshark/wireshark/-/raw/master/manuf" \
    --progress-bar
echo "✅ Wireshark: $(wc -l < "$SOURCES_DIR/wireshark_manuf.txt") lines downloaded"
echo ""

# 3. Nmap MAC Prefixes
echo "📥 [3/3] Downloading Nmap MAC prefixes..."
curl -L -o "$SOURCES_DIR/nmap_prefixes.txt" \
    "https://raw.githubusercontent.com/nmap/nmap/master/nmap-mac-prefixes" \
    --progress-bar
echo "✅ Nmap: $(wc -l < "$SOURCES_DIR/nmap_prefixes.txt") lines downloaded"
echo ""

echo "🎉 All sources downloaded successfully!"
echo ""
echo "Next step: Run merge script"
echo "  node merge-oui-databases.js"
