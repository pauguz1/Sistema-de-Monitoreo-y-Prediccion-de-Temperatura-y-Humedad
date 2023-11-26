
WiFiServer server(80); //ponemos el puerto 80
/**
   Esta clase nos ayuda con las peticiones del servidor para poder manejar las peticiones de una manera
   mas sencilla
   Author:Paul Alejandro Santana Guzman
   Version:5.0

   Direcciones de Memoria EEPROM usadas
   0-31 nombre red
   32-63 password red
   64-164 para el nombre del host del socket
   165-265 para el nombre del host server
 * */
class Servidor {
  private:
    WiFiClient client;// cliente
    HTTPClient http;// para las peticiones http
    String hostSocket;
    String hostServer;
    String token;
    String id_micro;
    int id;
    String direccionIp;
    String direccionMac;
  public:
    Servidor();

    //------------------- Conexion a wifi del ESP8266 ------------------------------------
    String getNombreRed();// <--- nombre de la red a la que se va a conectar el ESP8266
    String getPasswordRed();// <--- password de la red a la que se va a conectar el ESP8266
    String getIp();
    bool setNombreRed(String nombre);
    bool setPasswordRed(String pass1);

    String obtenerPeticion(String pet);// obtiene la peticion y regresa solo el Path
    String getFecha1();//obtener fecha de inicio del las lamparas
    String getFecha2();// obtener fecha de termino del las lamparas
    bool setFecha1(String fe1);// cambiar el valor de la fecha 1 en la EPROM
    bool setFecha2(String fe2);// cambiar el valor de la fecha 2 en la EPROM

    String obtenerDatoMemoria(int inicio1, int fin1); //<-- obtener lo que esta escrito en la EPROM en en un rango dado
    bool setDatoMemoria(int inicio1, int fin1, String informacion); // almacena un dato en el rango de direccion de memoria proporcionado

    String peticionGet(String informacion);
    void setHostSocket(String informacion);
    void setHostServer(String informacion);
    void setId(int informacion);
    void setToken(String t);
    void actualizarHost();
    String getToken();
    int getId();
    String getHostSocket();// obtener la variable
    String getHostServer();// obtener la variable
    String obtenerVariables();
    bool enviarLecturaPost(float temp1,float hum1,String id_micro1,String direccion);
    bool obtenerTokenSesion();


    String obtenerIdMicro();//------- Para manejar el id del micro
    void setIdMicro(String informacion);
    
    String obtenerDireccionIp();//------- Para manejar la direccion ip
    void setDireccionIp(String informacion);
    
    String obtenerDireccionMac();//------- Para manejar el id del micro
    void setDireccionMac(String informacion);
    
    void split(String informacion,String *arreglo, int numVariables);
};

/**
 * Este metodo separa una cadena separada por , y las pone en un arreglo que es pasado como parametro
 * @Param String informacion     cadena que contiene el texto separado por , 1,2,3
 * @Param String arreglo      es el arreglo en el que se almacenaran las variables
 * @param int numVariables    es el numero de variables que contiene la cadena separa por , 1,2 <- tiene 2 datos
 */
void Servidor::split(String informacion,String arreglo1[], int numVariables) {
  int contF = 0;
  for (int a = 0; a < informacion.length(); a++) {
    if (informacion.charAt(a) != ',') {
      arreglo1[contF] += informacion.charAt(a);
    } else {
      contF++;
    }
  }
}

/**
 * Este metodo obtiene el valor del id de micro
 */
 String Servidor::obtenerIdMicro(){
  return id_micro;
 }

 /**
 * Este cambia el valor del id del micro
 */
 void Servidor::setIdMicro(String informacion){
  id_micro = informacion;
 }

/**
 * Este metodo obtiene el valor de la direccion ip
 */
 String Servidor::obtenerDireccionIp(){
  return direccionIp;
 }

 /**
 * Este cambia el valor de la direccion ip
 */
 void Servidor::setDireccionIp(String informacion){
  direccionIp = informacion;
 }

 /**
 * Este metodo obtiene el valor de la direccion mac
 */
 String Servidor::obtenerDireccionMac(){
  return direccionMac;
 }

 /**
 * Este cambia el valor de la direccion mac
 */
 void Servidor::setDireccionMac(String informacion){
  direccionMac = informacion;
 }
 

 /* Este metodo envia datos de lectura al servidor
 @Param direccion es el path del servidor
 @Param temperatura1 es la temperatura
 @Param humedadAmbiental1 es la humedad ambiental 
 @Param humedadFisica es la humedad fisica
 @Param ventilacion1 es el estado de la ventilacion true o false encendida o apagada
 @Param extractor1 es el estado del extractor true o false encendido o apagado
 @Param riego1 es el estado de la bomba de riego
 @Param lampara1 es el estado de la lampara true o false encendida o apagada
 */
 bool Servidor::enviarLecturaPost(float temp1,float hum1,String id_micro1,String direccion){
  http.begin(client, getHostServer()+direccion); //host + path
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", getToken() );

  String json;
  json +="{";
  json += "\"temperatura\":\""+String(temp1)+"\",";
  json += "\"humedad\":\""+String(hum1)+"\",";
  json += "\"id_microcontrolador\":\""+id_micro1+"\"";// ultima variable del json
  json +="}";//fin del JSON
  int httpCode = http.POST(json);

  // si el http code es -1 enconces es un error
  if (httpCode > 0) {
      // imprimimos el status de la respuesta http code
      Serial.printf("[HTTP] POST... code: %d\n", httpCode);

      // file found at server httpCode == HTTP_CODE_OK
      if (httpCode >=200 && httpCode <= 299 ){
        String payload = http.getString();
        Serial.println("Response:");
        Serial.println(payload);
        http.end();
        return true;
      }else if(httpCode == 401){// para cuando ya no sirve el token pida uno nuevo(inicie sesion nuevamente)
        obtenerTokenSesion();
        http.end();
        return false;
      }
    } else {
      Serial.printf("[HTTP] POST... failed, error: %s\n", http.errorToString(httpCode).c_str());
      http.end();
      return false;
    }
 }

 
 /* para iniciar sesion en el servidor y nos regrese el token de sesion*/
  bool Servidor::obtenerTokenSesion(){
  http.begin(client, getHostServer()+"/api/loginMicro"); //host + path
  http.addHeader("Content-Type", "application/json");

  //int httpCode = http.POST("{\"hello\":\"world\"}");
  int httpCode = http.POST("{\"direccion_ip\":\""+obtenerDireccionIp()+"\",\"direccion_mac\":\""+obtenerDireccionMac()+"\"}");

  // si el http code es -1 enconces es un error
  if (httpCode > 0) {
      Serial.printf("[HTTP] POST... code: %d\n", httpCode);

      // file found at server httpCode == HTTP_CODE_OK
      if (httpCode >=200 && httpCode <= 299 ){
        String arregloDatos[3];//-- arreglo para las variables token,id_micro,id_invernadero
        String respuesta = http.getString().substring(1,http.getString().length()-1);//quitamos las comillas " token 28828282,id_micro,id_invernadero " de la respuesta
        split(respuesta,arregloDatos,3);//separamos los datos por , 
        String token1;
        token1 = arregloDatos[0];//asignamos el valor del arreglo a las variables correspondientes
        setIdMicro(arregloDatos[1]);
        
        Serial.println(token1);
        Serial.println("Id_micro:"+obtenerIdMicro());
        setToken(token1);// Guardamos el token de sesion
        Serial.println("Sesion obtenida correctamente");
        http.end();
        return true;
      }
    } else {
      Serial.printf("[HTTP] POST... failed, error: %s\n", http.errorToString(httpCode).c_str());
    }
    http.end();
    return false;
 }

/* para obtener el token de sesion del servidor*/
 String Servidor::getToken(){
  return token;
 }
 /* Para asignarle un valor al token de sesion del servidor */
 void Servidor::setToken(String t){
  token = t;
 }
 
 /* Este metodo cambia el valor del nombre del host del socket de la EEPROM*/
 void Servidor::setHostSocket(String informacion){
   setDatoMemoria(64,164,informacion);
   hostSocket = informacion;
  }
  /* Obtenemos el nombre del host de la EEPROM*/
 String Servidor::getHostSocket(){
  return hostSocket;
 }


 
  /* Este metodo cambia el valor del nombre del host del socket de la EEPROM*/
 void Servidor::setHostServer(String informacion){
   setDatoMemoria(165,265,informacion);
   hostServer = informacion;
  }
  /* Obtenemos el nombre del host de la EEPROM*/
 String Servidor::getHostServer(){
  return hostServer;
 }
   /* Este metodo actualiza el valor del host en la variable host **/
  void Servidor::actualizarHost(){
    hostSocket = obtenerDatoMemoria(64,164);
    hostServer = obtenerDatoMemoria(165,265);
    
  }
  void Servidor::setId(int informacion){
    id=informacion;
  }
  int Servidor::getId(){
    return id;
  }
  
/* Este metodo regresa la direccion ip del Micro*/
String Servidor::getIp(){
  return WiFi.localIP().toString();
}

/**
   Este metodo manda una informacion dada a la eprom en  un rango de direccion daddo
   @Param inicio1 inicio del rango de direccion de memoria
   @Param fin1 fin del rango de direccion de memoria
   @Param informacion Dato a almacenar
   return true si se guardo y false si no se guardo
*/
bool Servidor::setDatoMemoria(int inicio1, int fin1, String informacion) {

  // primero validamos que la informacion quepa en el rango dado
  if (informacion.length() <= (fin1 - inicio1 + 1)) {
    int cont = 0; // contador para las posiciones del dato 'informacion' ya que este empieza desde el 0 siempre
    for (int a = inicio1; a <= fin1; a++) { // recorremos los espacios en memoria para almacenar la informacion
      if (cont <= informacion.length()) {
        EEPROM.write(a, informacion.charAt(cont));
        cont++;//incrementamos el contador de los elementos del string
      } else {
        EEPROM.write(a, 0); //espacios en blanco
      }
    }
    EEPROM.commit();//guardamos los cambios
    return true;
  } else {
    return false;
  }
}

/**
   Este metodo obtiene lo que este en la EPROM en un rango dado
   @Param inicio1  es donde inicio la direccion de memoria
   @Param fin1 es donde termina la direccion de memoria
   return  lo que este en ese rango dado
*/
String Servidor::obtenerDatoMemoria(int inicio1, int fin1) {
  String resultado1 = "";
  for (int a = inicio1; a <= fin1; a++) {
    if (EEPROM.read(a) != 0) {
      resultado1 += (char)EEPROM.read(a);
    }
  }
  return resultado1;
}

/**
   Este metodo nos ayuda a cambiar el nombre de red a la que se va a conectar el ESP8266 Nota (el nombre va a tomar los primeros 32 posiciones empezando del cero 'tope 31')
   @ param nombre  es el nombre que le vamos a dar
   return   true si se cambio con exito y false si no se cambio
*/
bool Servidor::setNombreRed(String nombre) {
  if (nombre.length() <= 32) { // <--el nombre debe ser menor o igual a 32 caracteres

    //escribimos los caracteres del nombre en la EEPROM "y validamos para ver si va a tener espacios vacios la EEPROM"
    for (int a = 0; a < nombre.length(); a++) {
      EEPROM.write(a, nombre.charAt(a));
    }
    nombreRed = nombre; // <-- cambiamos el nombre de la red

    if (nombre.length() < 32) { // si la contraseña es menor a 32 entonces tiene ponemos espacios vacios

      for (int a = nombre.length(); a < 32; a++) { // llenamos los espacios vacios Nota 'llega hasta el espacio 31 por que empieza desde el 0'
        EEPROM.write(a, 0);
      }
    }
    EEPROM.commit();// guardamos los cambios
    return true;
  } else {
    return false;
  }
}
/**
   Este metodo nos ayuda a cambiar la password de la red a la que se va a conectar el ESP8266
   @ param password de la red
   return   true si se cambio con exito y false si no se cambio
*/
bool Servidor::setPasswordRed(String pass1) {
  if (pass1.length() <= 32) { // <--el nombre debe ser menor o igual a 32 caracteres

    //escribimos los caracteres del nombre en la EEPROM "y validamos para ver si va a tener espacios vacios la EEPROM"
    // empezamos de la pos 32 por que la 31 esta ocupada
    for (int a = 32; a < pass1.length() + 32; a++) { // tope pos 63
      EEPROM.write(a, pass1.charAt(a - 32));
    }
    passwordRed = pass1; // <-- cambiamos el password de la red

    if (pass1.length() < 32) { //si la pass es menor a 32 entonces tiene espacios vacios
      for (int a = pass1.length() + 32; a < 64; a++) { // llenamos los espacios vacios Nota 'llega hasta el espacio 63 por que empieza desde el 31'
        EEPROM.write(a, 0);
      }
    }
    EEPROM.commit();// guardamos los cambios
    return true;
  } else {
    return false;
  }
}
/**
   Este metodo obtiene la password de la red a la que se esta conectando el ESP8266 que esta almacenado en la EEPROM
   return password
*/
String Servidor::getPasswordRed() {
  String resultado1 = "";
  for (int a = 32; a < 64; a++) {
    if (EEPROM.read(a) != 0) {
      resultado1 += (char)EEPROM.read(a);
    }
  }
  return resultado1;
}
/**
   Este metodo obtiene la password de la red a la que se esta conectando el ESP8266 que esta almacenado en la EEPROM
   return password
*/
String Servidor::getNombreRed() {
  String resultado1 = "";
  for (int a = 0; a < 32; a++) {
    if (EEPROM.read(a) != 0) {
      resultado1 += (char)EEPROM.read(a);
    }
  }
  return resultado1;
}



//-------------------------------------
Servidor::Servidor() { // Contructor
  actualizarHost();
}
