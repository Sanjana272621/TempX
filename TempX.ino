#include <WiFi.h>
#include <WebServer.h>
#include <LittleFS.h>

const char* ssid = WIFI_SSID;
const char* password = WIFI_PASS;

WebServer server(80);

// Fake sensor values
float temperature = 27.0;
float humidity = 60.0;
unsigned long lastUpdate = 0;
const unsigned long updateInterval = 3000; // 3 seconds

// Clamp helper
float clampFloat(float value, float minVal, float maxVal) {
  if (value < minVal) return minVal;
  if (value > maxVal) return maxVal;
  return value;
}

// Generate fake sensor readings every 3 seconds
void updateFakeSensorData() {
  if (millis() - lastUpdate >= updateInterval) {
    lastUpdate = millis();

    // Small random drift to look realistic
    float tempChange = random(-8, 9) / 10.0;   // -0.8 to +0.8
    float humChange  = random(-15, 16) / 10.0; // -1.5 to +1.5

    temperature += tempChange;
    humidity += humChange;

    // Keep in requested demo range
    temperature = clampFloat(temperature, 24.0, 32.0);
    humidity = clampFloat(humidity, 45.0, 75.0);
  }
}

String getStatus(float t, float h) {
  // Simple status logic for demo
  if (t >= 24.0 && t <= 32.0 && h >= 45.0 && h <= 75.0) {
    return "NORMAL";
  }
  return "ALERT";
}

void handleData() {
  updateFakeSensorData();

  unsigned long uptimeSeconds = millis() / 1000;
  String status = getStatus(temperature, humidity);

  String json = "{";
  json += "\"temperature\":" + String(temperature, 1) + ",";
  json += "\"humidity\":" + String(humidity, 1) + ",";
  json += "\"status\":\"" + status + "\",";
  json += "\"uptime\":" + String(uptimeSeconds);
  json += "}";

  server.sendHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  server.send(200, "application/json", json);
}

bool serveFile(String path, String contentType) {
  if (LittleFS.exists(path)) {
    File file = LittleFS.open(path, "r");
    server.streamFile(file, contentType);
    file.close();
    return true;
  }
  return false;
}

void handleRoot() {
  if (!serveFile("/index.html", "text/html")) {
    server.send(404, "text/plain", "index.html not found");
  }
}

void handleCSS() {
  if (!serveFile("/style.css", "text/css")) {
    server.send(404, "text/plain", "style.css not found");
  }
}

void handleJS() {
  if (!serveFile("/script.js", "application/javascript")) {
    server.send(404, "text/plain", "script.js not found");
  }
}

void handleNotFound() {
  server.send(404, "text/plain", "404: File Not Found");
}

void setup() {
  Serial.begin(115200);
  delay(1000);

  // Seed random for fake sensor generation
  randomSeed(micros());

  // Mount LittleFS
  if (!LittleFS.begin(true)) {
    Serial.println("LittleFS mount failed");
    return;
  }
  Serial.println("LittleFS mounted successfully");

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to Wi-Fi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println();
  Serial.println("Wi-Fi connected");
  Serial.print("ESP32 IP address: ");
  Serial.println(WiFi.localIP());

  // Web routes
  server.on("/", handleRoot);
  server.on("/index.html", handleRoot);
  server.on("/style.css", handleCSS);
  server.on("/script.js", handleJS);
  server.on("/data", HTTP_GET, handleData);
  server.onNotFound(handleNotFound);

  server.begin();
  Serial.println("Web server started");

  // Initial fake values
  updateFakeSensorData();

  /*
    ---------------------------------------------
    LATER: Replace fake sensor logic with real sensor code
    Example:
      - Read DHT11 / DHT22 / BME280 / SHT31 here
      - Assign actual values to:
            temperature = realTemperature;
            humidity = realHumidity;
    Then remove or disable updateFakeSensorData().
    ---------------------------------------------
  */
}

void loop() {
  server.handleClient();
  updateFakeSensorData();
}