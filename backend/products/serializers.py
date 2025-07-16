from rest_framework import serializers
from .models import Category, Brand, Product, ProductVariant, ProductAttribute


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'is_active', 'created_at', 'updated_at']


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ['id', 'name', 'description', 'is_active', 'created_at', 'updated_at']


class ProductAttributeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductAttribute
        fields = ['id', 'name', 'values', 'is_active', 'created_at']


class ProductVariantSerializer(serializers.ModelSerializer):
    current_stock = serializers.ReadOnlyField()
    
    class Meta:
        model = ProductVariant
        fields = ['id', 'product', 'name', 'sku', 'barcode', 'cost_price', 
                 'selling_price', 'current_stock', 'is_active', 'created_at', 'updated_at']


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    brand_name = serializers.CharField(source='brand.name', read_only=True)
    profit_margin = serializers.ReadOnlyField()
    current_stock = serializers.ReadOnlyField()
    variants = ProductVariantSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'category', 'category_name', 'brand', 
                 'brand_name', 'sku', 'barcode', 'unit', 'cost_price', 'selling_price',
                 'min_stock', 'max_stock', 'has_variants', 'is_active', 'is_service',
                 'profit_margin', 'current_stock', 'variants', 'created_at', 'updated_at']


class ProductCreateSerializer(serializers.ModelSerializer):
    variants = ProductVariantSerializer(many=True, required=False)

    class Meta:
        model = Product
        fields = ['name', 'description', 'category', 'brand', 'sku', 'barcode', 
                 'unit', 'cost_price', 'selling_price', 'min_stock', 'max_stock',
                 'has_variants', 'is_active', 'is_service', 'variants']

    def create(self, validated_data):
        variants_data = validated_data.pop('variants', [])
        product = Product.objects.create(**validated_data)
        
        for variant_data in variants_data:
            ProductVariant.objects.create(product=product, **variant_data)
        
        return product
