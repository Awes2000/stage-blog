'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import MarkdownRenderer from '@/components/MarkdownRenderer'

export default function EditPostPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('stage1')
  const [customDate, setCustomDate] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    fetchPost()
  }, [])

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/get?id=${params.id}`)
      const data = await response.json()

      if (data.success) {
        const post = data.post
        setTitle(post.title)
        setContent(post.content)
        setCategory(post.category)
        if (post.customDate) {
          const date = new Date(post.customDate)
          const localDateTime = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16)
          setCustomDate(localDateTime)
        }
      }
    } catch (error) {
      console.error('Error fetching post:', error)
    } finally {
      setLoading(false)
    }
  }

  const insertMarkdown = (before, after = '') => {
    const textarea = document.querySelector('textarea')
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    const newText =
      content.substring(0, start) +
      before +
      selectedText +
      after +
      content.substring(end)
    setContent(newText)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch('/api/posts/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: params.id,
          title,
          content,
          category,
          customDate: customDate || null,
        }),
      })

      const data = await response.json()

      if (data.success) {
        router.push('/admin/posts')
      } else {
        alert('Error updating post')
      }
    } catch (error) {
      console.error('Error updating post:', error)
      alert('Error updating post')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Post Bewerken</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Titel
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Categorie
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="stage1">Stage 1</option>
                <option value="stage2">Stage 2</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="customDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Mutatiedatum (optioneel)
              </label>
              <input
                type="datetime-local"
                id="customDate"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Inhoud (Markdown)
              </label>

              <div className="mb-2 flex space-x-2">
                <button
                  type="button"
                  onClick={() => insertMarkdown('**', '**')}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium"
                  title="Bold"
                >
                  B
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('*', '*')}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm italic"
                  title="Italic"
                >
                  I
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('\n## ')}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium"
                  title="Header"
                >
                  H
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('\n- ')}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                  title="Bullet List"
                >
                  •
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('![alt text](', ')')}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                  title="Image"
                >
                  IMG
                </button>
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="ml-auto px-3 py-1 bg-blue-100 hover:bg-blue-200 rounded text-sm"
                >
                  {showPreview ? 'Editor' : 'Preview'}
                </button>
              </div>

              {!showPreview ? (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  rows="20"
                  required
                />
              ) : (
                <div className="border border-gray-300 rounded-md p-4 min-h-[400px] bg-white">
                  <MarkdownRenderer content={content} />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Bezig...' : 'Wijzigingen Opslaan'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/posts')}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Annuleer
          </button>
        </div>
      </form>
    </div>
  )
}
