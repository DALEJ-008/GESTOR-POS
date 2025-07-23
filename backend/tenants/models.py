from django.db import models
from django.contrib.auth.models import User
# from tenant_schemas.models import TenantMixin  # Comentado temporalmente


class Tenant(models.Model):  # Cambiar por TenantMixin cuando esté listo
    """
    Modelo para manejar tenants (empresas) en el sistema multi-tenant
    """
    name = models.CharField(max_length=100, verbose_name="Nombre de la empresa")
    description = models.TextField(blank=True, verbose_name="Descripción")
    contact_email = models.EmailField(verbose_name="Email de contacto")
    contact_phone = models.CharField(max_length=20, blank=True, verbose_name="Teléfono")
    address = models.TextField(blank=True, verbose_name="Dirección")
    # logo = models.ImageField(upload_to='tenants/logos/', blank=True, null=True, verbose_name="Logo")
    
    # Configuraciones de negocio
    currency = models.CharField(max_length=3, default='MXN', verbose_name="Moneda")
    timezone = models.CharField(max_length=50, default='America/Mexico_City', verbose_name="Zona horaria")
    language = models.CharField(max_length=5, default='es', verbose_name="Idioma")
    
    # Configuraciones del plan
    plan = models.CharField(max_length=20, default='trial', 
                           choices=[
                               ('trial', 'Trial'),
                               ('basic', 'Básico'),
                               ('professional', 'Profesional'),
                               ('enterprise', 'Empresarial'),
                           ], verbose_name="Plan")
    max_users = models.IntegerField(default=5, verbose_name="Máximo de usuarios")
    max_products = models.IntegerField(default=1000, verbose_name="Máximo de productos")
    
    # Fechas importantes
    trial_ends = models.DateTimeField(null=True, blank=True, verbose_name="Fin del trial")
    is_active = models.BooleanField(default=True, verbose_name="Activo")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Creado en")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Actualizado en")

    class Meta:
        verbose_name = "Tenant"
        verbose_name_plural = "Tenants"

    def __str__(self):
        return self.name


class UserTenant(models.Model):
    """
    Relación entre usuarios y tenants (empresas)
    Un usuario puede pertenecer a múltiples empresas con diferentes roles
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tenants')
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='users')
    role = models.CharField(max_length=20, default='user',
                           choices=[
                               ('admin', 'Administrador'),
                               ('manager', 'Gerente'),
                               ('user', 'Usuario'),
                               ('viewer', 'Solo Lectura'),
                           ], verbose_name="Rol")
    is_active = models.BooleanField(default=True, verbose_name="Activo")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Creado en")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Actualizado en")

    class Meta:
        verbose_name = "Usuario-Tenant"
        verbose_name_plural = "Usuarios-Tenants"
        unique_together = ['user', 'tenant']  # Un usuario solo puede tener un rol por tenant

    def __str__(self):
        return f"{self.user.username} - {self.tenant.name} ({self.role})"
