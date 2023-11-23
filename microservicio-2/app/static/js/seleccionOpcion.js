
//------- Codigo que se encarga de la seleccion de opciones


// Función para cerrar todos los WebSockets abiertos
function cerrarTodosLosWebSockets() {
    webSocketsAbiertos.forEach(socket => {
      socket.close();
    });
    webSocketsAbiertos = []; // Vaciar la lista después de cerrar los WebSockets
  }

/**
 * Este metodo pone un boton que pasemos como parametro en negro y todos los que
 * no sean ese boton en blanco del contenedor de opciones del sistema
 */
function activarBotonSeleccionado(boton){
    document.querySelectorAll('.contenedor-opciones button').forEach((b)=>{
        if(boton == b){
            boton.classList.add('boton-si-seleccionado');
            boton.classList.remove('boton-no-seleccionado');
        }else{
            b.classList.remove('boton-si-seleccionado');
            b.classList.add('boton-no-seleccionado');
        }
    });
}

/**
 * Este metodo muestra el contenido de la seccion de Monitoreo en contenedor que contiene la opcion seleccionada
 * para que el usuario pueda ver el monitoreo
 * actica todos lo referene a dicha seccion
 */
function mostrarOpcionMonitoreo(){
    //si el web socket de monitoreo en tiempo real esta corriendo entonces lo cerramos
    cerrarTodosLosWebSockets();

    //obtenemos el contenedor total el cual contiene toda la informacion de una opcion seleccionada
    let contenedor = document.querySelector('.contenedor-total');
    //eliminamos el primer elemento que es el contenedor de una opcion (solo hay una opcion a la vez)
    if(contenedor.children.length > 0 ){
        contenedor.children[0].remove();
    }

    contenedor.innerHTML +=`
    <div class="contenedor-principal">
        <div class="monitoreo-contenedor-etiquetas">
            <label>Temperatura: </label>
            <label>Humedad: </label>
        </div>

        <div class="monitoreo-contenedor-graficas">
            <div class="monitoreo-graficas">
                <canvas class='grafica' id="grafica-monitoreo-temperatura"></canvas>
            </div>
            
            <div class="monitoreo-graficas">
                <canvas class='grafica' id="grafica-monitoreo-humedad"></canvas>
            </div>

        </div>
    </div>
    `;
    mostrarMonitoreoTiempoReal();
}

/**
 * Este metodo muestra el contenido de la seccion de Historico en contenedor que contiene la opcion seleccionada
 * para que el usuario pueda realizar las opciones de historico
 */
function mostrarOpcionHistorico(){
    //obtenemos el contenedor total el cual contiene toda la informacion de una opcion seleccionada
    let contenedor = document.querySelector('.contenedor-total');
    //eliminamos el primer elemento que es el contenedor de una opcion (solo hay una opcion a la vez)
    if(contenedor.children.length > 0 ){
        contenedor.children[0].remove();
    }

    contenedor.innerHTML +=`
    <div class="contenedor-principal">
        <div class="historico-contenedor-filtro">
            <div class="historico-contenedor-input">
                <label>Fecha de inicio</label>
                <input placeholder="fecha" type="datetime-local" name="" id="">
            </div>
            <div class="historico-contenedor-input">
                <label>Fecha final</label>
                <input placeholder="fecha" type="datetime-local" name="" id="">
            </div>
            <button onclick="filtrarHistorico()">Filtrar</button>
        </div>

        <div class="monitoreo-contenedor-graficas">
            <div class="monitoreo-graficas">
                <canvas class='grafica' id="grafica-historico-temperatura"></canvas>
            </div>
            
            <div class="monitoreo-graficas">
                <canvas class='grafica' id="grafica-historico-humedad"></canvas>
            </div>

        </div>
    </div>
    `;
    cerrarTodosLosWebSockets();
}

/**
 * Este metodo muestra el contenido de la seccion de Historico en contenedor que contiene la opcion seleccionada
 * para que el usuario pueda realizar las opciones de historico
 */
function mostrarOpcionPrediccion(){
    //si el web socket de monitoreo en tiempo real esta corriendo entonces lo cerramos
    cerrarTodosLosWebSockets();

    //obtenemos el contenedor total el cual contiene toda la informacion de una opcion seleccionada
    let contenedor = document.querySelector('.contenedor-total');
    //eliminamos el primer elemento que es el contenedor de una opcion (solo hay una opcion a la vez)
    if(contenedor.children.length > 0 ){
        contenedor.children[0].remove();
    }

    contenedor.innerHTML +=`
    <div class="contenedor-principal">

        <label class="text-center">Temperatura</label>
        <div class="prediccion-contenedor-resultados"> </div>

        <label class="text-center">Humedad</label>
        <div class="prediccion-contenedor-resultados"> </div>

    </div>
    `;
    obtenerPrediccion();
}

//presionamos el boton Monitoreo ya que es la primera opcion
document.querySelector('.contenedor-opciones').children[0].click();