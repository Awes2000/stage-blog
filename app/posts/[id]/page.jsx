import { redirect } from 'next/navigation'
import { getUserFromCookie } from '@/lib/auth'
import Navbar from '@/components/Navbar'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import CommentBox from '@/components/CommentBox'
import Link from 'next/link'

async function getPost(id) {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'
  const response = await fetch(`${baseUrl}/api/posts/get?id=${id}`, {
    cache: 'no-store',
  })
  const data = await response.json()
  return data.post
}

export default async function PostDetailPage({ params }) {
  const user = await getUserFromCookie()

  if (!user) {
    redirect('/login')
  }

  const resolvedParams = await params
  const post = await getPost(resolvedParams.id)

  if (!post) {
    return <div>Post not found</div>
  }

  const displayDate = post.customDate
    ? new Date(post.customDate)
    : new Date(post.createdAt)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />

      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-10 py-10">
        {/* Back Button */}
        <Link
          href="/posts"
          className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Terug naar posts
        </Link>

        {/* Post Header Card */}
        <div className="card p-8 mb-6">
          <div className="flex items-center space-x-3 mb-6">
            <span className={`badge ${post.category === 'stage1' ? 'badge-blue' : 'badge-green'}`}>
              {post.category === 'stage1' ? 'Stage 1' : 'Stage 2'}
            </span>
            <span className="text-sm text-gray-500">•</span>
            <span className="text-sm text-gray-500 flex items-center">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {displayDate.toLocaleDateString('nl-NL', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center space-x-4 text-sm text-gray-500 pb-6 border-b border-gray-200">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {post.author.username}
            </span>
            {post.customDate && (
              <>
                <span>•</span>
                <span>
                  Mutatiedatum: {new Date(post.customDate).toLocaleDateString('nl-NL')}
                </span>
              </>
            )}
          </div>

          {user.role === 'admin' && (
            <div className="mt-6">
              <Link
                href={`/admin/posts/${post.id}`}
                className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Bewerk Post
              </Link>
            </div>
          )}
        </div>

        {/* Post Content */}
        <div className="card p-8 mb-8">
          <MarkdownRenderer content={post.content} />
        </div>

        {/* Comments Section */}
        <div className="card p-8">
          <div className="flex items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Reacties
            </h2>
            <span className="ml-3 badge bg-gray-100 text-gray-700">
              {post.comments.length}
            </span>
          </div>

          {post.comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <p>Nog geen reacties.</p>
            </div>
          ) : (
            <div className="space-y-4 mb-6">
              {post.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-gray-50 rounded-lg p-5 border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-700">
                          {comment.author.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900 block">
                          {comment.author.username}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString('nl-NL', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                </div>
              ))}
            </div>
          )}

          <CommentBox postId={post.id} user={user} />
        </div>
      </div>
    </div>
  )
}
