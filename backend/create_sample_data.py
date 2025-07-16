"""
Script para crear datos de prueba del sistema POS
"""
import os
import sys
import django

# Configurar Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gestor_pos.settings')
django.setup()

from django.contrib.auth.models import User
from products.models import Category, Brand, Product, ProductVariant
from customers.models import CustomerGroup, Customer, CustomerAddress
from suppliers.models import SupplierCategory, Supplier, SupplierContact, SupplierProduct
from sales.models import PaymentMethod
from inventory.models import Warehouse, Stock
from decimal import Decimal


def create_sample_data():
    print("Creando datos de prueba...")
    
    # Crear superusuario si no existe
    if not User.objects.filter(username='admin').exists():
        admin = User.objects.create_superuser(
            username='admin',
            email='admin@pos.com',
            password='admin123'
        )
        print("✓ Superusuario 'admin' creado")
    
    # Crear categorías de productos
    categories_data = [
        {'name': 'Bebidas', 'description': 'Bebidas frías y calientes'},
        {'name': 'Snacks', 'description': 'Aperitivos y golosinas'},
        {'name': 'Lácteos', 'description': 'Productos lácteos'},
        {'name': 'Panadería', 'description': 'Pan y productos de panadería'},
        {'name': 'Limpieza', 'description': 'Productos de limpieza'},
    ]
    
    for cat_data in categories_data:
        category, created = Category.objects.get_or_create(
            name=cat_data['name'],
            defaults={'description': cat_data['description']}
        )
        if created:
            print(f"✓ Categoría '{category.name}' creada")
    
    # Crear marcas
    brands_data = [
        {'name': 'Coca-Cola', 'description': 'Bebidas refrescantes'},
        {'name': 'Pepsi', 'description': 'Bebidas refrescantes'},
        {'name': 'Bimbo', 'description': 'Productos de panadería'},
        {'name': 'Lala', 'description': 'Productos lácteos'},
        {'name': 'Sabritas', 'description': 'Snacks y botanas'},
    ]
    
    for brand_data in brands_data:
        brand, created = Brand.objects.get_or_create(
            name=brand_data['name'],
            defaults={'description': brand_data['description']}
        )
        if created:
            print(f"✓ Marca '{brand.name}' creada")
    
    # Crear productos
    products_data = [
        {
            'name': 'Coca-Cola 600ml',
            'category': 'Bebidas',
            'brand': 'Coca-Cola',
            'sku': 'CC600',
            'cost': Decimal('15.00'),
            'selling_price': Decimal('20.00'),
            'min_stock': 20,
            'description': 'Refresco de cola 600ml'
        },
        {
            'name': 'Pepsi 600ml',
            'category': 'Bebidas',
            'brand': 'Pepsi',
            'sku': 'PP600',
            'cost': Decimal('14.50'),
            'selling_price': Decimal('20.00'),
            'min_stock': 20,
            'description': 'Refresco de cola 600ml'
        },
        {
            'name': 'Pan Blanco',
            'category': 'Panadería',
            'brand': 'Bimbo',
            'sku': 'PB001',
            'cost': Decimal('25.00'),
            'selling_price': Decimal('35.00'),
            'min_stock': 15,
            'description': 'Pan de caja blanco'
        },
        {
            'name': 'Leche Entera 1L',
            'category': 'Lácteos',
            'brand': 'Lala',
            'sku': 'LE1L',
            'cost': Decimal('20.00'),
            'selling_price': Decimal('28.00'),
            'min_stock': 30,
            'description': 'Leche entera 1 litro'
        },
        {
            'name': 'Papas Sabritas',
            'category': 'Snacks',
            'brand': 'Sabritas',
            'sku': 'PS001',
            'cost': Decimal('8.00'),
            'selling_price': Decimal('12.00'),
            'min_stock': 50,
            'description': 'Papas fritas sabor natural'
        }
    ]
    
    for prod_data in products_data:
        category = Category.objects.get(name=prod_data['category'])
        brand = Brand.objects.get(name=prod_data['brand'])
        
        product, created = Product.objects.get_or_create(
            sku=prod_data['sku'],
            defaults={
                'name': prod_data['name'],
                'category': category,
                'brand': brand,
            'cost_price': prod_data['cost'],
                'selling_price': prod_data['selling_price'],
                'min_stock': prod_data['min_stock'],
                'description': prod_data['description']
            }
        )
        if created:
            print(f"✓ Producto '{product.name}' creado")
    
    # Crear grupos de clientes
    customer_groups_data = [
        {'name': 'General', 'description': 'Clientes generales', 'discount_percentage': Decimal('0')},
        {'name': 'VIP', 'description': 'Clientes VIP', 'discount_percentage': Decimal('5')},
        {'name': 'Mayoreo', 'description': 'Clientes mayoristas', 'discount_percentage': Decimal('10')},
    ]
    
    for group_data in customer_groups_data:
        group, created = CustomerGroup.objects.get_or_create(
            name=group_data['name'],
            defaults={
                'description': group_data['description'],
                'discount_percentage': group_data['discount_percentage']
            }
        )
        if created:
            print(f"✓ Grupo de cliente '{group.name}' creado")
    
    # Crear clientes
    customers_data = [
        {
            'first_name': 'Cliente',
            'last_name': 'General',
            'email': 'general@cliente.com',
            'phone': '+52 55 1234 5678',
            'group': 'General',
            'document_type': 'rfc',
            'document_number': 'XAXX010101000'
        },
        {
            'first_name': 'María',
            'last_name': 'González',
            'email': 'maria@email.com',
            'phone': '+52 55 2345 6789',
            'group': 'VIP',
            'document_type': 'rfc',
            'document_number': 'GOMA850315HM2'
        },
        {
            'first_name': 'Juan',
            'last_name': 'Pérez',
            'email': 'juan@email.com',
            'phone': '+52 55 3456 7890',
            'group': 'Mayoreo',
            'document_type': 'rfc',
            'document_number': 'PEJJ801010HM1'
        }
    ]
    
    for cust_data in customers_data:
        group = CustomerGroup.objects.get(name=cust_data['group'])
        
        customer, created = Customer.objects.get_or_create(
            document_number=cust_data['document_number'],
            defaults={
                'first_name': cust_data['first_name'],
                'last_name': cust_data['last_name'],
                'email': cust_data['email'],
                'phone': cust_data['phone'],
                'customer_group': group,
                'document_type': cust_data['document_type']
            }
        )
        if created:
            print(f"✓ Cliente '{customer.first_name} {customer.last_name}' creado")
    
    # Crear categorías de proveedores
    supplier_categories_data = [
        {'name': 'Bebidas', 'description': 'Proveedores de bebidas'},
        {'name': 'Abarrotes', 'description': 'Proveedores de abarrotes'},
        {'name': 'Panadería', 'description': 'Proveedores de productos de panadería'},
    ]
    
    for cat_data in supplier_categories_data:
        category, created = SupplierCategory.objects.get_or_create(
            name=cat_data['name'],
            defaults={'description': cat_data['description']}
        )
        if created:
            print(f"✓ Categoría de proveedor '{category.name}' creada")
    
    # Crear proveedores
    suppliers_data = [
        {
            'company_name': 'Distribuidora Coca-Cola',
            'document_number': 'CCM850101XX1',
            'email': 'ventas@cocacola.com',
            'phone': '+52 55 5555 0001',
            'category': 'Bebidas',
            'contact_name': 'Carlos Vendor',
            'payment_terms': 30,
            'credit_limit': Decimal('50000.00')
        },
        {
            'company_name': 'Grupo Bimbo S.A.',
            'document_number': 'GBM850202XX2',
            'email': 'pedidos@bimbo.com',
            'phone': '+52 55 5555 0002',
            'category': 'Panadería',
            'contact_name': 'Ana Distribución',
            'payment_terms': 15,
            'credit_limit': Decimal('30000.00')
        },
        {
            'company_name': 'Abarrotes del Centro',
            'document_number': 'ADC850303XX3',
            'email': 'compras@abarrotes.com',
            'phone': '+52 55 5555 0003',
            'category': 'Abarrotes',
            'contact_name': 'Luis Mayoreo',
            'payment_terms': 30,
            'credit_limit': Decimal('75000.00')
        }
    ]
    
    for supp_data in suppliers_data:
        category = SupplierCategory.objects.get(name=supp_data['category'])
        
        supplier, created = Supplier.objects.get_or_create(
            document_number=supp_data['document_number'],
            defaults={
                'company_name': supp_data['company_name'],
                'email': supp_data['email'],
                'phone': supp_data['phone'],
                'category': category,
                'contact_name': supp_data['contact_name'],
                'payment_terms': supp_data['payment_terms'],
                'credit_limit': supp_data['credit_limit']
            }
        )
        if created:
            print(f"✓ Proveedor '{supplier.company_name}' creado")
    
    # Crear métodos de pago
    payment_methods_data = [
        {'name': 'Efectivo', 'description': 'Pago en efectivo', 'is_active': True},
        {'name': 'Tarjeta de Débito', 'description': 'Pago con tarjeta de débito', 'is_active': True},
        {'name': 'Tarjeta de Crédito', 'description': 'Pago con tarjeta de crédito', 'is_active': True},
        {'name': 'Transferencia', 'description': 'Transferencia bancaria', 'is_active': True},
    ]
    
    for method_data in payment_methods_data:
        method, created = PaymentMethod.objects.get_or_create(
            name=method_data['name'],
            defaults={
                'description': method_data['description'],
                'is_active': method_data['is_active']
            }
        )
        if created:
            print(f"✓ Método de pago '{method.name}' creado")
    
    # Crear almacén principal
    warehouse, created = Warehouse.objects.get_or_create(
        name='Almacén Principal',
        defaults={
            'address': 'Calle Principal #123'
        }
    )
    if created:
        print(f"✓ Almacén '{warehouse.name}' creado")
    
    # Crear stock inicial
    products = Product.objects.all()
    for product in products:
        stock, created = Stock.objects.get_or_create(
            product=product,
            warehouse=warehouse,
            defaults={'quantity': 100}  # Stock inicial de 100 unidades
        )
        if created:
            print(f"✓ Stock para '{product.name}' creado (100 unidades)")
    
    print("\n🎉 ¡Datos de prueba creados exitosamente!")
    print("\nCredenciales de administrador:")
    print("Usuario: admin")
    print("Contraseña: admin123")
    print("\nPuedes acceder al admin en: http://localhost:8000/admin/")


if __name__ == '__main__':
    create_sample_data()
