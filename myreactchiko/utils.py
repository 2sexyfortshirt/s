from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import json
from django.core.serializers.json import DjangoJSONEncoder





def send_order_update_to_websocket(order_data):
    """
    Отправляет данные о заказе через WebSocket в группу "orders".
    """
    try:
        channel_layer = get_channel_layer()
        if channel_layer is None:
            print("Channel layer is None. Check your settings.")
        else:
            print("Channel layer successfully retrieved.")
    except Exception as e:
        print(f"Error retrieving channel layer: {e}")
    print("Sending data to WebSocket group...")
    async_to_sync(channel_layer.group_send)(
        "order_updates",  # Имя группы
        {
            "type": "send_order_update",  # Метод обработки в Consumer
            "message": json.dumps(order_data, cls=DjangoJSONEncoder)

        }
    )
    print("Serialized order data:", json.dumps(order_data, cls=DjangoJSONEncoder))
