#!/usr/bin/env python3
"""
Script para probar la comunicación frontend-backend del Gestor POS
"""
import requests
import json
import sys

def test_cors_and_connection():
    """Probar CORS y conexión entre frontend y backend"""
    print("🔍 Probando comunicación Frontend-Backend...")
    print("=" * 50)
    
    # URL del backend
    backend_url = "http://127.0.0.1:8000"
    frontend_url = "http://localhost:3001"
    
    # 1. Probar health check
    try:
        print("1. 🔧 Probando health check del backend...")
        response = requests.get(f"{backend_url}/api/health/", timeout=5)
        if response.status_code == 200:
            print("   ✅ Backend responde correctamente")
            print(f"   📝 Respuesta: {response.json()}")
        else:
            print(f"   ❌ Backend respondió con status {response.status_code}")
    except Exception as e:
        print(f"   ❌ Error conectando al backend: {e}")
        return False
    
    # 2. Probar login con headers CORS
    try:
        print("2. 🔑 Probando login con headers CORS...")
        headers = {
            'Content-Type': 'application/json',
            'Origin': frontend_url,  # Simular petición desde frontend
        }
        
        login_data = {
            "username": "testuser",
            "password": "testpass123"
        }
        
        response = requests.post(
            f"{backend_url}/api/auth/login/", 
            json=login_data,
            headers=headers,
            timeout=5
        )
        
        if response.status_code == 200:
            print("   ✅ Login funcionando con CORS")
            data = response.json()
            print(f"   👤 Usuario: {data.get('user', {}).get('username')}")
            print(f"   🎫 Token obtenido: {data.get('tokens', {}).get('access', 'N/A')[:50]}...")
            
            # Verificar headers CORS
            cors_headers = response.headers.get('Access-Control-Allow-Origin')
            print(f"   🌐 CORS Headers: {cors_headers}")
            
        else:
            print(f"   ❌ Login falló con status {response.status_code}")
            print(f"   📝 Respuesta: {response.text}")
            
    except Exception as e:
        print(f"   ❌ Error en login: {e}")
        return False
    
    # 3. Probar registro con headers CORS
    try:
        print("3. 📝 Probando registro con headers CORS...")
        import time
        
        register_data = {
            "username": f"testcors_{int(time.time())}",
            "password": "testpass123",
            "confirm_password": "testpass123",
            "email": "testcors@example.com",
            "first_name": "Test",
            "last_name": "CORS"
        }
        
        response = requests.post(
            f"{backend_url}/api/auth/register/", 
            json=register_data,
            headers=headers,
            timeout=5
        )
        
        if response.status_code == 201:
            print("   ✅ Registro funcionando con CORS")
            data = response.json()
            print(f"   👤 Usuario creado: {data.get('user', {}).get('username')}")
        else:
            print(f"   ❌ Registro falló con status {response.status_code}")
            print(f"   📝 Respuesta: {response.text}")
            
    except Exception as e:
        print(f"   ❌ Error en registro: {e}")
    
    print("=" * 50)
    print("🎉 Pruebas de comunicación completadas!")
    print(f"📝 Frontend debería funcionar en: {frontend_url}")
    print(f"🔧 Backend corriendo en: {backend_url}")
    
    return True

if __name__ == "__main__":
    test_cors_and_connection()
