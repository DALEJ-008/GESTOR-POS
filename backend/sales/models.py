from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator
from decimal import Decimal
from customers.models import Customer
from products.models import Product, ProductVariant


class Sale(models.Model):
    """Venta principal"""
    STATUS_CHOICES = [
        ('draft', 'Borrador'),
        ('pending', 'Pendiente'),
        ('confirmed', 'Confirmada'),
        ('partial', 'Parcial'),
        ('completed', 'Completada'),
        ('cancelled', 'Cancelada'),
        ('refunded', 'Reembolsada'),
    ]

    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pendiente'),
        ('partial', 'Parcial'),
        ('paid', 'Pagado'),
        ('overdue', 'Vencido'),
        ('refunded', 'Reembolsado'),
    ]

    # Identificación
    sale_number = models.CharField(max_length=50, unique=True, verbose_name="Número de venta")
    invoice_number = models.CharField(max_length=50, unique=True, null=True, blank=True, verbose_name="Número de factura")
    
    # Cliente y usuario
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT, null=True, blank=True, verbose_name="Cliente")
    customer_name = models.CharField(max_length=200, blank=True, null=True, verbose_name="Nombre del cliente")
    customer_document = models.CharField(max_length=50, blank=True, null=True, verbose_name="Documento del cliente")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, verbose_name="Vendedor")
    
    # Estado y fechas
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft', verbose_name="Estado")
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending', verbose_name="Estado de pago")
    sale_date = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de venta")
    due_date = models.DateField(null=True, blank=True, verbose_name="Fecha de vencimiento")
    
    # Montos
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name="Subtotal")
    tax_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name="Impuestos")
    discount_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name="Descuento")
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name="Total")
    paid_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name="Monto pagado")
    
    # Información adicional
    notes = models.TextField(blank=True, null=True, verbose_name="Notas")
    internal_notes = models.TextField(blank=True, null=True, verbose_name="Notas internas")
    
    # Fechas de control
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Creado en")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Actualizado en")

    class Meta:
        verbose_name = "Venta"
        verbose_name_plural = "Ventas"
        ordering = ['-sale_date']

    def __str__(self):
        return f"Venta {self.sale_number} - {self.customer_name or 'Cliente general'}"

    @property
    def pending_amount(self):
        """Monto pendiente de pago"""
        return self.total_amount - self.paid_amount

    @property
    def is_paid(self):
        """Verifica si está pagado completamente"""
        return self.paid_amount >= self.total_amount

    def save(self, *args, **kwargs):
        if not self.sale_number:
            # Generar número de venta automático
            last_sale = Sale.objects.filter(sale_number__startswith='V').order_by('-id').first()
            if last_sale:
                last_number = int(last_sale.sale_number[1:])
                self.sale_number = f"V{last_number + 1:06d}"
            else:
                self.sale_number = "V000001"
        
        # Actualizar estado de pago
        if self.paid_amount >= self.total_amount:
            self.payment_status = 'paid'
        elif self.paid_amount > 0:
            self.payment_status = 'partial'
        else:
            self.payment_status = 'pending'
            
        super().save(*args, **kwargs)


class SaleItem(models.Model):
    """Elementos de la venta"""
    sale = models.ForeignKey(Sale, on_delete=models.CASCADE, related_name='items', verbose_name="Venta")
    product = models.ForeignKey(Product, on_delete=models.PROTECT, null=True, blank=True, verbose_name="Producto")
    product_variant = models.ForeignKey(ProductVariant, on_delete=models.PROTECT, null=True, blank=True, verbose_name="Variante")
    product_name = models.CharField(max_length=200, verbose_name="Nombre del producto")
    product_sku = models.CharField(max_length=50, blank=True, null=True, verbose_name="SKU")
    
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(1)], verbose_name="Cantidad")
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.00'))], verbose_name="Precio unitario")
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0, verbose_name="Descuento (%)")
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name="Descuento")
    tax_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0, verbose_name="Impuesto (%)")
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name="Impuesto")
    line_total = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name="Total línea")

    class Meta:
        verbose_name = "Elemento de venta"
        verbose_name_plural = "Elementos de venta"

    def __str__(self):
        return f"{self.product_name} x {self.quantity}"

    def save(self, *args, **kwargs):
        # Calcular totales automáticamente
        subtotal = self.quantity * self.unit_price
        self.discount_amount = (subtotal * self.discount_percentage) / 100
        subtotal_after_discount = subtotal - self.discount_amount
        self.tax_amount = (subtotal_after_discount * self.tax_percentage) / 100
        self.line_total = subtotal_after_discount + self.tax_amount
        super().save(*args, **kwargs)


class PaymentMethod(models.Model):
    """Métodos de pago"""
    name = models.CharField(max_length=100, verbose_name="Nombre")
    description = models.TextField(blank=True, null=True, verbose_name="Descripción")
    is_active = models.BooleanField(default=True, verbose_name="Activo")
    requires_reference = models.BooleanField(default=False, verbose_name="Requiere referencia")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Creado en")

    class Meta:
        verbose_name = "Método de pago"
        verbose_name_plural = "Métodos de pago"
        ordering = ['name']

    def __str__(self):
        return self.name


class Payment(models.Model):
    """Pagos de ventas"""
    sale = models.ForeignKey(Sale, on_delete=models.CASCADE, related_name='payments', verbose_name="Venta")
    payment_method = models.ForeignKey(PaymentMethod, on_delete=models.PROTECT, verbose_name="Método de pago")
    amount = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))], verbose_name="Monto")
    reference = models.CharField(max_length=100, blank=True, null=True, verbose_name="Referencia")
    notes = models.TextField(blank=True, null=True, verbose_name="Notas")
    payment_date = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de pago")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, verbose_name="Usuario")

    class Meta:
        verbose_name = "Pago"
        verbose_name_plural = "Pagos"
        ordering = ['-payment_date']

    def __str__(self):
        return f"Pago {self.sale.sale_number} - {self.amount}"
