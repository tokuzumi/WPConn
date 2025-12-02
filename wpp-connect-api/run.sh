#!/bin/bash

# Executa as migrações do banco de dados
echo "Running database migrations..."
alembic upgrade head

# Inicia a aplicação com Gunicorn (4 Workers para deixar CPU livre para o LangGraph)
echo "Starting application with Gunicorn..."
gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000 --forwarded-allow-ips '*'
