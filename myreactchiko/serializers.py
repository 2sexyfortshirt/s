from rest_framework import serializers
from .models import Menu, Dish,Cart, CartItem,Order,Ingredients
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import Review



class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    class Meta:
        model = Review
        fields = ['id', 'user', 'rating', 'comment']




class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email','is_staff']

class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()

    def validate(self, attrs):
        refresh_token = attrs.get('refresh')
        if not refresh_token:
            raise serializers.ValidationError('Refresh token is required for logout.')

        try:
            # Попытка создать RefreshToken
            token = RefreshToken(refresh_token)
        except Exception as e:
            # Токен неверный или истёкший
            raise serializers.ValidationError('Invalid or expired refresh token.')

        return attrs

    def save(self, **kwargs):
        refresh_token = self.validated_data['refresh']

        try:
            # Черним токен
            token = RefreshToken(refresh_token)
            token.blacklist()  # Черный список токена
        except Exception as e:
            print(f"Error while blacklisting token: {e}")  # Отладочная информация
            raise serializers.ValidationError('Error blacklisting the refresh token.')
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    token = serializers.CharField(read_only=True)

    def validate(self, data):

        username = data.get('username')
        password = data.get('password')

        # Проверяем, существует ли пользователь
        user = authenticate(username=username, password=password)

        if user is None:
            raise serializers.ValidationError("Invalid credentials")

        # Генерируем токен
        refresh = RefreshToken.for_user(user)
        return {
            'username': user.username,
            'token': str(refresh.access_token),
            'refresh': str(refresh)
        }

class CustomBurgerSerializer(serializers.Serializer):
    menu_id = serializers.IntegerField()
    ingredients = serializers.PrimaryKeyRelatedField(queryset=Ingredients.objects.all(), many=True)


    def validate_menu_id(self, value):
        if not Menu.objects.filter(id=value).exists():
            raise serializers.ValidationError("Указанный тип блюда не существует.")
        return value

    def validate_ingredients(self, value):
        if not value:
            raise serializers.ValidationError("Необходимо выбрать хотя бы один ингредиент.")
        return value



class IngredientsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Ingredients
        fields = ['id','name', 'extra_cost']

class DishSerializer(serializers.ModelSerializer):
    ingredients = IngredientsSerializer(many=True, read_only=True)
    dish_type = serializers.CharField(source='menu.dish_type', allow_null=True, required=False)
    picture = serializers.ImageField(use_url=True)
    class Meta:
        model = Dish
        fields = ['id', 'name', 'description', 'price', 'menu','ingredients','picture','dish_type']  # Убедитесь, что поля корректные


# Сериализатор для модели CartItem
class CartItemSerializer(serializers.ModelSerializer):
    dish = DishSerializer(read_only=True)
    ingredients = IngredientsSerializer(many=True, read_only=True)
    dish_type = serializers.CharField(
        source='dish.menu.dish_type',
        read_only=True
    )

    class Meta:
        model = CartItem
        fields = [
            'id',
            'dish',
            'quantity',
            'ingredients',
            'dish_type',
            'custom_dish_price',
            'custom_dish_type',
        ]
# Сериализатор для модели Cart
class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)  # Вложенный сериализатор для элементов корзины
    session_key = serializers.CharField(read_only=True)


    class Meta:
        model = Cart
        fields = ['id', 'session_key', 'created_at', 'updated_at', 'items','is_ordered']  # Убедитесь, что поля корректные



# Сериализатор для модели Menu
class MenuSerializer(serializers.ModelSerializer):
    dishes = DishSerializer(many=True,read_only=True)
    class Meta:
        model = Menu
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    cart = CartSerializer()
    items = CartItemSerializer(many=True, source='cart.items')


    class Meta:
        model = Order
        fields = ['id', 'cart', 'status','total_price','items','delivery_latitude',
                  'delivery_longitude','created_at','delivery_address','phone_number']




class OrderStatusUpdateSerializer(serializers.ModelSerializer):
    status = serializers.CharField()

    class Meta:
        model = Order
        fields = ['status']

    def validate_status(self, value):
        # Check if the status is one of the valid choices
        if value not in dict(Order.STATUS_CHOICES):
            raise serializers.ValidationError("Invalid status value.")
        return value

    def update(self, instance, validated_data):
        # Update the order status with the new value
        instance.status = validated_data['status']
        instance.save()
        return instance