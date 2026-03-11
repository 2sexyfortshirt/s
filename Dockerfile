# --- Python / Django ---
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# --- React build ---
WORKDIR /app/myreactapp
RUN npm install
RUN npm run build

WORKDIR /app

# Django collectstatic
RUN python manage.py collectstatic --noinput

# Запуск через gunicorn
CMD ["gunicorn", "mychiko.wsgi:application", "--bind", "0.0.0.0:8080"]
