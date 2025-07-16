# Credenciales de Prueba - Gestor POS

## Usuarios para Pruebas

### Usuario 1
- **Username**: `testuser`
- **Password**: `testpass123`
- **Email**: test@example.com
- **Rol**: Employee (Empleado)

### Usuario 2
- **Username**: `testuser2`
- **Password**: `newpass123`
- **Email**: test2@example.com
- **Rol**: Employee (Empleado)

## URLs de Acceso

- **Frontend**: http://localhost:3001/
- **Login**: http://localhost:3001/auth/login
- **Registro**: http://localhost:3001/auth/register
- **Registro de Empresas**: http://localhost:3001/auth/tenant-register
- **Backend API**: http://localhost:8000/api/
- **Admin Django**: http://localhost:8000/admin/

## Cómo Probar el Sistema

1. **Iniciar Backend**:
   ```bash
   # En PowerShell
   .\start-backend.ps1
   
   # O usar VS Code Tasks
   Ctrl+Shift+P > "Tasks: Run Task" > "Start Development Server"
   ```

2. **Iniciar Frontend**:
   ```bash
   # En PowerShell
   .\start-frontend-stable.ps1
   
   # O usar VS Code Tasks
   Ctrl+Shift+P > "Tasks: Run Task" > "Start Frontend Server"
   ```

3. **Iniciar Ambos**:
   ```bash
   .\start-both.ps1
   ```

4. **Probar Login**:
   - Ir a http://localhost:3001/auth/login
   - Usar cualquiera de las credenciales de prueba
   - Debería redirigir al dashboard

5. **Probar Registro**:
   - Ir a http://localhost:3001/auth/register
   - Llenar el formulario con datos nuevos
   - Debería crear el usuario y hacer login automático

## Estado del Sistema

✅ **Funcionando Correctamente**:
- Backend Django (API) en puerto 8000
- Frontend React (Vite) en puerto 3001
- Autenticación con JWT
- Registro de usuarios
- CORS configurado correctamente
- Base de datos SQLite funcionando

⚠️ **Pendiente de Implementar**:
- Registro de nuevas empresas (tenants)
- Dashboard completo
- Módulos de productos, inventario, ventas
- Funcionalidades multi-tenant completas

## Notas Técnicas

- La autenticación usa tokens JWT (access + refresh)
- Los tokens se almacenan en localStorage
- El sistema está preparado para multi-tenancy
- Base de datos: SQLite (desarrollo)
- Frontend: React + TypeScript + Ant Design + Tailwind
- Backend: Django + DRF + SimpleJWT
