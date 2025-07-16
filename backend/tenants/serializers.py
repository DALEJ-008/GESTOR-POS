from rest_framework import serializers
from .models import Tenant


class TenantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tenant
        fields = [
            'id', 'name', 'description', 'contact_email', 'contact_phone', 
            'address', 'logo', 'currency', 'timezone', 'language', 'plan', 
            'max_users', 'max_products', 'trial_ends', 'is_active', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class TenantCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear nuevos tenants"""
    confirm_email = serializers.EmailField(write_only=True)
    
    class Meta:
        model = Tenant
        fields = [
            'name', 'description', 'contact_email', 'confirm_email', 
            'contact_phone', 'address', 'currency', 'timezone', 'language'
        ]
    
    def validate(self, data):
        if data['contact_email'] != data['confirm_email']:
            raise serializers.ValidationError(
                "Los emails de contacto no coinciden"
            )
        return data
    
    def create(self, validated_data):
        validated_data.pop('confirm_email')
        return super().create(validated_data)
