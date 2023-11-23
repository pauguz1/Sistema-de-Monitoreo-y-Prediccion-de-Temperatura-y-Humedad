
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

    

#para los filtros de busqueda de estanque
class PrediccionView(APIView):
    permission_classes = [permissions.AllowAny]
    def get_object(self, pk):
        try:
            return Lectura.objects.get(pk=pk)
        except Lectura.DoesNotExist:
            raise Http404
    
    def get(self,request,format=None):
        lista = Lectura.objects.all()
        serializer = PrediccionSerializer().to_representation(lista)
        return Response(serializer)
    
