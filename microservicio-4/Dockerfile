FROM python:3.10.12

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1


WORKDIR /app

# Copia todo el contenido del directorio actual al contenedor en /app
ADD . .

RUN pip install -r requirements.txt

# realizar las migrationes
RUN python manage.py makemigrations &
RUN python manage.py migrate &

EXPOSE 8002

# Comando para ejecutar Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8002", "microservicio4.wsgi:application"]  
