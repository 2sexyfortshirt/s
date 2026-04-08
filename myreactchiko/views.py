from rest_framework.response import Response
from rest_framework import serializers
from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from django.db.models import Avg
from rest_framework import permissions
from django.contrib.auth.tokens import default_token_generator

from django.core.mail import send_mail
from django.contrib.auth.models import User
from rest_framework.exceptions import ValidationError
from rest_framework import generics
from .models import Menu, Dish,Cart,CartItem
from .serializers import MenuSerializer, DishSerializer
from .services import add_to_cart_service
from django.shortcuts import get_object_or_404
from django.utils.http import urlsafe_base64_encode,urlsafe_base64_decode
from django.utils.encoding import force_bytes
from .utils import send_order_update_to_websocket
from django.contrib.auth.decorators import login_required
from rest_framework_simplejwt.tokens import RefreshToken
from django.http import JsonResponse
from rest_framework.decorators import api_view,permission_classes
from rest_framework import status
from .models import Dish, Cart, CartItem,Order,Ingredients,Review
from .serializers import CartSerializer,CartItemSerializer,OrderSerializer,IngredientsSerializer,CustomBurgerSerializer,LoginSerializer,UserSerializer,OrderStatusUpdateSerializer,LogoutSerializer,ReviewSerializer
import random
import time


from rest_framework.views import APIView
from django.views.decorators.csrf import csrf_exempt
from django.middleware.csrf import get_token
from django.contrib.auth import authenticate
import json
from rest_framework.permissions import IsAdminUser




class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()

    def validate(self, attrs):
        refresh_token = attrs.get('refresh')

        if not refresh_token:
            raise ValidationError('Refresh token is required for logout.')

        try:
            # Пытаемся создать объект RefreshToken
            token = RefreshToken(refresh_token)
        except Exception as e:
            logger.error(f"Error validating token: {str(e)}")  # Логируем ошибку
            raise ValidationError(f'Invalid or expired refresh token: {str(e)}')

        return attrs

    def save(self, **kwargs):
        refresh_token = self.validated_data['refresh']

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()  # Черный список токена
        except Exception as e:
            logger.error(f"Error blacklisting token: {str(e)}")  # Логируем ошибку
            raise ValidationError(f'Error blacklisting the refresh token: {str(e)}')
class IngredientsList(generics.ListAPIView):
    queryset = Ingredients.objects.all()
    serializer_class = IngredientsSerializer




class MenuViewSet(viewsets.ModelViewSet):
    queryset = Menu.objects.all()
    serializer_class = MenuSerializer

class DishViewSet(viewsets.ModelViewSet):
    queryset = Dish.objects.all()
    serializer_class = DishSerializer

class ReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer

    def get_queryset(self):
        dish_id = self.kwargs.get('dish_id')  # Получаем dish_id из URL
        if dish_id:
            return Review.objects.filter(dish_id=dish_id)
        return Review.objects.none()

    def perform_create(self, serializer):
        dish_id = self.kwargs.get('dish_id')  # Передаем dish_id для нового отзыва
        serializer.save(dish_id=dish_id)



@csrf_exempt
@api_view(['GET'])
def get_cart(request):
    session = request.session

    session_key = request.session.session_key

    cart = Cart.objects.filter(
        session_key=session.session_key,
        is_ordered=False
    ).first()

    if not cart:
        return Response({"cart_items": []})

    items = CartItem.objects.filter(cart=cart)
    return Response({
        "cart_items": CartItemSerializer(items, many=True).data
    })
@csrf_exempt
@api_view(['POST'])
def add_to_cart(request):
    cart = add_to_cart_service(
        request=request,
        dish_id=request.data.get("dish_id"),
        quantity=request.data.get("quantity", 1),
        ingredients=request.data.get("ingredients"),
    )

    return Response({
        "cart_items": CartItemSerializer(
            cart.items.all(), many=True
        ).data
    })





@api_view(['POST'])
@transaction.atomic
def create_order(request):
    user_session = request.session.session_key
    phone_number = request.data.get('phone_number')
    delivery_address = request.data.get('delivery_address')
    try:



        cart = Cart.objects.get(session_key=user_session, is_ordered=False)
        total_price = 0
        for item in cart.items.all():
            if item.dish:
                total_price += item.dish.price * item.quantity
            else:
                total_price += item.custom_dish_price * item.quantity

            for ingredient in item.ingredients.all():
                if ingredient.extra_cost:
                    total_price += ingredient.extra_cost * item.quantity

        for ingredient in item.ingredients.all():
            if ingredient.extra_cost is not None:
                print(f"Ingredient: {ingredient.name}, Extra Cost: {ingredient.extra_cost}, Quantity: {item.quantity}")
                total_price += ingredient.extra_cost * item.quantity

            else:
                print(f"Ингредиент {ingredient.name} не имеет стоимости")
        coordinates = generate_emulated_coordinates()
        latitude = coordinates["delivery_latitude"]
        longitude = coordinates["delivery_longitude"]

        order = Order.objects.create(
            user=request.user,


            cart=cart, total_price=total_price,
            status="Pending",
            phone_number=phone_number,
            delivery_address=delivery_address,
            delivery_latitude=latitude,
            delivery_longitude=longitude
        )
        serializer = OrderSerializer(order)
        cart.is_ordered = True
        cart.save()
        """request.session.cycle_key()"""

        serialized_data = serializer.data
        send_order_update_to_websocket(serialized_data)










        return JsonResponse({'success': True, 'order': serializer.data,'message': 'Ваш заказ успешно оформлен!'})



    except Cart.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Cart not found'}, status=400)
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)






@api_view(['PUT'])
def update_cart_item_quantity(request,item_id):
    user_session = request.session.session_key
    try:
        cart_item = CartItem.objects.get(id=item_id)

        if cart_item.cart.session_key != user_session:
            return Response({'success': False, 'message': 'У вас нет доступа к этому элементу'}, status=403)
        serializer = CartItemSerializer(cart_item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()


            return Response({'success':True,'message':'Количество обновлено'},status=200)
        else:
            return Response({'success':False,'message':'Количество должно быть больше нуля'},status=400)
    except CartItem.DoesNotExist:
        return Response ({'success':False,'message':'Предмет не найден'},status=404)

@api_view(['DELETE'])
def delete_item(request,item_id):
    user_session = request.session.session_key
    if not user_session:
        return Response({'error' : 'No active session'},status=status.HTTP_400_BAD_REQUEST)

    try:
        cart_item = CartItem.objects.get(id=item_id)

        cart_item.delete()
        cart = Cart.objects.get(session_key=user_session, is_ordered=False)

        serializer = CartSerializer(cart)



        return Response({'success':True,'message': 'Item removed from cart',  'cart': serializer.data },status=status.HTTP_200_OK)
    except CartItem.DoesNotExist:
        return Response({'error':'Item not found in cart '},status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def add_custom_burger_to_cart(request):
    if request.method == 'POST':
        print("Данные запроса:", request.data)
        serializer = CustomBurgerSerializer(data=request.data)

        if serializer.is_valid():
            session_key = request.session.session_key
            if not session_key:
                request.session.create()

            # Создаем кастомный бургер
            cart, created = Cart.objects.get_or_create(session_key=request.session.session_key, is_ordered=False)

            menu_id = request.data.get('menu_id')
            try:
                menu = Menu.objects.get(id=menu_id)
                custom_dish_type = menu.dish_type
                custom_dish_price = 20.00 if custom_dish_type == 'Burgers' else 10.00 if custom_dish_type == 'Pizza' else 0.00


            except Menu.DoesNotExist:
                return Response({"error": "Меню не найдено"}, status=status.HTTP_404_NOT_FOUND)


            # Добавляем кастомный бургер в корзину как элемент
            cart_item = CartItem.objects.create(
                cart=cart,
                menu_id=menu_id,
                custom_dish_type=custom_dish_type,
                custom_dish_price=custom_dish_price,
                quantity=request.data.get('quantity', 1)


            # Здесь добавьте дополнительные поля, если они нужны
            )
            cart_item.ingredients.set(serializer.validated_data['ingredients'])  # Добавляем ингредиенты
            cart_item.save()

            cart_item_serializer = CartItemSerializer(cart_item)
            return Response(cart_item_serializer.data, status=status.HTTP_201_CREATED)




        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def remove_ingredient_from_cart(request, ingredient_id,item_id):
    user_session = request.session.session_key
    if not user_session:
        return Response({'error' : 'No active session'},status=status.HTTP_400_BAD_REQUEST)
    try:
        cart = get_object_or_404(Cart,session_key=user_session,is_ordered=False)
        cart_item = get_object_or_404(CartItem,id=item_id,cart=cart)
        # Получаем ингредиент
        ingredient = get_object_or_404(Ingredients, id=ingredient_id)

        cart_item.ingredients.remove(ingredient)

        if not cart_item.ingredients.exists() and cart_item.custom_dish_type:
            # Если ингредиентов больше нет, удаляем CartItem
            cart_item.delete()

        # Удаляем ингредиент из всех связанных CartItems


        return JsonResponse({'success': True, 'message': 'Ингредиент успешно удален.'})

    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=400)



LAT_MIN = 36.4
LAT_MAX = 36.7
LNG_MIN = 31.7
LNG_MAX = 32.3



current_coordinates = { "delivery_latitude": 36.543,  # Начальная широта (пример)
    "delivery_longitude": 31.999, }

def generate_emulated_coordinates():
    global current_coordinates
    latitude_change = random.uniform(-0.01, 0.01)
    longitude_change = random.uniform(-0.01, 0.01)

    new_latitude = current_coordinates["delivery_latitude"] + latitude_change
    new_longtitude = current_coordinates["delivery_longitude"] + longitude_change

    if LAT_MIN <= new_latitude <= LAT_MAX:
        current_coordinates["delivery_latitude"] = new_latitude

    if LNG_MIN <= new_longtitude <= LNG_MAX:
        current_coordinates["delivery_longitude"] = new_longtitude



    return current_coordinates

def get_emulated_coordinates(request):
    coordinates = generate_emulated_coordinates()
    return JsonResponse(coordinates)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_order_by_id(request):
    if request.user.is_staff:
        orders = Order.objects.all()
    else:
        orders = Order.objects.filter(user=request.user)

    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_orders(request):
    if not request.user.is_staff:
        return Response({"error": "Forbidden"}, status=403)

    orders = Order.objects.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)



class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']

            user = authenticate(username=username, password=password)
            if user:
                refresh = RefreshToken.for_user(user)
                access_token = refresh.access_token

                return Response({
                    'access': str(access_token),
                    'refresh': str(refresh),
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'is_staff': user.is_staff,  # 🔥 ВАЖНО
                        'is_superuser': user.is_superuser}
                })
            return Response({"error": "Invalid credentials"}, status=400)
        return Response(serializer.errors, status=400)

from rest_framework.exceptions import ParseError
class LogoutView(APIView):

    def post(self, request):
        try:
            print("Raw request data:", request.body)  # Логируем сырые данные
            serializer = LogoutSerializer(data=request.data)
        except ParseError:
            return Response({'error': 'Invalid format. Expected JSON.'}, status=status.HTTP_400_BAD_REQUEST)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Logout successful."}, status=status.HTTP_204_NO_CONTENT)
        print("Serializer errors:", serializer.errors)  # Логируем ошибки сериализатора
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
def register(request):
    username = request.data.get("username")
    password = request.data.get("password")
    email = request.data.get("email")


    if not username or not password:
        return Response({"error":"Username and password required"},status=400)
    if User.objects.filter(username=username,email=email).exists():
        return Response({"error": "User already exists"},status=400)
    user = User.objects.create_user(username=username,password=password,email=email)
    return Response({"success": True})
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data, status=200)


class CsrfTokenView(APIView):
    def get(self, request):
        csrf_token = get_token(request)  # Fetch the CSRF token
        return Response({"csrf_token": csrf_token})

import logging
logger = logging.getLogger(__name__)

@api_view(['GET'])
def get_status_choices(request):
    """
    Returns available status choices for orders.
    """
    choices = [{'value': choice[0], 'label': choice[1]} for choice in Order.STATUS_CHOICES]
    return Response({'choices': choices}, status=status.HTTP_200_OK)
@api_view(['POST'])
@permission_classes([IsAdminUser])  # 🔥 ТОЛЬКО АДМИН
def update_order_status(request, order_id):
    try:
        status_value = request.data.get('status')

        if status_value not in ['pending', 'completed', 'cancelled']:
            return Response({'error': 'Invalid status'}, status=400)

        order = Order.objects.get(id=order_id)
        print("ORDER BEFORE:", order.status)
        order.status = status_value
        order.save()

        return Response({'success': 'Order status updated'})

    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=404)


def get_average_rating(request, dish_id):
    average_rating = Review.objects.filter(dish_id=dish_id).aggregate(avg_rating=Avg('rating'))['avg_rating']
    return JsonResponse({'average_rating': round(average_rating, 2) if average_rating else 0})



# it is request for reset password
@api_view(['POST'])
def request_password_reset(request):
    email = request.data.get("email")
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"error": "User not found "}, status=404)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    reset_link = f"{request.scheme}://{request.get_host()}/reset/{uid}/{token}/"
    send_mail(
        "Password Reset",
        f"Click here: {reset_link}",
        "whosdefirst@gmail.com",  # можно любое имя, письма не уходят
        [email],
    )
    return Response({"success":True})


# it is admittion of reset


@api_view(['POST'])

def confirm_password_reset(request):
    uid = request.data.get("uid")
    token = request.data.get("token")
    new_password = request.data.get("new_password")

    try:
        user_id = urlsafe_base64_decode(uid).decode()
        user = User.objects.get(pk=user_id)
        print("UID:", uid)
        print("TOKEN:", token)

    except:

        return Response({"error": "Invalid token"},status=400)


    if not default_token_generator.check_token(user, token):
        return Response({"error":"invalid token"},status=400)
    user.set_password(new_password)
    user.save()
    return Response({"success": True})

