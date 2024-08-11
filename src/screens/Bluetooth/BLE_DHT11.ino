#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>
#include <DHT.h>

#define DHTPIN 4
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

BLECharacteristic *temperatureCharacteristic;
BLECharacteristic *humidityCharacteristic;

bool deviceConnected = false;
unsigned long lastUpdateTime = 0;

// UUIDs for the BLE Service and Characteristics
#define SERVICE_UUID        "12345678-1234-1234-1234-1234567890ab"
#define TEMPERATURE_UUID    "87654321-4321-4321-4321-210987654321"
#define HUMIDITY_UUID       "11223344-5566-7788-99aa-bbccddeeff00"

class MyServerCallbacks: public BLEServerCallbacks {
  void onConnect(BLEServer* pServer) {
    deviceConnected = true;
  };

  void onDisconnect(BLEServer* pServer) {
    deviceConnected = false;
  }
};

void setup() {
  Serial.begin(115200);
  dht.begin();

  BLEDevice::init("ESP32_DHT11");
  BLEServer *pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());

  BLEService *pService = pServer->createService(SERVICE_UUID);

  temperatureCharacteristic = pService->createCharacteristic(
                                         TEMPERATURE_UUID,
                                         BLECharacteristic::PROPERTY_READ |
                                         BLECharacteristic::PROPERTY_NOTIFY
                                       );
  temperatureCharacteristic->addDescriptor(new BLE2902());

  humidityCharacteristic = pService->createCharacteristic(
                                         HUMIDITY_UUID,
                                         BLECharacteristic::PROPERTY_READ |
                                         BLECharacteristic::PROPERTY_NOTIFY
                                       );
  humidityCharacteristic->addDescriptor(new BLE2902());

  pService->start();

  pServer->getAdvertising()->start();
}

void loop() {
  if (deviceConnected) {
    if (millis() - lastUpdateTime > 2000) {
      lastUpdateTime = millis();
      float temperature = dht.readTemperature();
      float humidity = dht.readHumidity();

      if (!isnan(temperature) && !isnan(humidity)) {
        char tempStr[8];
        char humStr[8];
        dtostrf(temperature, 1, 2, tempStr);
        dtostrf(humidity, 1, 2, humStr);

        temperatureCharacteristic->setValue(tempStr);
        temperatureCharacteristic->notify();

        humidityCharacteristic->setValue(humStr);
        humidityCharacteristic->notify();

        Serial.print("Temperature: ");
        Serial.print(tempStr);
        Serial.print(" *C, Humidity: ");
        Serial.print(humStr);
        Serial.println(" %");
      } else {
        Serial.println("Failed to read from DHT sensor!");
      }
    }
  }
  delay(100);
}
