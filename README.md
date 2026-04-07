# TempX – ESP32 Cold Chain Monitoring Dashboard

TempX is an ESP32-based IoT monitoring prototype that tracks temperature and humidity using a DHT11 sensor and displays the data on a live web dashboard served directly from the device.

The system demonstrates a full-stack embedded architecture where the ESP32 acts as both a backend server and frontend host using LittleFS.

---

## Overview

Cold-chain environments such as vaccine storage require continuous monitoring. TempX provides a lightweight prototype that reads environmental data from a sensor and visualizes it in real time via a browser interface.

The project focuses on:
- Embedded web servers on ESP32  
- Serving static frontend files using LittleFS  
- Real-time sensor data updates via REST-style endpoints  

---

## Tech Stack

**Hardware**
- ESP32 microcontroller  
- DHT11 temperature and humidity sensor  

**Firmware**
- Arduino (C++)  
- WiFi library  
- WebServer library  
- LittleFS (filesystem for hosting frontend)  
- DHT sensor library  

**Frontend**
- HTML  
- CSS  
- JavaScript (Fetch API)  

---

## Features

- ESP32 hosts a web dashboard (no external server required)  
- Frontend files stored separately in LittleFS  
- `/data` API endpoint returning JSON sensor readings  
- Real-time temperature and humidity monitoring  
- Auto-refreshing dashboard every 3 seconds  
- Status classification (NORMAL / ALERT)  
- Device uptime tracking  

---

## System Architecture

1. ESP32 reads temperature and humidity from DHT11  
2. LittleFS serves static frontend files (`index.html`, `style.css`, `script.js`)  
3. ESP32 exposes a `/data` API endpoint  
4. Frontend fetches data every 3 seconds  
5. Dashboard updates dynamically in the browser  

---

## Folder Structure

```bash
TempX/
    TempX.ino
    data/
        index.html
        style.css
        script.js
```

## Setup

### 1. Open project in Arduino IDE

Ensure the folder name and `.ino` file name match.

---

### 2. Install required libraries

- ESP32 board package (Espressif)  
- DHT sensor library (Adafruit)  
- Adafruit Unified Sensor  

---

### 3. Add Wi-Fi credentials

Inside `TempX.ino`:

```cpp
const char* ssid = "YOUR_WIFI_NAME";
const char* password = "YOUR_WIFI_PASSWORD";
``` 

### 4. Upload frontend files (LittleFS)

Place all web files (HTML, CSS, JS) inside the `data/` folder within your project directory.


### 5. Upload firmware
Click the Upload button in the Arduino IDE to flash the code to your microcontroller.


### 6. Run the project

1.  Open the Serial Monitor and set the baud rate to 115200.
2.  Once connected to Wi-Fi, note the **ESP32 IP address** displayed in the logs.
3.  Open your web browser and navigate to:  
    `http://<ESP32_IP_ADDRESS>/`

### API Reference

**Endpoint:** `GET /data`  
**Description:** Fetches current sensor readings and system status.

**Response Body:**
```json
{
  "temperature": 27.4,
  "humidity": 61.0,
  "status": "NORMAL",
  "uptime": 123
}
```

### Hardware Setup
- VCC → 3.3V
- GND → GND
- DATA → GPIO 4

## Future Improvements
- Integration with Supabase for cloud-based logging
- Historical data visualization (graphs)
- Alert notifications (SMS / Email)
- Multi-device monitoring
- Remote dashboard access