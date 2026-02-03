# Railway Deployment Guide

## Quick Deploy

### Option 1: Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project (from grant-navigator directory)
railway init

# Deploy
railway up
```

### Option 2: GitHub Integration

1. Push the `grant-navigator` folder to a GitHub repository
2. Go to [railway.app](https://railway.app)
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway auto-detects Next.js and deploys

## Configuration

The app is pre-configured with:

- **railway.toml** - Build and deploy settings
- **Health check** - `/api/health` endpoint
- **Bundled data** - `data/opportunities/` directory

## Environment Variables (Optional)

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `production` |

## Post-Deployment

After deployment, Railway provides:
- A public URL (e.g., `https://your-app.up.railway.app`)
- Automatic HTTPS
- Logs and metrics dashboard

## Updating Data

To update opportunity data:

1. Update files in `data/opportunities/`
2. Commit and push changes
3. Railway auto-redeploys

## Troubleshooting

### Build Fails
- Check `npm run build` works locally
- Verify all dependencies in package.json

### Data Not Loading
- Ensure `data/opportunities/ENRICHED-OPPORTUNITIES.csv` exists
- Check folder structure matches expected format

### Performance Issues
- Enable Railway's autoscaling
- Consider upgrading to Pro plan for better resources
