from django.db import models
from django.contrib.auth.models import User


# Create your models here.





class Menu(models.Model):
    dish_type = models.CharField(max_length=100)
    def __str__(self):
        return self.dish_type

class Ingredients(models.Model):

    name = models.CharField(max_length=100)
    extra_cost = models.DecimalField(max_digits=10 , decimal_places=2, default=0.00)

    def __str__(self):
        return self.name





class Dish(models.Model):
    menu = models.ForeignKey(Menu, on_delete=models.CASCADE,related_name='dishes')
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    ingredients = models.ManyToManyField(Ingredients,blank=True)
    picture = models.CharField(max_length=255, default='http://example.com/default-image.jpg')

    def __str__(self):
        return self.name



class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    session_key = models.CharField(max_length=40, blank=True, null=True)  # Для анонимных пользователей
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_ordered = models.BooleanField(default=False)
    def __str__(self):
        return f"Cart {self.id} (Session: {self.session_key})"

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name='items', on_delete=models.CASCADE)
    dish = models.ForeignKey(Dish, related_name='cart_items', on_delete=models.CASCADE, null=True, blank=True)
    quantity = models.PositiveIntegerField(default=1)
    ingredients = models.ManyToManyField(Ingredients, blank=True)
    menu = models.ForeignKey(Menu, null=True, blank=True, on_delete=models.CASCADE)  # Новое поле для menu
    custom_dish_type = models.CharField(max_length=100, blank=True, null=True)  # Тип кастомного блюда
    custom_dish_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    item_price = models.DecimalField(max_digits=10,decimal_places=2,null=True,blank=True)





    def __str__(self):
        # Обработка случая, когда dish может быть None
        if self.dish and self.dish.name:
            return self.dish.name
        return f"Custom:{self.custom_dish_type} "  # Или любое другое значение, чтобы избежать ошибки


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]


    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='orders',null=True,blank=True)
    cart = models.OneToOneField(Cart, on_delete=models.CASCADE)  # Связь с корзиной
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    phone_number = models.CharField(max_length=15,blank=True)
    delivery_address = models.CharField(max_length=255,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    delivery_latitude = models.FloatField(null=True, blank=True)  # Координаты для отслеживания доставщика
    delivery_longitude = models.FloatField(null=True, blank=True)  # Координаты для отслеживания доставщика


    def __str__(self):
        return f"Order {self.id} for cart {self.cart.id}"


class Review(models.Model):

    dish = models.ForeignKey(Dish,on_delete =models.CASCADE, related_name='reviews')
    name = models.CharField(max_length=100)
    rating = models.IntegerField(choices=[(i,i) for i in range(1,6)])
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.rating}"


