# Guia de Deploy em Produção (VPS) com Traefik

Este guia descreve os passos para implantar o WPConn em um servidor VPS (Ubuntu/Debian) usando Docker e Traefik como Reverse Proxy com SSL automático (Let's Encrypt).

## 1. Pré-requisitos
- Servidor VPS com Docker e Docker Compose instalados.
- Domínio configurado apontando para o IP do servidor:
    - `api.seudominio.com` (para o Backend)
    - `app.seudominio.com` (para o Dashboard)

## 2. Estrutura de Arquivos
No servidor, clone o repositório:
```bash
git clone https://github.com/tokuzumi/WPConn.git
cd WPConn
```

## 3. Configuração de Variáveis de Ambiente
Crie um arquivo `.env` na raiz com as configurações abaixo. O Traefik usará essas variáveis para gerar os certificados e rotear o tráfego.

```env
# Configuração de Domínios
DOMAIN_API=api.seudominio.com
DOMAIN_APP=app.seudominio.com
ACME_EMAIL=seu_email@exemplo.com

# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=sua_senha_segura_db
POSTGRES_DB=wpp_connect
DATABASE_URL=postgresql+asyncpg://postgres:sua_senha_segura_db@db:5432/wpp_connect

# Backend API
APP_SECRET=sua_chave_secreta_gerada_com_openssl
WEBHOOK_VERIFY_TOKEN=seu_token_de_verificacao_meta
API_V1_STR=/api/v1
# CORS: Deve incluir o domínio do frontend
BACKEND_CORS_ORIGINS=["https://app.seudominio.com"]

# MinIO (Opcional)
MINIO_ENDPOINT=minio:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET_NAME=whatsapp-media
MINIO_USE_SSL=False

# Frontend Dashboard
NEXTAUTH_SECRET=sua_chave_secreta_nextauth
```

## 4. Docker Compose de Produção
Utilize o arquivo `docker-compose.prod.yml` para subir os serviços. O Traefik irá automaticamente:
1.  Detectar os containers.
2.  Gerar certificados SSL para os domínios definidos.
3.  Redirecionar HTTP para HTTPS.

```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

## 5. Verificação
- Acesse `https://app.seudominio.com` para ver o Dashboard.
- Acesse `https://api.seudominio.com/docs` para ver a documentação da API.
- O Traefik Dashboard (se habilitado na porta 8080) pode ser acessado via túnel SSH ou liberando a porta (não recomendado em produção sem senha).

## 6. Manutenção
Para ver os logs do Traefik e verificar a emissão de certificados:
```bash
docker-compose -f docker-compose.prod.yml logs -f traefik
```
