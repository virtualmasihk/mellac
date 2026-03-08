# MellAC - Quick Start Guide

## Prerequisites

- Node.js 18 or higher
- pnpm (npm or yarn also work)

## Installation & Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Initialize Database

The database will be created automatically on first run, but you can also initialize it manually:

```bash
pnpm setup
```

This creates a SQLite database at `./data/mellac.db`

### 3. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## First Steps

### 1. Create Account

Visit `http://localhost:3000/register` and create a new account:
- **Username**: Your admin username
- **Email**: Your email address
- **Password**: Strong password (min 6 characters)

### 2. Login

Go to `http://localhost:3000/login` and sign in with your credentials.

### 3. Create Your First Server

1. In the dashboard, go to **Servers**
2. Click **Add New Server**
3. Fill in:
   - Server Name: `My Test Server`
   - Server IP: `localhost` or your actual server IP
   - Server Port: `25565` (or your custom port)
4. Click **Add Server**
5. **Copy your API Key** - you'll need this for the plugin

### 4. Test with Cheat Report

Send a test cheat report to your API:

```bash
curl -X POST http://localhost:3000/api/cheat-reports \
  -H "Content-Type: application/json" \
  -d '{
    "api_key": "YOUR_API_KEY_HERE",
    "player_name": "TestPlayer",
    "player_ip": "127.0.0.1",
    "cheat_type": "aimbot",
    "cheat_reason": "Test detection",
    "severity": "high"
  }'
```

### 5. View in Dashboard

Go to **Servers** → Click your server → See the test detection in logs!

## Directory Structure

```
mellac/
├── app/
│   ├── api/              # API endpoints
│   ├── dashboard/        # Protected admin pages
│   ├── login/
│   ├── register/
│   └── page.tsx          # Home (redirects)
├── components/           # React components
├── lib/                  # Utilities & helpers
├── data/                 # SQLite database (created at runtime)
├── public/               # Static files
├── scripts/              # Setup scripts
└── README.md             # Full documentation
```

## API Endpoints

### Authentication

- **POST** `/api/auth/register` - Register new user
- **POST** `/api/auth/login` - Login

### Servers

- **GET** `/api/servers` - List your servers
- **POST** `/api/servers` - Create server

### Cheat Reports (from plugin)

- **POST** `/api/cheat-reports` - Submit cheat detection

### Monitoring

- **GET** `/api/logs?server_id=<id>` - Get cheat logs
- **GET** `/api/stats?server_id=<id>` - Get statistics

## Dashboard Routes

- `/` - Home (redirects to dashboard or login)
- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - Dashboard home
- `/dashboard/servers` - Server management
- `/dashboard/servers/[id]` - Server details & logs
- `/dashboard/cheaters` - Flagged players database
- `/dashboard/pricing` - Pricing plans
- `/dashboard/updates` - Update history
- `/dashboard/wiki` - Documentation
- `/dashboard/support` - Support contact

## Build & Deploy

### Build for Production

```bash
pnpm build
pnpm start
```

### Environment Variables

Create `.env.local` for custom settings:

```env
JWT_SECRET=your-super-secret-key-here
```

**IMPORTANT**: Change JWT_SECRET to a strong random value for production!

## Debugging

### Check Database

The SQLite database is stored at `./data/mellac.db`

### View Logs

Check browser console (F12) for frontend errors and terminal for backend errors.

### API Testing

Use curl or Postman to test endpoints:

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"password"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"password"}'
```

## Next Steps

1. **Read Full Docs**: Check [README.md](./README.md) for complete documentation
2. **Plugin Setup**: Follow [PLUGIN_GUIDE.md](./PLUGIN_GUIDE.md) to integrate with Minecraft plugin
3. **Deploy**: Deploy to Vercel, AWS, or your own server
4. **Customize**: Modify styling, add features, integrate with your systems

## Troubleshooting

### Port Already in Use

If port 3000 is in use:

```bash
pnpm dev -- -p 3001
```

### Database Locked Error

Delete `./data/mellac.db` and let it recreate:

```bash
rm -rf data/
pnpm dev
```

### Authentication Not Working

Clear browser storage:

1. Open DevTools (F12)
2. Application → Local Storage
3. Delete `mellac-app` entries
4. Refresh page

## Need Help?

- Check [README.md](./README.md) for detailed documentation
- Read [PLUGIN_GUIDE.md](./PLUGIN_GUIDE.md) for plugin integration
- Visit [GitHub Issues](https://github.com/yourrepo/issues) to report bugs
- Join our Discord community for support

---

**Enjoy using MellAC!** Keep your Minecraft servers fair and secure.
