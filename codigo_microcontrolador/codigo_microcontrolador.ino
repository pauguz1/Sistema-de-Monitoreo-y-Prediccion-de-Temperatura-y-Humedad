/*
  Codigo para comunicarse con el socket de microservicio1
  de la app de monitoreo de temperatura y humedad
  version: 1.0
  Author: Paul Santana
*/

#include <ArduinoWebsockets.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
#include <EEPROM.h>

#include "Delay.h"

StaticJsonDocument<200> doc;

//instanciamos el objeto Delay para el tiempo de envio de las lecturas
Delay d1;// delay de envio de lecturas

float temperatura;
float humedad;
int pin = 5;
String nombreRed;
String passwordRed;

#include "Servidor.h"
Servidor S;

String obtenerJson(String jsonInfo,String clave){
  deserializeJson(doc, jsonInfo);
  return  doc.as<JsonObject>()[clave];
}

const uint16_t websockets_server_port = 8080; // Enter server port

using namespace websockets;

//creamos los objetos para los consumir los web sockets
WebsocketsClient cliente_lectura;

void setup() {
    EEPROM.begin(512);
    Serial.begin(9600);
    pinMode(pin,OUTPUT);

    //almacenamos los datos en la EEPROM 
    S.setHostSocket("10.2.83.89");
    S.setHostServer("http://10.2.83.89:8001");
    S.setNombreRed("UAZ-Alumnos");
    S.setPasswordRed("");

    //obtenemos los nonbres de la red de la EEPROM
    nombreRed = S.getNombreRed();
    passwordRed = S.getPasswordRed();
    
    //datos de conexion del microcontrolador a socket y servidor
    S.setDireccionIp("168.165.0.1");
    S.setDireccionMac("1234567890123456");
    
    S.actualizarHost();// actualiza los nombres de los hosts (socket y server) en las variables
    
    
    // Conectando al wifi
    WiFi.begin(nombreRed, passwordRed);

    while (WiFi.status() != WL_CONNECTED) {
      delay(60);
      Serial.print(".");
    }
    Serial.println("Conectado al  WiFi");
    
    // tratando de conectar al web socket
    bool connected1 = cliente_lectura.connect(S.getHostSocket(), websockets_server_port, "/");
    //obtenemos el token de sesion para mandar lecturas
    S.obtenerTokenSesion();
    
    if(connected1) {//revisando que si nos conectamos al web socket para suscribirnos a la cola de mensajes de estado_lampara
      Serial.println("web socket SI Conectado a lectura!");
      //nos conectamos a la cola de mensajes de lectura para mandar lecturas
      cliente_lectura.send("{ \"type\": \"subscribe\", \"channel\": \"lectura\" }");
    }else{
      Serial.println("no conectado al socket");
    }
    
}

void loop() {
    temperatura = random(15,20);
    humedad = random(2,14);
    // comprobamos los mensajes entrantes y enviamos el estado de la temperatura y humedad en tiempo real
    if(cliente_lectura.available()) {
        cliente_lectura.poll();
        //el estado_lampara es el unico que tiene content
        //cliente_estado_lampara.send("{ \"type\": \"message\", \"content\": \""+String(digitalRead(pin))+"\" }");
        cliente_lectura.send("{ \"type\": \"message\", \"content\": \""+String(temperatura)+","+String(humedad)+" \" }");
    }
    
    //--------------Para el envio de datos de lectura cada 5 Min al Servidor
    if (d1.getDelay() == false) { //si el delay es false entonces lo reiniciamos y realizamos la tarea correspondiente al delay
      d1.setDelay(300000);
      //d1.setDelay(3000);//3 segundos
      Serial.println("-------------------Enviando Lectura cada 5 Min");
      S.enviarLecturaPost(temperatura,humedad,S.obtenerIdMicro(),"/api/addLectura");//enviamos la lectura del microcontrolador
    }
    
    delay(200);
}
