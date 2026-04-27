# myreactchiko/urls.py
from django.urls import path, include

from rest_framework.routers import DefaultRouter
from .views import MenuViewSet, DishViewSet, UserOrderViewSet,AdminOrderViewSet,get_cart, add_to_cart,\
    create_order, update_cart_item_quantity,\
    delete_item, IngredientsList,\
    add_custom_burger_to_cart, remove_ingredient_from_cart, \
    LoginView, LogoutView, UserProfileView, CsrfTokenView, update_order_status,\
    get_status_choices, ReviewListCreateView, get_average_rating, register, request_password_reset,\
    confirm_password_reset\


# Создайте роутер и зарегистрируйте ViewSets
router = DefaultRouter()
router.register(r'menu', MenuViewSet)
router.register(r'dishes', DishViewSet)
router.register(r'orders', AdminOrderViewSet)
router.register(r'my-orders', UserOrderViewSet, basename='my-orders')


# Укажите URL-маршруты для API
urlpatterns = [
    path('', include(router.urls)),
    path('cart/', get_cart, name='get_cart'),
    path('cart/add/', add_to_cart, name='add_to_cart'),

    path('create_order/', create_order, name='create_order'),
    path('update_cart_item/<int:item_id>/', update_cart_item_quantity, name='update_cart_item'),
    path('delete_item/<int:item_id>/', delete_item, name='delete_item'),
    path('api/ingredients/', IngredientsList.as_view(), name='ingredient-list'),
    path('api/cart/add_custom_burger/', add_custom_burger_to_cart, name='add_custom_burger_to_cart'),
    path('api/remove_ingredient/<int:item_id>/<int:ingredient_id>/', remove_ingredient_from_cart, name='remove_ingredient'),


  #  path('api/check-authorization/', check_authorization, name='check-authorization'),
    path('login/', LoginView.as_view(), name='login'),
    path('register/', register, name='register'),

    path('profile/', UserProfileView.as_view(), name='profile'),
    path('csrf-token/', CsrfTokenView.as_view(), name='csrf-token'),
    path('order/<int:order_id>/status/', update_order_status, name='update_order_status'),
    path('get_status_choices/', get_status_choices,name='get_status_choices'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('reviews/<int:dish_id>/', ReviewListCreateView.as_view()),
    path('average-rating/<int:dish_id>/', get_average_rating, name='average_rating'),
    path('password-reset/', request_password_reset, name='request_password_reset'),
    path('password-reset-confirm/', confirm_password_reset,name='confirm_password_reset'),



]

