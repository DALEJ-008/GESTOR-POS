from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'warehouses', views.WarehouseViewSet)
router.register(r'stocks', views.StockViewSet)
router.register(r'movements', views.StockMovementViewSet)
router.register(r'alerts', views.StockAlertViewSet)
router.register(r'adjustments', views.InventoryAdjustmentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
