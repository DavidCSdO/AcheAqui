FROM python:3.11-slim

WORKDIR /app

# Atualizar pacotes do sistema
RUN apt-get update && apt-get install -y \
    wget \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copiar apenas os requirements primeiro para otimizar o cache de build do Docker
COPY requirements.txt .

# Instalar dependências do Python
RUN pip install --no-cache-dir -r requirements.txt

# Instalar dependências do sistema necessárias para o Playwright (navegadores)
RUN playwright install chromium
RUN playwright install-deps

# Copiar o resto do código da aplicação
COPY . .

# Expor a porta (o Render injetará a variável $PORT dinamicamente, mas 8000 é o fallback)
EXPOSE 8000

# Usar shell para permitir a expansão da variável de ambiente $PORT
CMD ["sh", "-c", "uvicorn server:app --host 0.0.0.0 --port ${PORT:-8000}"]
