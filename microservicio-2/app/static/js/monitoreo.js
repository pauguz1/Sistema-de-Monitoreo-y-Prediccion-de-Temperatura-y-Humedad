
//------- Codigo que se encarga del monitoreo en tiempo real

        /* este metodo devuelve el molde de la grafica */
        function obtenerMoldeGrafica(nombre){
        var etiquetas = [];
        var lista = [];


        var grafica ={
            type:"line",//seleccionamos el tipo de grafico, en este caso es un grafico estilo pie, en esta parte podemos cambiar el tipo de grafico por el que deseamos
            data:{//le pasamos la data
              datasets:[
                {
                    label: nombre,
                    data: lista,//esta es la data, podemos pasarle variables directamente desde el backend usando blade de la siguiente forma 
                    borderColor: getComputedStyle(document.body).getPropertyValue('--box-shadow') ,
                    backgroundColor: getComputedStyle(document.body).getPropertyValue('--text-color2') ,
                    pointBackgroundColor: getComputedStyle(document.body).getPropertyValue('--text-color1') ,
                    tension: 0.1,

                },

            ],
              labels: etiquetas
            },
            options:{//le pasamos como opcion adicional que sea responsivo
              responsive: true,
              maintainAspectRatio: false,
              legend: {
                labels: {
                    fontColor: getComputedStyle(document.body).getPropertyValue('--text-color1'),
                    fontSize:  parseInt(getComputedStyle(document.body).getPropertyValue('--font-size1'))
                }
            },scales: {
                xAxes: [{
                    ticks: {
                        fontColor: getComputedStyle(document.body).getPropertyValue('--text-color1'),
                        fontSize: parseInt(getComputedStyle(document.body).getPropertyValue('--font-size1')),
                        stepSize: 1,
                        beginAtZero: true
                    }
                }],
                yAxes: [{
                    ticks: {
                        fontColor: getComputedStyle(document.body).getPropertyValue('--text-color1'),
                        fontSize: parseInt(getComputedStyle(document.body).getPropertyValue('--font-size1')),
                        beginAtZero:true
                    }
                }]
            }
            }
          };
          return grafica;
        }


        // Crear una lista para almacenar los WebSockets abiertos
        var webSocketsAbiertos = [];

        function mostrarMonitoreoTiempoReal(){
            //------------------------------------ Instanciacion de los sockets y los agregamos a la lista de websockets
        //para mandar el estado de la lectura
        var hostname = window.location.hostname;
        var socketLectura = new WebSocket('ws://'+hostname+':8080');

        webSocketsAbiertos.push(socketLectura);//agregamos el websocket a la lista de web sockets abiertos

        //---------------------------------------------------- Suscripcion a la cola de mensajes
        // para suscribirnos al estado de la lectura (ver las lecturas)
        socketLectura.onopen = function() {
            socketLectura.send(JSON.stringify({ type: 'subscribe', channel: 'lectura' }));
        };


        //------------------------ Escucha de la llegada de mensajes

        //escuchamos las peticiones de solicitud de destao de la lectura
        socketLectura.onmessage = function(event) {
            let contenedor = document.querySelector('.contenedor-primario');
            let contenedorEtiquetas = document.querySelector('.monitoreo-contenedor-etiquetas');
            let data = JSON.parse(event.data);
            let partes = data.content.split(',')

            let temperatura = partes[0];
            let humedad = partes[1];
            //mostramos la temperatura y humedad en las etiquetas
            contenedorEtiquetas.children[0].innerHTML = 'Temperatura:'+temperatura;
            contenedorEtiquetas.children[1].innerHTML = 'Humedad:'+humedad;

            var time = new Date();
            const newLabel = time.getHours()+':'+time.getMinutes()+':'+time.getSeconds();
            const newData = temperatura;
            chart1.data.labels.push(newLabel);
            chart1.data.datasets.forEach((dataset) => {
                dataset.data.push(newData);
                if(dataset.data.length == 15){
                    dataset.data.shift();//quitamos el primer registro
                    chart1.data.labels.shift();//quitamos la etiqueta del primer registro
                }
            });
            chart1.update();

            var time = new Date();
            const newLabel2 = time.getHours()+':'+time.getMinutes()+':'+time.getSeconds();
            const newData2 = humedad;
            chart2.data.labels.push(newLabel2);
            chart2.data.datasets.forEach((dataset) => {
                dataset.data.push(newData2);
                if(dataset.data.length == 15){
                    dataset.data.shift();//quitamos el primer registro
                    chart2.data.labels.shift();//quitamos la etiqueta del primer registro
                }
            });
            chart2.update();
        }
        var canvas1 = document.getElementById('grafica-monitoreo-temperatura').getContext('2d');//seleccionamos el canvas
        var canvas2 = document.getElementById('grafica-monitoreo-humedad').getContext('2d');//seleccionamos el canvas

        var chart1 = new Chart(canvas1,obtenerMoldeGrafica('Temperatura'));//le pasamos el grafico y la data para representarlo
        var chart2 = new Chart(canvas2,obtenerMoldeGrafica('Humedad'));//le pasamos el grafico y la data para representarlo

        chart1.update();
        chart2.update();
        }

        
        