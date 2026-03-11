from .models import Cart,CartItem,Dish,Ingredients
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