from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from products.models import Product, ProductVariant


class Warehouse(models.Model):
    """Almacén o bodega"""
    name = models.CharField(max_length=100, verbose_name="Nombre")
    address = models.TextField(blank=True, null=True, verbose_name="Dirección")
    is_active = models.BooleanField(default=True, verbose_name="Activo")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Creado en")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Actualizado en")

    class Meta:
        verbose_name = "Almacén"
        verbose_name_plural = "Almacenes"
        ordering = ['name']

    def __str__(self):
        return self.name


class Stock(models.Model):
    """Stock de productos en almacenes"""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True, blank=True, verbose_name="Producto")
    product_variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE, null=True, blank=True, verbose_name="Variante")
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE, verbose_name="Almacén")
    quantity = models.PositiveIntegerField(default=0, verbose_name="Cantidad")
    reserved_quantity = models.PositiveIntegerField(default=0, verbose_name="Cantidad reservada")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Actualizado en")

    class Meta:
        verbose_name = "Stock"
        verbose_name_plural = "Stocks"
        unique_together = [
            ['product', 'warehouse'],
            ['product_variant', 'warehouse']
        ]

    def __str__(self):
        if self.product_variant:
            return f"{self.product_variant} - {self.warehouse}: {self.quantity}"
        return f"{self.product} - {self.warehouse}: {self.quantity}"

    @property
    def available_quantity(self):
        """Cantidad disponible (sin reservas)"""
        return max(0, self.quantity - self.reserved_quantity)

    def clean(self):
        """Validación: debe tener producto o variante, pero no ambos"""
        if not self.product and not self.product_variant:
            raise ValidationError("Debe especificar un producto o una variante")
        if self.product and self.product_variant:
            raise ValidationError("No puede especificar tanto producto como variante")


class StockMovement(models.Model):
    """Movimientos de inventario"""
    MOVEMENT_TYPES = [
        ('in', 'Entrada'),
        ('out', 'Salida'),
        ('transfer', 'Transferencia'),
        ('adjustment', 'Ajuste'),
        ('sale', 'Venta'),
        ('purchase', 'Compra'),
        ('return', 'Devolución'),
    ]

    stock = models.ForeignKey(Stock, on_delete=models.CASCADE, verbose_name="Stock")
    movement_type = models.CharField(max_length=20, choices=MOVEMENT_TYPES, verbose_name="Tipo de movimiento")
    quantity = models.IntegerField(verbose_name="Cantidad")  # Puede ser negativo
    quantity_before = models.PositiveIntegerField(verbose_name="Cantidad anterior")
    quantity_after = models.PositiveIntegerField(verbose_name="Cantidad posterior")
    reason = models.TextField(blank=True, null=True, verbose_name="Motivo")
    reference = models.CharField(max_length=100, blank=True, null=True, verbose_name="Referencia")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, verbose_name="Usuario")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Creado en")

    class Meta:
        verbose_name = "Movimiento de stock"
        verbose_name_plural = "Movimientos de stock"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.stock} - {self.get_movement_type_display()}: {self.quantity}"


class StockAlert(models.Model):
    """Alertas de stock"""
    ALERT_TYPES = [
        ('low_stock', 'Stock bajo'),
        ('out_of_stock', 'Sin stock'),
        ('overstock', 'Sobrestock'),
    ]

    stock = models.ForeignKey(Stock, on_delete=models.CASCADE, verbose_name="Stock")
    alert_type = models.CharField(max_length=20, choices=ALERT_TYPES, verbose_name="Tipo de alerta")
    threshold = models.PositiveIntegerField(verbose_name="Umbral")
    is_active = models.BooleanField(default=True, verbose_name="Activo")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Creado en")
    resolved_at = models.DateTimeField(null=True, blank=True, verbose_name="Resuelto en")

    class Meta:
        verbose_name = "Alerta de stock"
        verbose_name_plural = "Alertas de stock"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.stock} - {self.get_alert_type_display()}"


class InventoryAdjustment(models.Model):
    """Ajustes de inventario"""
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE, verbose_name="Almacén")
    reason = models.TextField(verbose_name="Motivo del ajuste")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, verbose_name="Usuario")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Creado en")

    class Meta:
        verbose_name = "Ajuste de inventario"
        verbose_name_plural = "Ajustes de inventario"
        ordering = ['-created_at']

    def __str__(self):
        return f"Ajuste {self.id} - {self.warehouse} - {self.created_at.strftime('%Y-%m-%d')}"


class InventoryAdjustmentItem(models.Model):
    """Elementos de ajuste de inventario"""
    adjustment = models.ForeignKey(InventoryAdjustment, on_delete=models.CASCADE, related_name='items', verbose_name="Ajuste")
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE, verbose_name="Stock")
    quantity_before = models.PositiveIntegerField(verbose_name="Cantidad anterior")
    quantity_after = models.PositiveIntegerField(verbose_name="Cantidad posterior")
    reason = models.TextField(blank=True, null=True, verbose_name="Motivo específico")

    class Meta:
        verbose_name = "Elemento de ajuste"
        verbose_name_plural = "Elementos de ajuste"

    def __str__(self):
        return f"{self.stock} - {self.quantity_before} → {self.quantity_after}"

    @property
    def quantity_difference(self):
        """Diferencia de cantidad"""
        return self.quantity_after - self.quantity_before
