from django.shortcuts import render

# Create your views here.


#retornar la pagina principal
def index(request):
    return render(request,'index.html',{})