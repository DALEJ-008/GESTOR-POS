from rest_framework import serializers
from .models import Sale, SaleItem, PaymentMethod, Payment
from customers.serializers import CustomerListSerializer
from products.serializers import ProductSerializer


class PaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethod
        fields = ['id', 'name', 'description', 'is_active', 'requires_reference', 'created_at']


class PaymentSerializer(serializers.ModelSerializer):
    payment_method_name = serializers.CharField(source='payment_method.name', read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Payment
        fields = ['id', 'sale', 'payment_method', 'payment_method_name', 'amount', 
                 'reference', 'notes', 'payment_date', 'user', 'user_name']


class SaleItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = SaleItem
        fields = ['id', 'sale', 'product', 'product_variant', 'product_name', 
                 'product_sku', 'quantity', 'unit_price', 'discount_percentage', 
                 'discount_amount', 'tax_percentage', 'tax_amount', 'line_total']

    def create(self, validated_data):
        # El cálculo de totales se hace automáticamente en el método save del modelo
        return super().create(validated_data)


class SaleSerializer(serializers.ModelSerializer):
    customer_details = CustomerListSerializer(source='customer', read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)
    items = SaleItemSerializer(many=True, read_only=True)
    payments = PaymentSerializer(many=True, read_only=True)
    pending_amount = serializers.ReadOnlyField()
    is_paid = serializers.ReadOnlyField()

    class Meta:
        model = Sale
        fields = ['id', 'sale_number', 'invoice_number', 'customer', 'customer_details',
                 'customer_name', 'customer_document', 'user', 'user_name', 'status',
                 'payment_status', 'sale_date', 'due_date', 'subtotal', 'tax_amount',
                 'discount_amount', 'total_amount', 'paid_amount', 'pending_amount',
                 'is_paid', 'notes', 'internal_notes', 'items', 'payments', 
                 'created_at', 'updated_at']


class SaleCreateSerializer(serializers.ModelSerializer):
    items = SaleItemSerializer(many=True)

    class Meta:
        model = Sale
        fields = ['customer', 'customer_name', 'customer_document', 'status',
                 'due_date', 'notes', 'internal_notes', 'items']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        validated_data['user'] = self.context['request'].user
        sale = Sale.objects.create(**validated_data)
        
        subtotal = 0
        tax_total = 0
        discount_total = 0
        
        for item_data in items_data:
            item_data['sale'] = sale
            item = SaleItem.objects.create(**item_data)
            subtotal += (item.quantity * item.unit_price)
            tax_total += item.tax_amount
            discount_total += item.discount_amount
        
        # Actualizar totales de la venta
        sale.subtotal = subtotal
        sale.tax_amount = tax_total
        sale.discount_amount = discount_total
        sale.total_amount = subtotal + tax_total - discount_total
        sale.save()
        
        return sale


class SaleListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listados"""
    customer_name_display = serializers.SerializerMethodField()
    user_name = serializers.CharField(source='user.username', read_only=True)
    pending_amount = serializers.ReadOnlyField()

    class Meta:
        model = Sale
        fields = ['id', 'sale_number', 'customer_name_display', 'user_name', 
                 'status', 'payment_status', 'sale_date', 'total_amount', 
                 'paid_amount', 'pending_amount', 'created_at']

    def get_customer_name_display(self, obj):
        if obj.customer:
            return obj.customer.display_name
        return obj.customer_name or 'Cliente general'


class PaymentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['sale', 'payment_method', 'amount', 'reference', 'notes']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        payment = Payment.objects.create(**validated_data)
        
        # Actualizar el monto pagado de la venta
        sale = payment.sale
        sale.paid_amount += payment.amount
        sale.save()
        
        return payment
