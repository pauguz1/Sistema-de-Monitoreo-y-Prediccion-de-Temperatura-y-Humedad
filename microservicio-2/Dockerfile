# Use the official Python image from the Docker Hub
FROM python:3.10.12

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia el archivo requirements.txt al contenedor
ADD . .


# Instala las dependencias del proyecto
RUN pip install -r requirements.txt

# Puerto en el que el contenedor va a escuchar (debe coincidir con el expuesto en docker-compose.yml)
EXPOSE 8000

# Comando para ejecutar el servidor Django (aquí se puede cambiar para cualquier otro comando necesario)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]