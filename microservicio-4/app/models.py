from django.db import models
from django.conf import settings
# Create your models here.


class Microcontrolador(models.Model):
    nombre = models.CharField(blank=False,max_length=50)
    direccion_mac = models.CharField(blank=False,max_length=17,unique=True) #que es la longitud de una direccion mac
    direccion_ip = models.CharField(blank=False,max_length=15)
    id_usuario = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,null=False)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

class Lectura(models.Model):
    id_microcontrolador = models.ForeignKey(Microcontrolador,on_delete=models.CASCADE,null=False)
    temperatura = models.FloatField(blank=False)
    humedad = models.FloatField(blank=False)
    fecha_creacion = models.DateTimeField(auto_now_add=True)