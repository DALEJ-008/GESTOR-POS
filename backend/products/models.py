from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal
from gestor_pos.models import TenantAwareModel, TenantAwareManager


class Category(TenantAwareModel):
    """Categoría de productos - Aislada por tenant"""
    name = models.CharField(max_length=100, verbose_name="Nombre")
    description = models.TextField(blank=True, null=True, verbose_name="Descripción")
    is_active = models.BooleanField(default=True, verbose_name="Activo")

    # Manager personalizado para filtrado automático por tenant
    objects = TenantAwareManager()

    class Meta:
        verbose_name = "Categoría"
        verbose_name_plural = "Categorías"
        ordering = ['name']
        unique_together = ['tenant', 'name']  # Nombre único por tenant

    def __str__(self):
        return f"{self.name} ({self.tenant.name})"


class Brand(TenantAwareModel):
    """Marca de productos - Aislada por tenant"""
    name = models.CharField(max_length=100, verbose_name="Nombre")
    description = models.TextField(blank=True, null=True, verbose_name="Descripción")
    is_active = models.BooleanField(default=True, verbose_name="Activo")

    # Manager personalizado para filtrado automático por tenant
    objects = TenantAwareManager()

    class Meta:
        verbose_name = "Marca"
        verbose_name_plural = "Marcas"
        ordering = ['name']
        unique_together = ['tenant', 'name']  # Nombre único por tenant

    def __str__(self):
        return f"{self.name} ({self.tenant.name})"


class Product(TenantAwareModel):
    """Producto principal - Aislado por tenant"""
    UNIT_CHOICES = [
        ('unit', 'Unidad'),
        ('kg', 'Kilogramo'),
        ('g', 'Gramo'),
        ('l', 'Litro'),
        ('ml', 'Mililitro'),
        ('m', 'Metro'),
        ('cm', 'Centímetro'),
        ('box', 'Caja'),
    ]

    name = models.CharField(max_length=200, verbose_name="Nombre")
    description = models.TextField(blank=True, null=True, verbose_name="Descripción")
    category = models.ForeignKey(Category, on_delete=models.CASCADE, verbose_name="Categoría")
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE, null=True, blank=True, verbose_name="Marca")
    sku = models.CharField(max_length=50, verbose_name="SKU")
    barcode = models.CharField(max_length=100, null=True, blank=True, verbose_name="Código de barras")
    unit = models.CharField(max_length=10, choices=UNIT_CHOICES, default='unit', verbose_name="Unidad")
    cost_price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.00'))], verbose_name="Precio de costo")
    selling_price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.00'))], verbose_name="Precio de venta")
    min_stock = models.PositiveIntegerField(default=0, verbose_name="Stock mínimo")
    max_stock = models.PositiveIntegerField(default=1000, verbose_name="Stock máximo")
    has_variants = models.BooleanField(default=False, verbose_name="Tiene variantes")
    is_active = models.BooleanField(default=True, verbose_name="Activo")
    is_service = models.BooleanField(default=False, verbose_name="Es servicio")
    # image = models.ImageField(upload_to='products/', null=True, blank=True, verbose_name="Imagen")

    # Manager personalizado para filtrado automático por tenant
    objects = TenantAwareManager()

    class Meta:
        verbose_name = "Producto"
        verbose_name_plural = "Productos"
        ordering = ['name']
        unique_together = ['tenant', 'sku']  # SKU único por tenant

    def __str__(self):
        return f"{self.name} ({self.sku}) - {self.tenant.name}"

    @property
    def profit_margin(self):
        """Calcular margen de ganancia"""
        if self.cost_price > 0:
            return ((self.selling_price - self.cost_price) / self.cost_price) * 100
        return 0

    @property
    def current_stock(self):
        """Stock actual del producto"""
        # Esto se calculará con el módulo de inventario
        return 0


class ProductVariant(TenantAwareModel):
    """Variante de producto (talla, color, etc.) - Aislada por tenant"""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants', verbose_name="Producto")
    name = models.CharField(max_length=100, verbose_name="Nombre de variante")
    sku = models.CharField(max_length=50, verbose_name="SKU de variante")
    barcode = models.CharField(max_length=100, null=True, blank=True, verbose_name="Código de barras")
    cost_price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.00'))], verbose_name="Precio de costo")
    selling_price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.00'))], verbose_name="Precio de venta")
    is_active = models.BooleanField(default=True, verbose_name="Activo")

    # Manager personalizado para filtrado automático por tenant
    objects = TenantAwareManager()

    class Meta:
        verbose_name = "Variante de producto"
        verbose_name_plural = "Variantes de producto"
        ordering = ['name']
        unique_together = ['tenant', 'sku']  # SKU único por tenant

    def __str__(self):
        return f"{self.product.name} - {self.name} ({self.tenant.name})"

    @property
    def current_stock(self):
        """Stock actual de la variante"""
        # Esto se calculará con el módulo de inventario
        return 0


class ProductAttribute(TenantAwareModel):
    """Atributos de productos (color, talla, material, etc.) - Aislados por tenant"""
    name = models.CharField(max_length=50, verbose_name="Nombre del atributo")
    values = models.JSONField(default=list, verbose_name="Valores posibles")
    is_active = models.BooleanField(default=True, verbose_name="Activo")

    # Manager personalizado para filtrado automático por tenant
    objects = TenantAwareManager()

    class Meta:
        verbose_name = "Atributo de producto"
        verbose_name_plural = "Atributos de producto"

    def __str__(self):
        return self.name
