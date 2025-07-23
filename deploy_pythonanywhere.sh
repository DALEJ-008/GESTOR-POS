#!/bin/bash

# Script de deployment para PythonAnywhere
# Ejecutar este script en la consola de PythonAnywhere

echo "🚀 Iniciando deployment de Gestor POS en PythonAnywhere..."

# 1. Clonar el repositorio (solo la primera vez)
echo "📥 Clonando repositorio..."
cd ~
git clone https://github.com/DALEJ-008/GESTOR-POS.git
cd GESTOR-POS/backend

# Si ya existe, hacer pull de los últimos cambios
# cd ~/GESTOR-POS
# git pull origin main
# cd backend

# 2. Crear entorno virtual (solo la primera vez)
echo "🐍 Creando entorno virtual..."
python3.10 -m venv venv
source venv/bin/activate

# 3. Instalar dependencias
echo "📦 Instalando dependencias..."
pip install --upgrade pip
pip install -r requirements.txt

# 4. Configurar variables de entorno
echo "⚙️ Configurando variables de entorno..."
# Crear archivo .env si no existe
if [ ! -f .env ]; then
    echo "SECRET_KEY=$(python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')" > .env
    echo "DEBUG=False" >> .env
    echo "ALLOWED_HOSTS=tu-usuario.pythonanywhere.com" >> .env
    echo "DATABASE_URL=mysql://tu-usuario:tu-password@tu-usuario.mysql.pythonanywhere-services.com/tu-usuario\$gestor_pos" >> .env
fi

# 5. Ejecutar migraciones
echo "🗄️ Ejecutando migraciones..."
python manage.py makemigrations
python manage.py migrate --settings=gestor_pos.settings_production

# 6. Crear superusuario (opcional)
echo "👤 ¿Crear superusuario? (y/n)"
read -r response
if [[ "$response" = "y" ]]; then
    python manage.py createsuperuser --settings=gestor_pos.settings_production
fi

# 7. Recopilar archivos estáticos
echo "📁 Recopilando archivos estáticos..."
python manage.py collectstatic --noinput --settings=gestor_pos.settings_production

echo "✅ Deployment completado!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Ve a la pestaña 'Web' en tu dashboard de PythonAnywhere"
echo "2. Configura tu aplicación web:"
echo "   - Source code: /home/tu-usuario/GESTOR-POS/backend"
echo "   - Working directory: /home/tu-usuario/GESTOR-POS/backend"
echo "   - WSGI configuration file: /home/tu-usuario/GESTOR-POS/backend/wsgi_production.py"
echo "   - Python version: 3.10"
echo "3. En 'Static files' configura:"
echo "   - URL: /static/"
echo "   - Directory: /home/tu-usuario/GESTOR-POS/backend/staticfiles"
echo "4. ¡Recarga tu aplicación web!"
