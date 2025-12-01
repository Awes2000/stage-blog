# Awes Zoretic – Stage Blog

## Full Technical Specification (Part 1/2)

### For Claude 3.5 Sonnet — Generate Full Multi-file Next.js Project

---

# 1. PROJECT OVERVIEW

Create a full-stack Stage Blog website meeting all requirements from Mediacollege Amsterdam’s StageBLOG rules.

Application name: **Awes Zoretic – Stage Blog**

Primary goals:

- Secure login-only access (required by school)
- Posts written in **Markdown**
- Admin + Teacher roles
- Teacher can leave comments
- Admin controls everything else
- Stage 1 / Stage 2 categories
- Custom publication dates (mutatiedatum support)
- Full CRUD post system
- Email notifications (toggle)
- Deployed on Vercel
- SQLite + Prisma
- Next.js 14 App Router architecture

The final output must be a fully running **Next.js + Prisma + Tailwind** project.

---

# 2. TECHNOLOGY STACK

Use the following technologies exactly:

- **Next.js 14 (App Router)**
- **React Server Components**
- **TailwindCSS**
- **Prisma ORM**
- **SQLite database** (Vercel-supported)
- **JSON Web Tokens stored in HttpOnly cookies**
- **bcrypt** for password hashing
- **Nodemailer** for email notifications
- **react-markdown + remark-gfm** for Markdown rendering

---

# 3. FOLDER STRUCTURE

Create EXACTLY this folder structure:

```
/app
  /login
    page.jsx
  /admin
    layout.jsx
    page.jsx
    /posts
      page.jsx
      /create
        page.jsx
      /[id]
        page.jsx
    /users
      page.jsx
    /settings
      page.jsx
  /posts
    page.jsx
    /[id]
      page.jsx
  /api
    /auth
      login.js
      me.js
    /posts
      create.js
      update.js
      delete.js
      get.js
    /comments
      create.js
      list.js
    /users
      create.js
      list.js
    /settings
      get.js
      update.js
/components
  Navbar.jsx
  AdminSidebar.jsx
  PostCard.jsx
  MarkdownRenderer.jsx
  CommentBox.jsx
  ProtectedRoute.jsx
/lib
  prisma.js
  auth.js
/styles
  globals.css
/prisma
  schema.prisma
```

This must be generated **exactly** as described.

---

# 4. PRISMA DATABASE SCHEMA

Use this exact schema:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  username  String   @unique
  password  String
  role      String   // "admin" | "teacher"
  posts     Post[]
  comments  Comment[]
}

model Post {
  id           Int       @id @default(autoincrement())
  title        String
  content      String     // markdown
  category     String     // "stage1" | "stage2"
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt
  customDate   DateTime?
  author       User       @relation(fields: [authorId], references: [id])
  authorId     Int
  comments     Comment[]
}

model Comment {
  id        Int      @id @default(autoincrement())
  content   String
  createdAt DateTime @default(now())
  post      Post     @relation(fields: [postId], references: [id])
  postId    Int
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
}

model Settings {
  id                Int      @id @default(autoincrement())
  notificationsOn   Boolean  @default(false)
  teacherEmail      String?
}
```

---

# 5. AUTHENTICATION SPECIFICATION

## Login Behavior

- Login via username + password
- Password hashed with bcrypt
- On success, create a JWT with:

```json
{
  "id": 1,
  "username": "admin",
  "role": "admin"
}
```

- Store JWT in HttpOnly cookie

## Authorization Rules

- `/admin/**` → admin only
- `/posts/**` → admin or teacher
- `/login` → public
- If unauthenticated → redirect to `/login`

## Session Handling

Create `/api/auth/me` to return:

```json
{
  "authenticated": true,
  "user": { "id": 1, "username": "admin", "role": "admin" }
}
```

---

# 6. USER ROLES

## Admin capabilities:

- Create/edit/delete posts
- Set custom post date
- Upload/insert images via Markdown
- Create users (admin/teacher)
- Toggle email notifications
- Set teacher email
- View all comments
- Cannot delete teacher comments (school transparency requirement)

## Teacher capabilities:

- View posts
- Filter posts
- Leave comments
- Read comments
- Cannot edit/delete posts
- Cannot change settings
- Cannot create users

---

# 7. POSTS SYSTEM

Each post contains:

- Title
- Markdown content
- Category ("stage1" or "stage2")
- createdAt
- updatedAt
- customDate (for school-required ordering)
- Comments
- Author

## Filtering:

- `/posts?category=stage1`
- `/posts?category=stage2`

## Sorting:

- By customDate (if present)
- Otherwise by createdAt

---

# 8. MARKDOWN EDITOR

Admin editing interface includes:

- Textarea for Markdown
- Live markdown preview (react-markdown)
- Buttons for:
  - Bold
  - Italic
  - Header
  - Bullet list
  - Insert image URL
- Clean styling similar to Blogger/Bold Editor

## Markdown Renderer Requirements:

- Use react-markdown
- Add plugin remark-gfm
- Must support:
  - bold
  - italic
  - inline code
  - code blocks
  - headings
  - bullet lists
  - numbered lists
  - images:

```markdown
![alt text](https://example.com/image.jpg)
```

---

# 9. COMMENT SYSTEM

- Only teachers can comment.

Comment fields:

- content (string)
- createdAt
- authorId
- postId

Admin views comments but cannot delete them.

Under each post:

- Comment list
- Comment textarea
- Submit button (teacher only)
- Show creation time and teacher name

---

# 10. EMAIL NOTIFICATION SYSTEM

When a new post is published:

- If `Settings.notificationsOn === true`:
  - Send email using Nodemailer:
    - **To:** Settings.teacherEmail
    - **Subject:** "Nieuwe Stageblog Post — {post.title}"
    - **Body:**
      - Title
      - Date
      - Category
      - Direct link to post

## Admin Settings Panel:

- Toggle: Enable/Disable notifications
- Input: Teacher email address
