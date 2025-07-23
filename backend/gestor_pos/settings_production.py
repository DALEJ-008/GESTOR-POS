"""
Configuración de Django para producción en PythonAnywhere
"""

from .settings import *
import os

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

# Dominios permitidos - actualizar con tu dominio de PythonAnywhere
ALLOWED_HOSTS = [
    'tu-usuario.pythonanywhere.com',  # Reemplazar con tu usuario real
    'localhost',
    '127.0.0.1',
]

# Base de datos para producción - MySQL en PythonAnywhere
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'tu-usuario$gestor_pos',  # Reemplazar con tu usuario real
        'USER': 'tu-usuario',  # Reemplazar con tu usuario real
        'PASSWORD': 'tu-password-db',  # Tu password de MySQL
        'HOST': 'tu-usuario.mysql.pythonanywhere-services.com',  # Tu host MySQL
        'PORT': '3306',
        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
            'charset': 'utf8mb4',
        },
    }
}

# Archivos estáticos para producción
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Archivos multimedia
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Configuración de CORS para producción
CORS_ALLOWED_ORIGINS = [
    "https://tu-usuario.pythonanywhere.com",  # Tu dominio
]

CORS_ALLOW_CREDENTIALS = True

# Configuración de seguridad adicional
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'

# Configuración de logging para producción
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

# Cache con Redis (si está disponible en tu plan)
# CACHES = {
#     'default': {
#         'BACKEND': 'django_redis.cache.RedisCache',
#         'LOCATION': 'redis://127.0.0.1:6379/1',
#         'OPTIONS': {
#             'CLIENT_CLASS': 'django_redis.client.DefaultClient',
#         }
#     }
# }

# Configuración de email (opcional)
# EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
# EMAIL_HOST = 'smtp.gmail.com'
# EMAIL_PORT = 587
# EMAIL_USE_TLS = True
# EMAIL_HOST_USER = 'tu-email@gmail.com'
# EMAIL_HOST_PASSWORD = 'tu-password-email'
