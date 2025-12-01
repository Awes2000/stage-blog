# Awes Zoretic – Stage Blog

A full-stack Next.js 14 blog application for Mediacollege Amsterdam internship documentation.

## Features

- 🔐 Secure authentication (Admin & Teacher roles)
- 📝 Markdown-based posts with live preview
- 💬 Teacher commenting system
- 📧 Email notifications for new posts
- 🎨 Clean, responsive UI with TailwindCSS
- 🗄️ SQLite database with Prisma ORM
- 🔒 JWT-based session management

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT with HttpOnly cookies
- **Markdown**: react-markdown with remark-gfm
- **Email**: Nodemailer

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

The `.env` file has been created with default values. Update the SMTP settings for email notifications:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="your-email@gmail.com"
```

### 3. Initialize Database

```bash
npx prisma migrate dev --name init
```

### 4. Seed Database

```bash
npm run seed
```

This creates:
- **Admin user**: username: `admin`, password: `Admin123!`
- **Teacher user**: username: `teacher`, password: `Teacher123!`
- Sample blog posts

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
/app
  /admin              # Admin dashboard pages
  /api                # API routes
  /login              # Login page
  /posts              # Public post pages
  layout.jsx          # Root layout
  page.jsx            # Home page (redirects to login)
  globals.css         # Global styles

/components           # React components
/lib                  # Utility functions
/prisma               # Database schema and migrations
```

## User Roles

### Admin
- Create, edit, and delete posts
- Set custom publication dates
- Manage users
- Configure email notifications
- View all comments (read-only)

### Teacher
- View all posts
- Filter by category (Stage 1 / Stage 2)
- Leave comments on posts
- Cannot edit or delete posts

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run seed` - Seed database with test data
- `npx prisma studio` - Open Prisma Studio database GUI
- `npx prisma migrate dev` - Create and apply migrations

## Deployment

This application is designed to deploy on Vercel:

1. Push your code to GitHub
2. Import project in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

**Note**: For production, consider using a PostgreSQL database instead of SQLite for better performance and reliability.

## License

MIT
