from django.contrib import admin
from .models import Menu, Dish, Cart,CartItem,Order,Ingredients


# Register your models here.
@admin.register(Menu)
class MenuAdmin(admin.ModelAdmin):
    list_display = ('dish_type',)  # Поля, отображаемые в списке

@admin.register(Dish)
class DishAdmin(admin.ModelAdmin):
    fields = ('menu', 'name', 'description', 'price', 'picture')

@admin.register(Ingredients)
class IngridientsAdmin(admin.ModelAdmin):
    list_display = ('name','extra_cost')
class IngridientsInline(admin.TabularInline):
    model = CartItem.ingredients.through  # Связь многие-ко-многим
    extra = 0
class CartItemInline(admin.TabularInline):  # Или StackedInline
    model = CartItem
    extra = 0  # Количество пустых форм для добавления новых предметов
@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ( 'session_key', 'created_at', 'updated_at','is_ordered')
    inlines = [CartItemInline]  # Добавляем CartItemInline

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'dish', 'quantity')

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('cart', 'status', 'total_price')
