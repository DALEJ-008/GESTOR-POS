from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib.auth import login, logout
from django.utils import timezone
from django.contrib.auth.models import User
from .models import UserSession
from .serializers import (
    UserRegistrationSerializer, UserLoginSerializer, UserSerializer,
    UserUpdateSerializer, ChangePasswordSerializer
)
import uuid
import time


class UserRegistrationView(generics.CreateAPIView):
    """Vista para registro de nuevos usuarios"""
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generar tokens JWT
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'Usuario registrado exitosamente',
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)


class UserLoginView(generics.GenericAPIView):
    """Vista para login de usuarios"""
    serializer_class = UserLoginSerializer
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']
        
        # Actualizar último login
        from django.utils import timezone
        user.last_login = timezone.now()
        user.save(update_fields=['last_login'])
        
        # Generar una clave de sesión única
        session_key = request.session.session_key
        if not session_key:
            # Crear una clave única usando UUID y timestamp
            session_key = f'api-{user.id}-{int(time.time())}-{uuid.uuid4().hex[:8]}'
        
        # Verificar si ya existe una sesión activa con esta clave
        existing_session = UserSession.objects.filter(
            session_key=session_key,
            is_active=True
        ).first()
        
        if existing_session:
            # Actualizar la sesión existente
            existing_session.last_activity = timezone.now()
            existing_session.ip_address = self.get_client_ip(request)
            existing_session.user_agent = request.META.get('HTTP_USER_AGENT', '')
            existing_session.save()
        else:
            # Crear nueva sesión solo si no existe
            try:
                UserSession.objects.create(
                    user=user,
                    session_key=session_key,
                    ip_address=self.get_client_ip(request),
                    user_agent=request.META.get('HTTP_USER_AGENT', '')
                )
            except Exception as e:
                # Si hay error de clave duplicada, generar una nueva clave
                session_key = f'api-{user.id}-{int(time.time())}-{uuid.uuid4().hex[:12]}'
                UserSession.objects.create(
                    user=user,
                    session_key=session_key,
                    ip_address=self.get_client_ip(request),
                    user_agent=request.META.get('HTTP_USER_AGENT', '')
                )
        
        # Generar tokens JWT
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'Login exitoso',
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_200_OK)
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def user_logout(request):
    """Vista para logout de usuarios"""
    try:
        # Invalidar todas las sesiones activas del usuario
        UserSession.objects.filter(user=request.user, is_active=True).update(
            is_active=False
        )
        
        # Obtener el refresh token del request (si se proporciona)
        refresh_token = request.data.get('refresh_token')
        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except Exception:
                pass
        
        return Response({
            'message': 'Logout exitoso'
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': 'Error durante el logout'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """Vista para obtener y actualizar perfil de usuario"""
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
    def get_serializer_class(self):
        if self.request.method == 'PATCH':
            return UserUpdateSerializer
        return UserSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    """Vista para cambio de contraseña"""
    serializer = ChangePasswordSerializer(
        data=request.data,
        context={'request': request}
    )
    
    if serializer.is_valid():
        user = request.user
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        
        # Invalidar todas las sesiones activas
        UserSession.objects.filter(user=user, is_active=True).update(
            is_active=False
        )
        
        return Response({
            'message': 'Contraseña actualizada exitosamente'
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserListView(generics.ListAPIView):
    """Vista para listar usuarios (solo administradores)"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Solo administradores pueden ver la lista completa
        if self.request.user.is_superuser:
            return User.objects.all()
        return User.objects.filter(id=self.request.user.id)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_permissions(request):
    """Vista para obtener permisos del usuario actual"""
    user = request.user
    
    # Como estamos usando el modelo User estándar de Django,
    # utilizamos los campos disponibles
    permissions = {
        'is_admin': user.is_superuser,
        'is_manager': user.is_staff,
        'can_manage_products': user.is_staff or user.is_superuser,
        'can_manage_inventory': user.is_staff or user.is_superuser,
        'can_make_sales': True,  # Todos los usuarios pueden hacer ventas
        'can_view_reports': user.is_staff or user.is_superuser,
        'can_manage_users': user.is_superuser,
        'can_manage_settings': user.is_superuser,
    }
    
    # Determinar rol basado en los permisos del usuario
    if user.is_superuser:
        role = 'admin'
    elif user.is_staff:
        role = 'manager'
    else:
        role = 'user'
    
    return Response({
        'user_id': user.id,
        'role': role,
        'permissions': permissions
    }, status=status.HTTP_200_OK)
