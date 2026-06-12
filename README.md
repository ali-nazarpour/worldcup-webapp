# جام جهانی — World Cup Predictions Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Persian RTL web app for viewing World Cup matches, submitting score predictions without registration, and managing tournaments via an admin panel.

پلتفرم فارسی RTL برای مشاهده مسابقات جام جهانی، ثبت پیش‌بینی نتیجه و مدیریت تورنمنت‌ها.

**Repository:** [github.com/ali-nazarpour/worldcup-webapp](https://github.com/ali-nazarpour/worldcup-webapp)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, Tailwind CSS, shadcn/ui |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| API Provider | football-data.org |
| Auth | JWT (httpOnly cookie) |
| Container | Docker, Docker Compose |

## Features

- مشاهده مسابقات با فیلترهای شمسی (امروز، این هفته، این ماه، تاریخ مشخص، پیش رو، انجام شده)
- ثبت پیش‌بینی بدون ثبت‌نام با کد پیگیری
- پیگیری پیش‌بینی با شماره تماس و کد پیگیری
- پنل مدیریت فارسی RTL
- همگام‌سازی خودکار و دستی با football-data.org
- پشتیبانی از تورنمنت‌های آینده (قابل پیکربندی)
- Export CSV of correct predictions from admin panel

## Quick Start (Local)

### Prerequisites

- Node.js 20+
- MongoDB 7+

### 1. Clone and configure

```bash
git clone https://github.com/ali-nazarpour/worldcup-webapp.git
cd worldcup-webapp
cp .env.example .env
# Edit .env and set FOOTBALL_API_KEY, JWT_SECRET, SUPER_ADMIN_PASSWORD
```

### 2. Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

Or from the repo root:

```bash
npm install --prefix server
npm install --prefix client
```

### 3. Start MongoDB

```bash
# Using Docker
docker run -d -p 27017:27017 --name worldcup-mongo public.ecr.aws/docker/library/mongo:7
```

### 4. Run server

```bash
cd server
npm run dev
```

### 5. Run client

```bash
cd client
npm run dev
```

**Root scripts** (from repo root):

| Script | Command |
|--------|---------|
| `npm run dev:server` | Start API in watch mode |
| `npm run dev:client` | Start Vite dev server |
| `npm run build` | Build client for production |
| `npm run start:server` | Start API (production) |

- Public app: http://localhost:5173
- Admin panel: http://localhost:5173/admin/login

## Docker

Images use **AWS ECR Public Gallery** (`public.ecr.aws/docker/library/...`) instead of Docker Hub, because Docker Hub blocks some regions (including Iran).

```bash
cp .env.example .env
# Edit .env with your values
docker compose up --build
```

- Public app: http://localhost:5173
- API: http://localhost:5000

If image pulls still fail, run without Docker using [Quick Start (Local)](#quick-start-local) above.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `development` |
| `PORT` | Server port | `5000` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/worldcup_predictions` |
| `JWT_SECRET` | JWT signing secret | — |
| `JWT_EXPIRES_IN` | Token expiry | `7d` |
| `SUPER_ADMIN_FULL_NAME` | Default admin name | `مدیر اصلی` |
| `SUPER_ADMIN_USERNAME` | Default admin username | `admin` |
| `SUPER_ADMIN_PASSWORD` | Default admin password | `change_this_password` |
| `FOOTBALL_API_PROVIDER` | Provider identifier | `football-data` |
| `FOOTBALL_API_BASE_URL` | football-data.org base URL | `https://api.football-data.org/v4` |
| `FOOTBALL_API_KEY` | football-data.org API token | — |
| `FOOTBALL_COMPETITION_CODE` | Competition code | `WC` |
| `FOOTBALL_SEASON` | Season year | `2026` |
| `FOOTBALL_DEFAULT_TIMEZONE` | Timezone for date filters | `Asia/Tehran` |
| `SYNC_ENABLED` | Enable cron sync | `true` |
| `SYNC_CRON` | Normal sync schedule | `*/30 * * * *` |
| `SYNC_ACTIVE_MATCHDAY_CRON` | Active matchday sync | `*/5 * * * *` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window (ms) | `900000` |
| `RATE_LIMIT_MAX` | Max requests per window | `100` |

> **Never commit `.env`.** Copy `.env.example` and fill in secrets locally.

### Timezone Assumption

All "today", "this week", and "this month" filters use `FOOTBALL_DEFAULT_TIMEZONE` (default: `Asia/Tehran`). UTC dates are stored in MongoDB; Jalali display is computed on read.

## football-data.org API Token

1. Register at [football-data.org](https://www.football-data.org/client/register)
2. Copy your API token
3. Set `FOOTBALL_API_KEY` in `.env`

All API calls are made server-side with header:

```http
X-Auth-Token: YOUR_API_TOKEN
```

## How Sync Works

1. On schedule (every 30 min) or manually from admin dashboard
2. Fetches matches from `GET /competitions/{code}/matches?season={year}`
3. Upserts teams and matches into MongoDB
4. Stores raw API payload for debugging
5. Recalculates prediction correctness for finished matches
6. During active match days, syncs every 5 minutes (configurable)

If `FOOTBALL_API_KEY` is missing, the app still runs with empty states and admin warnings.

## Super Admin

On first startup, if no admin exists, a super admin is created from env:

- Username: `SUPER_ADMIN_USERNAME` (default: `admin`)
- Password: `SUPER_ADMIN_PASSWORD` (default: `change_this_password`)

**Change the default password immediately in production.**

## Predictions

1. User clicks "پیش‌بینی نتیجه" on an upcoming match
2. Enters name, phone, and predicted score
3. Receives a unique tracking code
4. Can track result later via phone + tracking code

### Correctness

A prediction is **correct** only when exact score matches:

```
predictedHomeScore === actualHomeScore
predictedAwayScore === actualAwayScore
```

## Future World Cups

1. Go to Admin → Tournaments
2. Create new tournament (e.g., World Cup 2030)
3. Set competition code (`WC`), season, and dates
4. Click "فعال‌سازی" to set as active
5. Trigger sync from dashboard

## Manual Sync

Admin Dashboard → "همگام‌سازی با football-data.org"

## API Routes

### Public

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/public/tournament/active` | Active tournament |
| GET | `/api/public/matches` | Matches with filters |
| GET | `/api/public/matches/:id` | Single match |
| POST | `/api/public/predictions` | Submit prediction |
| POST | `/api/public/predictions/track` | Track prediction |

**Match filters:** `filter=today|this-week|this-month|upcoming|finished` or `date=1405-03-25`

### Admin Auth

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/admin/auth/login` | Login |
| POST | `/api/admin/auth/logout` | Logout |
| GET | `/api/admin/auth/me` | Current admin |

### Admin (authenticated)

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/admin/dashboard` | Dashboard stats |
| POST | `/api/admin/sync` | Manual sync |
| GET | `/api/admin/matches` | All matches |
| PUT | `/api/admin/matches/:id` | Update match (manual override) |
| GET | `/api/admin/predictions` | All predictions |
| GET | `/api/admin/predictions/correct` | Correct predictions |
| GET | `/api/admin/predictions/export/correct` | CSV export |
| GET/POST/PUT | `/api/admin/tournaments` | Tournament CRUD |
| POST | `/api/admin/tournaments/:id/set-active` | Set active tournament |
| GET/POST/PUT | `/api/admin/users` | Admin management (SUPER_ADMIN only) |

## Project Structure

```
worldcup-webapp/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/     # UI, admin, matches, predictions
│   │   ├── hooks/          # React Query hooks
│   │   ├── pages/          # Route pages
│   │   ├── services/       # API clients
│   │   └── lib/            # Jalali, utils
│   ├── Dockerfile
│   └── nginx.conf
├── server/                 # Express API
│   ├── src/
│   │   ├── config/         # DB, env
│   │   ├── controllers/
│   │   ├── jobs/           # Cron sync
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── providers/      # football-data.org
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   └── Dockerfile
├── docker-compose.yml
├── .env.example
├── package.json            # Root workspace scripts
└── README.md
```

## Production Checklist

- [ ] Set strong `JWT_SECRET` and `SUPER_ADMIN_PASSWORD`
- [ ] Use a managed MongoDB instance (or persistent Docker volume)
- [ ] Set `NODE_ENV=production`
- [ ] Configure `CLIENT_URL` to your production domain
- [ ] Enable HTTPS and secure cookies behind a reverse proxy
- [ ] Add a valid `FOOTBALL_API_KEY` before go-live

## License

MIT
