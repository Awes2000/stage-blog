import Link from 'next/link'

export default function PostCard({ post }) {
  const displayDate = post.customDate
    ? new Date(post.customDate)
    : new Date(post.createdAt)

  const preview = post.content.substring(0, 150) + '...'

  return (
    <Link href={`/posts/${post.id}`}>
      <div className="group card p-6 hover:shadow-lg hover:-translate-y-1 cursor-pointer h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <span
              className={`badge mb-3 inline-block ${
                post.category === 'stage1'
                  ? 'badge-blue'
                  : 'badge-green'
              }`}
            >
              {post.category === 'stage1' ? 'Stage 1' : 'Stage 2'}
            </span>
            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {post.title}
            </h3>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-3 flex items-center">
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {displayDate.toLocaleDateString('nl-NL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>

        <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">{preview}</p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-blue-600 font-medium text-sm group-hover:text-blue-700 flex items-center">
            Lees meer
            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
          {post.comments && post.comments.length > 0 && (
            <span className="text-sm text-gray-500 flex items-center">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              {post.comments.length}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
