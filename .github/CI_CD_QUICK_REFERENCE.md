# CI/CD Quick Reference

Quick reference guide for developers working with the GitHub Actions CI/CD pipeline.

## 🚀 Quick Start

### Running Tests Locally

```bash
# Backend
cd backend
bun install
bun test

# Frontend
cd frontend
npm install
npm test
```

### Building Docker Images

```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build backend
docker-compose build frontend
```

### Triggering Workflows

```bash
# Using GitHub CLI
gh workflow run ci.yml
gh workflow run deploy.yml -f environment=production -f tag=v1.0.0
gh workflow run docker-publish.yml

# View workflow runs
gh run list
gh run watch
```

## 📋 Workflow Triggers

| Workflow | Trigger | When to Use |
|----------|---------|-------------|
| CI Pipeline | Auto (Push/PR) | Every commit |
| Docker Publish | Auto (Push to main/Tag) | After merge to main |
| Deploy | Manual | When ready to deploy |
| Release | Auto (Tag push) | Creating releases |
| Code Quality | Auto (Push/PR) | Every commit |
| PR Labeler | Auto (PR) | Automatic |
| Stale | Scheduled (Daily) | Automatic |

## 🏷️ Creating Releases

```bash
# 1. Update version
# Edit package.json files

# 2. Commit changes
git add .
git commit -m "chore: bump version to 1.0.0"

# 3. Create tag
git tag -a v1.0.0 -m "Release v1.0.0"

# 4. Push tag
git push origin v1.0.0

# 5. Release workflow auto-creates GitHub release
```

## 🐳 Pulling Docker Images

```bash
# Latest images
docker pull ghcr.io/YOUR_USERNAME/release-checklist-tool-backend:latest
docker pull ghcr.io/YOUR_USERNAME/release-checklist-tool-frontend:latest

# Specific version
docker pull ghcr.io/YOUR_USERNAME/release-checklist-tool-backend:v1.0.0
docker pull ghcr.io/YOUR_USERNAME/release-checklist-tool-frontend:v1.0.0
```

## 🔍 Checking Status

### Via GitHub UI
1. Go to **Actions** tab
2. Select workflow
3. View run details

### Via CLI
```bash
# List recent runs
gh run list --workflow=ci.yml

# View specific run
gh run view <run-id>

# Watch in real-time
gh run watch
```

## 📊 Status Badges

Add to README.md:

```markdown
![CI](https://github.com/YOUR_USERNAME/release-checklist-tool/workflows/CI%20Pipeline/badge.svg)
![Docker](https://github.com/YOUR_USERNAME/release-checklist-tool/workflows/Docker%20Build%20and%20Publish/badge.svg)
![CodeQL](https://github.com/YOUR_USERNAME/release-checklist-tool/workflows/Code%20Quality/badge.svg)
```

## 🐛 Debugging Failed Workflows

### CI Pipeline Failures

```bash
# Check test logs
gh run view --log-failed

# Run tests locally with same setup
docker-compose up -d db
cd backend && bun test
cd frontend && npm test
```

### Docker Build Failures

```bash
# Build locally with verbose output
docker build --progress=plain -t test ./backend

# Check build context
docker build --no-cache -t test ./backend
```

### Deployment Failures

```bash
# Check environment secrets
gh secret list

# View deployment logs
gh run view --job=<job-id>
```

## 🔐 Required Secrets

| Secret | Required For | How to Set |
|--------|--------------|------------|
| GITHUB_TOKEN | All workflows | Auto-provided |
| CODECOV_TOKEN | Coverage reports | Optional |
| SSH_PRIVATE_KEY | Deployments | If using SSH |
| DEPLOY_HOST | Deployments | If using SSH |
| DEPLOY_USER | Deployments | If using SSH |

### Setting Secrets

```bash
# Via GitHub CLI
gh secret set SECRET_NAME

# Via UI
Settings → Secrets and variables → Actions → New repository secret
```

## 🏷️ PR Labels

Auto-applied labels based on file changes:
- `backend` - Backend code changes
- `frontend` - Frontend code changes
- `database` - Database/migration changes
- `tests` - Test file changes
- `documentation` - Markdown files
- `ci` - GitHub Actions changes
- `docker` - Docker-related changes
- `dependencies` - Package updates
- `size/xs` to `size/xl` - PR size

## 📝 Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: add new feature
fix: resolve bug
docs: update documentation
chore: update dependencies
test: add tests
refactor: code restructuring
perf: performance improvement
ci: update workflows
```

## ⚡ Performance Tips

### Speed Up CI

1. **Use cache:**
   - Node modules cached automatically
   - Docker layers cached with BuildKit

2. **Run tests in parallel:**
   - Frontend and backend run concurrently

3. **Skip CI when not needed:**
   ```bash
   git commit -m "docs: update README [skip ci]"
   ```

### Reduce Build Time

1. **Optimize Dockerfile:**
   - Order layers by change frequency
   - Use multi-stage builds
   - Minimize image size

2. **Use .dockerignore:**
   - Exclude unnecessary files
   - Reduce build context size

## 🔄 Common Workflows

### Feature Development

```bash
# 1. Create branch
git checkout -b feature/new-feature

# 2. Make changes
# ... code ...

# 3. Commit with conventional message
git commit -m "feat: add new feature"

# 4. Push and create PR
git push origin feature/new-feature
gh pr create

# 5. CI runs automatically
# 6. Address review comments
# 7. Merge when green
```

### Hotfix

```bash
# 1. Create hotfix branch from main
git checkout -b hotfix/critical-bug main

# 2. Fix the bug
# ... code ...

# 3. Commit
git commit -m "fix: resolve critical bug"

# 4. Create PR to main
git push origin hotfix/critical-bug
gh pr create --base main

# 5. After merge, create patch release
git tag v1.0.1
git push origin v1.0.1

# 6. Deploy
gh workflow run deploy.yml -f environment=production -f tag=v1.0.1
```

### Dependency Updates

```bash
# Dependabot creates PRs automatically
# Review and merge Dependabot PRs
gh pr list --author app/dependabot
gh pr merge <pr-number> --merge
```

## 📚 Additional Resources

- [Full CI/CD Documentation](./CI_CD.md)
- [Docker Setup Guide](./DOCKER.md)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [GitHub CLI Manual](https://cli.github.com/manual/)

## 🆘 Getting Help

1. Check workflow logs in Actions tab
2. Review [CI_CD.md](./CI_CD.md) documentation
3. Search existing issues
4. Create new issue with `bug` label
5. Tag maintainers for urgent issues

## 📞 Quick Commands

```bash
# View all workflows
gh workflow list

# Enable/disable workflow
gh workflow enable ci.yml
gh workflow disable stale.yml

# Re-run failed jobs
gh run rerun <run-id> --failed

# Download artifacts
gh run download <run-id>

# View workflow file
gh workflow view ci.yml --yaml
```
