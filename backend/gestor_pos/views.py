from django.http import JsonResponse
from django.shortcuts import render


def api_root(request):
    """
    Vista principal de la API que muestra información sobre los endpoints disponibles
    """
    api_info = {
        'message': 'Bienvenido a Gestor POS API',
        'version': '1.0.0',
        'endpoints': {
            'admin': '/admin/',
            'authentication': '/api/auth/',
            'tenants': '/api/tenants/',
            'products': '/api/products/',
            'inventory': '/api/inventory/',
            'customers': '/api/customers/',
            'documentation': '/api/docs/',
        },
        'status': 'active'
    }
    return JsonResponse(api_info, json_dumps_params={'indent': 2})


def health_check(request):
    """
    Endpoint de health check para verificar el estado del servidor
    """
    return JsonResponse({
        'status': 'healthy',
        'message': 'Server is running correctly'
    })
