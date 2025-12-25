# OUI Lookup CLI Tool

Cross-platform command-line tool for MAC address manufacturer lookup with network scanning.

**Runs on:** Windows, Linux, macOS

## Quick Start

```bash
# Windows - double-click oui-lookup.bat or:
node oui-lookup.js --interactive

# Linux/macOS:
node oui-lookup.js --interactive
```

## Command Line Usage

```bash
# Look up a MAC address
node oui-lookup.js 00:00:0C:12:34:56
node oui-lookup.js 00-00-0C-12-34-56
node oui-lookup.js 00000C123456

# Search by manufacturer
node oui-lookup.js --search cisco
node oui-lookup.js --search "apple"

# Network scanning
node oui-lookup.js --wifi        # Scan WiFi networks
node oui-lookup.js --bluetooth   # Scan Bluetooth devices
node oui-lookup.js --arp         # Show ARP table

# Other options
node oui-lookup.js --file log.txt    # Look up MACs from file
node oui-lookup.js --stats           # Database statistics
node oui-lookup.js --interactive     # Interactive mode
node oui-lookup.js --help            # Show help
```

## Features

- **MAC Lookup**: Look up any MAC address to find manufacturer, device type, country
- **WiFi Scan**: Scan nearby WiFi networks and identify access point vendors
- **Bluetooth Scan**: Scan Bluetooth devices with manufacturer info
- **ARP Table**: View all devices on local network with vendor identification
- **Manufacturer Search**: Find all OUIs belonging to a manufacturer
- **File Processing**: Extract and look up all MAC addresses from any text file
- **Interactive Mode**: Continuous lookup session with all features

## Requirements

- Node.js 14+
- That's it. Runs on anything.

## Platform-Specific Notes

| Feature | Windows | Linux | macOS |
|---------|---------|-------|-------|
| WiFi Scan | `netsh wlan` | `nmcli` / `iwlist` | `airport` |
| Bluetooth | `Get-PnpDevice` | `bluetoothctl` / `hcitool` | `system_profiler` |
| ARP Table | `arp -a` | `arp -a` | `arp -a` |

## Output Example

```
------------------------------------------------------------
MAC Address:    00:00:0C:12:34:56
OUI:            00:00:0C
Manufacturer:   Cisco Systems, Inc
Short Name:     Cisco
Device Type:    Router
Country:        US
Address:        170 WEST TASMAN DRIVE SAN JOSE CA US 95134
Registry:       MA-L
Registered:     1998-04-22
Sources:        IEEE, Wireshark, Nmap
```

## Database

Uses the master OUI database from the parent `LISTS/` folder:
- 86,098+ unique OUIs
- Device type classification
- Country codes
- Registration dates
- Multiple verified sources
