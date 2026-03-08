# MellAC - Advanced Minecraft Anti-Cheat System

A comprehensive anti-cheat monitoring system for Minecraft servers with real-time detection, analytics, and admin dashboard.

## Features

- 🛡️ **Real-time Cheat Detection** - Monitor multiple types of cheats including aimbot, speedhack, reach, and more
- 📊 **Advanced Analytics** - View detailed statistics and trends for cheat detections
- 🔑 **API Integration** - Easy plugin integration with your Minecraft servers
- 🖥️ **Admin Dashboard** - Beautiful, intuitive dashboard for server management
- 🔐 **Secure Authentication** - JWT-based authentication with encrypted passwords
- 📈 **Player Tracking** - Monitor flagged players and their detection history
- 🌙 **Dark Theme** - Modern, eye-friendly dark interface

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: SQLite (local), better-sqlite3
- **Authentication**: JWT, bcryptjs
- **UI Components**: Lucide icons, shadcn/ui

## Troubleshooting

If you encounter the "Fatal error during initialization" error or other issues, please check the [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) file for detailed solutions.

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (or npm/yarn)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/mellac.git
cd mellac
```

2. **Verify setup**
```bash
pnpm verify
```

3. **Install dependencies**
```bash
pnpm install
```

4. **Set up environment variables**
Create a `.env.local` file in the root directory:
```env
JWT_SECRET=your-super-secret-jwt-key-here-change-in-production
```

5. **Run the development server**
```bash
pnpm dev
```

5. **Open in browser**
Navigate to `http://localhost:3000`

## Project Structure

```
mellac/
├── app/
│   ├── api/                 # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   ├── servers/        # Server management
│   │   ├── cheat-reports/  # Cheat report submission
│   │   ├── logs/           # Log retrieval
│   │   └── stats/          # Statistics
│   ├── dashboard/          # Protected dashboard routes
│   ├── login/              # Login page
│   ├── register/           # Registration page
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page (redirects)
├── components/
│   ├── login-form.tsx      # Login form
│   ├── register-form.tsx   # Registration form
│   ├── sidebar.tsx         # Dashboard sidebar
│   ├── server-form.tsx     # Server creation form
│   ├── servers-list.tsx    # Servers list component
│   └── ui/                 # shadcn/ui components
├── lib/
│   ├── auth.ts            # Authentication utilities
│   ├── auth-context.tsx   # Auth context provider
│   └── db.ts              # Database utilities
├── scripts/
│   ├── init-db.sql        # Database schema
│   └── setup-db.js        # Database setup script
└── public/                 # Static assets
```

## Usage

### 1. Create an Account

Visit `http://localhost:3000/register` and create a new account.

### 2. Create a Server

1. Go to Dashboard → Servers
2. Click "Add New Server"
3. Fill in your server details
4. Copy the generated API key

### 3. Install Plugin on Your Minecraft Server

See [PLUGIN_GUIDE.md](./PLUGIN_GUIDE.md) for detailed plugin integration instructions.

### 4. View Statistics

Once your plugin sends data, visit your server's detail page to see:
- Total detections
- Detected cheat types
- Player statistics
- Real-time logs

## API Documentation

### Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <jwt-token>
```

### Endpoints

#### Auth
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login to account

#### Servers
- `GET /api/servers` - List user's servers
- `POST /api/servers` - Create new server

#### Cheat Reports
- `POST /api/cheat-reports` - Submit cheat detection (from plugin)

#### Logs
- `GET /api/logs?server_id=<id>` - Get server cheat logs

#### Statistics
- `GET /api/stats?server_id=<id>` - Get server statistics

See [PLUGIN_GUIDE.md](./PLUGIN_GUIDE.md) for detailed API examples.

## Database Schema

### Users Table
```sql
id (INT, PK)
username (TEXT, UNIQUE)
email (TEXT, UNIQUE)
password_hash (TEXT)
api_key (TEXT, UNIQUE)
created_at (DATETIME)
updated_at (DATETIME)
```

### Servers Table
```sql
id (INT, PK)
user_id (INT, FK)
server_name (TEXT)
server_ip (TEXT)
server_port (INT)
api_key (TEXT, UNIQUE)
last_seen (DATETIME)
is_active (INT)
created_at (DATETIME)
updated_at (DATETIME)
```

### Cheat Logs Table
```sql
id (INT, PK)
server_id (INT, FK)
player_name (TEXT)
player_ip (TEXT)
cheat_type (TEXT)
cheat_reason (TEXT)
severity (TEXT)
detected_at (DATETIME)
created_at (DATETIME)
```

### Player Stats Table
```sql
id (INT, PK)
server_id (INT, FK)
player_name (TEXT)
player_ip (TEXT)
total_detections (INT)
last_detection (DATETIME)
is_flagged (INT)
notes (TEXT)
created_at (DATETIME)
updated_at (DATETIME)
```

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
- `/dashboard/support` - Support & contact

## Security Features

- ✅ Password hashing with bcryptjs (10 rounds)
- ✅ JWT tokens with 7-day expiration
- ✅ Protected routes and API endpoints
- ✅ SQL injection prevention with parameterized queries
- ✅ HTTPS-ready architecture
- ✅ Secure session management

## Environment Variables

```env
JWT_SECRET          # JWT signing secret (change in production!)
NODE_ENV            # "development" or "production"
```

## Production Deployment

1. **Change JWT_SECRET** to a strong, random value
2. **Set NODE_ENV=production**
3. **Consider using a production database** (PostgreSQL, MySQL)
4. **Enable HTTPS** for all connections
5. **Add proper error logging and monitoring**
6. **Configure CORS** if needed
7. **Set up regular backups** of the database

## Development

### Running Tests
```bash
pnpm test
```

### Building for Production
```bash
pnpm build
pnpm start
```

### Linting
```bash
pnpm lint
```

## Known Limitations

- SQLite is single-process and not suitable for very high-traffic production environments
- Consider migrating to PostgreSQL for production use
- Local database doesn't support distributed systems

## Future Enhancements

- [ ] Multi-region support
- [ ] Advanced machine learning detection
- [ ] Discord/Telegram bot integration
- [ ] Automatic player banning system
- [ ] Custom detection rules
- [ ] Data export functionality
- [ ] Payment integration for premium features

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

- 📧 Email: support@mellac.ru
- 💬 Discord: [Join our community](https://discord.gg/mellac)
- 📚 Documentation: [See PLUGIN_GUIDE.md](./PLUGIN_GUIDE.md)

## Disclaimer

This is an anti-cheat system designed for legitimate server administration. Use responsibly and in accordance with applicable laws and Minecraft server policies.
