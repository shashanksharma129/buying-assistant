# GitHub Setup Guide

This guide will help you push your AI Buying Assistant to GitHub.

## Prerequisites

- Git installed on your system
- A GitHub account ([Sign up here](https://github.com/join))

## Step-by-Step Instructions

### 1. Initialize Git Repository (if not already done)

```bash
cd ~/code/buying-assistant
git init
```

### 2. Configure Git (First Time Only)

```bash
# Set your name and email
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 3. Create a New Repository on GitHub

1. Go to [GitHub](https://github.com)
2. Click the **"+"** icon in the top right
3. Select **"New repository"**
4. Fill in the details:
   - **Repository name**: `buying-assistant` (or your preferred name)
   - **Description**: "AI Buying Assistant powered by Google ADK and Gemini"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click **"Create repository"**

### 4. Add All Files to Git

```bash
# Add all files (respecting .gitignore)
git add .

# Check what will be committed
git status
```

### 5. Create Initial Commit

```bash
git commit -m "Initial commit: AI Buying Assistant with Google ADK"
```

### 6. Connect to GitHub Repository

Replace `yourusername` with your actual GitHub username:

```bash
git remote add origin https://github.com/yourusername/buying-assistant.git
```

### 7. Push to GitHub

```bash
# Push to main branch
git push -u origin main
```

If you get an error about the branch name, try:

```bash
# Rename branch to main if needed
git branch -M main

# Then push
git push -u origin main
```

### 8. Verify on GitHub

Go to your repository URL: `https://github.com/yourusername/buying-assistant`

You should see all your files!

## Authentication Options

### Option 1: HTTPS with Personal Access Token (Recommended)

If prompted for credentials:

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name (e.g., "Buying Assistant")
4. Select scopes: `repo` (full control of private repositories)
5. Click "Generate token"
6. **Copy the token** (you won't see it again!)
7. Use this token as your password when pushing

### Option 2: SSH (More Secure, One-Time Setup)

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Copy the public key
cat ~/.ssh/id_ed25519.pub

# Add to GitHub:
# 1. Go to GitHub Settings → SSH and GPG keys
# 2. Click "New SSH key"
# 3. Paste your public key
# 4. Click "Add SSH key"

# Change remote to SSH
git remote set-url origin git@github.com:yourusername/buying-assistant.git
```

## Future Updates

After making changes to your code:

```bash
# Check what changed
git status

# Add changed files
git add .

# Commit with a descriptive message
git commit -m "Add feature: description of what you changed"

# Push to GitHub
git push
```

## Common Git Commands

```bash
# View commit history
git log --oneline

# View current status
git status

# View differences
git diff

# Create a new branch
git checkout -b feature-name

# Switch branches
git checkout main

# Pull latest changes
git pull
```

## .gitignore Explained

The `.gitignore` file prevents sensitive and unnecessary files from being committed:

- `.env` - Contains your API keys (NEVER commit this!)
- `.venv/` - Virtual environment (too large, can be recreated)
- `__pycache__/` - Python cache files
- `debug_*.py`, `test_*.py` - Temporary test files
- `digest.txt` - Reference documentation (too large)

## Best Practices

1. **Never commit `.env`**: Always use `.env.example` as a template
2. **Write clear commit messages**: Describe what and why, not how
3. **Commit often**: Small, focused commits are better than large ones
4. **Use branches**: Create feature branches for new work
5. **Pull before push**: Always pull latest changes before pushing

## Troubleshooting

### "Repository not found"
- Check the repository URL is correct
- Ensure you have access to the repository

### "Authentication failed"
- Verify your username and token/password
- For SSH, ensure your key is added to GitHub

### "Updates were rejected"
- Someone else pushed changes
- Pull first: `git pull origin main`
- Then push: `git push`

### "Large files"
- Check `.gitignore` is working
- Remove large files from staging: `git rm --cached filename`

## Need Help?

- [GitHub Docs](https://docs.github.com)
- [Git Documentation](https://git-scm.com/doc)
- [GitHub Desktop](https://desktop.github.com/) - GUI alternative

---

Happy coding! 🚀
