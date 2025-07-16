from django.urls import path
from . import views

urlpatterns = [
    path('', views.TenantListView.as_view(), name='tenant-list'),
    path('create/', views.create_tenant, name='tenant-create'),
    path('info/', views.tenant_info, name='tenant-info'),
    path('switch/', views.switch_tenant, name='tenant-switch'),
    path('<int:pk>/', views.TenantDetailView.as_view(), name='tenant-detail'),
]
