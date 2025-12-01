import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production'

export function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export async function getUserFromCookie() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')

  if (!token) {
    return null
  }

  const user = verifyToken(token.value)
  return user
}

export async function requireAuth() {
  const user = await getUserFromCookie()
  if (!user) {
    return null
  }
  return user
}

export async function requireAdmin() {
  const user = await getUserFromCookie()
  if (!user || user.role !== 'admin') {
    return null
  }
  return user
}
