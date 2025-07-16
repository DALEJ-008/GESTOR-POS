from django.contrib import admin
from .models import Category, Brand, Product, ProductVariant, ProductAttribute


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description']


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ['name', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description']


@admin.register(ProductAttribute)
class ProductAttributeAdmin(admin.ModelAdmin):
    list_display = ['name', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name']


class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 0
    fields = ['name', 'sku', 'cost_price', 'selling_price', 'is_active']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'sku', 'category', 'brand', 'selling_price', 'has_variants', 'is_active']
    list_filter = ['category', 'brand', 'has_variants', 'is_active', 'is_service', 'created_at']
    search_fields = ['name', 'sku', 'barcode', 'description']
    readonly_fields = ['profit_margin', 'current_stock']
    inlines = [ProductVariantInline]
    
    fieldsets = (
        ('Información básica', {
            'fields': ('name', 'description', 'category', 'brand', 'image')
        }),
        ('Códigos e identificación', {
            'fields': ('sku', 'barcode', 'unit')
        }),
        ('Precios y costos', {
            'fields': ('cost_price', 'selling_price', 'profit_margin')
        }),
        ('Inventario', {
            'fields': ('min_stock', 'max_stock', 'current_stock')
        }),
        ('Configuración', {
            'fields': ('has_variants', 'is_active', 'is_service')
        }),
    )


@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    list_display = ['name', 'product', 'sku', 'selling_price', 'is_active']
    list_filter = ['product__category', 'is_active', 'created_at']
    search_fields = ['name', 'sku', 'barcode', 'product__name']
