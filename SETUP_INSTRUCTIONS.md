# MellAC Setup Instructions

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js 18 or higher (`node -v`)
- ✅ pnpm 8 or higher (`pnpm -v`) - or npm/yarn

## Step 1: Install Dependencies

```bash
pnpm install
```

This installs all required packages including:
- `next` - React framework
- `better-sqlite3` - Database
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `tailwindcss` & `shadcn/ui` - UI framework

## Step 2: Database Setup (Optional - Auto-initializes)

The database will be created automatically on first server start. To initialize manually:

```bash
pnpm setup
```

This creates `./data/mellac.db` with all tables and indexes.

## Step 3: Start Development Server

```bash
pnpm dev
```

Expected output:
```
> next dev

  ▲ Next.js 16.1.6
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 1.5s
```

## Step 4: Open Application

Open your browser to: **http://localhost:3000**

You'll be redirected to `/login` automatically.

## Step 5: Create Your First Account

1. Click "Зарегистрироваться" (Register)
2. Enter:
   - **Имя пользователя** (Username): `admin`
   - **Email**: `admin@example.com`
   - **Пароль** (Password): `MySecurePassword123`
   - **Подтвердите пароль** (Confirm): `MySecurePassword123`
3. Click "Зарегистрироваться"
4. You'll be redirected to dashboard

## Step 6: Create Your First Server

1. Go to **Серверы** (Servers) in sidebar
2. Click on **Добавить сервер** (Add Server) tab
3. Fill the form:
   - **Название сервера**: `Test Server`
   - **IP адрес**: `localhost` or `127.0.0.1`
   - **Порт**: `25565`
4. Click "Добавить сервер"
5. **COPY YOUR API KEY** - You'll need this!

## Step 7: Test the API

Send a test cheat report using curl:

```bash
curl -X POST http://localhost:3000/api/cheat-reports \
  -H "Content-Type: application/json" \
  -d '{
    "api_key": "srv_YOUR_COPIED_KEY_HERE",
    "player_name": "TestPlayer",
    "player_ip": "127.0.0.1",
    "cheat_type": "aimbot",
    "cheat_reason": "Suspicious aiming",
    "severity": "high"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Отчет о читах получен"
}
```

## Step 8: View in Dashboard

1. Go to **Серверы** → Click your server
2. You should see your test detection in the table
3. Check stats cards for numbers

## Troubleshooting

### "Port 3000 already in use"

Use a different port:
```bash
pnpm dev -- -p 3001
```

Then open http://localhost:3001

### "Database locked" error

Delete and recreate the database:
```bash
rm -rf data/
pnpm dev
```

### "Cannot find module" errors

Reinstall dependencies:
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Can't login or register

Clear browser storage:
1. Open DevTools (F12)
2. Go to Application → Local Storage
3. Delete all entries
4. Refresh page

### API requests failing

1. Check database is initialized: `ls data/mellac.db`
2. Check server is running: see terminal
3. Verify API key is correct (should start with `srv_`)
4. Check Content-Type header is `application/json`

## Project Structure

```
mellac/
├── app/                      # Next.js App Router
│   ├── api/                 # Backend endpoints
│   ├── dashboard/           # Admin pages
│   ├── login/ & /register/  # Auth pages
│   └── page.tsx             # Home page
├── components/              # React components
├── lib/                     # Utilities (auth, db)
├── data/                    # SQLite database (created)
├── public/                  # Static assets
├── scripts/                 # Setup scripts
└── README.md               # Full documentation
```

## Database Location

SQLite database is stored at: `./data/mellac.db`

To inspect:
```bash
# Using sqlite3 CLI
sqlite3 data/mellac.db

# Inside CLI
sqlite> .tables
sqlite> SELECT * FROM users;
sqlite> .exit
```

## Environment Variables

Create `.env.local` in project root (optional):

```env
JWT_SECRET=my-super-secret-key-change-this
NODE_ENV=development
```

For production, always set a strong `JWT_SECRET`.

## Available Commands

```bash
# Development
pnpm dev                 # Start dev server

# Building
pnpm build              # Build for production
pnpm start              # Run production build

# Utility
pnpm setup              # Initialize database manually
pnpm lint               # Run ESLint

# Clear everything
pnpm clean              # Remove node_modules and build files
```

## Testing Your Setup

### 1. Check API is working

```bash
curl http://localhost:3000/api/servers \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 2. Check authentication

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@test.com","password":"testpass123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass123"}'
```

### 3. Check database

```bash
# After creating a server, verify it's in DB
sqlite3 data/mellac.db "SELECT * FROM servers;"
```

## Next Steps

1. **Read Documentation**:
   - See `QUICKSTART.md` for quick overview
   - See `README.md` for full documentation
   - See `PLUGIN_GUIDE.md` for plugin integration

2. **Customize**:
   - Change colors in `tailwind.config.ts`
   - Modify UI in `/components`
   - Add features to pages

3. **Deploy**:
   - Deploy to Vercel (recommended)
   - Or use Docker, AWS, etc.
   - Update `JWT_SECRET` for production

4. **Integrate Plugin**:
   - Build Minecraft plugin to use API
   - Follow `PLUGIN_GUIDE.md` for details

## Production Deployment Checklist

Before deploying:

- [ ] Change `JWT_SECRET` to random strong value
- [ ] Set `NODE_ENV=production`
- [ ] Consider migrating from SQLite to PostgreSQL
- [ ] Enable HTTPS/SSL
- [ ] Set up error logging
- [ ] Configure CORS if needed
- [ ] Set up database backups
- [ ] Review security settings
- [ ] Test all API endpoints
- [ ] Set up monitoring

## Support & Documentation

- **Full Docs**: See `README.md`
- **Quick Start**: See `QUICKSTART.md`
- **Plugin Guide**: See `PLUGIN_GUIDE.md`
- **This Guide**: See `SETUP_INSTRUCTIONS.md`

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Port already in use | Use different port: `pnpm dev -- -p 3001` |
| Database locked | Delete `data/` folder and restart |
| Module not found | Run `pnpm install` again |
| Login not working | Clear browser storage (F12 → Application) |
| API fails | Verify server is running, check console |
| No database | Run `pnpm setup` or wait for auto-init |

---

## You're All Set! 🎉

Your MellAC anti-cheat system is now ready to use!

1. **Dashboard**: http://localhost:3000
2. **Login**: Use credentials from Step 5
3. **Create Server**: Follow Step 6
4. **Test API**: Follow Step 7
5. **View Data**: Follow Step 8

For help, check the documentation files or review console logs.

**Happy monitoring!**
