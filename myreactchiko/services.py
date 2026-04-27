from .models import Cart,CartItem,Dish,Ingredients,Order



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