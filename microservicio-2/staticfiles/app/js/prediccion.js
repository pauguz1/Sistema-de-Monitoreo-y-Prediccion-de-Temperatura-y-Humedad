
//------- Codigo que se encarga del monitoreo en tiempo real

var urlPrediccion = 'http://'+window.location.hostname+'/microservicio4/prediccion/predecir'
        
function obtenerPrediccion(){
    let contenedores = document.querySelectorAll('.prediccion-contenedor-resultados');
    let contenedorTemperatura = contenedores[0];
    let contenedorHumedad = contenedores[1];
    fetch(urlPrediccion,{
    method: 'GET',
    headers:{
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem('token')
    },
    mode: 'cors', // Habilita CORS
    }).then(response =>{
        if(response.ok){// si la respuesta es correcta entonces
            response.json().then(datos=>{
                for(a in datos){
                    //creamos el item de temperatura
                    let itemTemperatura = document.createElement('div');
                    itemTemperatura.classList.add('prediccion-item');
                    itemTemperatura.innerHTML =`<label>${datos[a].hora}h</label> <label>${datos[a].temperatura.toFixed(0)}º</label>`;

                    //creamos el item de humedad
                    let itemHumedad = document.createElement('div');
                    itemHumedad.classList.add('prediccion-item');
                    itemHumedad.innerHTML =`<label>${datos[a].hora}h</label> <label>${datos[a].humedad.toFixed(0)}%</label>`;

                    //agregamos los intems a sus respecticas listas
                    contenedorTemperatura.append(itemTemperatura);
                    contenedorHumedad.append(itemHumedad);
                }
            });
        }else{
            //
        }

    }).catch(error=>{console.error(error);});
}