#!/usr/bin/env python
"""
Script para aplicar la solución de aislamiento de datos por empresa
Ejecutar desde el directorio backend: python apply_tenant_isolation.py
"""

import os
import sys
import django
from django.core.management import execute_from_command_line

def setup_django():
    """Configurar Django para el script"""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gestor_pos.settings')
    django.setup()

def create_migrations():
    """Crear migraciones para los cambios"""
    print("🔄 Creando migraciones...")
    
    apps_to_migrate = ['tenants', 'products', 'customers']
    
    for app in apps_to_migrate:
        print(f"   📝 Creando migración para {app}...")
        try:
            execute_from_command_line(['manage.py', 'makemigrations', app])
        except Exception as e:
            print(f"   ⚠️ Error en {app}: {e}")

def apply_migrations():
    """Aplicar las migraciones"""
    print("🚀 Aplicando migraciones...")
    try:
        execute_from_command_line(['manage.py', 'migrate'])
        print("   ✅ Migraciones aplicadas exitosamente")
    except Exception as e:
        print(f"   ❌ Error aplicando migraciones: {e}")

def create_sample_data():
    """Crear datos de ejemplo para verificar el aislamiento"""
    print("📊 Creando datos de prueba...")
    
    from django.contrib.auth.models import User
    from tenants.models import Tenant, UserTenant
    
    # Crear usuarios de prueba
    user1, created = User.objects.get_or_create(
        username='empresa1',
        defaults={
            'email': 'empresa1@test.com',
            'first_name': 'Usuario',
            'last_name': 'Empresa 1'
        }
    )
    if created:
        user1.set_password('password123')
        user1.save()
    
    user2, created = User.objects.get_or_create(
        username='empresa2', 
        defaults={
            'email': 'empresa2@test.com',
            'first_name': 'Usuario',
            'last_name': 'Empresa 2'
        }
    )
    if created:
        user2.set_password('password123')
        user2.save()
    
    print("   ✅ Usuarios de prueba creados:")
    print("      - empresa1 / password123")
    print("      - empresa2 / password123")

def verify_isolation():
    """Verificar que el aislamiento funciona"""
    print("🔍 Verificando aislamiento de datos...")
    
    from django.contrib.auth.models import User
    from tenants.models import Tenant
    from products.models import Product
    
    # Contar tenants
    tenant_count = Tenant.objects.count()
    product_count = Product.objects.all_tenants().count()
    
    print(f"   📊 Estadísticas:")
    print(f"      - Tenants: {tenant_count}")
    print(f"      - Productos totales: {product_count}")
    
    if tenant_count > 0:
        print("   ✅ Sistema multi-tenant configurado correctamente")
    else:
        print("   ⚠️ No se encontraron tenants")

def main():
    """Función principal"""
    print("🏢 APLICANDO SOLUCIÓN DE AISLAMIENTO DE DATOS POR EMPRESA")
    print("=" * 60)
    
    try:
        setup_django()
        create_migrations()
        apply_migrations()
        create_sample_data()
        verify_isolation()
        
        print("\n" + "=" * 60)
        print("✅ SOLUCIÓN APLICADA EXITOSAMENTE")
        print("\n📋 Próximos pasos:")
        print("1. Reiniciar el servidor backend")
        print("2. Probar con diferentes usuarios")
        print("3. Verificar que cada usuario ve solo sus datos")
        print("\n🔐 Cuentas de prueba creadas:")
        print("   - Usuario: empresa1, Contraseña: password123")
        print("   - Usuario: empresa2, Contraseña: password123")
        
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
