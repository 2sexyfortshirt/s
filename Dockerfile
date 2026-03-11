# -------------------------------
# Stage 1: React build
# -------------------------------
FROM node:20-alpine AS react-build

# Создаем рабочую директорию
WORKDIR /app/myreactapp

# Копируем только package.json и package-lock.json для кэширования npm install
COPY myreactapp/package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь React проект
COPY myreactapp/. .

# Собираем production версию
RUN npm run build

# -------------------------------
# Stage 2: Python / Django
# -------------------------------
FROM python:3.13-slim AS backend

# Рабочая директория для Django
WORKDIR /app

# Обновляем pip и устанавливаем зависимости для сборки
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Копируем requirements
COPY requirements.txt .

# Устанавливаем Python зависимости
RUN pip install --no-cache-dir --upgrade pip setuptools wheel
RUN pip install --no-cache-dir -r requirements.txt

# Копируем весь Django проект
COPY . .

# Копируем собранный React build в статические файлы Django
COPY --from=react-build /app/myreactapp/build ./static/myreactapp

# Expose порт Django
EXPOSE 8000

# Команда запуска
CMD ["gunicorn", "myproject.wsgi:application", "--bind", "0.0.0.0:8000"]