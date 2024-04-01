from django.urls import path
from beatgt_app import views
from django.contrib import admin

urlpatterns = [
    path('registration/', views.RegView, name='registration_view'),
    path('auth_user/', views.AuthView, name='auth_view'),
    path('component/', views.GetComponent, name='get_component'),
    path('assembly/', views.AssemblyView.get_for_pk, name='get_assembly'),
    path('create_component/', views.СreateComponent, name='create_component'),
    path('assembly_like/', views.AssemblyView.post_like, name='post_like'),
    path('count_stats/', views.GetCountUserAssem, name='count_stats'),
    path('get_assemblies/', views.AssemblyView.get_assemblies, name='get_assemblies'),
    path('delete_assembly/', views.AssemblyView.delete_assembly, name='delete_assembly'),
    path('get_filter_component/', views.GetFilterComponent, name='get_filter_component'),
    path('create_assembly/', views.AssemblyView.create, name='create_assembly'),
    path('test/', views.Test, name='test'),
]