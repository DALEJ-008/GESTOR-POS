from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.db import connection
# from tenant_schemas.utils import schema_context  # Comentado temporalmente
from .models import Tenant
from .serializers import TenantSerializer, TenantCreateSerializer


class TenantListView(generics.ListAPIView):
    """Lista de tenants - solo para administradores globales"""
    queryset = Tenant.objects.all()
    serializer_class = TenantSerializer


class TenantDetailView(generics.RetrieveUpdateAPIView):
    """Detalle y actualización de tenant"""
    queryset = Tenant.objects.all()
    serializer_class = TenantSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def create_tenant(request):
    """
    Crear un nuevo tenant (empresa)
    Este endpoint permite el registro de nuevas empresas
    """
    serializer = TenantCreateSerializer(data=request.data)
    
    if serializer.is_valid():
        # Crear el tenant
        tenant = serializer.save()
        
        return Response({
            'message': 'Tenant creado exitosamente',
            'tenant': TenantSerializer(tenant).data,
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def tenant_info(request):
    """
    Obtener información del tenant actual
    """
    return Response({
        'message': 'Información de tenant disponible cuando se configure multi-tenancy'
    })


@api_view(['POST'])
def switch_tenant(request):
    """
    Cambiar de tenant (para usuarios con acceso a múltiples tenants)
    """
    return Response({
        'message': 'Cambio de tenant disponible cuando se configure multi-tenancy'
    })
