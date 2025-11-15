# TempX – Cold Chain Monitoring System

TempX is a full-stack IoT cold-chain monitoring application that tracks temperature readings from ESP32-based sensors and visualizes them on a web dashboard. It highlights threshold breaches, supports acknowledgment workflows, and provides summary metrics for temperature-sensitive storage environments.

## Overview

Cold-chain environments such as vaccine storage require continuous monitoring. TempX collects sensor data, stores it in a PostgreSQL database via Supabase, and displays the logs in a structured dashboard built with Next.js and TypeScript. The system identifies temperature breaches and allows staff to acknowledge and resolve alerts.

## Tech Stack

**Hardware**
- ESP32 microcontroller  
- DHT11 temperature sensor  

**Backend / Database**
- Supabase PostgreSQL  
- Supabase REST API  

**Frontend**
- Next.js (App Router)
- React  
- TypeScript  
- TailwindCSS  

## Features

- Real-time temperature logging from IoT devices  
- Breach detection based on configurable thresholds  
- Acknowledgment of breach events  
- Summary of total logs, breaches, and pending acknowledgments  
- Device-wise log grouping  
- Server-side data fetching with React Server Components  
- Indexed database queries for efficient retrieval  

## System Architecture

1. ESP32 reads temperature using DHT11.  
2. Device sends readings to Supabase via REST API.  
3. Supabase stores data in PostgreSQL with timestamps and breach flags.  
4. Next.js dashboard fetches logs and renders them server-side.  
5. Users can acknowledge breaches, updating the database.

## Folder Structure
```bash
app/
page.tsx
components/
TemperatureDashboard.tsx
TemperatureTable.tsx
AcknowledgeButton.tsx
lib/
data.ts
```

## Setup

### 1. Clone the repository
```bash
git clone <repo-url>
cd <project-folder>
```

### 2. Install dependencies:
```bash
npm install
```

### 3. Create `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=<your-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-key>
```

### 4. Run Development Server
```bash
npm run dev
```

### 5. Flash ESP32 code using Arduino IDE or PlatformIO to send sensor readings to the API endpoint.


## Future Improvements

- Realtime updates with Supabase Realtime  
- Graphs for historical temperature trends  
- Alerts via email or SMS  
- Pagination and filtering  
- Multi-user authentication  

## Author

Sanjana S  
GitHub: https://github.com/Sanjana272621  
Email: sanjana.sureshkumar05@gmail.com
