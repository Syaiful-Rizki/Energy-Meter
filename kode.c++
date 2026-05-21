#include <WiFi.h>
#include <WiFiManager.h>
#include <Firebase_ESP_Client.h>
#include <PZEM004Tv30.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include "time.h"

// =====================================================
// FIREBASE CONFIG
// =====================================================
#define API_KEY "[REMOVED-FIREBASE-APIKEY]"
#define DATABASE_URL "https://iot-energy-meter-45051-default-rtdb.asia-southeast1.firebasedatabase.app"

// =====================================================
// FIREBASE OBJECT
// =====================================================
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// =====================================================
// LCD I2C
// SDA -> GPIO21
// SCL -> GPIO22
// =====================================================
LiquidCrystal_I2C lcd(0x27, 16, 2);

// =====================================================
// PZEM
// RX -> GPIO16
// TX -> GPIO17
// =====================================================
PZEM004Tv30 pzem(Serial2, 16, 17);

// =====================================================
// TIMER
// =====================================================
unsigned long lastSend = 0;
const int interval = 2000;

unsigned long lastLog = 0;
// Log setiap 15 menit (900000 ms) agar grafik cepat terisi
const unsigned long logInterval = 900000; 

const char* ntpServer = "pool.ntp.org";
const long  gmtOffset_sec = 25200; // GMT+7 WIB
const int   daylightOffset_sec = 0;

// =====================================================
// LCD PAGE
// =====================================================
bool lcdPage = false;

// =====================================================
// WIFI MANAGER
// =====================================================
WiFiManager wm;

// =====================================================
// WIFI LOST TIMER
// =====================================================
unsigned long wifiLostTime = 0;
bool wifiDisconnected = false;

// =====================================================
// SETUP
// =====================================================
void setup() {

  Serial.begin(115200);

  Serial.println();
  Serial.println("==================================");
  Serial.println("ESP32 ENERGY METER STARTING");
  Serial.println("==================================");

  // =====================================================
  // LCD
  // =====================================================
  Wire.begin(21, 22);

  lcd.init();
  lcd.backlight();

  lcd.setCursor(0, 0);
  lcd.print("Energy Meter");

  lcd.setCursor(0, 1);
  lcd.print("Starting...");

  Serial.println("[LCD] LCD Ready");

  delay(2000);

  // =====================================================
  // PZEM
  // =====================================================
  Serial2.begin(9600, SERIAL_8N1, 16, 17);

  Serial.println("[PZEM] Ready");

  // =====================================================
  // WIFI CONNECT
  // =====================================================
  Serial.println("[WIFI] Connecting...");

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Connect WiFi");

  // Auto hotspot jika WiFi berubah / tidak ada
  bool res = wm.autoConnect("ESP32-EnergyMeter");

  if (!res) {

    Serial.println("[WIFI] Failed");

    lcd.clear();

    lcd.setCursor(0, 0);
    lcd.print("WiFi Failed");

    delay(3000);

    ESP.restart();
  }

  // =====================================================
  // WIFI CONNECTED
  // =====================================================
  Serial.println("[WIFI] Connected");

  Serial.print("[WIFI] SSID : ");
  Serial.println(WiFi.SSID());

  Serial.print("[WIFI] IP : ");
  Serial.println(WiFi.localIP());

  lcd.clear();

  lcd.setCursor(0, 0);
  lcd.print("WiFi Connected");

  delay(2000);

  // =====================================================
  // NTP TIME
  // =====================================================
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);

  // =====================================================
  // FIREBASE CONNECT
  // =====================================================
  Serial.println("[FIREBASE] Connecting...");

  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;

  if (Firebase.signUp(&config, &auth, "", "")) {

    Serial.println("[FIREBASE] Connected");

    lcd.clear();

    lcd.setCursor(0, 0);
    lcd.print("Firebase OK");

  } else {

    Serial.println("[FIREBASE] FAILED");

    Serial.print("[ERROR] ");
    Serial.println(config.signer.signupError.message.c_str());

    lcd.clear();

    lcd.setCursor(0, 0);
    lcd.print("Firebase Error");
  }

  Firebase.begin(&config, &auth);

  Firebase.reconnectWiFi(true);

  delay(2000);

  lcd.clear();

  Serial.println("[SYSTEM] READY");
}

// =====================================================
// LOOP
// =====================================================
void loop() {

  // =====================================================
  // AUTO WIFI CHECK
  // =====================================================
  if (WiFi.status() != WL_CONNECTED) {

    // Pertama kali disconnect
    if (!wifiDisconnected) {

      wifiDisconnected = true;
      wifiLostTime = millis();

      Serial.println("[WIFI] Connection Lost");

      lcd.clear();

      lcd.setCursor(0, 0);
      lcd.print("WiFi Lost");
    }

    // Coba reconnect
    WiFi.reconnect();

    Serial.println("[WIFI] Reconnecting...");

    delay(1000);

    // Jika gagal >15 detik
    if (millis() - wifiLostTime > 15000) {

      Serial.println("[WIFI] Reset WiFi");

      lcd.clear();

      lcd.setCursor(0, 0);
      lcd.print("Reset WiFi");

      delay(2000);

      // Hapus WiFi lama
      wm.resetSettings();

      // Restart
      ESP.restart();
    }

    return;
  }

  // =====================================================
  // WIFI CONNECTED AGAIN
  // =====================================================
  wifiDisconnected = false;

  // =====================================================
  // SEND DATA EVERY 2 SECOND
  // =====================================================
  if (millis() - lastSend > interval) {

    lastSend = millis();

    Serial.println();
    Serial.println("========== ENERGY DATA ==========");

    // =====================================================
    // READ PZEM
    // =====================================================
    float voltage = pzem.voltage();
    float current = pzem.current();
    float power   = pzem.power();
    float energy  = pzem.energy();

    // =====================================================
    // ROUNDING DATA
    // =====================================================
    voltage = round(voltage * 10) / 10.0;
    current = round(current * 100) / 100.0;
    power   = round(power);
    energy  = round(energy * 100) / 100.0;

    // =====================================================
    // SENSOR ERROR
    // =====================================================
    if (isnan(voltage) ||
        isnan(current) ||
        isnan(power) ||
        isnan(energy)) {

      Serial.println("[PZEM] SENSOR ERROR");

      lcd.clear();

      lcd.setCursor(0, 0);
      lcd.print("Sensor Error");

      delay(2000);

      return;
    }

    // =====================================================
    // SERIAL MONITOR
    // =====================================================
    Serial.print("Voltage : ");
    Serial.print(voltage);
    Serial.println(" V");

    Serial.print("Current : ");
    Serial.print(current);
    Serial.println(" A");

    Serial.print("Power   : ");
    Serial.print(power);
    Serial.println(" W");

    Serial.print("Energy  : ");
    Serial.print(energy);
    Serial.println(" kWh");

    // =====================================================
    // SEND TO FIREBASE
    // =====================================================
    if (Firebase.ready()) {

      bool v1 = Firebase.RTDB.setFloat(
        &fbdo,
        "/energy_meter/voltage",
        voltage
      );

      bool v2 = Firebase.RTDB.setFloat(
        &fbdo,
        "/energy_meter/current",
        current
      );

      bool v3 = Firebase.RTDB.setFloat(
        &fbdo,
        "/energy_meter/power",
        power
      );

      bool v4 = Firebase.RTDB.setFloat(
        &fbdo,
        "/energy_meter/energy",
        energy
      );

      bool v5 = Firebase.RTDB.setString(
        &fbdo,
        "/energy_meter/status",
        "online"
      );

      if (v1 && v2 && v3 && v4 && v5) {

        Serial.println("[FIREBASE] Data Sent");

        // =====================================================
        // FIREBASE HISTORICAL LOGGING
        // =====================================================
        if (millis() - lastLog > logInterval || lastLog == 0) {
          lastLog = millis();
          
          struct tm timeinfo;
          String timestampStr = "";
          if(getLocalTime(&timeinfo)){
            char timeStringBuff[50];
            strftime(timeStringBuff, sizeof(timeStringBuff), "%Y-%m-%dT%H:%M:%S+07:00", &timeinfo);
            timestampStr = String(timeStringBuff);
          } else {
            // Fallback if NTP is not synced yet
            timestampStr = String(millis());
          }

          FirebaseJson json;
          json.set("voltage", voltage);
          json.set("current", current);
          json.set("power", power);
          json.set("energy", energy);
          json.set("timestamp", timestampStr);

          if (Firebase.RTDB.pushJSON(&fbdo, "/energy_history", &json)) {
              Serial.println("[FIREBASE] History Saved!");
          } else {
              Serial.println("[FIREBASE] History Failed");
          }
        }

      } else {

        Serial.println("[FIREBASE] Send Failed");

        Serial.print("[ERROR] ");
        Serial.println(fbdo.errorReason());
      }

    } else {

      Serial.println("[FIREBASE] Not Ready");
    }

    // =====================================================
    // LCD DISPLAY
    // =====================================================
    lcd.clear();

    // ================= PAGE 1 =================
    if (lcdPage == false) {

      // BARIS 1
      lcd.setCursor(0, 0);

      lcd.print("V:");
      lcd.print(voltage, 1);
      lcd.print("V");

      // BARIS 2
      lcd.setCursor(0, 1);

      lcd.print("I:");
      lcd.print(current, 2);
      lcd.print("A");

      lcdPage = true;
    }

    // ================= PAGE 2 =================
    else {

      // BARIS 1
      lcd.setCursor(0, 0);

      lcd.print("P:");
      lcd.print(power, 0);
      lcd.print("W");

      // BARIS 2
      lcd.setCursor(0, 1);

      lcd.print("E:");
      lcd.print(energy, 2);
      lcd.print("kWh");

      lcdPage = false;
    }
  }
}