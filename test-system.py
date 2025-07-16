#!/usr/bin/env python3
"""
Script de prueba completa para el sistema Gestor POS
Verifica que todas las funcionalidades básicas funcionen correctamente
"""

import requests
import json

API_BASE = 'http://localhost:8000/api'

def test_health_check():
    """Verificar que el servidor esté corriendo"""
    try:
        response = requests.get(f'{API_BASE}/../health/')
        return response.status_code == 200
    except:
        return False

def test_registration():
    """Probar registro de nuevo usuario"""
    data = {
        'username': f'testuser_{int(__import__("time").time())}',
        'email': f'test_{int(__import__("time").time())}@example.com',
        'first_name': 'Test',
        'last_name': 'User',
        'password': 'testpass123',
        'confirm_password': 'testpass123'
    }
    
    try:
        response = requests.post(f'{API_BASE}/auth/register/', json=data)
        return response.status_code == 201, response.json()
    except Exception as e:
        return False, str(e)

def test_login():
    """Probar login con usuario existente"""
    data = {
        'username': 'testuser',
        'password': 'testpass123'
    }
    
    try:
        response = requests.post(f'{API_BASE}/auth/login/', json=data)
        return response.status_code == 200, response.json()
    except Exception as e:
        return False, str(e)

def main():
    print("🔍 Iniciando pruebas del sistema Gestor POS...")
    print("=" * 50)
    
    # Test 1: Health Check
    print("1. ⚡ Verificando servidor...")
    if test_health_check():
        print("   ✅ Servidor backend corriendo correctamente")
    else:
        print("   ❌ Servidor backend no responde")
        return
    
    # Test 2: Registro
    print("\n2. 📝 Probando registro de usuario...")
    success, result = test_registration()
    if success:
        print("   ✅ Registro funcionando correctamente")
        print(f"   👤 Usuario creado: {result['user']['username']}")
    else:
        print(f"   ❌ Error en registro: {result}")
    
    # Test 3: Login
    print("\n3. 🔑 Probando inicio de sesión...")
    success, result = test_login()
    if success:
        print("   ✅ Login funcionando correctamente")
        print(f"   👤 Usuario logueado: {result['user']['username']}")
        print(f"   🎫 Token obtenido: {result['tokens']['access'][:20]}...")
    else:
        print(f"   ❌ Error en login: {result}")
    
    print("\n" + "=" * 50)
    print("🎉 Pruebas completadas!")
    print("\n📝 Para probar el frontend:")
    print("   1. Abrir http://localhost:3001/auth/login")
    print("   2. Usar credenciales: testuser / testpass123")
    print("   3. O registrar un nuevo usuario")

if __name__ == "__main__":
    main()
