from django.urls import path
from . import views

urlpatterns = [
    path('getsession/', views.getSession, name="getSession"),
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name="logout")
]
