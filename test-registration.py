#!/usr/bin/env python3
"""
Script para probar el registro de usuarios desde frontend
"""
import requests
import json
import time
import random

def test_registration():
    print("🧪 Probando registro de usuarios desde frontend...")
    print("=" * 50)
    
    # URL del backend
    backend_url = "http://127.0.0.1:8000"
    
    # Datos de prueba
    timestamp = int(time.time())
    test_data = {
        "username": f"frontend_user_{timestamp}",
        "password": "testpass123",
        "confirm_password": "testpass123", 
        "email": f"frontend_test_{timestamp}@example.com",
        "first_name": "Frontend",
        "last_name": "Test"
    }
    
    # Headers que envía el frontend
    headers = {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:3001',
        'Referer': 'http://localhost:3001/auth/register'
    }
    
    try:
        print(f"1. 📝 Probando registro con datos: {test_data['username']}")
        response = requests.post(
            f"{backend_url}/api/auth/register/",
            json=test_data,
            headers=headers,
            timeout=10
        )
        
        print(f"   Status: {response.status_code}")
        print(f"   Headers: {dict(response.headers)}")
        
        if response.status_code == 201:
            result = response.json()
            print("   ✅ Registro exitoso!")
            print(f"   👤 Usuario: {result.get('user', {}).get('username')}")
            print(f"   📧 Email: {result.get('user', {}).get('email')}")
            return True
        else:
            print("   ❌ Error en registro")
            print(f"   📝 Respuesta: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"   ❌ Error de conexión: {e}")
        return False
    except Exception as e:
        print(f"   ❌ Error inesperado: {e}")
        return False

def test_registration_with_existing_user():
    print("\n2. 🔄 Probando registro con usuario existente...")
    
    backend_url = "http://127.0.0.1:8000"
    
    # Intentar registrar con un usuario que ya existe
    test_data = {
        "username": "testuser",  # Este usuario ya existe
        "password": "testpass123",
        "confirm_password": "testpass123",
        "email": "existing@example.com",
        "first_name": "Existing",
        "last_name": "User"
    }
    
    headers = {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:3001',
        'Referer': 'http://localhost:3001/auth/register'
    }
    
    try:
        response = requests.post(
            f"{backend_url}/api/auth/register/",
            json=test_data,
            headers=headers,
            timeout=10
        )
        
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 400:
            result = response.json()
            print("   ✅ Error esperado (usuario ya existe)")
            print(f"   📝 Mensaje: {result}")
            return True
        else:
            print("   ❌ Debería fallar con status 400")
            print(f"   📝 Respuesta: {response.text}")
            return False
            
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

def test_registration_validation():
    print("\n3. ⚠️ Probando validaciones...")
    
    backend_url = "http://127.0.0.1:8000"
    
    # Datos inválidos (contraseñas no coinciden)
    test_data = {
        "username": f"invalid_user_{int(time.time())}",
        "password": "testpass123",
        "confirm_password": "differentpass",  # Contraseña diferente
        "email": "invalid@example.com",
        "first_name": "Invalid",
        "last_name": "User"
    }
    
    headers = {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:3001'
    }
    
    try:
        response = requests.post(
            f"{backend_url}/api/auth/register/",
            json=test_data,
            headers=headers,
            timeout=10
        )
        
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 400:
            result = response.json()
            print("   ✅ Validación funcionando")
            print(f"   📝 Error: {result}")
            return True
        else:
            print("   ❌ Debería fallar con validación")
            print(f"   📝 Respuesta: {response.text}")
            return False
            
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("🔍 Iniciando pruebas de registro de usuarios...")
    print("=" * 60)
    
    # Verificar si el backend está corriendo
    try:
        response = requests.get("http://127.0.0.1:8000/admin/", timeout=5)
        print("✅ Backend está corriendo")
    except:
        print("❌ Backend no está corriendo")
        exit(1)
    
    # Ejecutar pruebas
    test1 = test_registration()
    test2 = test_registration_with_existing_user() 
    test3 = test_registration_validation()
    
    print("\n" + "=" * 60)
    print("📊 Resumen de pruebas:")
    print(f"   Registro nuevo usuario: {'✅' if test1 else '❌'}")
    print(f"   Usuario existente: {'✅' if test2 else '❌'}")
    print(f"   Validaciones: {'✅' if test3 else '❌'}")
    
    if all([test1, test2, test3]):
        print("\n🎉 Todas las pruebas pasaron!")
        print("📝 El problema podría estar en:")
        print("   - Configuración del frontend")
        print("   - Red/conectividad")
        print("   - Headers específicos")
    else:
        print("\n⚠️ Algunas pruebas fallaron")
