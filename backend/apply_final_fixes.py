#!/usr/bin/env python
"""
Script para aplicar todas las correcciones de tenant isolation en los modelos
"""

import os
import sys
import re

# Agregar el directorio del proyecto al path
sys.path.append('/workspaces/GESTOR-POS/backend')

def fix_sales_models():
    """Corregir modelos de sales"""
    file_path = '/workspaces/GESTOR-POS/backend/sales/models.py'
    
    # Leer el archivo
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Agregar import si no existe
    if 'TenantAwareManager' not in content:
        content = content.replace(
            'from gestor_pos.models import TenantAwareModel, TenantAwareManager',
            'from gestor_pos.models import TenantAwareModel, TenantAwareManager'
        )
    
    # Reemplazar todas las clases Model por TenantAwareModel y agregar managers
    replacements = [
        # Sale ya está parcialmente corregido, solo agregar manager
        (r'(class Sale\(TenantAwareModel\):.*?\n)(.*?)(class Meta:)', 
         r'\1\2    # Manager personalizado para filtrado automático por tenant\n    objects = TenantAwareManager()\n\n    \3'),
        
        # Corregir SaleItem
        (r'class SaleItem\(models\.Model\):', 'class SaleItem(TenantAwareModel):'),
        
        # Corregir PaymentMethod
        (r'class PaymentMethod\(models\.Model\):', 'class PaymentMethod(TenantAwareModel):'),
        
        # Corregir Payment
        (r'class Payment\(models\.Model\):', 'class Payment(TenantAwareModel):'),
    ]
    
    for pattern, replacement in replacements:
        content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    
    # Agregar managers a todas las clases que heredan de TenantAwareModel
    models_to_fix = ['SaleItem', 'PaymentMethod', 'Payment']
    
    for model in models_to_fix:
        # Buscar la definición de la clase y agregar manager antes de class Meta
        pattern = f'(class {model}\\(TenantAwareModel\\):.*?)(    class Meta:)'
        replacement = f'\\1    # Manager personalizado para filtrado automático por tenant\\n    objects = TenantAwareManager()\\n\\n\\2'
        content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    
    # Corregir unique_together para Sale
    content = re.sub(
        r"sale_number = models\.CharField\(max_length=50, verbose_name=\"Número de venta\"\)",
        'sale_number = models.CharField(max_length=50, verbose_name="Número de venta")',
        content
    )
    
    # Agregar unique_together para tenant
    content = re.sub(
        r'(class Sale\(TenantAwareModel\):.*?class Meta:.*?ordering = \[.*?\])',
        r'\1\n        unique_together = [\'tenant\', \'sale_number\']  # Número único por tenant',
        content,
        flags=re.DOTALL
    )
    
    # Escribir el archivo corregido
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ Modelos de sales corregidos")

def fix_authentication_models():
    """Corregir modelos de authentication"""
    file_path = '/workspaces/GESTOR-POS/backend/authentication/models.py'
    
    # Leer el archivo
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Agregar imports
    if 'TenantAwareModel' not in content:
        content = content.replace(
            'from django.db import models',
            'from django.db import models\nfrom gestor_pos.models import TenantAwareModel, TenantAwareManager'
        )
    
    # Reemplazar UserSession
    content = re.sub(
        r'class UserSession\(models\.Model\):',
        'class UserSession(TenantAwareModel):',
        content
    )
    
    # Agregar manager
    content = re.sub(
        r'(class UserSession\(TenantAwareModel\):.*?)(    class Meta:)',
        r'\1    # Manager personalizado para filtrado automático por tenant\n    objects = TenantAwareManager()\n\n\2',
        content,
        flags=re.DOTALL
    )
    
    # Escribir el archivo corregido
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ Modelos de authentication corregidos")

def main():
    """Función principal"""
    print("🔧 Aplicando correcciones finales a los modelos...")
    
    try:
        fix_sales_models()
        fix_authentication_models()
        print("\n✅ Todas las correcciones aplicadas exitosamente!")
        print("\n📋 Próximos pasos:")
        print("1. Ejecutar: python manage.py makemigrations")
        print("2. Ejecutar: python manage.py migrate")
        print("3. Verificar con: python fix_tenant_isolation.py")
        
    except Exception as e:
        print(f"❌ Error aplicando correcciones: {e}")

if __name__ == '__main__':
    main()
