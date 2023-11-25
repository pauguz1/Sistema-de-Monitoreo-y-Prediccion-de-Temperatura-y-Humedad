import os
import django
import sys
sys.path.append('')
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "grep.settings")
django.setup()

from django.contrib.auth.models import User

# Crear un usuario normal
#user = User.objects.create_user(username='nombre_de_usuario', email='correo@ejemplo.com', password='contraseña')

# Crear un superusuario
superuser = User.objects.create_superuser(username='paul', email='paul@gmail.com', password='123')
