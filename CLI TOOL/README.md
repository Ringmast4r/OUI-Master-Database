# OUI Lookup CLI Tool

Cross-platform MAC address manufacturer lookup with WiFi, Bluetooth, and network scanning.

---

# 📥 Installation

## 🪟 Windows

**Step 1:** Download & install Node.js from **https://nodejs.org/** (click LTS, run installer, restart PC)

**Step 2:** Download this tool from **https://github.com/Ringmast4r/OUI-Master-Database**
- Click green **Code** button → **Download ZIP** → Extract it

**Step 3:** Open the `CLI TOOL` folder and double-click **`oui-lookup.bat`**

---

## 🐧 Linux

**Step 1:** Open Terminal (`Ctrl + Alt + T`)

**Step 2:** Install Node.js:
```bash
sudo apt update && sudo apt install -y nodejs npm git
```

**Step 3:** Download & run:
```bash
cd ~/Desktop && git clone https://github.com/Ringmast4r/OUI-Master-Database.git
cd OUI-Master-Database/CLI\ TOOL && node oui-lookup.js --interactive
```

**Optional** - For WiFi/Bluetooth scanning:
```bash
sudo apt install -y network-manager bluez
```

---

## 🍎 macOS

**Step 1:** Open Terminal (`Cmd + Space`, type `Terminal`, press Enter)

**Step 2:** Install Homebrew (if you don't have it):
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```
Follow the prompts. Run any extra commands it tells you to at the end.

**Step 3:** Install Node.js:
```bash
brew install node git
```

**Step 4:** Download & run:
```bash
cd ~/Desktop && git clone https://github.com/Ringmast4r/OUI-Master-Database.git
cd OUI-Master-Database/CLI\ TOOL && node oui-lookup.js --interactive
```

---

# 💻 Commands

| Command | What It Does |
|---------|--------------|
| `wifi` | Scan nearby WiFi networks |
| `bluetooth` | Scan Bluetooth devices |
| `arp` | Show devices on your network |
| `stats` | Database statistics |
| `quit` | Exit |

Or type any **MAC address** or **company name** (try: `cisco`, `apple`, `samsung`)

---

# 📋 Example Output

```
------------------------------------------------------------
MAC Address:    00:00:0C:12:34:56
OUI:            00:00:0C
Manufacturer:   Cisco Systems, Inc
Device Type:    Router
Country:        US
Registry:       MA-L
Registered:     1998-04-22
```

---

# ❓ Troubleshooting

| Problem | Fix |
|---------|-----|
| `node not recognized` | Restart your computer after installing Node.js |
| `command not found` | Close and reopen Terminal |
| WiFi shows nothing | Make sure WiFi is on. Linux may need `network-manager` |
| Permission denied | Add `sudo` before the command |

---

**86,098+ manufacturers** from IEEE, Wireshark, Nmap | [Report issues](https://github.com/Ringmast4r/OUI-Master-Database/issues)
