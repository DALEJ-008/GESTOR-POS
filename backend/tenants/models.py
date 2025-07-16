from django.db import models
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
