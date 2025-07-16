from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Count, Sum, Q, F, Avg
from django.utils import timezone
from datetime import datetime, timedelta
from decimal import Decimal

from .models import Sale, SaleItem, Payment, PaymentMethod
from .serializers import (
    SaleSerializer, SaleListSerializer, SaleCreateSerializer,
    SaleItemSerializer, PaymentSerializer, PaymentMethodSerializer
)


class SaleViewSet(viewsets.ModelViewSet):
    """ViewSet para ventas"""
    queryset = Sale.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'sale_type', 'customer', 'payment_status']
    search_fields = ['sale_number', 'customer__name', 'notes']
    ordering_fields = ['sale_date', 'total_amount', 'sale_number']
    ordering = ['-sale_date']

    def get_serializer_class(self):
        if self.action == 'create':
            return SaleCreateSerializer
        elif self.action == 'list':
            return SaleListSerializer
        return SaleSerializer

    @action(detail=False, methods=['get'])
    def today_sales(self, request):
        """Ventas del día actual"""
        today = timezone.now().date()
        sales = self.queryset.filter(sale_date__date=today)
        
        stats = {
            'total_sales': sales.count(),
            'total_amount': sales.aggregate(Sum('total_amount'))['total_amount__sum'] or 0,
            'avg_ticket': sales.aggregate(Avg('total_amount'))['total_amount__avg'] or 0,
            'completed_sales': sales.filter(status='completed').count(),
            'pending_sales': sales.filter(status='pending').count()
        }
        
        serializer = SaleListSerializer(sales[:20], many=True)
        return Response({
            'statistics': stats,
            'recent_sales': serializer.data
        })

    @action(detail=False, methods=['get'])
    def sales_by_period(self, request):
        """Ventas por período"""
        period = request.query_params.get('period', 'week')  # week, month, year
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        if start_date and end_date:
            sales = self.queryset.filter(
                sale_date__date__range=[start_date, end_date]
            )
        else:
            today = timezone.now().date()
            if period == 'week':
                start = today - timedelta(days=7)
            elif period == 'month':
                start = today - timedelta(days=30)
            elif period == 'year':
                start = today - timedelta(days=365)
            else:
                start = today - timedelta(days=7)
            
            sales = self.queryset.filter(sale_date__date__gte=start)
        
        # Agrupar por día
        daily_sales = {}
        for sale in sales:
            day = sale.sale_date.date()
            if day not in daily_sales:
                daily_sales[day] = {
                    'date': day,
                    'total_sales': 0,
                    'total_amount': Decimal('0'),
                    'completed': 0,
                    'pending': 0
                }
            
            daily_sales[day]['total_sales'] += 1
            daily_sales[day]['total_amount'] += sale.total_amount
            if sale.status == 'completed':
                daily_sales[day]['completed'] += 1
            elif sale.status == 'pending':
                daily_sales[day]['pending'] += 1
        
        return Response(list(daily_sales.values()))

    @action(detail=False, methods=['get'])
    def top_customers(self, request):
        """Mejores clientes por ventas"""
        limit = int(request.query_params.get('limit', 10))
        
        customers = self.queryset.values('customer__name', 'customer__id').annotate(
            total_purchases=Count('id'),
            total_spent=Sum('total_amount'),
            avg_ticket=Avg('total_amount')
        ).order_by('-total_spent')[:limit]
        
        return Response(customers)

    @action(detail=False, methods=['get'])
    def pending_payments(self, request):
        """Ventas con pagos pendientes"""
        pending = self.queryset.filter(
            Q(payment_status='pending') | Q(payment_status='partial')
        )
        
        total_pending = pending.aggregate(
            total_amount=Sum('total_amount'),
            total_paid=Sum('paid_amount')
        )
        
        balance = (total_pending['total_amount'] or 0) - (total_pending['total_paid'] or 0)
        
        serializer = SaleListSerializer(pending[:50], many=True)
        return Response({
            'total_pending_amount': balance,
            'pending_sales_count': pending.count(),
            'sales': serializer.data
        })

    @action(detail=True, methods=['post'])
    def add_payment(self, request, pk=None):
        """Agregar pago a una venta"""
        sale = self.get_object()
        
        amount = Decimal(str(request.data.get('amount', 0)))
        payment_method_id = request.data.get('payment_method')
        notes = request.data.get('notes', '')
        
        if amount <= 0:
            return Response(
                {'error': 'El monto debe ser mayor a 0'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        remaining = sale.total_amount - sale.paid_amount
        if amount > remaining:
            return Response(
                {'error': f'El monto excede la deuda pendiente de {remaining}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Crear el pago
        payment_data = {
            'sale': sale.id,
            'amount': amount,
            'payment_method': payment_method_id,
            'notes': notes
        }
        
        serializer = PaymentSerializer(data=payment_data)
        if serializer.is_valid():
            serializer.save()
            
            # Actualizar estado de pago de la venta
            sale.paid_amount += amount
            if sale.paid_amount >= sale.total_amount:
                sale.payment_status = 'paid'
            else:
                sale.payment_status = 'partial'
            sale.save()
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def complete_sale(self, request, pk=None):
        """Completar una venta"""
        sale = self.get_object()
        
        if sale.status == 'completed':
            return Response(
                {'error': 'La venta ya está completada'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        sale.status = 'completed'
        sale.save()
        
        # Aquí se actualizaría el inventario
        # for item in sale.items.all():
        #     # Reducir stock del producto
        #     pass
        
        serializer = self.get_serializer(sale)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def cancel_sale(self, request, pk=None):
        """Cancelar una venta"""
        sale = self.get_object()
        reason = request.data.get('reason', '')
        
        if sale.status == 'completed':
            return Response(
                {'error': 'No se puede cancelar una venta completada'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        sale.status = 'cancelled'
        sale.notes = f"Cancelada: {reason}"
        sale.save()
        
        serializer = self.get_serializer(sale)
        return Response(serializer.data)


class SaleItemViewSet(viewsets.ModelViewSet):
    """ViewSet para items de venta"""
    queryset = SaleItem.objects.all()
    serializer_class = SaleItemSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['sale', 'product']
    search_fields = ['product__name', 'sale__sale_number']
    ordering_fields = ['quantity', 'unit_price', 'total']
    ordering = ['-id']

    @action(detail=False, methods=['get'])
    def top_products(self, request):
        """Productos más vendidos"""
        limit = int(request.query_params.get('limit', 10))
        
        products = self.queryset.values(
            'product__name', 'product__id'
        ).annotate(
            total_quantity=Sum('quantity'),
            total_sales=Count('sale', distinct=True),
            total_revenue=Sum('total')
        ).order_by('-total_quantity')[:limit]
        
        return Response(products)


class PaymentViewSet(viewsets.ModelViewSet):
    """ViewSet para pagos"""
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['payment_method', 'sale']
    search_fields = ['sale__sale_number', 'notes']
    ordering_fields = ['payment_date', 'amount']
    ordering = ['-payment_date']

    @action(detail=False, methods=['get'])
    def payments_by_method(self, request):
        """Pagos agrupados por método de pago"""
        payments = self.queryset.values(
            'payment_method__name'
        ).annotate(
            total_amount=Sum('amount'),
            transaction_count=Count('id')
        ).order_by('-total_amount')
        
        return Response(payments)

    @action(detail=False, methods=['get'])
    def daily_payments(self, request):
        """Pagos del día"""
        today = timezone.now().date()
        payments = self.queryset.filter(payment_date__date=today)
        
        stats = {
            'total_payments': payments.count(),
            'total_amount': payments.aggregate(Sum('amount'))['amount__sum'] or 0,
            'by_method': payments.values('payment_method__name').annotate(
                total=Sum('amount'),
                count=Count('id')
            )
        }
        
        serializer = self.get_serializer(payments[:20], many=True)
        return Response({
            'statistics': stats,
            'recent_payments': serializer.data
        })


class PaymentMethodViewSet(viewsets.ModelViewSet):
    """ViewSet para métodos de pago"""
    queryset = PaymentMethod.objects.all()
    serializer_class = PaymentMethodSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name']
    ordering = ['name']

    @action(detail=False, methods=['get'])
    def active_methods(self, request):
        """Métodos de pago activos"""
        active = self.queryset.filter(is_active=True)
        serializer = self.get_serializer(active, many=True)
        return Response(serializer.data)
