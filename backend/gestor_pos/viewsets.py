from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .middleware import get_current_tenant


class TenantAwareViewSet(viewsets.ModelViewSet):
    """
    ViewSet base que maneja automáticamente el aislamiento por tenant
    Todos los ViewSets que hereden de este tendrán aislamiento automático
    """
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """
        Override del get_queryset para asegurar aislamiento por tenant
        """
        if hasattr(self, 'queryset') and self.queryset is not None:
            # Si el modelo usa TenantAwareManager, este ya filtra automáticamente
            return self.queryset._clone()
        
        # Fallback: usar el modelo directamente
        if hasattr(self, 'serializer_class') and self.serializer_class:
            model = self.serializer_class.Meta.model
            return model.objects.all()
        
        raise NotImplementedError("Debe definir queryset o serializer_class")
    
    def perform_create(self, serializer):
        """
        Override para establecer automáticamente el tenant y usuario al crear
        """
        current_tenant = get_current_tenant()
        if current_tenant and hasattr(serializer.instance, 'tenant'):
            serializer.save(tenant=current_tenant)
        else:
            serializer.save()
    
    def perform_update(self, serializer):
        """
        Override para asegurar que no se puede cambiar el tenant al actualizar
        """
        # Evitar que se cambie el tenant en actualizaciones
        if hasattr(serializer.instance, 'tenant'):
            current_tenant = get_current_tenant()
            if current_tenant:
                serializer.save(tenant=current_tenant)
            else:
                # Mantener el tenant original si no hay uno actual
                serializer.save()
        else:
            serializer.save()


class TenantAwareReadOnlyViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet de solo lectura que maneja automáticamente el aislamiento por tenant
    """
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """
        Override del get_queryset para asegurar aislamiento por tenant
        """
        if hasattr(self, 'queryset') and self.queryset is not None:
            # Si el modelo usa TenantAwareManager, este ya filtra automáticamente
            return self.queryset._clone()
        
        # Fallback: usar el modelo directamente
        if hasattr(self, 'serializer_class') and self.serializer_class:
            model = self.serializer_class.Meta.model
            return model.objects.all()
        
        raise NotImplementedError("Debe definir queryset o serializer_class")
