from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Sum, F
from django.utils import timezone
from .models import (
    Warehouse, Stock, StockMovement, StockAlert,
    InventoryAdjustment, InventoryAdjustmentItem
)
from .serializers import (
    WarehouseSerializer, StockSerializer, StockMovementSerializer,
    StockAlertSerializer, InventoryAdjustmentSerializer,
    InventoryAdjustmentCreateSerializer, StockUpdateSerializer
)
from products.models import Product, ProductVariant


class WarehouseViewSet(viewsets.ModelViewSet):
    queryset = Warehouse.objects.all()
    serializer_class = WarehouseSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active']
    search_fields = ['name', 'address']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']


class StockViewSet(viewsets.ModelViewSet):
    queryset = Stock.objects.select_related('product', 'product_variant', 'warehouse')
    serializer_class = StockSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['warehouse', 'product__category', 'product__brand']
    search_fields = ['product__name', 'product_variant__name', 'product__sku', 'product_variant__sku']
    ordering_fields = ['quantity', 'updated_at']
    ordering = ['-updated_at']

    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        """Productos con stock bajo"""
        stocks = self.get_queryset().filter(
            Q(product__isnull=False, quantity__lt=F('product__min_stock')) |
            Q(product_variant__isnull=False, quantity__lt=F('product_variant__product__min_stock'))
        )
        serializer = self.get_serializer(stocks, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def out_of_stock(self, request):
        """Productos sin stock"""
        stocks = self.get_queryset().filter(quantity=0)
        serializer = self.get_serializer(stocks, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def update_stock(self, request):
        """Actualizar stock con movimiento"""
        serializer = StockUpdateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            data = serializer.validated_data
            
            # Encontrar o crear el stock
            stock_filter = {'warehouse_id': data['warehouse']}
            if data.get('product'):
                stock_filter['product_id'] = data['product']
                stock_filter['product_variant'] = None
            else:
                stock_filter['product_variant_id'] = data['product_variant']
                stock_filter['product'] = None
            
            stock, created = Stock.objects.get_or_create(**stock_filter)
            
            # Calcular nueva cantidad
            quantity_before = stock.quantity
            new_quantity = max(0, quantity_before + data['quantity_change'])
            
            # Crear movimiento
            StockMovement.objects.create(
                stock=stock,
                movement_type=data['movement_type'],
                quantity=data['quantity_change'],
                quantity_before=quantity_before,
                quantity_after=new_quantity,
                reason=data['reason'],
                reference=data.get('reference', ''),
                user=request.user
            )
            
            # Actualizar stock
            stock.quantity = new_quantity
            stock.save()
            
            return Response(StockSerializer(stock).data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Resumen de inventario"""
        warehouse_id = request.query_params.get('warehouse')
        stocks = self.get_queryset()
        
        if warehouse_id:
            stocks = stocks.filter(warehouse_id=warehouse_id)
        
        total_products = stocks.count()
        total_quantity = stocks.aggregate(total=Sum('quantity'))['total'] or 0
        low_stock_count = stocks.filter(
            Q(product__isnull=False, quantity__lt=F('product__min_stock')) |
            Q(product_variant__isnull=False, quantity__lt=F('product_variant__product__min_stock'))
        ).count()
        out_of_stock_count = stocks.filter(quantity=0).count()
        
        return Response({
            'total_products': total_products,
            'total_quantity': total_quantity,
            'low_stock_count': low_stock_count,
            'out_of_stock_count': out_of_stock_count
        })


class StockMovementViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = StockMovement.objects.select_related('stock', 'user')
    serializer_class = StockMovementSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['movement_type', 'stock__warehouse', 'user']
    search_fields = ['reason', 'reference']
    ordering_fields = ['created_at', 'quantity']
    ordering = ['-created_at']

    @action(detail=False, methods=['get'])
    def by_product(self, request):
        """Movimientos por producto"""
        product_id = request.query_params.get('product')
        variant_id = request.query_params.get('variant')
        
        if product_id:
            movements = self.get_queryset().filter(stock__product_id=product_id)
        elif variant_id:
            movements = self.get_queryset().filter(stock__product_variant_id=variant_id)
        else:
            return Response({'error': 'Se requiere product o variant'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        serializer = self.get_serializer(movements, many=True)
        return Response(serializer.data)


class StockAlertViewSet(viewsets.ModelViewSet):
    queryset = StockAlert.objects.select_related('stock')
    serializer_class = StockAlertSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['alert_type', 'is_active', 'stock__warehouse']
    ordering_fields = ['created_at']
    ordering = ['-created_at']

    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        """Resolver alerta"""
        alert = self.get_object()
        alert.is_active = False
        alert.resolved_at = timezone.now()
        alert.save()
        
        serializer = self.get_serializer(alert)
        return Response(serializer.data)


class InventoryAdjustmentViewSet(viewsets.ModelViewSet):
    queryset = InventoryAdjustment.objects.select_related('warehouse', 'user').prefetch_related('items')
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['warehouse', 'user']
    search_fields = ['reason']
    ordering_fields = ['created_at']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'create':
            return InventoryAdjustmentCreateSerializer
        return InventoryAdjustmentSerializer
