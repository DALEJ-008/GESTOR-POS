"""
WSGI config for gestor_pos project en PythonAnywhere.

Este archivo es usado por PythonAnywhere para servir tu aplicación Django.
"""

import os
import sys

# Agregar el path de tu proyecto
path = '/home/tu-usuario/GESTOR-POS/backend'  # Reemplazar con tu usuario real
if path not in sys.path:
    sys.path.insert(0, path)

# Configurar Django settings para producción
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gestor_pos.settings_production')

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
