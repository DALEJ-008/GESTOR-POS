from rest_framework import serializers
from .models import SupplierCategory, Supplier, SupplierContact, SupplierProduct


class SupplierCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SupplierCategory
        fields = ['id', 'name', 'description', 'is_active', 'created_at']


class SupplierContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupplierContact
        fields = ['id', 'name', 'position', 'department', 'email', 'phone', 
                 'mobile', 'extension', 'is_primary', 'notes', 'created_at']


class SupplierProductSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_sku = serializers.CharField(source='product.sku', read_only=True)

    class Meta:
        model = SupplierProduct
        fields = ['id', 'supplier', 'product', 'product_name', 'product_sku',
                 'supplier_sku', 'supplier_name', 'cost_price', 'minimum_quantity',
                 'lead_time', 'is_preferred', 'is_active', 'notes', 'created_at', 'updated_at']


class SupplierSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    display_name = serializers.ReadOnlyField()
    total_purchases = serializers.ReadOnlyField()
    current_debt = serializers.ReadOnlyField()
    available_credit = serializers.ReadOnlyField()
    contacts = SupplierContactSerializer(many=True, read_only=True)
    products = SupplierProductSerializer(many=True, read_only=True)

    class Meta:
        model = Supplier
        fields = ['id', 'company_name', 'trade_name', 'document_type', 'document_number',
                 'supplier_type', 'category', 'category_name', 'contact_name', 
                 'contact_position', 'email', 'phone', 'mobile', 'fax', 'website',
                 'address', 'city', 'state', 'postal_code', 'country', 'payment_terms',
                 'credit_limit', 'discount_percentage', 'delivery_time', 'minimum_order',
                 'bank_name', 'bank_account', 'account_type', 'is_active', 'is_preferred',
                 'rating', 'notes', 'display_name', 'total_purchases', 'current_debt',
                 'available_credit', 'contacts', 'products', 'created_at', 'updated_at']


class SupplierCreateSerializer(serializers.ModelSerializer):
    contacts = SupplierContactSerializer(many=True, required=False)

    class Meta:
        model = Supplier
        fields = ['company_name', 'trade_name', 'document_type', 'document_number',
                 'supplier_type', 'category', 'contact_name', 'contact_position', 
                 'email', 'phone', 'mobile', 'fax', 'website', 'address', 'city', 
                 'state', 'postal_code', 'country', 'payment_terms', 'credit_limit', 
                 'discount_percentage', 'delivery_time', 'minimum_order', 'bank_name', 
                 'bank_account', 'account_type', 'is_active', 'is_preferred', 'rating', 
                 'notes', 'contacts']

    def create(self, validated_data):
        contacts_data = validated_data.pop('contacts', [])
        supplier = Supplier.objects.create(**validated_data)
        
        for contact_data in contacts_data:
            SupplierContact.objects.create(supplier=supplier, **contact_data)
        
        return supplier


class SupplierListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listados"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    display_name = serializers.ReadOnlyField()

    class Meta:
        model = Supplier
        fields = ['id', 'company_name', 'trade_name', 'document_number', 'supplier_type',
                 'category_name', 'contact_name', 'email', 'phone', 'display_name',
                 'is_active', 'is_preferred', 'rating', 'created_at']
