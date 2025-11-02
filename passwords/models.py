from django.db import models
from django.contrib.auth.models import User
from cryptography.fernet import Fernet
from django.conf import settings


class PasswordEntry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    website_url = models.URLField(blank=True)
    username = models.CharField(max_length=200)
    encrypted_password = models.BinaryField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
 
    def __str__(self): 
        return f"{self.username} - {self.website_url}"

    def set_password(self, raw_password):

        key = settings.ENCRYPTION_KEY
        cipher = Fernet(key)
        self.encrypted_password = cipher.encrypt(raw_password.encode())

    def get_password(self):

        key = settings.ENCRYPTION_KEY
        cipher = Fernet(key)
        return cipher.decrypt(self.encrypted_password).decode()