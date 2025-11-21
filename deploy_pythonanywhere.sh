#!/bin/bash

# Script de deployment para PythonAnywhere
# Ejecutar este script en la consola de PythonAnywhere

echo "🚀 Iniciando deployment de Gestor POS en PythonAnywhere..."

# Determinar usuario de PythonAnywhere (usa $PA_USER si está exportado, o $USER)
PA_USER=${PA_USER:-$USER}
REPO_URL=${REPO_URL:-https://github.com/DALEJ-008/GESTOR-POS.git}
PYTHON=${PYTHON:-python3.10}

# 1. Clonar el repositorio (solo la primera vez)
echo "📥 Clonando/actualizando repositorio..."
cd ~
if [ ! -d "GESTOR-POS" ]; then
    git clone "$REPO_URL"
fi
cd GESTOR-POS/backend || exit 1

# Si ya existe, hacer pull de los últimos cambios
git pull origin main || true

# 2. Crear entorno virtual (solo la primera vez)
echo "🐍 Creando/activando entorno virtual..."
if [ ! -d "venv" ]; then
    $PYTHON -m venv venv
fi
source venv/bin/activate

# 3. Instalar dependencias
echo "📦 Instalando dependencias..."
pip install --upgrade pip
pip install -r requirements.txt

# 4. Configurar variables de entorno (archivo .env)
echo "⚙️ Configurando variables de entorno..."
if [ ! -f .env ]; then
    SECRET_KEY=$(python - <<'PY'
from django.core.management.utils import get_random_secret_key
print(get_random_secret_key())
PY
)
    DB_NAME="${PA_USER}\$gestor_pos"
    echo "SECRET_KEY=${SECRET_KEY}" > .env
    echo "DEBUG=False" >> .env
    echo "ALLOWED_HOSTS=${PA_USER}.pythonanywhere.com" >> .env
    echo "DB_NAME=${DB_NAME}" >> .env
    echo "DB_USER=${PA_USER}" >> .env
    echo "DB_PASSWORD=REEMPLAZA_POR_TU_PASSWORD" >> .env
    echo "DB_HOST=${PA_USER}.mysql.pythonanywhere-services.com" >> .env
    echo "DB_PORT=3306" >> .env
fi

# 5. Ejecutar migraciones
echo "🗄️ Ejecutando migraciones..."
python manage.py makemigrations
python manage.py migrate --settings=gestor_pos.settings_production

# 6. Crear superusuario (opcional)
read -p "👤 ¿Crear superusuario? (y/n) " response
if [ "$response" = "y" ]; then
    python manage.py createsuperuser --settings=gestor_pos.settings_production
fi

# 7. Recopilar archivos estáticos
echo "📁 Recopilando archivos estáticos..."
python manage.py collectstatic --noinput --settings=gestor_pos.settings_production

echo "✅ Deployment script finalizado."
echo ""
echo "📋 Próximos pasos:"
echo "1. Ve a la pestaña 'Web' en tu dashboard de PythonAnywhere"
echo "2. Configura tu aplicación web:" 
echo "   - Source code: /home/${PA_USER}/GESTOR-POS/backend"
echo "   - Working directory: /home/${PA_USER}/GESTOR-POS/backend"
echo "   - WSGI configuration file: /home/${PA_USER}/GESTOR-POS/backend/wsgi_production.py"
echo "   - Python version: 3.10"
echo "3. En 'Static files' configura:"
echo "   - URL: /static/"
echo "   - Directory: /home/${PA_USER}/GESTOR-POS/backend/staticfiles"
echo "4. Edita el archivo .env para poner tu contraseña real en DB_PASSWORD"
echo "5. ¡Recarga tu aplicación web desde la pestaña Web!"
echo "6. (Opcional) Si sirves archivos multimedia, añade mapping:" 
echo "   - URL: /media/"
echo "   - Directory: /home/${PA_USER}/GESTOR-POS/backend/media"
