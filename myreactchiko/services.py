from .models import Cart,CartItem,Dish,Ingredients,Order
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.password_validation import validate_password
from django.core.mail import send_mail
from django.utils.encoding import force_bytes
from django.utils.http import (urlsafe_base64_encode,urlsafe_base64_decode,)
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import os
from django.core.exceptions import ValidationError





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

import os
from django.conf import settings

print("DEBUG SENDGRID KEY:", os.environ.get("SENDGRID_API_KEY"))
print("DEBUG EMAIL BACKEND:", settings.EMAIL_BACKEND)


def send_password_reset_email(email):
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return

    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)

    reset_link = f"https://s-production-7378.up.railway.app/reset/{uid}/{token}/"

    message = Mail(
        from_email="whosdefirst@gmail.com",
        to_emails=email,
        subject="Password Reset",
        html_content=f"Reset link: {reset_link}"
    )

    try:
        sg = SendGridAPIClient(os.environ.get("SENDGRID_API_KEY"))
        response = sg.send(message)
        print("SENDGRID STATUS:", response.status_code)
    except Exception as e:
        print("SENDGRID ERROR:", str(e))

def confirm_password_service(uid, token, new_password):
    print("UID:", uid)
    print("TOKEN:", token)
    print("PASSWORD:", new_password)

    try:
        user_id = urlsafe_base64_decode(uid).decode()
        print("USER ID:", user_id)

        user = User.objects.get(pk=user_id)
        print("USER:", user)

    except Exception as e:
        print("ERROR 1:", str(e))
        raise

    print("CHECKING TOKEN")

    if not default_token_generator.check_token(user, token):
        print("TOKEN INVALID")
        raise ValueError("Invalid or expired token")

    print("TOKEN OK")

    validate_password(new_password, user)

    print("PASSWORD VALID")

    user.set_password(new_password)
    user.save()

    print("PASSWORD SAVED")