import { redirect } from 'next/navigation'
import { getUserFromCookie } from '@/lib/auth'
import Navbar from '@/components/Navbar'
import PostCard from '@/components/PostCard'
import Link from 'next/link'

async function getPosts(category) {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'
  const url = category
    ? `${baseUrl}/api/posts/get?category=${category}`
    : `${baseUrl}/api/posts/get`

  const response = await fetch(url, { cache: 'no-store' })
  const data = await response.json()
  return data.posts || []
}

export default async function PostsPage({ searchParams }) {
  const user = await getUserFromCookie()

  if (!user) {
    redirect('/login')
  }

  const params = await searchParams
  const category = params?.category || null
  const posts = await getPosts(category)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-10">
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Stage Blog
          </h1>
          <p className="text-lg text-gray-600">
            Documentatie van mijn leerproces en ervaringen
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2 bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
            <Link
              href="/posts"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                !category
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Alle Posts
            </Link>
            <Link
              href="/posts?category=stage1"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                category === 'stage1'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Stage 1
            </Link>
            <Link
              href="/posts?category=stage2"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                category === 'stage2'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Stage 2
            </Link>
          </div>

          {user.role === 'admin' && (
            <Link
              href="/admin/posts/create"
              className="btn-primary flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nieuwe Post
            </Link>
          )}
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div className="card p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Geen posts gevonden</h3>
            <p className="text-gray-600">
              {category
                ? `Er zijn nog geen posts in ${category === 'stage1' ? 'Stage 1' : 'Stage 2'}.`
                : 'Er zijn nog geen posts.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
