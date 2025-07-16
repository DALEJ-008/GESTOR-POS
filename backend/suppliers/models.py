from django.db import models
from django.core.validators import EmailValidator


class SupplierCategory(models.Model):
    """Categoría de proveedores"""
    name = models.CharField(max_length=100, verbose_name="Nombre")
    description = models.TextField(blank=True, null=True, verbose_name="Descripción")
    is_active = models.BooleanField(default=True, verbose_name="Activo")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Creado en")

    class Meta:
        verbose_name = "Categoría de proveedor"
        verbose_name_plural = "Categorías de proveedores"
        ordering = ['name']

    def __str__(self):
        return self.name


class Supplier(models.Model):
    """Proveedor"""
    DOCUMENT_TYPES = [
        ('rif', 'RIF'),
        ('cedula', 'Cédula'),
        ('passport', 'Pasaporte'),
        ('other', 'Otro'),
    ]

    SUPPLIER_TYPES = [
        ('manufacturer', 'Fabricante'),
        ('distributor', 'Distribuidor'),
        ('wholesaler', 'Mayorista'),
        ('retailer', 'Minorista'),
        ('service', 'Servicio'),
        ('other', 'Otro'),
    ]

    # Información básica
    company_name = models.CharField(max_length=200, verbose_name="Nombre de empresa")
    trade_name = models.CharField(max_length=200, blank=True, null=True, verbose_name="Nombre comercial")
    document_type = models.CharField(max_length=20, choices=DOCUMENT_TYPES, default='rif', verbose_name="Tipo de documento")
    document_number = models.CharField(max_length=50, unique=True, verbose_name="Número de documento")
    supplier_type = models.CharField(max_length=20, choices=SUPPLIER_TYPES, default='distributor', verbose_name="Tipo de proveedor")
    category = models.ForeignKey(SupplierCategory, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Categoría")
    
    # Contacto principal
    contact_name = models.CharField(max_length=200, verbose_name="Nombre del contacto")
    contact_position = models.CharField(max_length=100, blank=True, null=True, verbose_name="Cargo del contacto")
    email = models.EmailField(blank=True, null=True, validators=[EmailValidator()], verbose_name="Email")
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name="Teléfono")
    mobile = models.CharField(max_length=20, blank=True, null=True, verbose_name="Móvil")
    fax = models.CharField(max_length=20, blank=True, null=True, verbose_name="Fax")
    website = models.URLField(blank=True, null=True, verbose_name="Sitio web")
    
    # Dirección
    address = models.TextField(blank=True, null=True, verbose_name="Dirección")
    city = models.CharField(max_length=100, blank=True, null=True, verbose_name="Ciudad")
    state = models.CharField(max_length=100, blank=True, null=True, verbose_name="Estado")
    postal_code = models.CharField(max_length=20, blank=True, null=True, verbose_name="Código postal")
    country = models.CharField(max_length=100, default='Venezuela', verbose_name="País")
    
    # Información comercial
    payment_terms = models.PositiveIntegerField(default=30, verbose_name="Términos de pago (días)")
    credit_limit = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name="Límite de crédito")
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0, verbose_name="Descuento (%)")
    delivery_time = models.PositiveIntegerField(default=7, verbose_name="Tiempo de entrega (días)")
    minimum_order = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name="Pedido mínimo")
    
    # Información bancaria
    bank_name = models.CharField(max_length=100, blank=True, null=True, verbose_name="Banco")
    bank_account = models.CharField(max_length=50, blank=True, null=True, verbose_name="Número de cuenta")
    account_type = models.CharField(max_length=50, blank=True, null=True, verbose_name="Tipo de cuenta")
    
    # Estado y notas
    is_active = models.BooleanField(default=True, verbose_name="Activo")
    is_preferred = models.BooleanField(default=False, verbose_name="Proveedor preferido")
    rating = models.PositiveIntegerField(default=5, choices=[(i, str(i)) for i in range(1, 6)], verbose_name="Calificación")
    notes = models.TextField(blank=True, null=True, verbose_name="Notas")
    
    # Fechas
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Creado en")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Actualizado en")

    class Meta:
        verbose_name = "Proveedor"
        verbose_name_plural = "Proveedores"
        ordering = ['company_name']

    def __str__(self):
        return f"{self.company_name} ({self.document_number})"

    @property
    def display_name(self):
        return self.trade_name if self.trade_name else self.company_name

    @property
    def total_purchases(self):
        """Total de compras al proveedor"""
        # Se calculará con el módulo de compras
        return 0

    @property
    def last_purchase_date(self):
        """Fecha de última compra"""
        # Se calculará con el módulo de compras
        return None

    @property
    def current_debt(self):
        """Deuda actual con el proveedor"""
        # Se calculará con el módulo de compras y pagos
        return 0

    @property
    def available_credit(self):
        """Crédito disponible"""
        return max(0, self.credit_limit - self.current_debt)


class SupplierContact(models.Model):
    """Contactos adicionales del proveedor"""
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE, related_name='contacts', verbose_name="Proveedor")
    name = models.CharField(max_length=200, verbose_name="Nombre del contacto")
    position = models.CharField(max_length=100, blank=True, null=True, verbose_name="Cargo")
    department = models.CharField(max_length=100, blank=True, null=True, verbose_name="Departamento")
    email = models.EmailField(blank=True, null=True, verbose_name="Email")
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name="Teléfono")
    mobile = models.CharField(max_length=20, blank=True, null=True, verbose_name="Móvil")
    extension = models.CharField(max_length=10, blank=True, null=True, verbose_name="Extensión")
    is_primary = models.BooleanField(default=False, verbose_name="Contacto principal")
    notes = models.TextField(blank=True, null=True, verbose_name="Notas")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Creado en")

    class Meta:
        verbose_name = "Contacto de proveedor"
        verbose_name_plural = "Contactos de proveedores"

    def __str__(self):
        return f"{self.supplier} - {self.name}"


class SupplierProduct(models.Model):
    """Productos ofrecidos por el proveedor"""
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE, related_name='products', verbose_name="Proveedor")
    product = models.ForeignKey('products.Product', on_delete=models.CASCADE, verbose_name="Producto")
    supplier_sku = models.CharField(max_length=100, verbose_name="SKU del proveedor")
    supplier_name = models.CharField(max_length=200, verbose_name="Nombre según proveedor")
    cost_price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Precio de costo")
    minimum_quantity = models.PositiveIntegerField(default=1, verbose_name="Cantidad mínima")
    lead_time = models.PositiveIntegerField(default=7, verbose_name="Tiempo de entrega (días)")
    is_preferred = models.BooleanField(default=False, verbose_name="Proveedor preferido para este producto")
    is_active = models.BooleanField(default=True, verbose_name="Activo")
    notes = models.TextField(blank=True, null=True, verbose_name="Notas")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Creado en")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Actualizado en")

    class Meta:
        verbose_name = "Producto de proveedor"
        verbose_name_plural = "Productos de proveedores"
        unique_together = ['supplier', 'product']

    def __str__(self):
        return f"{self.supplier} - {self.product}"
