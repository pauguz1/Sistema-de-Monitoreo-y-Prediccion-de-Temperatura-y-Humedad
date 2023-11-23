

from dataclasses import fields
from rest_framework import serializers
from .models import *
from django.contrib.auth.models import User
from datetime import datetime

#librerias para tensorflow
import numpy as np
import tensorflow as tf
from tensorflow import keras
from keras import layers

class PrediccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lectura
        fields = '__all__'
    def to_representation(self, data):
        horas = [item.fecha_creacion.hour for item in data]
        temperaturas = [item.temperatura for item in data]
        humedades = [item.humedad for item in data]


        # Crear un modelo de regresión en Keras
        model = keras.Sequential([
            layers.Input(shape=(1,)),  # Entrada unidimensional (hora del día)
            layers.Dense(32, activation='relu'),
            layers.Dense(2)  # Dos salidas: temperatura y humedad
        ])

        # Compilar el modelo
        model.compile(optimizer='adam', loss='mean_squared_error')

        # Entrenar el modelo con datos 
        model.fit(np.array(horas), np.column_stack((temperaturas, humedades)), epochs=100, batch_size=32)

        respuesta =[]
        # Realizar predicciones de las 24 horas del dia
        for a in range(1,25):
            hora_deseada = a  # agregamos la hora que queremos predecir
            predicciones = model.predict(np.array([hora_deseada]))

            temperatura_predicha = predicciones[0][0]
            humedad_predicha = predicciones[0][1]
            respuesta.append( {'hora':a,'temperatura':temperatura_predicha,'humedad':humedad_predicha},)
        return respuesta