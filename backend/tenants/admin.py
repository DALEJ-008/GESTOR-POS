from django.contrib import admin
from .models import Tenant


@admin.register(Tenant)
class TenantAdmin(admin.ModelAdmin):
    list_display = ['name', 'contact_email', 'plan', 'is_active', 'created_at']
    list_filter = ['plan', 'is_active', 'created_at']
    search_fields = ['name', 'contact_email']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('name', 'description')
        }),
        ('Contacto', {
            'fields': ('contact_email', 'contact_phone', 'address')
        }),
        ('Configuración', {
            'fields': ('logo', 'currency', 'timezone', 'language')
        }),
        ('Plan y Límites', {
            'fields': ('plan', 'max_users', 'max_products', 'trial_ends')
        }),
        ('Estado', {
            'fields': ('is_active', 'created_at', 'updated_at')
        }),
    )
