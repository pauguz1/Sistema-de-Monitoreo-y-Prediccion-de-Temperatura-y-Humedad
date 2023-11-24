#!/bin/bash

# Correr el microservicio de Node con los websockets
node microservicio-1/websocket-server.js &

# Correr el microservicio que muestra la Pagina WEB
python microservicio-2/manage.py runserver 0:8000 &

# Correr el microservicio de API Historico
python microservicio-3/manage.py runserver 0:8001 &

# Correr el microservicio de API prediccion
python microservicio-4/manage.py runserver 0:8002 &
