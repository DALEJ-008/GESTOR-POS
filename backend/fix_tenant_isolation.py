#!/usr/bin/env python
"""
Script para verificar y corregir el aislamiento de datos por tenant
Este script verifica que todos los modelos tengan el campo tenant
y aplica las migraciones necesarias
"""

import os
import sys
import django

# Agregar el directorio del proyecto al path
sys.path.append('/workspaces/GESTOR-POS/backend')

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gestor_pos.settings')
django.setup()

from django.core.management import call_command
from django.db import models
from django.apps import apps
from gestor_pos.models import TenantAwareModel

def check_tenant_isolation():
    """
    Verifica que todos los modelos relevantes hereden de TenantAwareModel
    """
    print("=== Verificando aislamiento por tenant ===\n")
    
    # Obtener todas las apps que deben tener aislamiento
    tenant_apps = [
        'products', 'inventory', 'customers', 'suppliers', 
        'sales', 'authentication'
    ]
    
    issues_found = []
    
    for app_name in tenant_apps:
        try:
            app_config = apps.get_app_config(app_name)
            models_list = app_config.get_models()
            
            print(f"📦 Verificando app: {app_name}")
            
            for model in models_list:
                model_name = f"{app_name}.{model.__name__}"
                
                # Verificar si hereda de TenantAwareModel
                if issubclass(model, TenantAwareModel):
                    print(f"  ✅ {model_name} - Tiene aislamiento por tenant")
                else:
                    # Verificar si tiene campo tenant manualmente
                    if hasattr(model, 'tenant'):
                        print(f"  ⚠️  {model_name} - Tiene campo tenant pero no hereda de TenantAwareModel")
                    else:
                        print(f"  ❌ {model_name} - NO tiene aislamiento por tenant")
                        issues_found.append(model_name)
            
            print()
            
        except Exception as e:
            print(f"❌ Error verificando app {app_name}: {e}\n")
    
    if issues_found:
        print("🚨 PROBLEMAS ENCONTRADOS:")
        for issue in issues_found:
            print(f"  - {issue}")
        print("\nEstos modelos necesitan heredar de TenantAwareModel para tener aislamiento correcto.\n")
    else:
        print("✅ Todos los modelos tienen aislamiento por tenant correctamente configurado.\n")
    
    return len(issues_found) == 0

def apply_migrations():
    """
    Aplica las migraciones necesarias
    """
    print("=== Aplicando migraciones ===\n")
    
    try:
        # Hacer migraciones para tenants primero
        print("📝 Creando migraciones para tenants...")
        call_command('makemigrations', 'tenants', verbosity=1)
        
        # Hacer migraciones para todas las apps
        print("📝 Creando migraciones para todas las apps...")
        call_command('makemigrations', verbosity=1)
        
        # Aplicar migraciones
        print("🔄 Aplicando migraciones...")
        call_command('migrate', verbosity=1)
        
        print("✅ Migraciones aplicadas correctamente.\n")
        return True
        
    except Exception as e:
        print(f"❌ Error aplicando migraciones: {e}\n")
        return False

def create_sample_data():
    """
    Crea datos de ejemplo para testing
    """
    print("=== Creando datos de ejemplo ===\n")
    
    try:
        from django.contrib.auth.models import User
        from tenants.models import Tenant, UserTenant
        from products.models import Category, Brand, Product
        
        # Crear usuarios de prueba
        users_data = [
            {'username': 'empresa1', 'email': 'empresa1@test.com', 'password': 'test123'},
            {'username': 'empresa2', 'email': 'empresa2@test.com', 'password': 'test123'},
        ]
        
        for user_data in users_data:
            user, created = User.objects.get_or_create(
                username=user_data['username'],
                defaults={
                    'email': user_data['email'],
                    'is_active': True
                }
            )
            if created:
                user.set_password(user_data['password'])
                user.save()
                print(f"✅ Usuario creado: {user.username}")
            else:
                print(f"ℹ️  Usuario ya existe: {user.username}")
        
        print("✅ Datos de ejemplo creados.\n")
        return True
        
    except Exception as e:
        print(f"❌ Error creando datos de ejemplo: {e}\n")
        return False

def main():
    """
    Función principal
    """
    print("🚀 Iniciando verificación de aislamiento por tenant...\n")
    
    # 1. Verificar aislamiento
    isolation_ok = check_tenant_isolation()
    
    # 2. Aplicar migraciones
    migrations_ok = apply_migrations()
    
    # 3. Crear datos de ejemplo si todo está bien
    if isolation_ok and migrations_ok:
        create_sample_data()
        print("🎉 ¡Aislamiento por tenant configurado correctamente!")
        print("\n📋 Próximos pasos:")
        print("1. Reinicia el servidor Django")
        print("2. Crea usuarios diferentes para probar el aislamiento")
        print("3. Verifica que cada usuario solo vea sus propios datos")
    else:
        print("⚠️  Se encontraron problemas que necesitan ser resueltos manualmente.")
    
    print("\n" + "="*50)

if __name__ == '__main__':
    main()
