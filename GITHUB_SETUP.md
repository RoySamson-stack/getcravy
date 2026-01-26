# GitHub Setup Guide

This guide will help you set up your GoEat project on GitHub and prepare it for collaboration and deployment.

## Initial GitHub Setup

### 1. Create a New Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon → "New repository"
3. Name it `getcravy` (or your preferred name)
4. Choose visibility (Public or Private)
5. **Don't** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

### 2. Initialize Git (if not already done)

```bash
# Check if git is initialized
git status

# If not initialized, run:
git init
```

### 3. Add Remote and Push

```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/yourusername/getcravy.git

# Or if using SSH:
git remote add origin git@github.com:yourusername/getcravy.git

# Stage all files
git add .

# Create initial commit
git commit -m "Initial commit: GoEat food delivery app"

# Push to GitHub
git branch -M main
git push -u origin main
```

## Repository Settings

### 1. Enable GitHub Actions

1. Go to repository Settings → Actions → General
2. Enable "Allow all actions and reusable workflows"
3. Save changes

### 2. Set Up Branch Protection

1. Go to Settings → Branches
2. Add rule for `main` branch:
   - Require pull request reviews
   - Require status checks to pass
   - Require branches to be up to date

### 3. Configure Secrets

For CI/CD to work, add these secrets in Settings → Secrets and variables → Actions:

- `EXPO_TOKEN`: Your Expo access token
  - Get it from: https://expo.dev/accounts/[your-account]/settings/access-tokens

Optional secrets:
- `APPLE_ID`: For iOS deployment
- `APPLE_APP_SPECIFIC_PASSWORD`: For iOS deployment
- `GOOGLE_SERVICE_ACCOUNT_KEY`: For Android deployment

## GitHub Features Setup

### 1. Issues

Issues are already configured with templates:
- Bug reports: `.github/ISSUE_TEMPLATE/bug_report.md`
- Feature requests: `.github/ISSUE_TEMPLATE/feature_request.md`

### 2. Pull Requests

PR template is set up at `.github/pull_request_template.md`

### 3. Dependabot

Dependabot is configured in `.github/dependabot.yml` to:
- Check for updates weekly
- Create PRs for dependency updates

### 4. GitHub Actions

CI/CD workflows are set up:
- **CI**: `.github/workflows/ci.yml` - Runs on every push/PR
- **Release**: `.github/workflows/release.yml` - Builds on version tags

## Project Management

### 1. Create Project Board

1. Go to repository → Projects tab
2. Create new project
3. Add columns:
   - Backlog
   - To Do
   - In Progress
   - Review
   - Done

### 2. Set Up Milestones

1. Go to Issues → Milestones
2. Create milestones:
   - v1.0.0 - Initial Release
   - v1.1.0 - Feature Updates
   - v2.0.0 - Major Update

### 3. Labels

Create labels for better organization:
- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Documentation improvements
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `dependencies` - Dependency updates

## Collaboration Workflow

### For Contributors

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/yourusername/getcravy.git
   cd getcravy
   ```

3. **Add upstream**
   ```bash
   git remote add upstream https://github.com/originalowner/getcravy.git
   ```

4. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

5. **Make changes and commit**
   ```bash
   git add .
   git commit -m "feat: add your feature"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create Pull Request**
   - Go to original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill out PR template

### For Maintainers

1. **Review PRs**
   - Check code quality
   - Run tests
   - Request changes if needed

2. **Merge PRs**
   - Use "Squash and merge" for cleaner history
   - Delete branch after merge

3. **Release Process**
   ```bash
   # Update version in package.json and app.json
   git tag v1.0.1
   git push origin v1.0.1
   # GitHub Actions will build automatically
   ```

## Release Process

### 1. Create Release

1. Go to Releases → "Draft a new release"
2. Choose tag (create new if needed)
3. Title: "v1.0.1 - Feature Update"
4. Description: Use CHANGELOG.md content
5. Publish release

### 2. Automated Builds

When you push a tag starting with `v`, the release workflow will:
- Build iOS app
- Build Android app
- (Configure submission if needed)

## GitHub Pages (Optional)

If you want to host documentation:

1. Go to Settings → Pages
2. Source: Deploy from a branch
3. Branch: `gh-pages` or `main` (docs folder)
4. Save

## Security

### 1. Enable Security Features

1. Go to Settings → Security
2. Enable:
   - Dependency graph
   - Dependabot alerts
   - Dependabot security updates
   - Secret scanning

### 2. Review Security Alerts

- Check Security tab regularly
- Review and fix vulnerabilities
- Update dependencies

## Best Practices

1. **Commit Messages**: Use conventional commits
   - `feat:` for features
   - `fix:` for bug fixes
   - `docs:` for documentation
   - `style:` for formatting
   - `refactor:` for refactoring
   - `test:` for tests
   - `chore:` for maintenance

2. **Branch Naming**:
   - `feature/feature-name`
   - `fix/bug-description`
   - `hotfix/urgent-fix`
   - `docs/documentation-update`

3. **PR Guidelines**:
   - Keep PRs small and focused
   - Write clear descriptions
   - Link related issues
   - Request reviews from team

4. **Code Review**:
   - Be constructive
   - Explain reasoning
   - Approve when ready
   - Request changes when needed

## Troubleshooting

### Push Rejected

```bash
# Pull latest changes first
git pull origin main --rebase

# Then push
git push origin main
```

### Merge Conflicts

```bash
# Pull latest
git pull origin main

# Resolve conflicts
# Then commit and push
git add .
git commit -m "fix: resolve merge conflicts"
git push origin main
```

## Resources

- [GitHub Docs](https://docs.github.com)
- [Git Handbook](https://guides.github.com/introduction/git-handbook/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)

## Next Steps

1. ✅ Set up repository on GitHub
2. ✅ Push initial code
3. ✅ Configure secrets
4. ✅ Set up branch protection
5. ✅ Create project board
6. ✅ Start development!

---

Happy coding! 🚀

