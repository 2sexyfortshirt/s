from django.contrib import admin
from .models import Menu, Dish, Cart,CartItem,Order,Ingredients,Review


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
    search_fields = ('user__username',)

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        qs = qs.select_related('user').prefetch_related('items__dish','items__ingredients')
        if request.user.is_superuser:
            return qs
        if request.user.is_staff:
            return qs.filter(order__status='pending')
        return qs.filter(user=request.user)

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'dish', 'quantity')

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id','cart', 'status', 'total_price','created_at')
    list_filter = ('status','created_at')
    search_fields = ('cart__user__username','phone_number')

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        qs = qs.select_related('cart','cart__user').prefetch_related('cart__items__dish','cart__items__ingredients')
        if request.user.is_superuser or request.user.is_staff:
            return qs
        return qs.filter(status='pending')
    def get_readonly_fields(self, request, obj=None):
        if request.user.is_superuser:
            return ()
        return ('cart','total_price','phone_number','delivery_adress','created_at')

    def has_change_permission(self, request, obj=None):
        return request.user.is_staff or request.user.is_superuser


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('user','dish','name','rating','comment','created_at')
