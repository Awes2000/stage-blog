'use client'

import { useState, useEffect } from 'react'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    notificationsOn: false,
    teacherEmail: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings/get')
      const data = await response.json()
      if (data.success) {
        setSettings({
          notificationsOn: data.settings.notificationsOn,
          teacherEmail: data.settings.teacherEmail || '',
        })
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      const response = await fetch('/api/settings/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      const data = await response.json()

      if (data.success) {
        setMessage('Instellingen succesvol opgeslagen!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('Fout bij opslaan van instellingen')
      }
    } catch (error) {
      console.error('Error updating settings:', error)
      setMessage('Fout bij opslaan van instellingen')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Instellingen</h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">
              E-mail Notificaties
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Wanneer ingeschakeld, wordt er een e-mail verstuurd naar de docent
              wanneer er een nieuwe post wordt gepubliceerd.
            </p>

            <div className="flex items-center space-x-3 mb-4">
              <input
                type="checkbox"
                id="notificationsOn"
                checked={settings.notificationsOn}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notificationsOn: e.target.checked,
                  })
                }
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="notificationsOn"
                className="text-sm font-medium text-gray-700"
              >
                Schakel e-mail notificaties in
              </label>
            </div>

            <div>
              <label
                htmlFor="teacherEmail"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Docent E-mailadres
              </label>
              <input
                type="email"
                id="teacherEmail"
                value={settings.teacherEmail}
                onChange={(e) =>
                  setSettings({ ...settings, teacherEmail: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="docent@mediacollege.nl"
              />
              <p className="mt-1 text-xs text-gray-500">
                Het e-mailadres waar notificaties naartoe worden gestuurd
              </p>
            </div>
          </div>

          {message && (
            <div
              className={`p-4 rounded-md ${
                message.includes('succesvol')
                  ? 'bg-green-50 text-green-800'
                  : 'bg-red-50 text-red-800'
              }`}
            >
              {message}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Bezig met opslaan...' : 'Instellingen Opslaan'}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold mb-2">SMTP Configuratie</h3>
          <p className="text-sm text-gray-600">
            E-mail notificaties worden verstuurd via de SMTP instellingen in het
            .env bestand. Zorg ervoor dat SMTP_HOST, SMTP_PORT, SMTP_USER,
            SMTP_PASS en SMTP_FROM correct zijn geconfigureerd.
          </p>
        </div>
      </div>
    </div>
  )
}
