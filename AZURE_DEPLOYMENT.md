# Azure VM Deployment Guide

This guide provides instructions for deploying the Release Checklist Tool on an Azure VM.

## Prerequisites

- Azure VM running Ubuntu 20.04 or later
- Docker and Docker Compose installed
- SSH access to the VM
- Open ports: 80, 5000 (optional: 5432 for external DB access)

## Quick Deployment

### 1. Prepare Azure VM

```bash
# SSH into your Azure VM
ssh username@YOUR_AZURE_IP

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout and login again for group changes to take effect
exit
```

### 2. Configure Azure Network Security Group

Open the following ports in Azure Portal → Network Security Group:

| Port | Protocol | Purpose |
|------|----------|---------|
| 22   | TCP      | SSH |
| 80   | TCP      | Frontend |
| 5000 | TCP      | Backend API (optional) |
| 5432 | TCP      | PostgreSQL (only if external access needed) |

**Steps:**
1. Go to Azure Portal → Virtual Machines → Your VM
2. Click on "Networking" → "Add inbound port rule"
3. Add rules for ports 80 and 5000
4. Set Source: Any (or restrict to specific IPs)
5. Destination: Any
6. Protocol: TCP
7. Action: Allow

### 3. Clone and Configure Project

```bash
# Clone repository
git clone <your-repo-url>
cd release-checklist-tool

# Create production environment file
cp .env.production .env

# Edit .env file with your Azure public IP
nano .env
```

**Update `.env` file:**

```bash
# Replace YOUR_AZURE_PUBLIC_IP with your actual Azure VM public IP
# Example: If your IP is 20.30.40.50

NODE_ENV=production
POSTGRES_PASSWORD=your_secure_password_here
DATABASE_URL=postgresql://postgres:your_secure_password_here@db:5432/release_checklist_tool

# IMPORTANT: Replace with your Azure Public IP
ALLOWED_ORIGINS=http://20.30.40.50,http://20.30.40.50:80,https://20.30.40.50

BACKEND_PORT=5000
FRONTEND_PORT=80
DB_PORT=5432
VITE_API_URL=/api
```

### 4. Build and Deploy

```bash
# Build and start services
docker-compose up -d --build

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Check specific service
docker-compose logs backend
docker-compose logs frontend
```

### 5. Verify Deployment

```bash
# Test from VM
curl http://localhost/
curl http://localhost:5000/health

# Test from your local machine (replace with your Azure IP)
curl http://YOUR_AZURE_IP/
curl http://YOUR_AZURE_IP:5000/health
```

### 6. Access Application

Open in browser:
- **Frontend:** `http://YOUR_AZURE_IP`
- **Backend API:** `http://YOUR_AZURE_IP:5000/health`
- **API Docs:** `http://YOUR_AZURE_IP:5000/api/releases`

## Configuration Options

### Option 1: Direct Port Access (Simpler)

**Pros:** Simple setup, no reverse proxy needed
**Cons:** Exposes backend port directly

```env
# .env file
ALLOWED_ORIGINS=http://YOUR_AZURE_IP,http://YOUR_AZURE_IP:80,http://YOUR_AZURE_IP:5000
BACKEND_PORT=5000
FRONTEND_PORT=80
VITE_API_URL=http://YOUR_AZURE_IP:5000/api
```

Frontend accesses backend at: `http://YOUR_AZURE_IP:5000/api`

### Option 2: Nginx Reverse Proxy (Recommended)

**Pros:** Single entry point, better security, easier SSL setup
**Cons:** Slightly more complex nginx configuration

The nginx.conf already handles this. Just use:

```env
# .env file
ALLOWED_ORIGINS=http://YOUR_AZURE_IP
BACKEND_PORT=5000
FRONTEND_PORT=80
VITE_API_URL=/api
```

Frontend accesses backend at: `/api` (proxied through nginx to backend:5000)

## Troubleshooting

### Issue: "Connection Refused" from outside VM

**Solution:** Check Azure NSG rules and firewall

```bash
# Check if ports are listening
sudo netstat -tulpn | grep -E '(80|5000)'

# Check Docker containers
docker-compose ps

# Check Azure NSG
# Go to Azure Portal → VM → Networking → Check inbound rules
```

### Issue: CORS Errors

**Solution:** Update ALLOWED_ORIGINS in .env

```bash
# Edit .env
nano .env

# Add your IP/domain to ALLOWED_ORIGINS
ALLOWED_ORIGINS=http://YOUR_IP,http://YOUR_DOMAIN.com,https://YOUR_DOMAIN.com

# Restart backend
docker-compose restart backend
```

### Issue: Database Connection Errors

**Solution:** Check DATABASE_URL and database status

```bash
# Check database logs
docker-compose logs db

# Connect to database
docker-compose exec db psql -U postgres -d release_checklist_tool

# Check backend can connect
docker-compose exec backend bun -e "console.log(process.env.DATABASE_URL)"
```

### Issue: Frontend Can't Reach Backend

**Solution:** Check API URL configuration

```bash
# Verify nginx is proxying correctly
docker-compose exec frontend cat /etc/nginx/conf.d/default.conf

# Test backend from frontend container
docker-compose exec frontend wget -O- http://backend:5000/health

# Verify VITE_API_URL
# Rebuild frontend if changed
docker-compose up -d --build frontend
```

## Security Best Practices

### 1. Change Default Passwords

```bash
# Generate secure password
openssl rand -base64 32

# Update in .env
POSTGRES_PASSWORD=generated_secure_password
```

### 2. Restrict CORS Origins

```env
# Instead of allowing all (*)
ALLOWED_ORIGINS=http://specific-ip.com,https://yourdomain.com
```

### 3. Enable SSL/HTTPS

Use Let's Encrypt with Certbot:

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate (requires domain)
sudo certbot --nginx -d yourdomain.com

# Update nginx configuration for SSL
# Update ALLOWED_ORIGINS to use https://
```

### 4. Firewall Configuration

```bash
# Enable UFW firewall
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 5000/tcp
sudo ufw enable
```

### 5. Don't Expose PostgreSQL Port

```yaml
# In docker-compose.yml, comment out:
# ports:
#   - "5432:5432"
```

Only expose if you need external database access.

## Monitoring

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service with timestamps
docker-compose logs -f --timestamps backend

# Last 100 lines
docker-compose logs --tail=100 backend
```

### Resource Usage

```bash
# Docker stats
docker stats

# System resources
htop
df -h
```

### Health Checks

```bash
# Backend health
curl http://localhost:5000/health

# Database health
docker-compose exec db pg_isready -U postgres

# Check container health
docker-compose ps
```

## Updating the Application

```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose down
docker-compose up -d --build

# Or update specific service
docker-compose up -d --build backend
```

## Backup and Restore

### Backup Database

```bash
# Create backup
docker-compose exec db pg_dump -U postgres release_checklist_tool > backup.sql

# Or with compression
docker-compose exec db pg_dump -U postgres release_checklist_tool | gzip > backup.sql.gz
```

### Restore Database

```bash
# Restore from backup
cat backup.sql | docker-compose exec -T db psql -U postgres release_checklist_tool

# Or from compressed
gunzip -c backup.sql.gz | docker-compose exec -T db psql -U postgres release_checklist_tool
```

## Scaling Considerations

### For Production Use:

1. **Use Azure Database for PostgreSQL** instead of container DB
2. **Set up Azure Load Balancer** for multiple VM instances
3. **Use Azure Container Registry** for Docker images
4. **Enable Azure Monitor** for application insights
5. **Set up Azure Backup** for automatic backups
6. **Use Azure Key Vault** for secrets management

## Getting Your Azure Public IP

```bash
# From within the VM
curl ifconfig.me

# Or
curl icanhazip.com

# From Azure Portal
# Go to: Virtual Machines → Your VM → Overview → Public IP address
```

## Quick Commands Reference

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart a service
docker-compose restart backend

# View logs
docker-compose logs -f backend

# Execute command in container
docker-compose exec backend sh

# Check status
docker-compose ps

# Rebuild after code changes
docker-compose up -d --build

# Clean up everything (including volumes)
docker-compose down -v
```

## Support

For issues specific to Azure deployment, check:
- Azure VM diagnostics in Azure Portal
- Docker logs: `docker-compose logs`
- System logs: `sudo journalctl -u docker`
- Network connectivity: `nc -zv localhost 5000`

## Next Steps

1. Set up a custom domain
2. Enable HTTPS with Let's Encrypt
3. Configure automated backups
4. Set up monitoring and alerts
5. Implement CI/CD with GitHub Actions
