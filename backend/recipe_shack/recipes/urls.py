from django.urls import path
from . import views

urlpatterns = [
    path('getfavorites/', views.get_favorites, name='get_favorites'),
    path('addfavorite/', views.add_favorite, name='add_favorite'),
    path('removefavorite/', views.remove_favorite, name='remove_favorite'),
    path('getrecipes/', views.get_recipes, name='get_recipes'),

]