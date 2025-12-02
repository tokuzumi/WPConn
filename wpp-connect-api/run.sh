#!/bin/bash

# Executa as migrações do banco de dados
echo "Running database migrations..."
alembic upgrade head

# Inicia a aplicação com Gunicorn (8 Workers para 8 vCPUs)
echo "Starting application with Gunicorn..."
gunicorn app.main:app --workers 8 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000 --forwarded-allow-ips '*'
