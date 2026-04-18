FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# =========================
# system deps (nginx + node)
# =========================
RUN apt-get update && apt-get install -y \
    nginx \
    curl \
    gnupg \
    build-essential \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# =========================
# workdir
# =========================
WORKDIR /app

# =========================
# python deps
# =========================
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# =========================
# copy project
# =========================
COPY . .

# =========================
# React build (FRONTEND)
# =========================
WORKDIR /app/myreactapp

RUN npm install
RUN npm run build

# =========================
# back to Django
# =========================
WORKDIR /app

# =========================
# nginx config
# =========================
COPY nginx.conf /etc/nginx/conf.d/default.conf

# =========================
# port
# =========================
EXPOSE 80

# =========================
# run everything
# =========================
CMD sh -c "\
python manage.py migrate --noinput && \
python manage.py collectstatic --noinput && \
gunicorn mychiko.wsgi:application --bind 0.0.0.0:8000 & \
daphne -b 0.0.0.0 -p 8001 mychiko.asgi:application & \
nginx -g 'daemon off;' \

"