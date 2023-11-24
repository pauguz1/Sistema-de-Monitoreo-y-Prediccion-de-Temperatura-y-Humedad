#!/bin/bash


#---------------------------------------- Microservicio 2
npm install --production --prefix microservicio-1/

node microservicio-1/websocket-server.js &



#---------------------------------------- Microservicio 2
# Activa el entorno virtual
source microservicio-2/.env/bin/activate

#instalamos las librerias en el entorno
pip install -r microservicio-2/requirements.txt

# Ejecuta el servidor Django
python microservicio-2/manage.py runserver 0:8000 &

#---------------------------------------- Microservicio 3

# Activa el entorno virtual
source microservicio-3/.env/bin/activate

#instalamos las librerias en el entorno
pip install -r microservicio-3/requirements.txt

# Ejecuta el servidor Django
python microservicio-3/manage.py runserver 0:8001 &

#---------------------------------------- Microservicio 4

# Activa el entorno virtual
source microservicio-4/.env/bin/activate

#instalamos las librerias en el entorno
pip install -r microservicio-4/requirements.txt

# Ejecuta el servidor Django
python microservicio-4/manage.py runserver 0:8002 &