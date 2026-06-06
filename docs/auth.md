# Authentication Architecture

WappCart uses **cookie hash authentication** for the single-admin delivery app. There is no JWT, no token expiry, and no refresh mechanism.

## How It Works

### Login

1. User submits email + password via the login form
2. Server verifies credentials against the database (`bcrypt.compare`)
3. Server computes a session hash: `bcrypt.hash(password + pepper + email, salt)`
4. Session hash is stored in an `httpOnly` cookie named `admin-session`
5. User is redirected to `/admin`

### Session Verification

On every `/admin/*` request:

1. Read the `admin-session` cookie
2. Verify it exists and is a valid bcrypt hash
3. Verify the user exists with `role: admin`
4. If valid → grant access; if invalid → redirect to `/admin/login`

### Logout

Clear the `admin-session` cookie by setting `maxAge: 0`.

## Security Model

| Layer | Protection |
|-------|-----------|
| Database theft | Pepper (server env) makes session hashes useless without it |
| XSS cookie theft | `httpOnly` flag — JavaScript cannot read the cookie |
| CSRF | `sameSite: strict` — cookie is not sent cross-origin |
| Password storage | bcrypt with per-user salt |
| No token expiry | Session is validated on every request |

## Key Concepts

### Pepper

A server-side secret (`ADMIN_PEPPER`, min 32 chars) stored in environment variables. It is concatenated with the password and email before hashing. Even if the database is compromised, an attacker cannot compute valid session hashes without the pepper.

### Salt

A per-user random value stored in the database. Generated when the user is created or when their password is reset. Ensures identical passwords produce different hashes.

### Session Hash

`bcrypt.hash(password + pepper + email, salt)` — stored in the cookie. This is NOT the password hash (`bcrypt.hash(password, salt)`), which is stored in the database.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ADMIN_PEPPER` | Yes | Server-side pepper, min 32 characters |
| `DATABASE_URL` | Yes | PostgreSQL connection string |

`NEXTAUTH_SECRET` is no longer used.

## Recovery Procedures

### Reset admin password

```bash
ADMIN_PEPPER="your-pepper" DATABASE_URL="your-db-url" \
  node scripts/reset-admin-password.js <new-password>
```

### Create admin user (first time)

```bash
ADMIN_PEPPER="your-pepper" DATABASE_URL="your-db-url" \
  node scripts/create-admin-first-time.js <email> <password>
```

## Cookie Configuration

| Setting | Value |
|---------|-------|
| Name | `admin-session` |
| httpOnly | `true` |
| secure | `true` in production |
| sameSite | `strict` |
| maxAge | 8 hours |
| path | `/` |
