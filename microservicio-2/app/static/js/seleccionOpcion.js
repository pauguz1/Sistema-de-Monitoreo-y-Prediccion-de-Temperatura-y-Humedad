
//------- Codigo que se encarga de la seleccion de opciones


// Función para cerrar todos los WebSockets abiertos
function cerrarTodosLosWebSockets() {
    webSocketsAbiertos.forEach(socket => {
      socket.close();
    });
    webSocketsAbiertos = []; // Vaciar la lista después de cerrar los WebSockets
  }

/**
* Este metodo manda la pagina al incio (osea la parte inicial de la pagina)
*/
function moverPaginaInicio(){
    // Mover la página al inicio
    window.scrollTo(0, 0); // Desplaza la página a las coordenadas (0, 0)
}

/**
 * Este metodo pone un boton que pasemos como parametro en negro y todos los que
 * no sean ese boton en blanco del contenedor de opciones del sistema
 */
function activarBotonSeleccionado(id){
    document.querySelectorAll('.contenedor-opciones button').forEach((b)=>{
        if( b.id == id){
            let boton = document.getElementById(b.id);//obtenemos el boton
            boton.classList.add('boton-si-seleccionado');
            boton.classList.remove('boton-no-seleccionado');
        }else{
            b.classList.remove('boton-si-seleccionado');
            b.classList.add('boton-no-seleccionado');
        }
    });
}

/**
 * Este metodo actualiza el path de la pagina sin recarga la pagina
 * @param {nuevo path} info 
 */ 
function actualizrPath(info){
    history.pushState({}, '', info);
}
/**
 * Este metodo muestra el contenido de la seccion de Monitoreo en contenedor que contiene la opcion seleccionada
 * para que el usuario pueda ver el monitoreo
 * actica todos lo referene a dicha seccion
 * @param {para saber si se va a actualiar el path o no} actualizar 
 */
function mostrarOpcionMonitoreo(actualizar){
    if(actualizar == true){
        //actualizamos el path
        actualizrPath('?s=monitoroe');
    }
    //seleccionamos el boton de monitoreo (fondo negro)
    activarBotonSeleccionado('btn-opcion-monitoreo');
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
    moverPaginaInicio()
}

/**
 * Este metodo muestra el contenido de la seccion de Historico en contenedor que contiene la opcion seleccionada
 * para que el usuario pueda realizar las opciones de historico
 * @param { indica si se va a actualizar el path o no} actualizar 
 */
function mostrarOpcionHistorico(actualizar){
    if(actualizar == true){
        //actualizamos el path
        actualizrPath('?s=historico');
    }
    //seleccionamos el boton de historico (fondo negro)
    activarBotonSeleccionado('btn-opcion-historico');
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
    moverPaginaInicio();
}

/**
 * Este metodo muestra el contenido de la seccion de Historico en contenedor que contiene la opcion seleccionada
 * para que el usuario pueda realizar las opciones de historico
 * @param {para saber si se va a actualizar el path o no} actualizar  
 */
function mostrarOpcionPrediccion(actualizar){
    console.log(actualizar)
    if(actualizar == true){
        //actualizamos el path
        actualizrPath('?s=prediccion');
    }
    //seleccionamos el boton de prediccion (fondo negro)
    activarBotonSeleccionado('btn-opcion-prediccion');
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
    moverPaginaInicio();
}


/**
 * Este metodo muestra en pantalla la opcion seleccionada acorde a 
 * las variables del path ?s='opcion'
 * @param {para saber si se va a actualizar el path o no} actualizar 
 */
function mostrarOpcionSeleccionada(actualizar){
    let path = window.location.search;
    //Creamos la instancia para obtener los parametros
    let parametros = new URLSearchParams(path);
    //Accedemos a los valores
    var opcinoSeleccionada = parametros.get('s');
    if(opcinoSeleccionada == null || opcinoSeleccionada == 'monitoreo'){// si la variable es null o monitoreo mostramos el monitoreo
        mostrarOpcionMonitoreo(actualizar);
    }else if(opcinoSeleccionada == 'historico'){//si la variable dice historico mostramos el historico
        mostrarOpcionHistorico(actualizar);
    }else if( opcinoSeleccionada == 'prediccion'){//si la variable dice prediccion mostramos la opcin de prediccion
        mostrarOpcionPrediccion(actualizar);
    }else{
        mostrarOpcionMonitoreo(actualizar);
    }
}


//revisamos que opcion fue seleccionada por el usuario
mostrarOpcionSeleccionada(false);


/**
 * Este metodo detecta cuando el usuario hace un retroceso en la pagina
 * y muestra la opcion seleccionada sin cambiar el historial
 */
window.addEventListener('popstate', function(event) {
    mostrarOpcionSeleccionada(false);
});