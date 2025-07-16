from django.contrib.auth.models import User
from django.db import models

# Modelo User personalizado temporalmente removido para evitar conflictos
# Se puede implementar más adelante usando migraciones adecuadas

class UserSession(models.Model):
    """
    Modelo para rastrear sesiones de usuario
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sessions')
    session_key = models.CharField(max_length=40, unique=True)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    last_activity = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Sesión de Usuario"
        verbose_name_plural = "Sesiones de Usuario"

    def __str__(self):
        return f"{self.user.username} - {self.ip_address}"
