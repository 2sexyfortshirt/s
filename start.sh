# Запуск миграций (опционально)
python manage.py migrate --noinput
# Запуск Daphne или Gunicorn
daphne -b 0.0.0.0 -p $PORT mychiko.asgi:application