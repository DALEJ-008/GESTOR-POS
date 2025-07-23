# 🚀 Guía de Deployment en PythonAnywhere

## Prerequisitos
1. **Cuenta en PythonAnywhere**: Tener una cuenta activa
2. **Plan adecuado**: Hacker plan o superior para usar MySQL y custom domains
3. **Repositorio actualizado**: Todos los cambios deben estar en GitHub

## 📋 Pasos de Deployment

### 1. Preparar la base de datos

#### En PythonAnywhere Dashboard:
1. Ve a **"Databases"** en tu dashboard
2. Crea una nueva base de datos MySQL:
   - Nombre: `tu-usuario$gestor_pos`
   - Anota el password que te asignen

### 2. Configurar aplicación web

#### En PythonAnywhere Dashboard:
1. Ve a **"Web"** en tu dashboard
2. Haz clic en **"Add a new web app"**
3. Selecciona tu dominio: `tu-usuario.pythonanywhere.com`
4. Selecciona **"Manual configuration"**
5. Elige **Python 3.10**

### 3. Clonar y configurar el proyecto

#### En PythonAnywhere Console (Bash):
```bash
# 1. Ir al directorio home
cd ~

# 2. Clonar el repositorio
git clone https://github.com/DALEJ-008/GESTOR-POS.git

# 3. Ir al directorio del backend
cd GESTOR-POS/backend

# 4. Crear entorno virtual
python3.10 -m venv venv

# 5. Activar entorno virtual
source venv/bin/activate

# 6. Instalar dependencias
pip install --upgrade pip
pip install -r requirements.txt
```

### 4. Configurar variables de entorno

#### Crear archivo .env:
```bash
# En el directorio ~/GESTOR-POS/backend/
nano .env
```

#### Contenido del archivo .env:
```env
SECRET_KEY=tu-secret-key-generado
DEBUG=False
ALLOWED_HOSTS=tu-usuario.pythonanywhere.com
DB_NAME=tu-usuario$gestor_pos
DB_USER=tu-usuario
DB_PASSWORD=tu-password-mysql
DB_HOST=tu-usuario.mysql.pythonanywhere-services.com
DB_PORT=3306
```

### 5. Actualizar configuración de producción

#### Editar settings_production.py:
```bash
nano gestor_pos/settings_production.py
```

Reemplazar:
- `tu-usuario` por tu nombre de usuario real
- `tu-password-db` por tu password de MySQL real

### 6. Ejecutar migraciones

```bash
# Activar entorno virtual
source venv/bin/activate

# Ejecutar migraciones
python manage.py makemigrations --settings=gestor_pos.settings_production
python manage.py migrate --settings=gestor_pos.settings_production

# Crear superusuario
python manage.py createsuperuser --settings=gestor_pos.settings_production

# Recopilar archivos estáticos
python manage.py collectstatic --noinput --settings=gestor_pos.settings_production
```

### 7. Configurar WSGI

#### En PythonAnywhere Web tab:
1. Ve a **"Code"** section
2. **Source code**: `/home/tu-usuario/GESTOR-POS/backend`
3. **Working directory**: `/home/tu-usuario/GESTOR-POS/backend`
4. Haz clic en **"WSGI configuration file"**

#### Contenido del archivo WSGI:
```python
import os
import sys

# Agregar el path de tu proyecto
path = '/home/tu-usuario/GESTOR-POS/backend'
if path not in sys.path:
    sys.path.insert(0, path)

# Configurar Django settings para producción
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gestor_pos.settings_production')

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
```

### 8. Configurar archivos estáticos

#### En PythonAnywhere Web tab:
1. Ve a **"Static files"** section
2. Agregar mapping:
   - **URL**: `/static/`
   - **Directory**: `/home/tu-usuario/GESTOR-POS/backend/staticfiles`

### 9. Configurar CORS (si usas frontend separado)

#### En settings_production.py, actualizar:
```python
CORS_ALLOWED_ORIGINS = [
    "https://tu-usuario.pythonanywhere.com",
    "https://tu-dominio-frontend.com",  # Si tienes frontend separado
]
```

### 10. Recargar aplicación

1. Ve al tab **"Web"** en tu dashboard
2. Haz clic en **"Reload tu-usuario.pythonanywhere.com"**
3. ¡Tu aplicación debería estar funcionando!

## 🔧 Comandos útiles para mantenimiento

### Actualizar código:
```bash
cd ~/GESTOR-POS
git pull origin main
# Recargar aplicación web desde dashboard
```

### Ver logs de errores:
```bash
# Error log
tail -f /var/log/tu-usuario.pythonanywhere.com.error.log

# Access log
tail -f /var/log/tu-usuario.pythonanywhere.com.access.log
```

### Ejecutar comandos Django:
```bash
cd ~/GESTOR-POS/backend
source venv/bin/activate
python manage.py shell --settings=gestor_pos.settings_production
```

## 🛠️ Solución de problemas comunes

### Error 502 Bad Gateway:
- Verificar configuración WSGI
- Revisar logs de error
- Asegurar que el entorno virtual tenga todas las dependencias

### Error de base de datos:
- Verificar credenciales en settings_production.py
- Confirmar que la base de datos existe
- Revisar que las migraciones se ejecutaron correctamente

### Archivos estáticos no cargan:
- Ejecutar `collectstatic` nuevamente
- Verificar configuración de static files en web tab
- Verificar permisos de archivos

## 🌐 URLs importantes

- **Aplicación**: `https://tu-usuario.pythonanywhere.com`
- **Admin**: `https://tu-usuario.pythonanywhere.com/admin/`
- **API**: `https://tu-usuario.pythonanywhere.com/api/`

## 🔐 Seguridad en producción

1. ✅ DEBUG=False
2. ✅ SECRET_KEY único y seguro
3. ✅ ALLOWED_HOSTS configurado
4. ✅ CORS configurado apropiadamente
5. ✅ Base de datos con password seguro

¡Tu sistema multi-tenant Gestor POS estará funcionando en producción!
