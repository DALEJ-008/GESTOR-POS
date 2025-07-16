#!/usr/bin/env python3
"""
Prueba final completa del sistema de registro y login
"""
import requests
import json
import time

def final_test():
    print("🎯 PRUEBA FINAL DEL SISTEMA")
    print("=" * 60)
    
    backend_url = "http://127.0.0.1:8000"
    timestamp = int(time.time())
    
    # Test 1: Verificar backend
    print("1. 🔧 Verificando backend...")
    try:
        response = requests.get(f"{backend_url}/admin/", timeout=5)
        print("   ✅ Backend funcionando")
    except:
        print("   ❌ Backend no responde")
        return False
    
    # Test 2: Registro exitoso
    print("\n2. 📝 Probando registro...")
    user_data = {
        "username": f"final_test_{timestamp}",
        "password": "finaltest123",
        "confirm_password": "finaltest123",
        "email": f"final_{timestamp}@test.com",
        "first_name": "Final",
        "last_name": "Test"
    }
    
    headers = {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:3001'
    }
    
    try:
        response = requests.post(
            f"{backend_url}/api/auth/register/",
            json=user_data,
            headers=headers,
            timeout=10
        )
        if response.status_code == 201:
            result = response.json()
            print(f"   ✅ Usuario registrado: {result['user']['username']}")
            user_created = True
        else:
            print(f"   ❌ Error en registro: {response.status_code}")
            print(f"   📝 {response.text}")
            return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False
    
    # Test 3: Login del usuario recién creado
    print("\n3. 🔑 Probando login...")
    try:
        login_data = {
            "username": user_data["username"],
            "password": user_data["password"]
        }
        
        response = requests.post(
            f"{backend_url}/api/auth/login/",
            json=login_data,
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"   ✅ Login exitoso: {result['user']['username']}")
            print(f"   🎫 Token generado: {len(result['tokens']['access'])} caracteres")
        else:
            print(f"   ❌ Error en login: {response.status_code}")
            return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False
    
    # Test 4: Registro de usuario duplicado (debe fallar)
    print("\n4. ⚠️ Probando usuario duplicado...")
    try:
        response = requests.post(
            f"{backend_url}/api/auth/register/",
            json=user_data,  # Mismos datos
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 400:
            print("   ✅ Error esperado (usuario ya existe)")
        else:
            print(f"   ❌ Debería fallar con 400, pero dio {response.status_code}")
            return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False
    
    # Test 5: Segundo usuario diferente
    print("\n5. 👥 Probando segundo usuario...")
    user_data2 = {
        "username": f"final_test2_{timestamp}",
        "password": "finaltest123",
        "confirm_password": "finaltest123",
        "email": f"final2_{timestamp}@test.com",
        "first_name": "Final2",
        "last_name": "Test2"
    }
    
    try:
        response = requests.post(
            f"{backend_url}/api/auth/register/",
            json=user_data2,
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 201:
            result = response.json()
            print(f"   ✅ Segundo usuario registrado: {result['user']['username']}")
        else:
            print(f"   ❌ Error con segundo usuario: {response.status_code}")
            return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False
    
    return True

if __name__ == "__main__":
    print("🚀 INICIANDO PRUEBA FINAL DEL SISTEMA GESTOR POS")
    print("=" * 80)
    
    success = final_test()
    
    print("\n" + "=" * 80)
    if success:
        print("🎉 ¡TODOS LOS TESTS PASARON!")
        print("")
        print("📝 Resumen:")
        print("   ✅ Backend funcionando correctamente")
        print("   ✅ Registro de usuarios funcionando")
        print("   ✅ Login de usuarios funcionando")
        print("   ✅ Validaciones funcionando")
        print("   ✅ Múltiples usuarios se pueden registrar")
        print("")
        print("🌐 URLs para probar:")
        print("   - Frontend: http://localhost:3001/")
        print("   - Login: http://localhost:3001/auth/login")
        print("   - Registro: http://localhost:3001/auth/register")
        print("   - Backend: http://127.0.0.1:8000/admin/")
        print("")
        print("🔑 Credenciales de prueba:")
        print("   - testuser / testpass123")
        print("   - testuser2 / newpass123")
        print("")
        print("✨ El sistema está listo para usar!")
    else:
        print("❌ ALGUNAS PRUEBAS FALLARON")
        print("")
        print("🔧 Verifica:")
        print("   - Que el backend esté corriendo")
        print("   - Que el frontend esté corriendo")
        print("   - Las configuraciones de CORS")
        print("   - Los logs del servidor")
    
    print("=" * 80)
