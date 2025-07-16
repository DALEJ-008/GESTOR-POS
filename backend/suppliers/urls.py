from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'suppliers', views.SupplierViewSet)
router.register(r'categories', views.SupplierCategoryViewSet)
router.register(r'contacts', views.SupplierContactViewSet)
router.register(r'supplier-products', views.SupplierProductViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
