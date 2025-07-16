from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import Category, Brand, Product, ProductVariant, ProductAttribute
from .serializers import (
    CategorySerializer, BrandSerializer, ProductSerializer, 
    ProductCreateSerializer, ProductVariantSerializer, ProductAttributeSerializer
)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']


class BrandViewSet(viewsets.ModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']


class ProductAttributeViewSet(viewsets.ModelViewSet):
    queryset = ProductAttribute.objects.all()
    serializer_class = ProductAttributeSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['is_active']
    search_fields = ['name']


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related('category', 'brand').prefetch_related('variants')
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'brand', 'is_active', 'is_service', 'has_variants']
    search_fields = ['name', 'description', 'sku', 'barcode']
    ordering_fields = ['name', 'selling_price', 'created_at']
    ordering = ['name']

    def get_serializer_class(self):
        if self.action == 'create':
            return ProductCreateSerializer
        return ProductSerializer

    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        """Productos con stock bajo"""
        # Esta funcionalidad se implementará con el módulo de inventario
        products = self.get_queryset().filter(is_active=True)
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def duplicate(self, request, pk=None):
        """Duplicar producto"""
        product = self.get_object()
        product.pk = None
        product.sku = f"{product.sku}_copy"
        product.name = f"{product.name} (Copia)"
        product.save()
        
        serializer = self.get_serializer(product)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def search_by_barcode(self, request):
        """Buscar producto por código de barras"""
        barcode = request.query_params.get('barcode')
        if not barcode:
            return Response({'error': 'Código de barras requerido'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Buscar en productos principales
            product = Product.objects.get(barcode=barcode, is_active=True)
            serializer = self.get_serializer(product)
            return Response(serializer.data)
        except Product.DoesNotExist:
            try:
                # Buscar en variantes
                variant = ProductVariant.objects.get(barcode=barcode, is_active=True)
                product = variant.product
                serializer = self.get_serializer(product)
                return Response({
                    'product': serializer.data,
                    'variant': ProductVariantSerializer(variant).data
                })
            except ProductVariant.DoesNotExist:
                return Response({'error': 'Producto no encontrado'}, 
                              status=status.HTTP_404_NOT_FOUND)


class ProductVariantViewSet(viewsets.ModelViewSet):
    queryset = ProductVariant.objects.select_related('product')
    serializer_class = ProductVariantSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['product', 'is_active']
    search_fields = ['name', 'sku', 'barcode']
    ordering_fields = ['name', 'selling_price', 'created_at']
    ordering = ['name']
