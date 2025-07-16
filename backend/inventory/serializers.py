from rest_framework import serializers
from .models import Warehouse, Stock, StockMovement, StockAlert, InventoryAdjustment, InventoryAdjustmentItem
from products.serializers import ProductSerializer


class WarehouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Warehouse
        fields = ['id', 'name', 'address', 'is_active', 'created_at', 'updated_at']


class StockSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_sku = serializers.CharField(source='product.sku', read_only=True)
    variant_name = serializers.CharField(source='product_variant.name', read_only=True)
    warehouse_name = serializers.CharField(source='warehouse.name', read_only=True)
    available_quantity = serializers.ReadOnlyField()

    class Meta:
        model = Stock
        fields = ['id', 'product', 'product_variant', 'product_name', 'product_sku',
                 'variant_name', 'warehouse', 'warehouse_name', 'quantity', 
                 'reserved_quantity', 'available_quantity', 'updated_at']


class StockMovementSerializer(serializers.ModelSerializer):
    stock_info = serializers.SerializerMethodField()
    user_name = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = StockMovement
        fields = ['id', 'stock', 'stock_info', 'movement_type', 'quantity', 
                 'quantity_before', 'quantity_after', 'reason', 'reference', 
                 'user', 'user_name', 'created_at']

    def get_stock_info(self, obj):
        if obj.stock.product:
            return f"{obj.stock.product.name} - {obj.stock.warehouse.name}"
        elif obj.stock.product_variant:
            return f"{obj.stock.product_variant.product.name} ({obj.stock.product_variant.name}) - {obj.stock.warehouse.name}"
        return str(obj.stock)
from .models import (
    Warehouse, Stock, StockMovement, StockAlert, 
    InventoryAdjustment, InventoryAdjustmentItem
)
from products.serializers import ProductSerializer, ProductVariantSerializer


class WarehouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Warehouse
        fields = ['id', 'name', 'address', 'is_active', 'created_at', 'updated_at']


class StockSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    variant_name = serializers.CharField(source='product_variant.name', read_only=True)
    warehouse_name = serializers.CharField(source='warehouse.name', read_only=True)
    available_quantity = serializers.ReadOnlyField()
    product_details = ProductSerializer(source='product', read_only=True)
    variant_details = ProductVariantSerializer(source='product_variant', read_only=True)

    class Meta:
        model = Stock
        fields = ['id', 'product', 'product_variant', 'warehouse', 'quantity', 
                 'reserved_quantity', 'available_quantity', 'product_name', 
                 'variant_name', 'warehouse_name', 'product_details', 
                 'variant_details', 'updated_at']


class StockMovementSerializer(serializers.ModelSerializer):
    stock_info = StockSerializer(source='stock', read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = StockMovement
        fields = ['id', 'stock', 'movement_type', 'quantity', 'quantity_before',
                 'quantity_after', 'reason', 'reference', 'user', 'user_name',
                 'stock_info', 'created_at']


class StockAlertSerializer(serializers.ModelSerializer):
    stock_info = StockSerializer(source='stock', read_only=True)

    class Meta:
        model = StockAlert
        fields = ['id', 'stock', 'alert_type', 'threshold', 'is_active',
                 'stock_info', 'created_at', 'resolved_at']


class InventoryAdjustmentItemSerializer(serializers.ModelSerializer):
    stock_info = StockSerializer(source='stock', read_only=True)
    quantity_difference = serializers.ReadOnlyField()

    class Meta:
        model = InventoryAdjustmentItem
        fields = ['id', 'stock', 'quantity_before', 'quantity_after',
                 'quantity_difference', 'reason', 'stock_info']


class InventoryAdjustmentSerializer(serializers.ModelSerializer):
    items = InventoryAdjustmentItemSerializer(many=True, read_only=True)
    warehouse_name = serializers.CharField(source='warehouse.name', read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = InventoryAdjustment
        fields = ['id', 'warehouse', 'warehouse_name', 'reason', 'user',
                 'user_name', 'items', 'created_at']


class InventoryAdjustmentCreateSerializer(serializers.ModelSerializer):
    items = InventoryAdjustmentItemSerializer(many=True)

    class Meta:
        model = InventoryAdjustment
        fields = ['warehouse', 'reason', 'items']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        adjustment = InventoryAdjustment.objects.create(
            user=self.context['request'].user,
            **validated_data
        )
        
        for item_data in items_data:
            InventoryAdjustmentItem.objects.create(
                adjustment=adjustment,
                **item_data
            )
            
            # Actualizar el stock
            stock = item_data['stock']
            # Crear movimiento de stock
            StockMovement.objects.create(
                stock=stock,
                movement_type='adjustment',
                quantity=item_data['quantity_after'] - item_data['quantity_before'],
                quantity_before=item_data['quantity_before'],
                quantity_after=item_data['quantity_after'],
                reason=f"Ajuste de inventario: {validated_data['reason']}",
                reference=f"ADJ-{adjustment.id}",
                user=self.context['request'].user
            )
            
            # Actualizar cantidad en stock
            stock.quantity = item_data['quantity_after']
            stock.save()
        
        return adjustment


class StockUpdateSerializer(serializers.Serializer):
    """Serializer para actualizar stock"""
    product = serializers.IntegerField(required=False)
    product_variant = serializers.IntegerField(required=False)
    warehouse = serializers.IntegerField()
    quantity_change = serializers.IntegerField()
    movement_type = serializers.ChoiceField(choices=StockMovement.MOVEMENT_TYPES)
    reason = serializers.CharField(max_length=255)
    reference = serializers.CharField(max_length=100, required=False)

    def validate(self, data):
        if not data.get('product') and not data.get('product_variant'):
            raise serializers.ValidationError("Debe especificar un producto o una variante")
        if data.get('product') and data.get('product_variant'):
            raise serializers.ValidationError("No puede especificar tanto producto como variante")
        return data
