from django.contrib import admin
from .models import CustomerGroup, Customer, CustomerAddress, CustomerContact


@admin.register(CustomerGroup)
class CustomerGroupAdmin(admin.ModelAdmin):
    list_display = ['name', 'discount_percentage', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description']


class CustomerAddressInline(admin.TabularInline):
    model = CustomerAddress
    extra = 0


class CustomerContactInline(admin.TabularInline):
    model = CustomerContact
    extra = 0


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ['display_name', 'document_number', 'email', 'phone', 'customer_group', 'is_vip', 'is_active']
    list_filter = ['customer_group', 'document_type', 'is_active', 'is_vip', 'city', 'state', 'created_at']
    search_fields = ['first_name', 'last_name', 'company_name', 'document_number', 'email', 'phone']
    readonly_fields = ['full_name', 'display_name', 'total_purchases', 'current_debt', 'available_credit']
    inlines = [CustomerAddressInline, CustomerContactInline]
    
    fieldsets = (
        ('Información personal', {
            'fields': ('first_name', 'last_name', 'company_name', 'birth_date')
        }),
        ('Documento', {
            'fields': ('document_type', 'document_number')
        }),
        ('Contacto', {
            'fields': ('email', 'phone', 'mobile')
        }),
        ('Dirección principal', {
            'fields': ('address', 'city', 'state', 'postal_code', 'country')
        }),
        ('Información comercial', {
            'fields': ('customer_group', 'credit_limit', 'payment_terms', 'discount_percentage')
        }),
        ('Estado y configuración', {
            'fields': ('is_active', 'is_vip', 'notes')
        }),
        ('Información calculada', {
            'fields': ('full_name', 'display_name', 'total_purchases', 'current_debt', 'available_credit'),
            'classes': ('collapse',)
        }),
    )


@admin.register(CustomerAddress)
class CustomerAddressAdmin(admin.ModelAdmin):
    list_display = ['customer', 'label', 'address_type', 'city', 'is_default', 'is_active']
    list_filter = ['address_type', 'is_default', 'is_active', 'city', 'state']
    search_fields = ['customer__first_name', 'customer__last_name', 'label', 'address', 'city']


@admin.register(CustomerContact)
class CustomerContactAdmin(admin.ModelAdmin):
    list_display = ['customer', 'name', 'position', 'email', 'phone', 'is_primary']
    list_filter = ['is_primary', 'position']
    search_fields = ['customer__first_name', 'customer__last_name', 'name', 'email', 'phone']
