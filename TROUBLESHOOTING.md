# MellAC - Troubleshooting Guide

## Error: "Fatal error during initialization"

This error typically occurs due to database initialization issues. Here's how to fix it:

### Step 1: Verify Setup
```bash
pnpm verify
```

This will check:
- Node.js version (requires 18+)
- Dependencies installed
- Directory structure
- Required packages

### Step 2: Ensure Data Directory
The application needs a `data/` directory for SQLite database:
```bash
mkdir -p data
```

### Step 3: Clear Cache and Dependencies
```bash
rm -rf node_modules .next
pnpm install
```

### Step 4: Check Environment Variables
Create or update `.env.local`:
```bash
cp .env.example .env.local
```

Then open `.env.local` and set your JWT_SECRET if needed.

### Step 5: Run Development Server
```bash
pnpm dev
```

## Common Issues

### Issue: "better-sqlite3 is not defined"
**Cause**: better-sqlite3 is trying to run on client-side code
**Fix**: Ensure all database imports are only in server files (API routes)

### Issue: "Module not found: better-sqlite3"
**Cause**: Dependencies not installed properly
**Fix**: 
```bash
pnpm install
```

### Issue: Database file locked (database is locked)
**Cause**: Multiple instances of the app running
**Fix**: 
- Kill all Node processes: `killall node`
- Remove lock files: `rm data/mellac.db-*`
- Restart: `pnpm dev`

### Issue: Port 3000 already in use
**Cause**: Another application is using port 3000
**Fix**:
```bash
pnpm dev -- -p 3001
```

## Debug Mode

To enable more detailed logging:
```bash
DEBUG=mellac:* pnpm dev
```

## Getting Help

1. Check `.next` build cache: `rm -rf .next`
2. Reinstall dependencies: `rm -rf node_modules && pnpm install`
3. Clear all caches: `pnpm clean` (if available)
4. Check logs in browser console (F12)
5. Check terminal output for error messages

## Database Issues

### Reset Database
To start with a fresh database:
```bash
rm data/mellac.db*
pnpm dev
```

This will recreate all tables automatically.

### Verify Database
Check if database is properly created:
```bash
ls -la data/
```

You should see:
- `mellac.db` - Main database file
- `mellac.db-shm` - Shared memory file (may not always be present)
- `mellac.db-wal` - Write-ahead log (may not always be present)

## Still Having Issues?

1. Make sure you're using Node.js 18 or higher:
   ```bash
   node --version
   ```

2. Check that all packages are installed:
   ```bash
   pnpm list --depth=0
   ```

3. Look for errors in the build output:
   ```bash
   pnpm build
   ```

4. Try a clean slate:
   ```bash
   rm -rf node_modules .next data
   pnpm install
   mkdir -p data
   pnpm dev
   ```
