from django.db import models
from django.contrib.auth.models import User


class TenantAwareModel(models.Model):
    """
    Modelo base abstracto que incluye el tenant para aislamiento de datos
    Todos los modelos que hereden de este tendrán aislamiento automático por empresa
    """
    tenant = models.ForeignKey(
        'tenants.Tenant', 
        on_delete=models.CASCADE, 
        verbose_name="Empresa",
        help_text="Empresa a la que pertenece este registro"
    )
    created_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name="%(class)s_created",
        verbose_name="Creado por"
    )
    updated_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name="%(class)s_updated",
        verbose_name="Actualizado por"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Creado en")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Actualizado en")

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        """
        Override del save para establecer automáticamente el tenant
        """
        from gestor_pos.middleware import get_current_tenant, get_current_user
        
        # Si no se ha establecido un tenant, usar el del contexto actual
        if not self.tenant_id:
            current_tenant = get_current_tenant()
            if current_tenant:
                self.tenant = current_tenant
        
        # Establecer el usuario que crea/actualiza
        current_user = get_current_user()
        if current_user and current_user.is_authenticated:
            if not self.pk:  # Es un nuevo registro
                self.created_by = current_user
            self.updated_by = current_user
        
        super().save(*args, **kwargs)


class TenantAwareManager(models.Manager):
    """
    Manager que filtra automáticamente por el tenant actual
    """
    
    def get_queryset(self):
        """
        Filtra automáticamente por el tenant actual
        """
        from gestor_pos.middleware import get_current_tenant
        
        queryset = super().get_queryset()
        current_tenant = get_current_tenant()
        
        if current_tenant:
            return queryset.filter(tenant=current_tenant)
        
        # Si no hay tenant actual, devolver queryset vacío para seguridad
        return queryset.none()
    
    def all_tenants(self):
        """
        Método para obtener datos de todos los tenants (solo para administradores)
        """
        return super().get_queryset()
    
    def for_tenant(self, tenant):
        """
        Método para obtener datos de un tenant específico
        """
        return super().get_queryset().filter(tenant=tenant)
