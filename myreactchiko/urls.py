# myreactchiko/urls.py
from django.urls import path, include

from rest_framework.routers import DefaultRouter
from .views import MenuViewSet, DishViewSet,  get_cart,add_to_cart,\
    create_order, update_cart_item_quantity,add_to_cart_service,\
    delete_item,IngredientsList,\
    add_custom_burger_to_cart,remove_ingredient_from_cart, get_order_by_id, get_emulated_coordinates,\
    LoginView, LogoutView, UserProfileView, CsrfTokenView, update_order_status,\
    get_status_choices, ReviewListCreateView,get_average_rating


# Создайте роутер и зарегистрируйте ViewSets
router = DefaultRouter()
router.register(r'menu', MenuViewSet)
router.register(r'dish', DishViewSet)
"""router.register(r'cart', CartViewSet)"""
"""router.register(r'cart_item', CartItemViewSet)"""

# Укажите URL-маршруты для API
urlpatterns = [
    path('', include(router.urls)),
    path('api/cart/', get_cart, name='get_cart'),
    path('api/cart/add/', add_to_cart, name='add_to_cart'),

    path('api/create_order/', create_order,name='create_order'),
    path('api/update_cart_item/<int:item_id>/', update_cart_item_quantity, name='update_cart_item'),
    path('api/delete_item/<int:item_id>/',delete_item, name='delete_item'),
    path('api/ingredients/', IngredientsList.as_view(), name='ingredient-list'),
    path('api/cart/add_custom_burger/', add_custom_burger_to_cart, name='add_custom_burger_to_cart'),
    path('api/remove_ingredient/<int:item_id>/<int:ingredient_id>/', remove_ingredient_from_cart, name='remove_ingredient_from_cart'),
    path('api/order/<int:order_id>/', get_order_by_id, name='get_order_by_id'),
    path('api/get_emulated_coordinates/', get_emulated_coordinates, name='get_emulated_coordinates'),
  #  path('api/check-authorization/', check_authorization, name='check-authorization'),
    path('api/login/', LoginView.as_view(), name='login'),

    path('profile/', UserProfileView.as_view(), name='profile'),
    path('api/csrf-token/', CsrfTokenView.as_view(), name='csrf-token'),
    path('order/<int:order_id>/update_status/', update_order_status, name='update_order_status'),
    path('api/get_status_choices',get_status_choices,name='get_status_choices'),
    path('api/logout/', LogoutView.as_view(), name='logout'),
    path('api/reviews/<int:dish_id>/', ReviewListCreateView.as_view(), name='reviews'),
    path('api/average-rating/<int:dish_id>/', get_average_rating, name='average_rating'),



]

