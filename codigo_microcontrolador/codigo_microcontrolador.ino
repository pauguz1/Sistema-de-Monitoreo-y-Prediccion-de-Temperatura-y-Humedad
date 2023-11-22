#include <ArduinoWebsockets.h>

const char* ssid = "TuSSID";
const char* password = "TuContraseña";

WebsocketsClient client;

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }

  Serial.println("Connected to WiFi");

  client.connect("wss://ejemplo.com"); // Reemplaza esto con tu URL WebSocket
}

void loop() {
  client.loop();
  if (client.available()) {
    WebsocketsMessage message = client.readMessage();
    if (message.opcode == WebsocketsMessage::TEXT) {
      Serial.print("Mensaje recibido: ");
      Serial.println(message.payload());
    }
  }

  // Aquí puedes agregar código para enviar datos al WebSocket si es necesario
}
