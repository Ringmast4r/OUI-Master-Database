#!/usr/bin/env node
/**
 * OUI Master Database - Cross-Platform CLI Lookup Tool
 *
 * Supports: Windows, Linux, macOS
 *
 * Features:
 *   - MAC address lookup
 *   - Manufacturer search
 *   - Bluetooth device scanning
 *   - WiFi network scanning
 *   - ARP table analysis
 *   - Interactive mode
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');
const os = require('os');

// Platform detection
const PLATFORM = process.platform; // 'win32', 'linux', 'darwin' (macOS)

// ANSI Colors
const c = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m'
};

// Load database from parent LISTS folder
let ouiDatabase = null;
const DB_PATH = path.join(__dirname, '..', 'LISTS', 'master_oui.min.json');

function loadDatabase() {
    if (ouiDatabase) return ouiDatabase;

    console.log(`${c.dim}Loading OUI database...${c.reset}`);

    if (!fs.existsSync(DB_PATH)) {
        console.error(`${c.red}Error: Database not found at ${DB_PATH}${c.reset}`);
        console.error(`Make sure the LISTS folder exists in the parent directory.`);
        process.exit(1);
    }

    const data = fs.readFileSync(DB_PATH, 'utf8');
    ouiDatabase = JSON.parse(data);

    const count = Object.keys(ouiDatabase).length;
    console.log(`${c.green}Loaded ${count.toLocaleString()} OUI entries${c.reset}\n`);

    return ouiDatabase;
}

// Normalize MAC address to OUI format (XX:XX:XX)
function normalizeMAC(mac) {
    const cleaned = mac.replace(/[:\-.\s]/g, '').toUpperCase();
    const oui = cleaned.substring(0, 6);
    if (oui.length >= 6) {
        return `${oui.substring(0, 2)}:${oui.substring(2, 4)}:${oui.substring(4, 6)}`;
    }
    return null;
}

// Look up a MAC address
function lookupMAC(mac) {
    const db = loadDatabase();
    const oui = normalizeMAC(mac);

    if (!oui) return { error: 'Invalid MAC address format' };

    const entry = db[oui];
    if (entry) {
        return { oui, fullMAC: mac, ...entry };
    }
    return { oui, fullMAC: mac, manufacturer: 'Unknown', error: 'OUI not found' };
}

// Display lookup result
function displayResult(result) {
    if (result.manufacturer === 'Unknown') {
        console.log(`${c.yellow}MAC:${c.reset} ${result.fullMAC}`);
        console.log(`${c.yellow}OUI:${c.reset} ${result.oui}`);
        console.log(`${c.red}Manufacturer: Unknown${c.reset}`);
        return;
    }

    console.log(`${c.cyan}${'-'.repeat(60)}${c.reset}`);
    console.log(`${c.bright}${c.green}MAC Address:${c.reset}    ${result.fullMAC}`);
    console.log(`${c.bright}${c.green}OUI:${c.reset}            ${result.oui}`);
    console.log(`${c.bright}${c.green}Manufacturer:${c.reset}   ${c.bright}${result.manufacturer}${c.reset}`);

    if (result.short_name) console.log(`${c.green}Short Name:${c.reset}     ${result.short_name}`);
    if (result.device_type) console.log(`${c.green}Device Type:${c.reset}    ${c.magenta}${result.device_type}${c.reset}`);
    if (result.country) console.log(`${c.green}Country:${c.reset}        ${result.country}`);
    if (result.address) console.log(`${c.green}Address:${c.reset}        ${result.address}`);
    if (result.registry) console.log(`${c.green}Registry:${c.reset}       ${result.registry}`);
    if (result.registered_date) console.log(`${c.green}Registered:${c.reset}     ${result.registered_date}`);
    if (result.sources?.length) console.log(`${c.green}Sources:${c.reset}        ${result.sources.join(', ')}`);
}

// Display device with full OUI info
function displayDevice(name, mac, extra = {}) {
    console.log(`${c.cyan}${'-'.repeat(60)}${c.reset}`);
    if (name) console.log(`${c.bright}Device:${c.reset}   ${name}`);
    if (extra.status) console.log(`${c.bright}Status:${c.reset}   ${extra.status}`);
    if (extra.ip) console.log(`${c.bright}IP:${c.reset}       ${extra.ip}`);

    // Normalize MAC to colon format for display
    let formatted = mac;
    if (mac.includes('-')) {
        formatted = mac.replace(/-/g, ':');
    } else if (!mac.includes(':')) {
        formatted = mac.replace(/(.{2})/g, '$1:').slice(0, -1);
    }
    console.log(`${c.bright}MAC:${c.reset}      ${formatted}`);

    const lookup = lookupMAC(mac);
    const vendorColor = lookup.manufacturer !== 'Unknown' ? c.green : c.yellow;
    console.log(`${c.bright}OUI:${c.reset}      ${lookup.oui}`);
    console.log(`${c.bright}Vendor:${c.reset}   ${vendorColor}${lookup.manufacturer}${c.reset}`);
    if (lookup.manufacturer !== 'Unknown') {
        if (lookup.device_type) console.log(`${c.bright}Type:${c.reset}     ${c.magenta}${lookup.device_type}${c.reset}`);
        if (lookup.address) console.log(`${c.bright}Address:${c.reset}  ${lookup.address}`);
        if (lookup.country) console.log(`${c.bright}Country:${c.reset}  ${lookup.country}`);
        if (lookup.registry) console.log(`${c.bright}Registry:${c.reset} ${lookup.registry}`);
        if (lookup.registered_date) console.log(`${c.bright}Registered:${c.reset} ${lookup.registered_date}`);
    }
    if (extra.signal) console.log(`${c.bright}Signal:${c.reset}   ${extra.signal}`);
    if (extra.channel) console.log(`${c.bright}Channel:${c.reset}  ${extra.channel}`);
}

// Search by manufacturer name
function searchManufacturer(term) {
    const db = loadDatabase();
    const searchTerm = term.toLowerCase();
    const results = [];

    for (const [oui, entry] of Object.entries(db)) {
        const manufacturer = (entry.manufacturer || '').toLowerCase();
        const shortName = (entry.short_name || '').toLowerCase();
        if (manufacturer.includes(searchTerm) || shortName.includes(searchTerm)) {
            results.push({ oui, ...entry });
        }
    }
    return results;
}

// Execute command safely
function execCommand(cmd, options = {}) {
    try {
        return execSync(cmd, { encoding: 'utf8', timeout: 30000, ...options });
    } catch (e) {
        return null;
    }
}

// ============== BLUETOOTH SCANNING ==============

function scanBluetoothWindows() {
    // Trigger a fresh Bluetooth scan by opening the Bluetooth panel
    try {
        execSync('start ms-settings:bluetooth', { encoding: 'utf8', shell: true, windowsHide: true });
        // Wait for scan
        execSync('ping -n 5 127.0.0.1 >nul', { encoding: 'utf8', shell: true });
        // Close settings
        execSync('taskkill /f /im SystemSettings.exe >nul 2>&1', { encoding: 'utf8', shell: true });
    } catch (e) {
        // Ignore errors
    }

    const psCommand = `Get-PnpDevice -Class Bluetooth -Status OK | Select-Object FriendlyName, InstanceId | ConvertTo-Json`;
    const result = execCommand(`powershell -Command "${psCommand}"`);
    if (!result) return [];

    try {
        const parsed = JSON.parse(result);
        const devices = Array.isArray(parsed) ? parsed : [parsed];
        return devices.filter(d => d.FriendlyName).map(d => {
            const macMatch = (d.InstanceId || '').match(/([0-9A-Fa-f]{12})/);
            return {
                name: d.FriendlyName,
                mac: macMatch ? macMatch[1] : null
            };
        });
    } catch (e) {
        return [];
    }
}

function scanBluetoothLinux() {
    // Trigger a scan first (runs for 3 seconds)
    execCommand('timeout 3 bluetoothctl scan on 2>/dev/null');

    // Try bluetoothctl first
    let result = execCommand('bluetoothctl devices 2>/dev/null');
    if (result) {
        const devices = [];
        for (const line of result.split('\n')) {
            const match = line.match(/Device\s+([0-9A-Fa-f:]+)\s+(.+)/);
            if (match) {
                devices.push({ name: match[2].trim(), mac: match[1] });
            }
        }
        if (devices.length > 0) return devices;
    }

    // Fallback to hcitool
    execCommand('hcitool scan --flush 2>/dev/null &');
    execCommand('sleep 3');
    result = execCommand('hcitool scan 2>/dev/null');
    if (result) {
        const devices = [];
        for (const line of result.split('\n')) {
            const match = line.match(/([0-9A-Fa-f:]+)\s+(.+)/);
            if (match) {
                devices.push({ name: match[2].trim(), mac: match[1] });
            }
        }
        return devices;
    }

    return [];
}

function scanBluetoothMac() {
    // Open Bluetooth preferences to trigger discovery (then close)
    execCommand('open -a "System Preferences" /System/Library/PreferencePanes/Bluetooth.prefPane 2>/dev/null || open -a "System Settings" 2>/dev/null');
    execCommand('sleep 4');
    execCommand('osascript -e \'quit app "System Preferences"\' 2>/dev/null; osascript -e \'quit app "System Settings"\' 2>/dev/null');

    const result = execCommand('system_profiler SPBluetoothDataType 2>/dev/null');
    if (!result) return [];

    const devices = [];
    let currentDevice = null;
    let inDevicesSection = false;

    for (const line of result.split('\n')) {
        if (line.includes('Devices (Paired, Configured, etc.):') || line.includes('Connected:') || line.includes('Devices:')) {
            inDevicesSection = true;
            continue;
        }
        if (inDevicesSection) {
            // Device name line (indented, ends with :)
            const nameMatch = line.match(/^\s{8}(\S.+):$/);
            if (nameMatch) {
                if (currentDevice && currentDevice.mac) devices.push(currentDevice);
                currentDevice = { name: nameMatch[1], mac: null };
            }
            // Address line
            const addrMatch = line.match(/Address:\s*([0-9A-Fa-f:-]+)/);
            if (addrMatch && currentDevice) {
                currentDevice.mac = addrMatch[1];
            }
        }
    }
    if (currentDevice && currentDevice.mac) devices.push(currentDevice);

    return devices;
}

function scanBluetooth() {
    console.log(`${c.bright}${c.blue}Scanning Bluetooth devices...${c.reset}\n`);

    let devices = [];
    if (PLATFORM === 'win32') devices = scanBluetoothWindows();
    else if (PLATFORM === 'darwin') devices = scanBluetoothMac();
    else devices = scanBluetoothLinux();

    if (devices.length === 0) {
        console.log(`${c.yellow}No Bluetooth devices found${c.reset}`);
        return;
    }

    console.log(`${c.green}Found ${devices.length} Bluetooth device(s):${c.reset}\n`);
    for (const device of devices) {
        if (device.mac) {
            displayDevice(device.name, device.mac);
        } else {
            console.log(`${c.cyan}${'-'.repeat(60)}${c.reset}`);
            console.log(`${c.bright}Device:${c.reset}   ${device.name}`);
            console.log(`${c.yellow}MAC:      Not available${c.reset}`);
        }
    }
}

// ============== WIFI SCANNING ==============

function scanWiFiWindows() {
    // Trigger a fresh scan by opening the WiFi panel briefly
    try {
        execSync('start ms-availablenetworks:', { encoding: 'utf8', shell: true, windowsHide: true });
        // Wait for scan to complete
        execSync('ping -n 4 127.0.0.1 >nul', { encoding: 'utf8', shell: true });
        // Close the panel
        execSync('taskkill /f /im SystemSettings.exe >nul 2>&1', { encoding: 'utf8', shell: true });
    } catch (e) {
        // Ignore errors from panel operations
    }

    const result = execCommand('netsh wlan show networks mode=bssid');
    if (!result) return [];

    const networks = [];
    let currentSSID = '';
    let currentBSSID = null;
    let currentSignal = null;
    let currentChannel = null;

    for (let line of result.split('\n')) {
        line = line.trim();

        if (line.match(/^SSID\s*\d*\s*:/)) {
            if (currentBSSID) {
                networks.push({ ssid: currentSSID, bssid: currentBSSID, signal: currentSignal, channel: currentChannel });
                currentBSSID = null;
            }
            const ssidMatch = line.match(/^SSID\s*\d*\s*:\s*(.*)/);
            currentSSID = ssidMatch ? ssidMatch[1].trim() : '';
        }

        const bssidMatch = line.match(/^BSSID\s*\d*\s*:\s*([0-9a-fA-F:]+)/);
        if (bssidMatch) {
            if (currentBSSID) {
                networks.push({ ssid: currentSSID, bssid: currentBSSID, signal: currentSignal, channel: currentChannel });
            }
            currentBSSID = bssidMatch[1];
            currentSignal = null;
            currentChannel = null;
        }

        const signalMatch = line.match(/^Signal\s*:\s*(\d+)%/);
        if (signalMatch) currentSignal = signalMatch[1] + '%';

        const channelMatch = line.match(/^Channel\s*:\s*(\d+)/);
        if (channelMatch) currentChannel = channelMatch[1];
    }

    if (currentBSSID) {
        networks.push({ ssid: currentSSID, bssid: currentBSSID, signal: currentSignal, channel: currentChannel });
    }

    return networks;
}

function scanWiFiLinux() {
    // Trigger a fresh scan first
    execCommand('nmcli dev wifi rescan 2>/dev/null');
    execCommand('sleep 2');

    // Try nmcli first
    let result = execCommand('nmcli -t -f BSSID,SSID,SIGNAL,CHAN dev wifi list 2>/dev/null');
    if (result) {
        const networks = [];
        for (const line of result.split('\n')) {
            const parts = line.split(':');
            if (parts.length >= 4 && parts[0].match(/[0-9A-Fa-f]/)) {
                // BSSID has colons, so rejoin first 6 parts
                const bssid = parts.slice(0, 6).join(':');
                const rest = parts.slice(6);
                networks.push({
                    bssid: bssid,
                    ssid: rest[0] || '(Hidden)',
                    signal: rest[1] ? rest[1] + '%' : null,
                    channel: rest[2] || null
                });
            }
        }
        if (networks.length > 0) return networks;
    }

    // Fallback to iwlist (requires sudo for scan)
    result = execCommand('sudo iwlist wlan0 scan 2>/dev/null || iwlist wlan0 scan 2>/dev/null');
    if (result) {
        const networks = [];
        let current = {};
        for (const line of result.split('\n')) {
            const cellMatch = line.match(/Cell \d+ - Address: ([0-9A-Fa-f:]+)/);
            if (cellMatch) {
                if (current.bssid) networks.push(current);
                current = { bssid: cellMatch[1] };
            }
            const essidMatch = line.match(/ESSID:"(.*)"/);
            if (essidMatch) current.ssid = essidMatch[1] || '(Hidden)';
            const sigMatch = line.match(/Signal level[=:](-?\d+)/);
            if (sigMatch) current.signal = sigMatch[1] + ' dBm';
            const chanMatch = line.match(/Channel[:\s]*(\d+)/);
            if (chanMatch) current.channel = chanMatch[1];
        }
        if (current.bssid) networks.push(current);
        return networks;
    }

    return [];
}

function scanWiFiMac() {
    // airport -s triggers a scan automatically
    const result = execCommand('/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -s 2>/dev/null');
    if (!result) return [];

    const networks = [];
    const lines = result.split('\n');

    for (let i = 1; i < lines.length; i++) { // Skip header
        const line = lines[i].trim();
        if (!line) continue;

        // Format: SSID BSSID RSSI CHANNEL ...
        const match = line.match(/^(.+?)\s+([0-9a-f:]+)\s+(-?\d+)\s+(\d+)/i);
        if (match) {
            networks.push({
                ssid: match[1].trim() || '(Hidden)',
                bssid: match[2],
                signal: match[3] + ' dBm',
                channel: match[4]
            });
        }
    }

    return networks;
}

function scanWiFi() {
    console.log(`${c.bright}${c.blue}Scanning nearby WiFi networks...${c.reset}\n`);

    let networks = [];
    if (PLATFORM === 'win32') networks = scanWiFiWindows();
    else if (PLATFORM === 'darwin') networks = scanWiFiMac();
    else networks = scanWiFiLinux();

    if (networks.length === 0) {
        console.log(`${c.yellow}No WiFi networks found. Make sure WiFi is enabled.${c.reset}`);
        return;
    }

    console.log(`${c.green}Found ${networks.length} access point(s):${c.reset}\n`);

    for (const net of networks) {
        console.log(`${c.cyan}${'-'.repeat(60)}${c.reset}`);
        console.log(`${c.bright}SSID:${c.reset}     ${net.ssid || '(Hidden)'}`);
        console.log(`${c.bright}BSSID:${c.reset}    ${net.bssid}`);
        if (net.signal) {
            if (net.signal.includes('%')) {
                const sig = parseInt(net.signal);
                const bars = '#'.repeat(Math.round(sig / 20)) + '-'.repeat(5 - Math.round(sig / 20));
                console.log(`${c.bright}Signal:${c.reset}   [${bars}] ${net.signal}`);
            } else {
                console.log(`${c.bright}Signal:${c.reset}   ${net.signal}`);
            }
        }
        if (net.channel) console.log(`${c.bright}Channel:${c.reset}  ${net.channel}`);

        const lookup = lookupMAC(net.bssid);
        const vendorColor = lookup.manufacturer !== 'Unknown' ? c.green : c.yellow;
        console.log(`${c.bright}OUI:${c.reset}      ${lookup.oui}`);
        console.log(`${c.bright}Vendor:${c.reset}   ${vendorColor}${lookup.manufacturer}${c.reset}`);
        if (lookup.manufacturer !== 'Unknown') {
            if (lookup.device_type) console.log(`${c.bright}Type:${c.reset}     ${c.magenta}${lookup.device_type}${c.reset}`);
            if (lookup.address) console.log(`${c.bright}Address:${c.reset}  ${lookup.address}`);
            if (lookup.country) console.log(`${c.bright}Country:${c.reset}  ${lookup.country}`);
            if (lookup.registry) console.log(`${c.bright}Registry:${c.reset} ${lookup.registry}`);
            if (lookup.registered_date) console.log(`${c.bright}Registered:${c.reset} ${lookup.registered_date}`);
        }
    }
}

// ============== ARP TABLE ==============

function showARP() {
    console.log(`${c.bright}${c.blue}Reading ARP table...${c.reset}\n`);

    const result = execCommand('arp -a');
    if (!result) {
        console.log(`${c.red}Error reading ARP table${c.reset}`);
        return;
    }

    const entries = [];

    for (const line of result.split('\n')) {
        let match;

        if (PLATFORM === 'win32') {
            // Windows: 192.168.1.1   00-11-22-33-44-55   dynamic
            // Must have exactly 5 dashes in MAC (6 octets)
            match = line.match(/^\s+(\d+\.\d+\.\d+\.\d+)\s+([0-9a-fA-F]{2}-[0-9a-fA-F]{2}-[0-9a-fA-F]{2}-[0-9a-fA-F]{2}-[0-9a-fA-F]{2}-[0-9a-fA-F]{2})\s+(\w+)/);
        } else {
            // Linux/Mac: hostname (192.168.1.1) at 00:11:22:33:44:55 [ether] on eth0
            match = line.match(/\((\d+\.\d+\.\d+\.\d+)\)\s+at\s+([0-9a-fA-F]{2}:[0-9a-fA-F]{2}:[0-9a-fA-F]{2}:[0-9a-fA-F]{2}:[0-9a-fA-F]{2}:[0-9a-fA-F]{2})/);
        }

        if (match) {
            const [, ip, mac] = match;
            const normalizedMac = mac.toLowerCase();
            if (normalizedMac !== 'ff-ff-ff-ff-ff-ff' && normalizedMac !== 'ff:ff:ff:ff:ff:ff') {
                entries.push({ ip, mac, type: match[3] || 'dynamic' });
            }
        }
    }

    if (entries.length === 0) {
        console.log(`${c.yellow}No ARP entries found${c.reset}`);
        return;
    }

    console.log(`${c.green}Found ${entries.length} ARP entries:${c.reset}\n`);

    for (const entry of entries) {
        displayDevice(null, entry.mac, { ip: entry.ip });
    }
}

// ============== OTHER FUNCTIONS ==============

function lookupFromFile(filePath) {
    if (!fs.existsSync(filePath)) {
        console.error(`${c.red}Error: File not found: ${filePath}${c.reset}`);
        return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const macPattern = /([0-9A-Fa-f]{2}[:\-]){5}[0-9A-Fa-f]{2}|[0-9A-Fa-f]{12}/g;
    const macs = content.match(macPattern) || [];

    if (macs.length === 0) {
        console.log(`${c.yellow}No MAC addresses found in file${c.reset}`);
        return;
    }

    console.log(`${c.green}Found ${macs.length} MAC address(es):${c.reset}\n`);
    for (const mac of macs) {
        displayResult(lookupMAC(mac));
        console.log('');
    }
}

function showStats() {
    const db = loadDatabase();
    const stats = { total: 0, byDeviceType: {}, byCountry: {}, byRegistry: {}, withDate: 0 };

    for (const entry of Object.values(db)) {
        stats.total++;
        const type = entry.device_type || 'Unclassified';
        stats.byDeviceType[type] = (stats.byDeviceType[type] || 0) + 1;
        if (entry.country) stats.byCountry[entry.country] = (stats.byCountry[entry.country] || 0) + 1;
        if (entry.registry) stats.byRegistry[entry.registry] = (stats.byRegistry[entry.registry] || 0) + 1;
        if (entry.registered_date) stats.withDate++;
    }

    console.log(`${c.bright}${c.cyan}OUI Database Statistics${c.reset}`);
    console.log(`${c.dim}${'='.repeat(23)}${c.reset}`);

    console.log(`\n${c.bright}Total OUIs:${c.reset} ${stats.total.toLocaleString()}`);
    console.log(`${c.bright}With Registration Date:${c.reset} ${stats.withDate.toLocaleString()}`);

    console.log(`\n${c.bright}${c.green}Top Device Types:${c.reset}`);
    Object.entries(stats.byDeviceType).sort((a, b) => b[1] - a[1]).slice(0, 10)
        .forEach(([type, count]) => console.log(`  ${type.padEnd(20)} ${count.toString().padStart(6)}`));

    console.log(`\n${c.bright}${c.blue}Top Countries:${c.reset}`);
    Object.entries(stats.byCountry).sort((a, b) => b[1] - a[1]).slice(0, 10)
        .forEach(([country, count]) => console.log(`  ${country.padEnd(5)} ${count.toString().padStart(6)}`));

    console.log(`\n${c.bright}${c.magenta}By Registry:${c.reset}`);
    Object.entries(stats.byRegistry).sort((a, b) => b[1] - a[1])
        .forEach(([registry, count]) => console.log(`  ${registry.padEnd(10)} ${count.toString().padStart(6)}`));
}

function interactiveMode() {
    loadDatabase();

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    const platName = PLATFORM === 'win32' ? 'Windows' : PLATFORM === 'darwin' ? 'macOS' : 'Linux';
    console.log(`${c.bright}${c.cyan}OUI Master Database - Interactive Mode${c.reset}`);
    console.log(`${c.dim}${'='.repeat(38)}${c.reset}`);
    console.log(`${c.dim}Platform: ${platName}${c.reset}`);
    console.log(`\n${c.dim}Commands: MAC address, manufacturer name, or:${c.reset}`);
    console.log(`  ${c.yellow}wifi${c.reset}       - Scan nearby WiFi networks`);
    console.log(`  ${c.yellow}bluetooth${c.reset}  - Scan Bluetooth devices`);
    console.log(`  ${c.yellow}arp${c.reset}        - Show ARP table`);
    console.log(`  ${c.yellow}stats${c.reset}      - Database statistics`);
    console.log(`  ${c.yellow}quit${c.reset}       - Exit\n`);

    const prompt = () => {
        rl.question(`${c.bright}${c.green}oui>${c.reset} `, (input) => {
            const trimmed = input.trim();
            if (!trimmed) { prompt(); return; }

            const lower = trimmed.toLowerCase();
            if (['quit', 'exit', 'q'].includes(lower)) { console.log('Goodbye!'); rl.close(); return; }

            if (lower === 'bt' || lower.startsWith('blu')) scanBluetooth();
            else if (lower === 'wifi' || lower === 'wi' || lower === 'wf') scanWiFi();
            else if (lower === 'arp') showARP();
            else if (lower === 'stats') showStats();
            else if (/^[0-9a-f:\-.]{6,17}$/i.test(trimmed)) displayResult(lookupMAC(trimmed));
            else {
                const results = searchManufacturer(trimmed);
                if (results.length === 0) console.log(`${c.yellow}No matches for "${trimmed}"${c.reset}`);
                else {
                    console.log(`${c.green}Found ${results.length} matches${results.length > 20 ? ' (showing 20)' : ''}:${c.reset}\n`);
                    results.slice(0, 20).forEach(r =>
                        console.log(`  ${c.cyan}${r.oui}${c.reset}  ${r.manufacturer}${r.device_type ? ` ${c.dim}(${r.device_type})${c.reset}` : ''}`));
                }
            }
            console.log('');
            prompt();
        });
    };
    prompt();
}

function printUsage() {
    const platName = PLATFORM === 'win32' ? 'Windows' : PLATFORM === 'darwin' ? 'macOS' : 'Linux';
    console.log(`${c.bright}${c.cyan}OUI Master Database - CLI Lookup Tool${c.reset}`);
    console.log(`${c.dim}${'='.repeat(37)}${c.reset}`);
    console.log(`${c.dim}Platform: ${platName}${c.reset}`);
    console.log(`
${c.bright}Usage:${c.reset}
  node oui-lookup.js <mac-address>          Look up a MAC address
  node oui-lookup.js --search <term>        Search by manufacturer
  node oui-lookup.js --wifi                 Scan nearby WiFi networks
  node oui-lookup.js --bluetooth            Scan Bluetooth devices
  node oui-lookup.js --arp                  Show ARP table with vendors
  node oui-lookup.js --file <path>          Look up MACs from file
  node oui-lookup.js --stats                Database statistics
  node oui-lookup.js --interactive          Interactive mode
  node oui-lookup.js --help                 Show this help

${c.bright}Examples:${c.reset}
  node oui-lookup.js 00:00:0C:12:34:56
  node oui-lookup.js 00-00-0C-12-34-56
  node oui-lookup.js 00000C123456
  node oui-lookup.js --search cisco
  node oui-lookup.js --wifi
  node oui-lookup.js --bluetooth
`);
}

function main() {
    const args = process.argv.slice(2);
    if (args.length === 0) { printUsage(); return; }

    const arg = args[0].toLowerCase();

    if (arg === '--help' || arg === '-h') printUsage();
    else if (arg === '--interactive' || arg === '-i') interactiveMode();
    else if (['--bluetooth', '--bt', '-b'].includes(arg)) { loadDatabase(); scanBluetooth(); }
    else if (arg === '--wifi' || arg === '-w') { loadDatabase(); scanWiFi(); }
    else if (arg === '--arp' || arg === '-a') { loadDatabase(); showARP(); }
    else if (arg === '--stats' || arg === '-s') showStats();
    else if (arg === '--search' && args[1]) {
        const results = searchManufacturer(args[1]);
        if (results.length === 0) console.log(`${c.yellow}No matches for "${args[1]}"${c.reset}`);
        else {
            console.log(`${c.green}Found ${results.length} matches:${c.reset}\n`);
            results.forEach(r => console.log(`  ${c.cyan}${r.oui}${c.reset}  ${r.manufacturer}${r.device_type ? ` ${c.dim}(${r.device_type})${c.reset}` : ''}`));
        }
    }
    else if (arg === '--file' && args[1]) lookupFromFile(args[1]);
    else if (arg.startsWith('-')) { console.log(`${c.red}Unknown option: ${arg}${c.reset}`); printUsage(); }
    else displayResult(lookupMAC(args[0]));
}

main();
