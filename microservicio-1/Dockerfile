# Usa una imagen de Node.js como base
FROM node:21.1.0

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos de la aplicación al contenedor
ADD . .

# Instala las dependencias de la aplicación
RUN npm install --production


# Expone el puerto en el que la aplicación va a funcionar
EXPOSE 8080

# Comando para ejecutar la aplicación cuando el contenedor se inicia
CMD ["node", "websocket-server.js"]
