# --- Используем образ Python для Django ---
FROM python:3.13-slim

# --- Устанавливаем Node.js и npm ---
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# --- Создаём рабочую директорию ---
WORKDIR /app

# --- Копируем зависимости Django ---
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# --- Копируем весь проект ---
COPY . .

# --- Сборка React ---
WORKDIR /app/myreactapp
RUN npm install
RUN npm run build

# --- Возвращаемся к Django ---
WORKDIR /app
EXPOSE 8000
CMD sh -c "python manage.py migrate --noinput && \
    gunicorn mychiko.wsgi:application --bind 0.0.0.0:8000 & \
    daphne -b 0.0.0.0 -p 8001 mychiko.asgi:application"