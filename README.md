# SaaS Auth Starter

A full-stack multi-tenant authentication starter built with:

- ✅ Next.js 14 (App Router)
- ✅ TypeScript & Tailwind CSS
- ✅ Drizzle ORM + Neon Postgres
- ✅ Custom email/password authentication
- ✅ Secure JWT-based sessions (HTTP-only cookies)
- ✅ Email verification with Resend
- ✅ Forgot & reset password flow
- ✅ Modular schema (users, profiles, orgs)
- ✅ Zod + React Hook Form + shadcn/ui
- 🚧 Social login (Google, Microsoft, Apple) — coming next

---

## 🧱 Stack

| Layer        | Tech                               |
|--------------|------------------------------------|
| Frontend     | Next.js App Router, Tailwind, shadcn/ui |
| Auth         | Custom email/password + JWT session |
| ORM          | Drizzle ORM                        |
| Database     | PostgreSQL (hosted on Neon)        |
| Email        | Resend API                         |
| Forms        | react-hook-form + zod              |

---

## 🗂 Folder Structure

```
app/
  api/
    auth/
      signup/
      login/
      logout/
      forgot-password/
      reset-password/
      verify-email/
  dashboard/
  signup/
  login/
  forgot-password/
  reset-password/

components/
  auth/
    signup-form.tsx
    login-form.tsx
    forgot-password-form.tsx
    reset-form.tsx
    verify-client.tsx

lib/
  auth/
    session.ts
  db.ts
  email/
    sendVerificationEmail.ts
    sendResetPasswordEmail.ts
```

---

## ⚙️ Getting Started

1. Clone the repo  
2. Install dependencies

```bash
npm install
```

3. Add your `.env.local` file:

```env
# Neon DB
PGHOST=...
PGDATABASE=...
PGUSER=...
PGPASSWORD=...

# Email (Resend)
RESEND_API_KEY=...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
JWT_SECRET=supersecretkey
```

4. Push your schema:

```bash
npm run db:push
```

5. Run the app

```bash
npm run dev
```

---

## ✅ Completed Features

- [x] Signup (email/password)
- [x] Email verification
- [x] Login with JWT + session cookie
- [x] Protected dashboard route
- [x] Forgot & reset password
- [x] Toast feedback everywhere

---

## 🚧 Coming Next

- [ ] OAuth login (Google, Microsoft, Apple)
- [ ] RBAC: roles and permissions
- [ ] Subdomain-based multi-tenancy
- [ ] Organization switching
- [ ] Invite & manage users per org

---

## 🪪 License

MIT