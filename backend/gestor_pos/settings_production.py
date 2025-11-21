"""
Configuración de Django para producción en PythonAnywhere.

Este archivo usa variables de entorno (a través de `decouple.config`) para
facilitar el despliegue en PythonAnywhere. Reemplaza variables en el entorno
de PA o crea un `.env` en `backend/` con los valores adecuados.
"""

from .settings import *
import os
from decouple import config

# SECURITY
DEBUG = config('DEBUG', default=False, cast=bool)

# Dominios permitidos
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost,127.0.0.1').split(',')

# Base de datos para producción (MySQL en PythonAnywhere)
DATABASES = {
    'default': {
        'ENGINE': config('DB_ENGINE', default='django.db.backends.mysql'),
        'NAME': config('DB_NAME', default=f"{os.environ.get('USER','tu-usuario')}$gestor_pos"),
        'USER': config('DB_USER', default=os.environ.get('USER', 'tu-usuario')),
        'PASSWORD': config('DB_PASSWORD', default=''),
        'HOST': config('DB_HOST', default=f"{os.environ.get('USER','tu-usuario')}.mysql.pythonanywhere-services.com"),
        'PORT': config('DB_PORT', default='3306'),
        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
            'charset': 'utf8mb4',
        },
    }
}

# Archivos estáticos y media
STATIC_URL = '/static/'
STATIC_ROOT = config('STATIC_ROOT', default=os.path.join(BASE_DIR, 'staticfiles'))

MEDIA_URL = '/media/'
MEDIA_ROOT = config('MEDIA_ROOT', default=os.path.join(BASE_DIR, 'media'))

# CORS
cors_origins = config('CORS_ALLOWED_ORIGINS', default='')
if cors_origins:
    CORS_ALLOWED_ORIGINS = [u.strip() for u in cors_origins.split(',') if u.strip()]
else:
    CORS_ALLOWED_ORIGINS = [f"https://{os.environ.get('USER','tu-usuario')}.pythonanywhere.com"]

CORS_ALLOW_CREDENTIALS = True

# Seguridad adicional
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'

# Logging (se mantiene, pero usando ruta en BASE_DIR)
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': os.path.join(BASE_DIR, 'django_production.log'),
        },
    },
    'root': {
        'handlers': ['file'],
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'INFO',
            'propagate': True,
        },
    },
}

# Nota: Redis/Celery y email pueden configurarse desde variables de entorno
