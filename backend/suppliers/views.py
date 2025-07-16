from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Count, Sum, Q
from django.utils import timezone
from datetime import datetime, timedelta

from .models import Supplier, SupplierCategory, SupplierContact, SupplierProduct
from .serializers import (
    SupplierSerializer, SupplierListSerializer, SupplierCreateSerializer,
    SupplierCategorySerializer, SupplierContactSerializer, SupplierProductSerializer
)


class SupplierViewSet(viewsets.ModelViewSet):
    """ViewSet para proveedores"""
    queryset = Supplier.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'status', 'payment_terms', 'country']
    search_fields = ['name', 'nif', 'email', 'phone', 'contact_person']
    ordering_fields = ['name', 'created_at', 'credit_limit']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'create':
            return SupplierCreateSerializer
        elif self.action == 'list':
            return SupplierListSerializer
        return SupplierSerializer

    @action(detail=False, methods=['get'])
    def by_category(self, request):
        """Obtener proveedores agrupados por categoría"""
        category_id = request.query_params.get('category_id')
        
        if category_id:
            suppliers = self.queryset.filter(category_id=category_id)
            serializer = SupplierListSerializer(suppliers, many=True)
            return Response(serializer.data)
        
        # Agrupar por categorías
        categories = SupplierCategory.objects.prefetch_related('suppliers').all()
        result = []
        
        for category in categories:
            suppliers = category.suppliers.filter(status='active')[:10]
            result.append({
                'category': SupplierCategorySerializer(category).data,
                'suppliers': SupplierListSerializer(suppliers, many=True).data,
                'total_suppliers': category.suppliers.count()
            })
        
        return Response(result)

    @action(detail=False, methods=['get'])
    def active_suppliers(self, request):
        """Obtener solo proveedores activos"""
        active = self.queryset.filter(status='active')
        serializer = SupplierListSerializer(active, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def suppliers_with_debt(self, request):
        """Obtener proveedores con deuda pendiente"""
        with_debt = self.queryset.filter(current_balance__gt=0)
        serializer = SupplierListSerializer(with_debt, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def products(self, request, pk=None):
        """Obtener productos de un proveedor específico"""
        supplier = self.get_object()
        products = SupplierProduct.objects.filter(supplier=supplier)
        serializer = SupplierProductSerializer(products, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def statistics(self, request, pk=None):
        """Estadísticas del proveedor"""
        supplier = self.get_object()
        
        # Aquí conectarías con el módulo de compras cuando esté disponible
        stats = {
            'total_products': supplier.supplierproduct_set.count(),
            'active_products': supplier.supplierproduct_set.filter(is_active=True).count(),
            'current_balance': supplier.current_balance,
            'credit_limit': supplier.credit_limit,
            'available_credit': supplier.credit_limit - supplier.current_balance if supplier.credit_limit else None,
            'contacts_count': supplier.contacts.count(),
            'created_date': supplier.created_at,
            'last_updated': supplier.updated_at
        }
        
        return Response(stats)

    @action(detail=True, methods=['post'])
    def add_product(self, request, pk=None):
        """Agregar producto a proveedor"""
        supplier = self.get_object()
        
        data = request.data.copy()
        data['supplier'] = supplier.id
        
        serializer = SupplierProductSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SupplierCategoryViewSet(viewsets.ModelViewSet):
    """ViewSet para categorías de proveedores"""
    queryset = SupplierCategory.objects.all()
    serializer_class = SupplierCategorySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']

    @action(detail=True, methods=['get'])
    def suppliers_count(self, request, pk=None):
        """Contar proveedores en la categoría"""
        category = self.get_object()
        count = category.suppliers.count()
        active_count = category.suppliers.filter(status='active').count()
        
        return Response({
            'category': category.name,
            'total_suppliers': count,
            'active_suppliers': active_count,
            'inactive_suppliers': count - active_count
        })


class SupplierContactViewSet(viewsets.ModelViewSet):
    """ViewSet para contactos de proveedores"""
    queryset = SupplierContact.objects.all()
    serializer_class = SupplierContactSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['supplier', 'is_primary']
    search_fields = ['name', 'email', 'phone', 'position']
    ordering_fields = ['name', 'created_at']
    ordering = ['-is_primary', 'name']

    @action(detail=False, methods=['get'])
    def primary_contacts(self, request):
        """Obtener solo contactos principales"""
        primary = self.queryset.filter(is_primary=True)
        serializer = self.get_serializer(primary, many=True)
        return Response(serializer.data)


class SupplierProductViewSet(viewsets.ModelViewSet):
    """ViewSet para productos de proveedores"""
    queryset = SupplierProduct.objects.all()
    serializer_class = SupplierProductSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['supplier', 'product', 'is_active']
    search_fields = ['supplier__name', 'product__name', 'supplier_code']
    ordering_fields = ['cost', 'updated_at']
    ordering = ['-updated_at']

    @action(detail=False, methods=['get'])
    def by_supplier(self, request):
        """Obtener productos por proveedor"""
        supplier_id = request.query_params.get('supplier_id')
        if not supplier_id:
            return Response({'error': 'supplier_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        products = self.queryset.filter(supplier_id=supplier_id, is_active=True)
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def cheapest_suppliers(self, request):
        """Obtener los proveedores más baratos por producto"""
        product_id = request.query_params.get('product_id')
        if not product_id:
            return Response({'error': 'product_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        products = self.queryset.filter(
            product_id=product_id, 
            is_active=True
        ).order_by('cost')[:5]
        
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)
