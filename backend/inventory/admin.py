from django.contrib import admin
from .models import (
    Warehouse, Stock, StockMovement, StockAlert,
    InventoryAdjustment, InventoryAdjustmentItem
)


@admin.register(Warehouse)
class WarehouseAdmin(admin.ModelAdmin):
    list_display = ['name', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'address']


@admin.register(Stock)
class StockAdmin(admin.ModelAdmin):
    list_display = ['__str__', 'quantity', 'reserved_quantity', 'available_quantity', 'updated_at']
    list_filter = ['warehouse', 'product__category', 'updated_at']
    search_fields = ['product__name', 'product_variant__name', 'product__sku']
    readonly_fields = ['available_quantity']


@admin.register(StockMovement)
class StockMovementAdmin(admin.ModelAdmin):
    list_display = ['stock', 'movement_type', 'quantity', 'quantity_before', 'quantity_after', 'user', 'created_at']
    list_filter = ['movement_type', 'created_at', 'stock__warehouse']
    search_fields = ['reason', 'reference', 'stock__product__name']
    readonly_fields = ['quantity_before', 'quantity_after', 'created_at']


@admin.register(StockAlert)
class StockAlertAdmin(admin.ModelAdmin):
    list_display = ['stock', 'alert_type', 'threshold', 'is_active', 'created_at']
    list_filter = ['alert_type', 'is_active', 'created_at']
    search_fields = ['stock__product__name', 'stock__product_variant__name']


class InventoryAdjustmentItemInline(admin.TabularInline):
    model = InventoryAdjustmentItem
    extra = 0
    readonly_fields = ['quantity_difference']


@admin.register(InventoryAdjustment)
class InventoryAdjustmentAdmin(admin.ModelAdmin):
    list_display = ['id', 'warehouse', 'user', 'created_at']
    list_filter = ['warehouse', 'created_at', 'user']
    search_fields = ['reason']
    readonly_fields = ['created_at']
    inlines = [InventoryAdjustmentItemInline]
