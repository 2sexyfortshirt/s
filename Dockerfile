# =========================
# 1. Python base
# =========================
FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# =========================
# 2. System deps
# =========================
RUN apt-get update && apt-get install -y \
    curl \
    build-essential \
    gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# =========================
# 3. Workdir
# =========================
WORKDIR /app

# =========================
# 4. Python deps
# =========================
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# =========================
# 5. Copy project
# =========================
COPY . .

# =========================
# 6. Build React
# =========================
WORKDIR /app/myreactapp

RUN npm install
RUN npm run build

# =========================
# 7. Back to Django
# =========================
WORKDIR /app

# =========================
# 8. Railway port
# =========================
ENV PORT=8000
EXPOSE 8000

# =========================
# 9. Start server (IMPORTANT)
# =========================
CMD sh -c "\
python manage.py migrate --noinput && \
python manage.py collectstatic --noinput && \
daphne -b 0.0.0.0 -p $PORT mychiko.asgi:application \
"