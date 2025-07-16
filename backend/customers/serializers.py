from rest_framework import serializers
from .models import CustomerGroup, Customer, CustomerAddress, CustomerContact


class CustomerGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerGroup
        fields = ['id', 'name', 'description', 'discount_percentage', 'is_active', 'created_at']


class CustomerAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerAddress
        fields = ['id', 'address_type', 'label', 'address', 'city', 'state', 
                 'postal_code', 'country', 'is_default', 'is_active', 'created_at']


class CustomerContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerContact
        fields = ['id', 'name', 'position', 'email', 'phone', 'mobile', 
                 'is_primary', 'notes', 'created_at']


class CustomerSerializer(serializers.ModelSerializer):
    group_name = serializers.CharField(source='customer_group.name', read_only=True)
    full_name = serializers.ReadOnlyField()
    display_name = serializers.ReadOnlyField()
    total_purchases = serializers.ReadOnlyField()
    current_debt = serializers.ReadOnlyField()
    available_credit = serializers.ReadOnlyField()
    effective_discount = serializers.SerializerMethodField()
    addresses = CustomerAddressSerializer(many=True, read_only=True)
    contacts = CustomerContactSerializer(many=True, read_only=True)

    class Meta:
        model = Customer
        fields = ['id', 'first_name', 'last_name', 'company_name', 'document_type', 
                 'document_number', 'email', 'phone', 'mobile', 'address', 'city', 
                 'state', 'postal_code', 'country', 'customer_group', 'group_name',
                 'credit_limit', 'payment_terms', 'discount_percentage', 'is_active', 
                 'is_vip', 'notes', 'birth_date', 'full_name', 'display_name',
                 'total_purchases', 'current_debt', 'available_credit', 
                 'effective_discount', 'addresses', 'contacts', 'created_at', 'updated_at']

    def get_effective_discount(self, obj):
        return obj.get_effective_discount()


class CustomerCreateSerializer(serializers.ModelSerializer):
    addresses = CustomerAddressSerializer(many=True, required=False)
    contacts = CustomerContactSerializer(many=True, required=False)

    class Meta:
        model = Customer
        fields = ['first_name', 'last_name', 'company_name', 'document_type', 
                 'document_number', 'email', 'phone', 'mobile', 'address', 'city', 
                 'state', 'postal_code', 'country', 'customer_group', 'credit_limit', 
                 'payment_terms', 'discount_percentage', 'is_active', 'is_vip', 
                 'notes', 'birth_date', 'addresses', 'contacts']

    def create(self, validated_data):
        addresses_data = validated_data.pop('addresses', [])
        contacts_data = validated_data.pop('contacts', [])
        
        customer = Customer.objects.create(**validated_data)
        
        for address_data in addresses_data:
            CustomerAddress.objects.create(customer=customer, **address_data)
        
        for contact_data in contacts_data:
            CustomerContact.objects.create(customer=customer, **contact_data)
        
        return customer


class CustomerListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listados"""
    group_name = serializers.CharField(source='customer_group.name', read_only=True)
    full_name = serializers.ReadOnlyField()
    display_name = serializers.ReadOnlyField()

    class Meta:
        model = Customer
        fields = ['id', 'first_name', 'last_name', 'company_name', 'document_number', 
                 'email', 'phone', 'group_name', 'full_name', 'display_name', 
                 'is_active', 'is_vip', 'created_at']
from .models import CustomerGroup, Customer, CustomerAddress, CustomerContact


class CustomerGroupSerializer(serializers.ModelSerializer):
    customer_count = serializers.SerializerMethodField()

    class Meta:
        model = CustomerGroup
        fields = ['id', 'name', 'description', 'discount_percentage', 'is_active',
                 'customer_count', 'created_at']

    def get_customer_count(self, obj):
        return obj.customer_set.filter(is_active=True).count()


class CustomerAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerAddress
        fields = ['id', 'customer', 'address_type', 'label', 'address', 'city',
                 'state', 'postal_code', 'country', 'is_default', 'is_active', 'created_at']


class CustomerContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerContact
        fields = ['id', 'customer', 'name', 'position', 'email', 'phone',
                 'mobile', 'is_primary', 'notes', 'created_at']


class CustomerSerializer(serializers.ModelSerializer):
    group_name = serializers.CharField(source='customer_group.name', read_only=True)
    full_name = serializers.ReadOnlyField()
    display_name = serializers.ReadOnlyField()
    total_purchases = serializers.ReadOnlyField()
    last_purchase_date = serializers.ReadOnlyField()
    current_debt = serializers.ReadOnlyField()
    available_credit = serializers.ReadOnlyField()
    effective_discount = serializers.SerializerMethodField()
    addresses = CustomerAddressSerializer(many=True, read_only=True)
    contacts = CustomerContactSerializer(many=True, read_only=True)

    class Meta:
        model = Customer
        fields = ['id', 'first_name', 'last_name', 'company_name', 'document_type',
                 'document_number', 'email', 'phone', 'mobile', 'address', 'city',
                 'state', 'postal_code', 'country', 'customer_group', 'group_name',
                 'credit_limit', 'payment_terms', 'discount_percentage', 'is_active',
                 'is_vip', 'notes', 'birth_date', 'full_name', 'display_name',
                 'total_purchases', 'last_purchase_date', 'current_debt',
                 'available_credit', 'effective_discount', 'addresses', 'contacts',
                 'created_at', 'updated_at']

    def get_effective_discount(self, obj):
        return obj.get_effective_discount()


class CustomerCreateSerializer(serializers.ModelSerializer):
    addresses = CustomerAddressSerializer(many=True, required=False)
    contacts = CustomerContactSerializer(many=True, required=False)

    class Meta:
        model = Customer
        fields = ['first_name', 'last_name', 'company_name', 'document_type',
                 'document_number', 'email', 'phone', 'mobile', 'address', 'city',
                 'state', 'postal_code', 'country', 'customer_group', 'credit_limit',
                 'payment_terms', 'discount_percentage', 'is_active', 'is_vip',
                 'notes', 'birth_date', 'addresses', 'contacts']

    def create(self, validated_data):
        addresses_data = validated_data.pop('addresses', [])
        contacts_data = validated_data.pop('contacts', [])
        
        customer = Customer.objects.create(**validated_data)
        
        for address_data in addresses_data:
            CustomerAddress.objects.create(customer=customer, **address_data)
        
        for contact_data in contacts_data:
            CustomerContact.objects.create(customer=customer, **contact_data)
        
        return customer


class CustomerSummarySerializer(serializers.ModelSerializer):
    """Serializer simplificado para listas y referencias"""
    full_name = serializers.ReadOnlyField()
    display_name = serializers.ReadOnlyField()

    class Meta:
        model = Customer
        fields = ['id', 'first_name', 'last_name', 'company_name', 'document_number',
                 'email', 'phone', 'full_name', 'display_name', 'is_active', 'is_vip']
