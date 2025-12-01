import { redirect } from 'next/navigation'
import { getUserFromCookie } from '@/lib/auth'
import Navbar from '@/components/Navbar'
import AdminSidebar from '@/components/AdminSidebar'

export default async function AdminLayout({ children }) {
  const user = await getUserFromCookie()

  if (!user) {
    redirect('/login')
  }

  if (user.role !== 'admin') {
    redirect('/posts')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}
