from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .models import UserSession


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer para registro de nuevos usuarios"""
    password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = [
            'username', 'email', 'first_name', 'last_name', 
            'password', 'confirm_password'
        ]
    
    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Las contraseñas no coinciden")
        
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError("Este email ya está registrado")
        
        if User.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError("Este nombre de usuario ya existe")
            
        return data
    
    def create(self, validated_data):
        validated_data.pop('confirm_password')
        password = validated_data.pop('password')
        
        user = User.objects.create_user(
            password=password,
            **validated_data
        )
        return user


class UserLoginSerializer(serializers.Serializer):
    """Serializer para login de usuarios"""
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            
            if not user:
                raise serializers.ValidationError("Credenciales inválidas")
            
            if not user.is_active:
                raise serializers.ValidationError("Cuenta desactivada")
                
            data['user'] = user
        else:
            raise serializers.ValidationError("Nombre de usuario y contraseña son requeridos")
            
        return data


class UserSerializer(serializers.ModelSerializer):
    """Serializer para información de usuario"""
    full_name = serializers.SerializerMethodField()
    permissions = serializers.SerializerMethodField()
    role = serializers.SerializerMethodField()
    language = serializers.SerializerMethodField()
    timezone = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'full_name',
            'is_active', 'date_joined', 'last_login', 'permissions', 'role',
            'language', 'timezone'
        ]
        read_only_fields = ['id', 'username', 'date_joined', 'last_login']
    
    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip()
    
    def get_permissions(self, obj):
        """Devolver permisos basados en si es staff/superuser"""
        if obj.is_superuser:
            return {
                'can_manage_products': True,
                'can_manage_inventory': True,
                'can_make_sales': True,
                'can_view_reports': True,
                'can_manage_users': True,
                'can_manage_settings': True,
            }
        elif obj.is_staff:
            return {
                'can_manage_products': True,
                'can_manage_inventory': True,
                'can_make_sales': True,
                'can_view_reports': True,
                'can_manage_users': False,
                'can_manage_settings': False,
            }
        else:
            return {
                'can_manage_products': False,
                'can_manage_inventory': False,
                'can_make_sales': True,
                'can_view_reports': False,
                'can_manage_users': False,
                'can_manage_settings': False,
            }
    
    def get_role(self, obj):
        """Devolver rol del usuario"""
        if obj.is_superuser:
            return 'admin'
        elif obj.is_staff:
            return 'manager'
        else:
            return 'employee'
    
    def get_language(self, obj):
        return 'es'  # Por defecto español
    
    def get_timezone(self, obj):
        return 'America/Mexico_City'  # Por defecto Mexico


class UserUpdateSerializer(serializers.ModelSerializer):
    """Serializer para actualización de perfil de usuario"""
    
    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'email'
        ]


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer para cambio de contraseña"""
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError("Las contraseñas nuevas no coinciden")
        return data
    
    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Contraseña actual incorrecta")
        return value
