#include <WiFi.h>
#include <WebServer.h>
#include <LittleFS.h>
#include <DHT.h>

const char* ssid = "YOUR_WIFI_NAME";
const char* password = "YOUR_WIFI_PASSWORD";

#define DHTPIN 4        // Change this to your GPIO pin
#define DHTTYPE DHT11   // DHT11 sensor

DHT dht(DHTPIN, DHTTYPE);
WebServer server(80);

float temperature = 0.0;
float humidity = 0.0;
unsigned long lastUpdate = 0;
const unsigned long updateInterval = 3000; // 3 seconds

//Status Logic
String getStatus(float t, float h) {
  if (t >= 24.0 && t <= 32.0 && h >= 45.0 && h <= 75.0) {
    return "NORMAL";
  }
  return "ALERT";
}

//Read DHT11 data
void updateSensorData() {
  if (millis() - lastUpdate >= updateInterval) {
    lastUpdate = millis();

    float t = dht.readTemperature();
    float h = dht.readHumidity();

    if (!isnan(t) && !isnan(h)) {
      temperature = t;
      humidity = h;

      Serial.print("Temp: ");
      Serial.print(temperature);
      Serial.print(" °C | Humidity: ");
      Serial.print(humidity);
      Serial.println(" %");
    } else {
      Serial.println("Failed to read from DHT sensor!");
    }
  }
}

//Data API handling
void handleData() {
  updateSensorData();

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

//Littlefs Files
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
  server.send(404, "text/plain", "404: Not Found");
}


void setup() {
  Serial.begin(115200);
  delay(1000);

  dht.begin();

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

  Serial.println("\nWi-Fi connected");
  Serial.print("ESP32 IP: ");
  Serial.println(WiFi.localIP());

  // Routes
  server.on("/", handleRoot);
  server.on("/index.html", handleRoot);
  server.on("/style.css", handleCSS);
  server.on("/script.js", handleJS);
  server.on("/data", HTTP_GET, handleData);
  server.onNotFound(handleNotFound);

  server.begin();
  Serial.println("Web server started");
}

void loop() {
  server.handleClient();
  updateSensorData();
}