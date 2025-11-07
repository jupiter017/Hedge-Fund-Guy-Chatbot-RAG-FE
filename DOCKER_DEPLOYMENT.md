# 🐳 Frontend Docker Deployment Guide

Complete guide for deploying the React + TypeScript + Vite frontend using Docker.

---

## 📋 What's Included

### Production Setup
- **Multi-stage Dockerfile** - Optimized build with Nginx
- **Nginx Configuration** - Reverse proxy with API forwarding
- **Docker Compose** - Full stack orchestration
- **Health Checks** - Container monitoring

### Development Setup
- **Development Dockerfile** - Hot-reload support
- **Volume Mounting** - Real-time code updates
- **Dev Compose** - Isolated development environment

---

## 🚀 Quick Start

### Production Deployment

```bash
cd frontend

# Build the Docker image
docker build -t hedge-fund-frontend:latest .

# Run the container
docker run -d \
  --name hedge_fund_frontend \
  -p 80:80 \
  hedge-fund-frontend:latest

# Access the application
open http://localhost
```

Or use the helper script:

**Linux/Mac:**
```bash
chmod +x docker-start.sh
./docker-start.sh
```

**Windows:**
```cmd
docker-start.bat
```

### Development Mode

```bash
cd frontend

# Start with hot-reload
docker-compose -f docker-compose.dev.yml up -d

# Access at http://localhost:3000
```

---

## 📁 File Structure

```
frontend/
├── Dockerfile              # Production build (multi-stage)
├── Dockerfile.dev          # Development build (hot-reload)
├── nginx.conf             # Nginx configuration
├── docker-compose.yml     # Production compose (with backend)
├── docker-compose.dev.yml # Development compose
├── .dockerignore          # Files to exclude
├── env.docker.template    # Environment template
├── docker-start.sh        # Quick start (Linux/Mac)
└── docker-start.bat       # Quick start (Windows)
```

---

## 🏭 Production Deployment

### 1. Production Dockerfile

The production Dockerfile uses **multi-stage builds**:

**Stage 1: Builder**
- Node.js 20 Alpine
- Installs dependencies
- Builds React app with Vite

**Stage 2: Runtime**
- Nginx Alpine (minimal size)
- Serves static files
- Proxies API requests to backend

**Image Size**: ~25 MB (vs ~1.2 GB with Node.js)

### 2. Build the Image

```bash
cd frontend

# Build
docker build -t hedge-fund-frontend:latest .

# Check size
docker images hedge-fund-frontend
```

### 3. Run the Container

#### Standalone (Frontend Only)

```bash
docker run -d \
  --name hedge_fund_frontend \
  -p 80:80 \
  hedge-fund-frontend:latest
```

#### With Backend (Full Stack)

```bash
# Ensure backend image exists
cd ../backend
docker build -t hedge-fund-backend:latest .

# Start full stack
cd ../frontend
docker-compose up -d
```

### 4. Verify Deployment

```bash
# Check container status
docker ps | grep hedge_fund_frontend

# Test health endpoint
curl http://localhost/health

# View logs
docker logs -f hedge_fund_frontend
```

### 5. Access the Application

- **Frontend**: http://localhost
- **API** (proxied): http://localhost/api
- **WebSocket** (proxied): ws://localhost/ws
- **Health Check**: http://localhost/health

---

## 💻 Development Mode

### Features

✅ **Hot Module Replacement (HMR)** - Instant updates  
✅ **Volume Mounting** - Local code changes reflected immediately  
✅ **Isolated Environment** - Doesn't affect production  
✅ **Fast Rebuilds** - No need to rebuild image for code changes

### Start Development Server

```bash
cd frontend

# Start
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop
docker-compose -f docker-compose.dev.yml down
```

### Development Workflow

1. **Start container**: `docker-compose -f docker-compose.dev.yml up -d`
2. **Edit code**: Changes in `src/` automatically reload
3. **View logs**: `docker-compose -f docker-compose.dev.yml logs -f frontend`
4. **Stop**: `docker-compose -f docker-compose.dev.yml down`

### Access Points

- **Frontend**: http://localhost:3000
- **Backend** (if configured): http://localhost:8000

---

## ⚙️ Configuration

### Nginx Configuration

The `nginx.conf` file includes:

#### API Proxy
```nginx
location /api {
    proxy_pass http://backend:8000;
    # Headers for proper proxying
}
```

#### WebSocket Support
```nginx
location /ws {
    proxy_pass http://backend:8000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
```

#### Static Asset Caching
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

#### Gzip Compression
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

#### React Router Support
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### Environment Variables

Create `.env` from template:

```bash
cp env.docker.template .env
```

**Key Variables**:

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | http://localhost:8000 |
| `FRONTEND_PORT` | Frontend port | 80 |

---

## 🔧 Advanced Usage

### Custom Nginx Configuration

Edit `nginx.conf` for:
- Custom proxy rules
- SSL/TLS configuration
- Additional security headers
- Custom caching policies

Example - Add SSL:
```nginx
server {
    listen 443 ssl http2;
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    # ... rest of config
}
```

### Custom Build Arguments

```bash
# Build with custom node version
docker build \
  --build-arg NODE_VERSION=20 \
  -t hedge-fund-frontend:latest .

# Build with production optimizations
docker build \
  --build-arg NODE_ENV=production \
  -t hedge-fund-frontend:latest .
```

### Multi-Platform Builds

```bash
# Build for multiple architectures
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t hedge-fund-frontend:latest \
  --push .
```

### Volume Mounting for Development

Mount specific directories:

```bash
docker run -d \
  --name hedge_fund_frontend_dev \
  -p 3000:3000 \
  -v $(pwd)/src:/app/src \
  -v $(pwd)/public:/app/public \
  hedge-fund-frontend:dev
```

---

## 🐛 Troubleshooting

### Build Issues

#### "npm install fails"

**Cause**: Network issues or package conflicts

**Solution**:
```bash
# Clear npm cache
docker build --no-cache -t hedge-fund-frontend:latest .

# Or use package-lock.json
# Ensure package-lock.json is up to date
npm install
docker build -t hedge-fund-frontend:latest .
```

#### "Build runs out of memory"

**Cause**: Large project, insufficient Docker memory

**Solution**:
```bash
# Increase Docker memory (Docker Desktop settings)
# Or build with limited parallelism
docker build --memory=4g -t hedge-fund-frontend:latest .
```

### Runtime Issues

#### "Cannot connect to API"

**Cause**: Backend not running or wrong URL

**Solution**:
```bash
# Check backend is running
docker ps | grep backend

# Check nginx proxy config
docker exec hedge_fund_frontend cat /etc/nginx/conf.d/default.conf

# Test backend directly
curl http://localhost:8000/health
```

#### "Static files not found"

**Cause**: Build didn't complete or files not copied

**Solution**:
```bash
# Rebuild and check logs
docker build -t hedge-fund-frontend:latest . 2>&1 | tee build.log

# Verify files in image
docker run --rm hedge-fund-frontend:latest ls -la /usr/share/nginx/html
```

#### "Hot reload not working in dev mode"

**Cause**: Volume mounting issues

**Solution**:
```bash
# Check volume mounts
docker inspect hedge_fund_frontend_dev | grep Mounts -A 10

# Restart with fresh volumes
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up -d
```

### Network Issues

#### "Port already in use"

```bash
# Find process using port
# Linux/Mac
lsof -i :80
# Windows
netstat -ano | findstr :80

# Use different port
docker run -d -p 8080:80 hedge-fund-frontend:latest
```

#### "Cannot access from host"

```bash
# Ensure container is running
docker ps

# Check port mapping
docker port hedge_fund_frontend

# Check firewall rules
sudo ufw allow 80/tcp  # Linux
```

---

## 📊 Performance Optimization

### Build Optimization

1. **Smaller Image Size**
   ```dockerfile
   # Already using multi-stage build
   # Results in ~25 MB vs ~1.2 GB
   ```

2. **Layer Caching**
   ```dockerfile
   # Copy package files first (changes less often)
   COPY package*.json ./
   RUN npm ci
   # Then copy source (changes more often)
   COPY . .
   ```

3. **Production Dependencies Only**
   ```bash
   RUN npm ci --production
   ```

### Runtime Optimization

1. **Enable Gzip Compression** ✅ (Already configured)

2. **Browser Caching** ✅ (1 year for static assets)

3. **HTTP/2 Support**
   ```nginx
   listen 443 ssl http2;
   ```

4. **Resource Limits**
   ```yaml
   services:
     frontend:
       deploy:
         resources:
           limits:
             cpus: '0.5'
             memory: 256M
   ```

---

## 🔒 Security Best Practices

### Production Security

1. **Use HTTPS**
   ```nginx
   server {
       listen 443 ssl http2;
       ssl_certificate /path/to/cert.pem;
       ssl_certificate_key /path/to/key.pem;
   }
   ```

2. **Security Headers** ✅ (Already configured)
   - X-Frame-Options
   - X-Content-Type-Options
   - X-XSS-Protection

3. **Hide Nginx Version**
   ```nginx
   server_tokens off;
   ```

4. **Rate Limiting**
   ```nginx
   limit_req_zone $binary_remote_addr zone=mylimit:10m rate=10r/s;
   ```

### Container Security

1. **Run as Non-Root User**
   ```dockerfile
   RUN addgroup -g 1001 -S nodejs
   RUN adduser -S nodejs -u 1001
   USER nodejs
   ```

2. **Read-Only Filesystem**
   ```bash
   docker run --read-only hedge-fund-frontend:latest
   ```

3. **Scan for Vulnerabilities**
   ```bash
   docker scan hedge-fund-frontend:latest
   ```

---

## 📈 Monitoring

### Health Checks

```bash
# Built-in health check
curl http://localhost/health

# Container health status
docker inspect --format='{{.State.Health.Status}}' hedge_fund_frontend

# Watch health
watch -n 5 'docker inspect --format="{{.State.Health.Status}}" hedge_fund_frontend'
```

### Logs

```bash
# Follow logs
docker logs -f hedge_fund_frontend

# Last 100 lines
docker logs --tail=100 hedge_fund_frontend

# Since specific time
docker logs --since 2024-01-01T00:00:00 hedge_fund_frontend

# Save logs
docker logs hedge_fund_frontend > frontend.log 2>&1
```

### Metrics

```bash
# Container stats
docker stats hedge_fund_frontend

# Resource usage
docker inspect hedge_fund_frontend | grep -A 10 Memory
```

---

## 🚢 Deployment Strategies

### Docker Compose (Recommended)

```bash
# Full stack deployment
docker-compose up -d

# Scale frontend
docker-compose up -d --scale frontend=3

# Update frontend only
docker-compose up -d --no-deps --build frontend
```

### Kubernetes

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hedge-fund-frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: hedge-fund-frontend
  template:
    metadata:
      labels:
        app: hedge-fund-frontend
    spec:
      containers:
      - name: frontend
        image: hedge-fund-frontend:latest
        ports:
        - containerPort: 80
```

### Docker Swarm

```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml hedge-fund

# Scale service
docker service scale hedge-fund_frontend=3
```

---

## 🎯 Summary

### Quick Commands

```bash
# Production build
docker build -t hedge-fund-frontend:latest .

# Run production
docker run -d -p 80:80 hedge-fund-frontend:latest

# Development mode
docker-compose -f docker-compose.dev.yml up -d

# Stop all
docker stop hedge_fund_frontend
docker-compose -f docker-compose.dev.yml down

# Clean up
docker rm hedge_fund_frontend
docker rmi hedge-fund-frontend:latest
```

### Key Features

✅ Multi-stage build (25 MB image)  
✅ Nginx reverse proxy  
✅ API & WebSocket forwarding  
✅ Hot-reload development mode  
✅ Health checks  
✅ Gzip compression  
✅ Static asset caching  
✅ React Router support  
✅ Security headers  

---

## 🆘 Need Help?

**Quick Help**:
```bash
./docker-start.sh    # Linux/Mac
docker-start.bat     # Windows
```

**Documentation**:
- Docker: https://docs.docker.com
- Nginx: https://nginx.org/en/docs/
- Vite: https://vitejs.dev/guide/

**Common Issues**:
- Check logs: `docker logs -f hedge_fund_frontend`
- Verify health: `curl http://localhost/health`
- Restart: `docker restart hedge_fund_frontend`

---

**Happy Deploying! 🚀**

