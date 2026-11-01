# Portfolio — React + Tailwind CSS (Frontend), Node.js + TypeScript (Backend), & MySQL (`database.sql`)

This project has been permanently configured for **Hostinger Node.js + MySQL** deployment:

- **Frontend**: React 19 + Tailwind CSS v4 + Shadcn/Radix UI (`app/`, `components/`, `public/`)
- **Backend**: Node.js + TypeScript + Nitro server (`server.js`, `app/api/`, `lib/`, `db/mysql-adapter.mjs`)
- **Database**: MySQL / MariaDB via `database.sql` (27 tables + initial portfolio seed data + default admin login)

## 1. Import the Database (`database.sql`) on Hostinger

1. Open **Hostinger hPanel → Databases → Management** and create a MySQL database.
2. Open **phpMyAdmin** for that database, click the **Import** tab, and upload **`database.sql`**.
3. This creates all 27 tables, seeds the initial website settings and portfolio entries, and sets up the initial administrator account:
   - **Admin Username**: `NIAZIS11`
   - **Initial Password**: `12345678` (you will be prompted to change it on first login)

## 2. Configure Environment Variables (`.env`)

Copy `.env.example` to `.env` (or add these variables in **Hostinger hPanel → Node.js → Environment Variables**):

```env
NODE_ENV=production
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=your_hostinger_db_name
DB_USER=your_hostinger_db_user
DB_PASSWORD=your_hostinger_db_password
CHAT_ENCRYPTION_KEY=replace_with_32_byte_base64_secret
OWNER_BOOTSTRAP_ENABLED=true
```

Optional integrations (Google OAuth, Apple Sign-In, Resend email verification/recovery):

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
APPLE_CLIENT_ID=
APPLE_TEAM_ID=
APPLE_KEY_ID=
APPLE_PRIVATE_KEY=
APPLE_REDIRECT_URI=
RESEND_API_KEY=
AUTH_FROM_EMAIL=
FILE_STORAGE_DIR=
TRUSTED_PROXY_IPS=
```

## 3. Hostinger Node.js Deployment Settings

In **Hostinger hPanel**:
- **Application Type**: Node.js Web App (Node.js 20+ / 24.x)
- **Install Command**: `npm install`
- **Build Command**: `npm run build`
- **Entry File / Start Command**: `server.js` (or `npm start`)
