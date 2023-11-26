/**
 * Esta Clase nos ayuda a crear un delay que no detiene los procesos 
 * ya que el procesos se sigue ejecuntando despues de que mandamos llamar al delay
 * 
 * Author: Paul Alejandro Santana Guzman
 * Version:1.0
 */
class Delay {
  private:
    bool bandera1;// para saber si el delay esta activo
    bool bandera2;
    unsigned long timer1;
    unsigned long timer2;
    unsigned long cont;
  public:
    Delay();
    Delay(unsigned long tiempo);
    void setDelay(unsigned long d);
    bool getDelay();
    long getContador();// para saber el numero de veces que se llamo al delay
    void escuchar();
};

Delay::Delay() {
  bandera1=false;
  bandera2=false;
}
Delay::Delay(unsigned long tiempo) {
  bandera1=false;
  bandera2=false;
}
/**
 * Este metodo recive el tiempo en milisegundos del delay
 */
void Delay::setDelay(unsigned long d) {
  if (bandera2 == false) { //esto indica que no tiene valor el delay
    bandera2 = true;
    timer2 = millis() + d;// sumamos el valor del reloj mas el valor que nos pasan como parametro
    cont++; // aumentamos el contador 
  }
}
/**
 * Este metodo regresa el valor true o false para saber si esta encendido el delay
 * true es para saber si esta activo
 * false no esta activo
 */
bool Delay::getDelay() {
  timer1 = millis(); // obtenemos el valor  del reloj  (5)  valor del delay (10)
  if (timer2 > timer1) { // si se cumple entonces se hace el proceso del delay
    bandera1 = true;// ponemos true
  } else { // si no entonces no se hace el proceso
    bandera1 = false;// ponemos el false
    bandera2 = false; // ponemos la bandera en false para que nuevamente se pueda realizar otro delay
  }
  return bandera1;
}
/**
 * Este metodo devuelve el numero de veces que se a usado el delay
 */
long Delay::getContador(){
  return cont;
}
