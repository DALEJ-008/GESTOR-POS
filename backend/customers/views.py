from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Count, Sum
from .models import CustomerGroup, Customer, CustomerAddress, CustomerContact
from .serializers import (
    CustomerGroupSerializer, CustomerSerializer, CustomerCreateSerializer,
    CustomerListSerializer, CustomerAddressSerializer, CustomerContactSerializer
)


class CustomerGroupViewSet(viewsets.ModelViewSet):
    queryset = CustomerGroup.objects.all()
    serializer_class = CustomerGroupSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'discount_percentage', 'created_at']
    ordering = ['name']


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.select_related('customer_group').prefetch_related('addresses', 'contacts')
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['customer_group', 'document_type', 'is_active', 'is_vip', 'city', 'state']
    search_fields = ['first_name', 'last_name', 'company_name', 'document_number', 'email', 'phone']
    ordering_fields = ['first_name', 'last_name', 'company_name', 'created_at']
    ordering = ['first_name', 'last_name']

    def get_serializer_class(self):
        if self.action == 'create':
            return CustomerCreateSerializer
        elif self.action == 'list':
            return CustomerListSerializer
        return CustomerSerializer

    @action(detail=False, methods=['get'])
    def search_by_document(self, request):
        """Buscar cliente por documento"""
        document = request.query_params.get('document')
        if not document:
            return Response({'error': 'Número de documento requerido'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        try:
            customer = Customer.objects.get(document_number=document, is_active=True)
            serializer = self.get_serializer(customer)
            return Response(serializer.data)
        except Customer.DoesNotExist:
            return Response({'error': 'Cliente no encontrado'}, 
                          status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'])
    def vip_customers(self, request):
        """Clientes VIP"""
        customers = self.get_queryset().filter(is_vip=True, is_active=True)
        serializer = CustomerSummarySerializer(customers, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def with_debt(self, request):
        """Clientes con deuda"""
        # Esta funcionalidad se implementará con el módulo de ventas
        customers = self.get_queryset().filter(is_active=True)
        serializer = CustomerSummarySerializer(customers, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Estadísticas de clientes"""
        total_customers = self.get_queryset().filter(is_active=True).count()
        vip_customers = self.get_queryset().filter(is_vip=True, is_active=True).count()
        customers_with_credit = self.get_queryset().filter(credit_limit__gt=0, is_active=True).count()
        
        # Agrupados por estado
        by_state = self.get_queryset().filter(is_active=True).values('state').annotate(
            count=Count('id')
        ).order_by('-count')[:10]
        
        # Agrupados por grupo
        by_group = self.get_queryset().filter(is_active=True).values(
            'customer_group__name'
        ).annotate(count=Count('id')).order_by('-count')
        
        return Response({
            'total_customers': total_customers,
            'vip_customers': vip_customers,
            'customers_with_credit': customers_with_credit,
            'by_state': list(by_state),
            'by_group': list(by_group)
        })

    @action(detail=True, methods=['get'])
    def purchase_history(self, request, pk=None):
        """Historial de compras del cliente"""
        customer = self.get_object()
        # Esta funcionalidad se implementará con el módulo de ventas
        return Response({
            'customer': CustomerSummarySerializer(customer).data,
            'purchases': [],
            'total_amount': 0,
            'total_purchases': 0
        })


class CustomerAddressViewSet(viewsets.ModelViewSet):
    queryset = CustomerAddress.objects.select_related('customer')
    serializer_class = CustomerAddressSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['customer', 'address_type', 'is_default', 'is_active', 'city', 'state']
    search_fields = ['label', 'address', 'city']

    @action(detail=False, methods=['get'])
    def by_customer(self, request):
        """Direcciones por cliente"""
        customer_id = request.query_params.get('customer')
        if not customer_id:
            return Response({'error': 'ID de cliente requerido'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        addresses = self.get_queryset().filter(customer_id=customer_id, is_active=True)
        serializer = self.get_serializer(addresses, many=True)
        return Response(serializer.data)


class CustomerContactViewSet(viewsets.ModelViewSet):
    queryset = CustomerContact.objects.select_related('customer')
    serializer_class = CustomerContactSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['customer', 'is_primary']
    search_fields = ['name', 'position', 'email', 'phone']

    @action(detail=False, methods=['get'])
    def by_customer(self, request):
        """Contactos por cliente"""
        customer_id = request.query_params.get('customer')
        if not customer_id:
            return Response({'error': 'ID de cliente requerido'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        contacts = self.get_queryset().filter(customer_id=customer_id)
        serializer = self.get_serializer(contacts, many=True)
        return Response(serializer.data)
