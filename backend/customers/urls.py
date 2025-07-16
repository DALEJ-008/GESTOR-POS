from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'groups', views.CustomerGroupViewSet)
router.register(r'customers', views.CustomerViewSet)
router.register(r'addresses', views.CustomerAddressViewSet)
router.register(r'contacts', views.CustomerContactViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
