# MellAC - Fresh Start Guide

If you're encountering initialization errors, follow this complete fresh start guide.

## Complete Reset (Recommended)

### 1. Clean Everything
```bash
# Remove all generated files and cache
rm -rf node_modules
rm -rf .next
rm -rf data/mellac.db*
rm -rf dist
rm -rf out
```

### 2. Reinstall Dependencies
```bash
pnpm install
```

### 3. Verify Setup
```bash
pnpm verify
```

You should see:
```
✓ Node.js version: Node.js 18+ required
✓ package.json: package.json found
✓ Dependencies: Dependencies installed
✓ App directory: App directory found
✓ Data directory: Data directory ready
✓ Required packages: All required packages installed

6 passed, 0 failed

✓ Setup verification complete! You can run "pnpm dev"
```

### 4. Start Development Server
```bash
pnpm dev
```

The server should start without errors. You should see:
```
  ▲ Next.js X.X.X
  - Local:        http://localhost:3000
  - Environment:  development
```

## If Issues Persist

### Option A: Port Conflict
If you see "Address already in use":
```bash
# Kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Or run on different port
pnpm dev -- -p 3001
```

### Option B: Node Version
Check Node.js version:
```bash
node --version  # Should be 18.0.0 or higher
```

If wrong version, install Node.js 18+

### Option C: Corrupted Dependencies
```bash
# Complete nuclear reset
rm -rf node_modules package-lock.json pnpm-lock.yaml .next data
pnpm install
mkdir -p data
pnpm dev
```

## Accessing the Application

Once running, open in browser:
- **URL**: http://localhost:3000
- **Register page**: http://localhost:3000/register
- **Login page**: http://localhost:3000/login

## Testing API

After registering and creating a server:

```bash
# Get your API key from dashboard, then:

curl -X POST http://localhost:3000/api/cheat-reports \
  -H "Content-Type: application/json" \
  -d '{
    "api_key": "YOUR_API_KEY_HERE",
    "player_name": "TestPlayer",
    "player_ip": "127.0.0.1",
    "cheat_type": "aimbot",
    "severity": "high"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Cheat report recorded",
  "log_id": 1
}
```

## Still Having Issues?

1. **Check all requirements**: Run `pnpm verify`
2. **Check logs**: Look for error messages in terminal
3. **Review TROUBLESHOOTING.md**: Detailed troubleshooting guide
4. **Review SETUP_INSTRUCTIONS.md**: Detailed setup guide

## What Gets Created

On first run, the application creates:
```
data/
├── mellac.db        # SQLite database
├── mellac.db-shm    # SQLite shared memory (temporary)
└── mellac.db-wal    # SQLite write-ahead log (temporary)
```

These files are automatically created - don't manually create them.

## Useful Commands

```bash
# Verify everything is ready
pnpm verify

# Start development server
pnpm dev

# Build for production
pnpm build

# Run production build
pnpm start

# Run ESLint
pnpm lint

# Reset database (deletes data, recreates tables)
rm data/mellac.db* && pnpm dev
```

## Environment Variables

Optional, but recommended for production:

```bash
# Create .env.local file
cp .env.example .env.local

# Edit with your values
JWT_SECRET=your-own-secret-key-at-least-32-characters
```

## Next Steps

1. ✓ Start the server: `pnpm dev`
2. ✓ Register an account: http://localhost:3000/register
3. ✓ Create a server: Dashboard → Серверы → Добавить сервер
4. ✓ Copy API key
5. ✓ Integrate with your Minecraft server plugin (see PLUGIN_GUIDE.md)
6. ✓ Monitor detections in the dashboard

Good luck with MellAC! 🎮
