
//------- Codigo que se encarga del historico
   
var urlFiltrarHistorico = 'http://'+window.location.hostname+'/microservicio3/'
function filtrarHistorico(){
    var canvas3 = document.getElementById('grafica-historico-temperatura').getContext('2d');//seleccionamos el canvas
    var canvas4 = document.getElementById('grafica-historico-humedad').getContext('2d');//seleccionamos el canva
    var chart3 = new Chart(canvas3,obtenerMoldeGrafica('Temperatura'));//le pasamos el grafico y la data para representarlo
    var chart4 = new Chart(canvas4,obtenerMoldeGrafica('Humedad'));//le pasamos el grafico y la data para representarl
    chart3.update();
    chart4.update();
    
    let contenedores = document.querySelectorAll('.historico-contenedor-input');
    let fechaInicio = contenedores[0].children[1].value;
    let fechaFinal = contenedores[1].children[1].value;
            
    if(fechaInicio != '' && fechaFinal != ''){
        fetch(urlFiltrarHistorico+'api/addLecturaFiltro?fecha_inicio='+fechaInicio+'&fecha_final='+fechaFinal,{
        method: 'GET',
        headers:{
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
        },
        mode: 'cors', // Habilita CORS
        }).then(response =>{
            if(response.ok){// si la respuesta es correcta entonces
                response.json().then(datos=>{
                    if(datos.lista_temperatura.length >0){
                        chart3.data.labels = datos.lista_fechas;
                        chart3.data.datasets[0].data = datos.lista_temperatura;
                        chart3.update();

                        chart4.data.labels = datos.lista_fechas;
                        chart4.data.datasets[0].data = datos.lista_humedad;
                        chart4.update();
                    }else{
                        mostrarModalEfimero('En ese rango de fecha no existe ningún registro de la humedad y temperatura');
                    }
                });
            }else{
                //procesarRespuesta401(response.clone());
            }

        }).catch(error=>{console.error(error);});
    }else{
        mostrarModalEfimero('Falta rellenar campos');
    }
}


