"""
WSGI config for gestor_pos project en PythonAnywhere.

Este archivo es usado por PythonAnywhere para servir tu aplicación Django.
Se utiliza la variable de entorno `PA_USER` o la variable `USER` para calcular
la ruta del proyecto si no editas este archivo manualmente.
"""

import os
import sys

# Determinar usuario de PythonAnywhere (PA_USER puede ser exportado en PA)
PA_USER = os.environ.get('PA_USER') or os.environ.get('USER') or 'tu-usuario'

# Agregar el path de tu proyecto (ajusta si tu estructura difiere)
path = f'/home/{PA_USER}/GESTOR-POS/backend'
if path not in sys.path:
    sys.path.insert(0, path)

# Configurar Django settings para producción
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gestor_pos.settings_production')

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
