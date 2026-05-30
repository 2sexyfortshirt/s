from .models import Cart,CartItem,Dish,Ingredients,Order
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.password_validation import validate_password
from django.core.mail import send_mail
from django.utils.encoding import force_bytes
from django.utils.http import (urlsafe_base64_encode,urlsafe_base64_decode,)




from django.db import transaction
def add_to_cart_service(*, request, dish_id, quantity=1, ingredients=None):
    if not dish_id:
        raise ValueError("dish_id is required")

    session = request.session
    if not session.session_key:
        session.create()
        session.save()

    dish = Dish.objects.get(id=dish_id)

    cart, _ = Cart.objects.get_or_create(
        session_key=session.session_key,
        is_ordered=False
    )

    cart_item, created = CartItem.objects.get_or_create(
        cart=cart,
        dish=dish,
        defaults={
            "quantity": quantity,
            "item_price": dish.price
        }
    )

    if not created:
        cart_item.quantity += int(quantity)
        cart_item.save()

    if ingredients:
        selected_ingredients = Ingredients.objects.filter(id__in=ingredients)
        cart_item.ingredients.add(*selected_ingredients)

    return cart
from django.db import transaction

class OrderService:
    @staticmethod
    @transaction.atomic
    def create_order(session_key, phone_number, delivery_address, user=None):

        cart = Cart.objects.filter(
            session_key=session_key,
            is_ordered=False
        ).first()

        if not cart:
            raise ValueError("Cart not found")

        if not cart.items.exists():
            raise ValueError("Cart is empty")

        total_price = 0
        for item in cart.items.select_related('dish'):
            if item.dish:
                total_price += item.dish.price * item.quantity

        order = Order.objects.create(
            cart=cart,
            user=user,  # 👈 вот тут
            total_price=total_price,
            status="Pending",
            phone_number=phone_number,
            delivery_address=delivery_address,
        )

        cart.is_ordered = True
        cart.save()

        return order




User = get_user_model()


def send_password_reset_email(email):
    try:
        user = User.objects.get(email=email)

    except User.DoesNotExist:
        return
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    reset_link = (
        f"https://s-production-7378.up.railway.app/"
        f"reset/{uid}/{token}/"
    )
    result = send_mail(
        "Password Reset",
        f"Reset link: {reset_link}",
        "whosdefirst@gmail.com",
        [email],
        fail_silently=False,
    )
    print("MAIL RESULT:", result)
    print("RESET LINK:", reset_link)




def confirm_password_reset(uid,token,new_password):
    try:

        user_id = (urlsafe_base64_decode(uid).decode()
                   )
        user = User.objects.get(pk=user_id)
    except(
        User.DoesNotExist,
        ValueError,TypeError,

    ):
        raise ValueError("Invalid reset link")

    if not default_token_generator.check_token(user, token,):
        raise ValueError(
            "Invalid or expired token "
        )
    validate_password(new_password,user)
    user.set_password(new_password)
    user.save(update_fields=["password"])