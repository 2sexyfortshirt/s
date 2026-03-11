# Python для Django
FROM python:3.13-slim

WORKDIR /app

# Копируем только requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копируем весь проект
COPY . .

# Сборка React (без минификации)
WORKDIR /app/myreactapp
RUN npm install
RUN npm run build

# Возвращаемся к Django
WORKDIR /app
EXPOSE 8000
CMD ["gunicorn", "myproject.wsgi:application", "--bind", "0.0.0.0:8000"]