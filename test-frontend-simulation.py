#!/usr/bin/env python3
"""
Script para simular exactamente el registro desde el frontend
"""
import requests
import json
import time

def test_frontend_registration():
    print("🧪 Simulando registro desde frontend...")
    print("=" * 50)
    
    # URL correcta que debe usar el frontend
    api_url = "http://127.0.0.1:8000/api/auth/register/"
    
    # Datos exactos que enviaría el frontend
    timestamp = int(time.time())
    registration_data = {
        "username": f"frontend_test_{timestamp}",
        "password": "testpass123",
        "confirm_password": "testpass123",
        "email": f"frontend_{timestamp}@test.com",
        "first_name": "Frontend",
        "last_name": "Test"
    }
    
    # Headers exactos que envía el frontend
    headers = {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:3001',
        'Referer': 'http://localhost:3001/auth/register',
        'User-Agent': 'Mozilla/5.0 (Frontend Simulation)'
    }
    
    print(f"📡 URL: {api_url}")
    print(f"📝 Datos: {json.dumps(registration_data, indent=2)}")
    print(f"🔧 Headers: {json.dumps(headers, indent=2)}")
    print("\n⏳ Enviando petición...")
    
    try:
        response = requests.post(
            api_url,
            json=registration_data,
            headers=headers,
            timeout=15
        )
        
        print(f"\n📊 Status Code: {response.status_code}")
        print(f"📋 Response Headers: {dict(response.headers)}")
        
        if response.status_code == 201:
            result = response.json()
            print("✅ ¡Registro exitoso!")
            print(f"👤 Usuario creado: {result.get('user', {}).get('username', 'N/A')}")
            print(f"📧 Email: {result.get('user', {}).get('email', 'N/A')}")
            print(f"🎫 Token generado: {'Sí' if 'tokens' in result else 'No'}")
            return True
        else:
            print("❌ Error en registro")
            try:
                error_data = response.json()
                print(f"📝 Error data: {json.dumps(error_data, indent=2)}")
            except:
                print(f"📝 Response text: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError as e:
        print(f"❌ Error de conexión: {e}")
        print("🔧 Verifica que el backend esté corriendo en http://127.0.0.1:8000")
        return False
    except requests.exceptions.Timeout as e:
        print(f"❌ Timeout: {e}")
        return False
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        return False

def verify_backend_status():
    print("🔍 Verificando estado del backend...")
    try:
        response = requests.get("http://127.0.0.1:8000/admin/", timeout=5)
        print(f"✅ Backend respondiendo (Status: {response.status_code})")
        return True
    except:
        print("❌ Backend no está respondiendo")
        return False

if __name__ == "__main__":
    print("🔬 Prueba de registro del frontend")
    print("=" * 60)
    
    if not verify_backend_status():
        print("\n💡 Solución: Ejecuta 'python manage.py runserver' en backend/")
        exit(1)
    
    print()
    success = test_frontend_registration()
    
    print("\n" + "=" * 60)
    if success:
        print("🎉 ¡Prueba exitosa! El registro debería funcionar desde el frontend")
        print("📝 Si aún no funciona, revisa:")
        print("   - Consola del navegador (F12)")
        print("   - Network tab para ver las peticiones")
        print("   - Configuración de CORS")
    else:
        print("⚠️ Hay un problema con el registro")
        print("📝 Verifica la configuración del backend")
