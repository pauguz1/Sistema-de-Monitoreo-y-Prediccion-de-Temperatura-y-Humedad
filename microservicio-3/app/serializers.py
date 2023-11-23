

from dataclasses import fields
from rest_framework import serializers
from .models import *
from django.contrib.auth.models import User


#para agregar los Microcontroladores
class MicroAddSerializer(serializers.ModelSerializer):
    class Meta:
        model = Microcontrolador
        fields = '__all__'


#para agregar las lecturas
class LecturaAddSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lectura
        fields = '__all__'

class LecturaGraficaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lectura
        fields = '__all__'
    def to_representation(self, data):
        temperatura = [item.temperatura for item in data]
        humedad = [item.humedad for item in data]
        return {'lista_temperatura': temperatura, 'lista_humedad': humedad}