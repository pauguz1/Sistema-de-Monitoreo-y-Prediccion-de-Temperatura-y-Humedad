/*
  Codigo para comunicarse con el socket de microservicio1
  de la app de monitoreo de temperatura y humedad
  version: 1.0
  Author: Paul Santana
*/

#include <ArduinoWebsockets.h>
#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
StaticJsonDocument<200> doc;

float temperatura;
float humedad;
int pin = 5;

String obtenerJson(String jsonInfo,String clave){
  deserializeJson(doc, jsonInfo);
  return  doc.as<JsonObject>()[clave];
}

const char* ssid = "Casita-2"; //Enter SSID
const char* password = "guzman321"; //Enter Password
const char* websockets_server_host = "192.168.1.14"; //Enter server adress
const uint16_t websockets_server_port = 8080; // Enter server port

using namespace websockets;

//creamos los objetos para los consumir los web sockets
WebsocketsClient cliente_lectura;

void setup() {
    Serial.begin(9600);
    StaticJsonDocument<200> json;
    pinMode(pin,OUTPUT);
    
    // Conectando al wifi
    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED) {
      delay(60);
      Serial.print(".");
    }

    Serial.println("Conectado al  WiFi");
    // tratando de conectar al web socket
    bool connected1 = cliente_lectura.connect(websockets_server_host, websockets_server_port, "/");
    
    if(connected1) {//revisando que si nos conectamos al web socket para suscribirnos a la cola de mensajes de estado_lampara
      Serial.println("web socket SI Conectado a lectura!");
      //nos conectamos a la cola de mensajes de lectura para mandar lecturas
      cliente_lectura.send("{ \"type\": \"subscribe\", \"channel\": \"lectura\" }");
    } 
    
}

void loop() {
    temperatura = random(15,20);
    humedad = random(2,14);
    // let the websockets client check for incoming messages
    if(cliente_lectura.available()) {
        cliente_lectura.poll();
        //el estado_lampara es el unico que tiene content
        //cliente_estado_lampara.send("{ \"type\": \"message\", \"content\": \""+String(digitalRead(pin))+"\" }");
        cliente_lectura.send("{ \"type\": \"message\", \"content\": \""+String(temperatura)+","+String(humedad)+" \" }");
    }
    
    delay(200);
}
