from django.utils.deprecation import MiddlewareMixin
from django.contrib.auth.models import User
from tenants.models import Tenant
import threading

# Thread-local storage para el tenant actual
_thread_locals = threading.local()

def get_current_tenant():
    """Obtiene el tenant actual del thread local"""
    return getattr(_thread_locals, 'tenant', None)

def set_current_tenant(tenant):
    """Establece el tenant actual en el thread local"""
    _thread_locals.tenant = tenant

def get_current_user():
    """Obtiene el usuario actual del thread local"""
    return getattr(_thread_locals, 'user', None)

def set_current_user(user):
    """Establece el usuario actual en el thread local"""
    _thread_locals.user = user


class TenantMiddleware(MiddlewareMixin):
    """
    Middleware para establecer el tenant actual basado en el usuario autenticado
    """
    
    def process_request(self, request):
        # Limpiar thread locals al inicio de cada request
        set_current_tenant(None)
        set_current_user(None)
        
        # Si el usuario está autenticado
        if request.user and request.user.is_authenticated:
            set_current_user(request.user)
            
            # Obtener o crear el tenant para este usuario
            # Por simplicidad, cada usuario tendrá su propio tenant
            tenant, created = Tenant.objects.get_or_create(
                name=f"Empresa de {request.user.username}",
                defaults={
                    'contact_email': request.user.email or f"{request.user.username}@example.com",
                    'description': f"Empresa personal de {request.user.get_full_name() or request.user.username}",
                }
            )
            
            # Asociar el usuario con el tenant si no existe la relación
            from tenants.models import UserTenant
            UserTenant.objects.get_or_create(
                user=request.user,
                tenant=tenant,
                defaults={'role': 'admin'}  # El usuario es admin de su propia empresa
            )
            
            set_current_tenant(tenant)
        
        return None
