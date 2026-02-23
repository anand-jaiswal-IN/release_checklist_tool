# GitHub Actions CI/CD Setup

This directory contains GitHub Actions workflows for continuous integration and deployment.

## Workflows

### 1. CI Workflow (`ci.yml`)

**Purpose:** Run tests for frontend and backend on every push and pull request.

**Triggers:**
- Push to `main` or `develop` branches  - Pull requests to `main` or `develop` branches

**Jobs:**
- **Backend Tests:** Runs backend tests with PostgreSQL database
- **Frontend Tests:** Lints and tests frontend, verifies build

**No secrets required** - runs automatically on push/PR.

---

### 2. Deploy Workflow (`deploy.yml`)

**Purpose:** Deploy the application to Azure VM using Docker containers.

**Triggers:**
- Push to `main` branch
- Manual trigger via workflow_dispatch

**What it does:**
1. SSHs into Azure VM
2. Pulls latest code from GitHub
3. Rebuilds and restarts Docker containers

---

## Setup Instructions

### Required GitHub Secrets

Add the following secrets to your GitHub repository (Settings → Secrets and variables → Actions → New repository secret):

| Secret Name | Description | Example |
|------------|-------------|---------|
| `AZURE_VM_HOST` | Public IP address of your Azure VM | `20.30.40.50` |
| `AZURE_VM_USERNAME` | SSH username for Azure VM | `azureuser` |
| `AZURE_VM_SSH_KEY` | Private SSH key for authentication | Contents of `~/.ssh/id_rsa` |

### Setting up SSH Key

1. **Generate SSH key on your local machine** (if you don't have one):
   ```bash
   ssh-keygen -t rsa -b 4096 -C "github-actions"
   ```

2. **Copy public key to Azure VM:**
   ```bash
   ssh-copy-id username@YOUR_AZURE_VM_IP
   ```
   
   Or manually add it:
   ```bash
   # On Azure VM
   mkdir -p ~/.ssh
   echo "YOUR_PUBLIC_KEY" >> ~/.ssh/authorized_keys
   chmod 700 ~/.ssh
   chmod 600 ~/.ssh/authorized_keys
   ```

3. **Add private key to GitHub Secrets:**
   - Copy the contents of your private key:
     ```bash
     cat ~/.ssh/id_rsa
     ```
   - Go to GitHub repository → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `AZURE_VM_SSH_KEY`
   - Value: Paste the entire private key (including `-----BEGIN...` and `-----END...`)

### Azure VM Prerequisites

Ensure your Azure VM has:
1. Docker and Docker Compose installed
2. Repository cloned to `/home/USERNAME/release-checklist-tool`
3. Port 22 (SSH) open in Network Security Group
4. Port 80 (HTTP) open for frontend access
5. Port 5000 open for backend API (optional)

### First-Time Setup on Azure VM

```bash
# SSH into Azure VM
ssh username@YOUR_AZURE_VM_IP

# Clone repository
cd /home/username
git clone https://github.com/YOUR_USERNAME/release-checklist-tool.git
cd release-checklist-tool

# Create .env file
nano .env
# Add your environment variables (see AZURE_DEPLOYMENT.md)

# Initial deployment
docker-compose up -d --build
```

---

## Usage

### Automatic Deployment

Once secrets are configured, deployment happens automatically when you push to `main`:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

### Manual Deployment

Trigger deployment manually:
1. Go to GitHub repository → Actions
2. Select "Deploy to Azure VM" workflow
3. Click "Run workflow"
4. Select branch and click "Run workflow"

---

## Monitoring

### View Workflow Runs

GitHub repository → Actions → Select workflow → View run details

### Check Deployment Status

SSH into Azure VM and check container status:
```bash
ssh username@YOUR_AZURE_VM_IP
cd release-checklist-tool
docker-compose ps
docker-compose logs -f
```

---

## Troubleshooting

### Deployment Fails

1. **Check SSH connection:**
   ```bash
   ssh -i ~/.ssh/id_rsa username@YOUR_AZURE_VM_IP
   ```

2. **Verify secrets are correctly set in GitHub**

3. **Check Azure VM has enough resources:**
   ```bash
   df -h  # Check disk space
   free -h  # Check memory
   ```

4. **View container logs:**
   ```bash
   docker-compose logs backend
   docker-compose logs frontend
   ```

### Tests Fail in CI

1. Check the Actions tab for error details
2. Run tests locally to reproduce:
   ```bash
   # Backend
   cd backend
   bun test
   
   # Frontend
   cd frontend
   npm test
   ```

---

## Customization

### Change Deployment Path

If your repository is cloned to a different path on Azure VM, update the `script` section in [deploy.yml](deploy.yml):

```yaml
script: |
  cd /path/to/your/release-checklist-tool
  git pull origin main
  docker-compose down
  docker-compose up -d --build
```

### Add Environment-Specific Deployments

Create separate workflows for staging and production environments with different secrets.

---

## Security Notes

- Never commit SSH private keys to the repository
- Use separate SSH keys for GitHub Actions (not your personal key)
- Restrict SSH access in Azure Network Security Group to specific IPs if possible
- Rotate SSH keys periodically
- Review workflow runs regularly in the Actions tab
