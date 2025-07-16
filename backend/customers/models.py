from django.db import models
from django.core.validators import EmailValidator, RegexValidator


class CustomerGroup(models.Model):
    """Grupo de clientes"""
    name = models.CharField(max_length=100, verbose_name="Nombre")
    description = models.TextField(blank=True, null=True, verbose_name="Descripción")
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0, verbose_name="Descuento (%)")
    is_active = models.BooleanField(default=True, verbose_name="Activo")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Creado en")

    class Meta:
        verbose_name = "Grupo de cliente"
        verbose_name_plural = "Grupos de clientes"
        ordering = ['name']

    def __str__(self):
        return self.name


class Customer(models.Model):
    """Cliente"""
    DOCUMENT_TYPES = [
        ('cedula', 'Cédula'),
        ('rif', 'RIF'),
        ('passport', 'Pasaporte'),
        ('other', 'Otro'),
    ]

    # Información básica
    first_name = models.CharField(max_length=100, verbose_name="Nombre")
    last_name = models.CharField(max_length=100, verbose_name="Apellido")
    company_name = models.CharField(max_length=200, blank=True, null=True, verbose_name="Nombre de empresa")
    document_type = models.CharField(max_length=20, choices=DOCUMENT_TYPES, default='cedula', verbose_name="Tipo de documento")
    document_number = models.CharField(max_length=50, unique=True, verbose_name="Número de documento")
    
    # Contacto
    email = models.EmailField(blank=True, null=True, validators=[EmailValidator()], verbose_name="Email")
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name="Teléfono")
    mobile = models.CharField(max_length=20, blank=True, null=True, verbose_name="Móvil")
    
    # Dirección
    address = models.TextField(blank=True, null=True, verbose_name="Dirección")
    city = models.CharField(max_length=100, blank=True, null=True, verbose_name="Ciudad")
    state = models.CharField(max_length=100, blank=True, null=True, verbose_name="Estado")
    postal_code = models.CharField(max_length=20, blank=True, null=True, verbose_name="Código postal")
    country = models.CharField(max_length=100, default='Venezuela', verbose_name="País")
    
    # Información comercial
    customer_group = models.ForeignKey(CustomerGroup, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Grupo")
    credit_limit = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name="Límite de crédito")
    payment_terms = models.PositiveIntegerField(default=0, verbose_name="Términos de pago (días)")
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0, verbose_name="Descuento personalizado (%)")
    
    # Estado
    is_active = models.BooleanField(default=True, verbose_name="Activo")
    is_vip = models.BooleanField(default=False, verbose_name="VIP")
    notes = models.TextField(blank=True, null=True, verbose_name="Notas")
    
    # Fechas
    birth_date = models.DateField(blank=True, null=True, verbose_name="Fecha de nacimiento")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Creado en")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Actualizado en")

    class Meta:
        verbose_name = "Cliente"
        verbose_name_plural = "Clientes"
        ordering = ['first_name', 'last_name']

    def __str__(self):
        if self.company_name:
            return f"{self.company_name} ({self.document_number})"
        return f"{self.first_name} {self.last_name} ({self.document_number})"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()

    @property
    def display_name(self):
        return self.company_name if self.company_name else self.full_name

    @property
    def total_purchases(self):
        """Total de compras del cliente"""
        # Se calculará con el módulo de ventas
        return 0

    @property
    def last_purchase_date(self):
        """Fecha de última compra"""
        # Se calculará con el módulo de ventas
        return None

    @property
    def current_debt(self):
        """Deuda actual del cliente"""
        # Se calculará con el módulo de ventas y pagos
        return 0

    @property
    def available_credit(self):
        """Crédito disponible"""
        return max(0, self.credit_limit - self.current_debt)

    def get_effective_discount(self):
        """Obtener descuento efectivo (personal o del grupo)"""
        if self.discount_percentage > 0:
            return self.discount_percentage
        elif self.customer_group and self.customer_group.discount_percentage > 0:
            return self.customer_group.discount_percentage
        return 0


class CustomerAddress(models.Model):
    """Direcciones adicionales del cliente"""
    ADDRESS_TYPES = [
        ('billing', 'Facturación'),
        ('shipping', 'Envío'),
        ('work', 'Trabajo'),
        ('other', 'Otra'),
    ]

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='addresses', verbose_name="Cliente")
    address_type = models.CharField(max_length=20, choices=ADDRESS_TYPES, verbose_name="Tipo de dirección")
    label = models.CharField(max_length=100, verbose_name="Etiqueta")
    address = models.TextField(verbose_name="Dirección")
    city = models.CharField(max_length=100, verbose_name="Ciudad")
    state = models.CharField(max_length=100, verbose_name="Estado")
    postal_code = models.CharField(max_length=20, blank=True, null=True, verbose_name="Código postal")
    country = models.CharField(max_length=100, default='Venezuela', verbose_name="País")
    is_default = models.BooleanField(default=False, verbose_name="Dirección por defecto")
    is_active = models.BooleanField(default=True, verbose_name="Activo")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Creado en")

    class Meta:
        verbose_name = "Dirección de cliente"
        verbose_name_plural = "Direcciones de clientes"

    def __str__(self):
        return f"{self.customer} - {self.label}"


class CustomerContact(models.Model):
    """Contactos adicionales del cliente"""
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='contacts', verbose_name="Cliente")
    name = models.CharField(max_length=200, verbose_name="Nombre del contacto")
    position = models.CharField(max_length=100, blank=True, null=True, verbose_name="Cargo")
    email = models.EmailField(blank=True, null=True, verbose_name="Email")
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name="Teléfono")
    mobile = models.CharField(max_length=20, blank=True, null=True, verbose_name="Móvil")
    is_primary = models.BooleanField(default=False, verbose_name="Contacto principal")
    notes = models.TextField(blank=True, null=True, verbose_name="Notas")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Creado en")

    class Meta:
        verbose_name = "Contacto de cliente"
        verbose_name_plural = "Contactos de clientes"

    def __str__(self):
        return f"{self.customer} - {self.name}"
