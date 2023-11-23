
#para el rest framework
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions

from rest_framework import viewsets
from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser 
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.authtoken.models import Token
import copy
from django.http import Http404

from django.contrib.auth.decorators import  login_required
from django.contrib.sessions.models import Session
from .serializers import *
from datetime import datetime


#para las querys DB
from django.db.models import Avg, Max, Min, Sum
from app.models import *


#para manejar la tabla de Microntrolador
class  MicrocontroladorView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get_object(self, pk):
        try:
            return Microcontrolador.objects.get(pk=pk)
        except Microcontrolador.DoesNotExist:
            raise Http404
    
    def get(self,request,pk,format=None):
        #time.sleep(2)
        if str(pk) == '-1':#si nos pasan -1 entonces devolvemos toda la lista de plantas del usuario
            token = Token.objects.get(key = request.auth)#obtenemos la info del token
            lista = Microcontrolador.objects.all()
            serializer = MicroAddSerializer(lista,many=True)
            return Response(serializer.data)
        #devolvemos un micro en especifico
        lista = self.get_object(pk)# probamos para ver si ese microcontrolador existe
        serializer = MicroAddSerializer(lista)
        return Response(serializer.data)

    def post(self,request,format=None):
        serializer = MicroAddSerializer(data= request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)#no se agrego con exito
    def put(self,request,pk,format=None):
        p = self.get_object(pk)
        serializer = MicroAddSerializer(p,data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self,request,pk,format=None):#borrar los micros
        p = self.get_object(pk)
        serializer = MicroAddSerializer(p)
        p.delete()
        return Response(serializer.data,status=status.HTTP_204_NO_CONTENT)

#para manejar la tabla de Lectura
class  LecturaView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get_object(self, pk):
        try:
            return Lectura.objects.get(pk=pk)
        except Lectura.DoesNotExist:
            raise Http404
    
    def get(self,request,pk,format=None):
        #time.sleep(2)
        if str(pk) == '-1':#si nos pasan -1 entonces devolvemos toda la lista de plantas del usuario
            token = Token.objects.get(key = request.auth)#obtenemos la info del token
            lista = Lectura.objects.all()
            serializer = LecturaAddSerializer(lista,many=True)
            return Response(serializer.data)
        #devolvemos un micro en especifico
        lista = self.get_object(pk)# probamos para ver si ese microcontrolador existe
        serializer = LecturaAddSerializer(lista)
        return Response(serializer.data)

    def post(self,request,format=None):
        serializer = LecturaAddSerializer(data= request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)#no se agrego con exito
    def put(self,request,pk,format=None):
        p = self.get_object(pk)
        serializer = LecturaAddSerializer(p,data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self,request,pk,format=None):#borrar los micros
        p = self.get_object(pk)
        serializer = LecturaAddSerializer(p)
        p.delete()
        return Response(serializer.data,status=status.HTTP_204_NO_CONTENT)
    

#para los filtros de busqueda de estanque
class LecturaFiltroView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get_object(self, pk):
        try:
            return Lectura.objects.get(pk=pk)
        except Lectura.DoesNotExist:
            raise Http404
    
    def get(self,request,format=None):
        #fecha_inicial = request.GET['fecha_inicio'] # Cambia estas fechas según tu rango
        #fecha_final = request.GET['fecha_final'] 

        fecha_inicial = datetime.strptime(request.GET['fecha_inicio'], '%d/%m/%Y')   # Cambia estas fechas según tu rango
        fecha_final = datetime.strptime(request.GET['fecha_final'], '%d/%m/%Y') 

        lista = Lectura.objects.filter(fecha_creacion__range=(fecha_inicial, fecha_final)) 
        #lista = Lectura.objects.all()
        serializer = LecturaGraficaSerializer().to_representation(lista)
        return Response(serializer)
    
#para iniciar sesion desde la api para le Microcontrolador
class LoginMicroView(APIView):
    permission_classes = [permissions.AllowAny]#para que cualquiera pueda logearse
    def post(self, request, format=None):
        ip = request.data['direccion_ip']
        mac = request.data['direccion_mac']
        micro = None
        try:
            micro = Microcontrolador.objects.get(direccion_mac=mac)
        except Microcontrolador.DoesNotExist:
            return Response({'error':'Usuario o contraseña incorrectos'},status=status.HTTP_400_BAD_REQUEST)
        if micro is not None: # si se encontro el micro y el micro esta activo entonces buscamos el UsuarioEstanque asociado
            #obtenemos el token asociado a dicho usuario y lo regresamos como json
            token = Token.objects.get_or_create(user=micro.id_usuario)#buscamos o creamos el token del usuario
            #regresamos el token del usuario
            return Response( 'token '+str(token[0])+','+str(micro.pk),status=status.HTTP_200_OK ) #regresamos solo el valor del token
        else:# si los datos del usuario no concuerdan mandamos un error
            return Response({'error':'Usuario o contraseña incorrectos'},status=status.HTTP_400_BAD_REQUEST)