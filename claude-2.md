# Awes Zoretic – Stage Blog

## Full Technical Specification (Part 2/2)

### For Claude 3.5 Sonnet — Generate Full Multi-file Next.js Project

---

# 11. API ROUTES (DETAILED)

All API routes must be **real server-side files** in `/app/api/**`.

Use `NextResponse.json()` for output.

---

## AUTH API

### POST `/api/auth/login`

Input:

```json
{
  "username": "admin",
  "password": "Admin123!"
}
```

Flow:

1. Find user in Prisma
2. `bcrypt.compare()` password
3. If correct → create JWT
4. Set JWT in HttpOnly cookie
5. Return `{ success: true }`

### GET `/api/auth/me`

Reads JWT from cookie.

Returns:

```json
{
  "authenticated": true,
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin"
  }
}
```

If missing/invalid:

```json
{ "authenticated": false }
```

---

## POSTS API

### POST `/api/posts/create`

Admin only.

Input:

```json
{
  "title": "Reflectie week 3",
  "content": "<markdown>",
  "category": "stage1",
  "customDate": "2025-02-15T00:00:00Z"
}
```

On success:

- Create post in database
- If notificationsOn: send email

### POST `/api/posts/update`

Admin only.

### POST `/api/posts/delete`

Admin only.

### GET `/api/posts/get?id=123`

Returns full post + comments.

---

## COMMENTS API

### POST `/api/comments/create`

Teacher only.

Input:

```json
{
  "postId": 4,
  "content": "Goed gedaan! Let op structuur."
}
```

### GET `/api/comments/list?postId=4`

Returns comments array.

---

## USERS API (Admin only)

### POST `/api/users/create`

Create new user:

```json
{
  "username": "teacher2",
  "password": "pw123",
  "role": "teacher"
}
```

### GET `/api/users/list`

Returns list of all users.

---

## SETTINGS API (Admin only)

### GET `/api/settings/get`

Returns current settings.

### POST `/api/settings/update`

Input example:

```json
{
  "notificationsOn": true,
  "teacherEmail": "mdstage@ma-web.nl"
}
```

---

# 12. FRONTEND PAGES & LAYOUTS

## `/login/page.jsx`

- Username input
- Password input
- Login button
- On success redirect to `/posts`
- Clean minimal design

## `/posts/page.jsx`

List ALL posts

Filters:

- Stage 1
- Stage 2

Sorted by:

- customDate if set
- createdAt otherwise

Each post tile:

- Title
- Category
- Date
- Short preview from markdown
- Link to full page

## `/posts/[id]/page.jsx`

Show:

- Title
- Category
- Created date
- Custom date (if set)
- Updated date
- Full markdown content
- Comments below (teacher only)

Teacher sees:

- Comment textarea
- Submit button

Admin sees:

- No comment box (read-only comments)

---

# 13. ADMIN DASHBOARD

## `/admin/layout.jsx`

Left sidebar with links:

- Dashboard (`/admin`)
- Posts (`/admin/posts`)
- Users (`/admin/users`)
- Settings (`/admin/settings`)
- Logout

## `/admin/posts/page.jsx`

Table layout:

| Title | Category | Created | Updated | Actions |

Actions:

- Edit
- Delete

## `/admin/posts/create/page.jsx`

Create Blog Post Form:

- Title
- Category selector
- Custom date picker
- Markdown textarea
- Markdown preview
- Submit button

## `/admin/posts/[id]/page.jsx`

Edit Blog Post Form (same as create)

## `/admin/users/page.jsx`

List users:

| Username | Role | Actions |

Button:

- Add User (opens form)

User creation form fields:

- Username
- Password
- Role (admin/teacher)

Passwords stored hashed.

## `/admin/settings/page.jsx`

Fields:

- Toggle (checkbox): Enable Notifications
- Input: Teacher Email Address

When toggled on:

- New posts trigger email using Nodemailer

---

# 14. COMPONENTS (DETAILED)

## MarkdownRenderer.jsx

Use:

```jsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

<ReactMarkdown remarkPlugins={[remarkGfm]}>
  {content}
</ReactMarkdown>
```

Style with Tailwind `.prose`.

## ProtectedRoute.jsx

Checks:

- If user not authenticated → redirect to `/login`
- If user role ≠ required → show 403 page
- Should be used in admin pages

## PostCard.jsx

Displays post preview:

- Title
- Category tag
- Snippet
- Date
- Link to read more

## CommentBox.jsx

- Textarea + submit
- Only renders if `role === "teacher"`

## Navbar.jsx

Simple top navigation with:

- App name
- Logout button
- User role indicator

## AdminSidebar.jsx

Vertical navigation for admin area.

---

# 15. SEED DATA

Create a `/prisma/seed.js` file (or include instructions).

## Seed users:

**Admin:**
- username: `admin`
- password: `Admin123!`
- role: `admin`

**Teacher:**
- username: `teacher`
- password: `Teacher123!`
- role: `teacher`

## Seed Settings:

```javascript
notificationsOn: false
teacherEmail: ""
```

---

# 16. DESIGN & UI REQUIREMENTS

Use TailwindCSS with:

- Light theme, white background
- Clean minimal spacing
- `.prose` for markdown readability
- Accent color: blue-600 or similar
- Mobile responsive
- Modern card styles
- Simple top navbar

---

# 17. DEPLOYMENT REQUIREMENTS

Must work completely on Vercel.

Requirements:

- Use SQLite (works natively with Prisma on Vercel)
- Use Prisma accelerate or Prisma Data Proxy if needed
- Ensure all API routes are Node.js runtime (not edge)
- Include necessary `prisma generate` commands
