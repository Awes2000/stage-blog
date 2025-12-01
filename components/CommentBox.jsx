'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CommentBox({ postId, user }) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Only teachers can comment
  if (!user || user.role !== 'teacher') {
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!content.trim()) return

    setLoading(true)

    try {
      const response = await fetch('/api/comments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          content,
        }),
      })

      if (response.ok) {
        setContent('')
        router.refresh()
      }
    } catch (error) {
      console.error('Error creating comment:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Reactie plaatsen</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="input-field"
          rows="4"
          placeholder="Schrijf je reactie hier..."
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Bezig...' : 'Verstuur reactie'}
        </button>
      </form>
    </div>
  )
}
