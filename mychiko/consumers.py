import json
from channels.generic.websocket import AsyncWebsocketConsumer





class OrderConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("WebSocket connection request received")






        self.room_group_name = 'order_updates'

        # Присоединение к группе (группа - это просто группа клиентов, которые получат обновления)
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Этот код выполнится при отключении
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Метод для получения сообщений от группы
    async def receive(self, text_data):
        data = json.loads(text_data)
        # Пример, вы можете отправлять информацию о заказах или другие данные
        await self.send(text_data=json.dumps({
            'message': data['message']
        }))

    # Метод для отправки обновлений заказов
    async def send_order_update(self, event):
        message = event['message']  # Здесь уже JSON-строка
        print("Sending order update:", message)
        await self.send(text_data=message)  # Отправляем как есть, поскольку это уже JSON
