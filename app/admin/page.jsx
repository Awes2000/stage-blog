export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Posts</h3>
          <p className="text-gray-600">Beheer je stage blog posts</p>
          <a
            href="/admin/posts"
            className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-medium"
          >
            Bekijk posts →
          </a>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Gebruikers</h3>
          <p className="text-gray-600">Beheer gebruikers en rollen</p>
          <a
            href="/admin/users"
            className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-medium"
          >
            Bekijk gebruikers →
          </a>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Instellingen</h3>
          <p className="text-gray-600">E-mail notificaties en meer</p>
          <a
            href="/admin/settings"
            className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-medium"
          >
            Bekijk instellingen →
          </a>
        </div>
      </div>
    </div>
  )
}
