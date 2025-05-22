import React from 'react'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 hidden sm:block">
        <h2 className="text-xl font-bold text-blue-600">My-RAG</h2>
        <nav className="mt-8 space-y-4">
          <a href="#" className="block text-sm text-gray-700 hover:text-blue-600">Dashboard</a>
          <a href="#" className="block text-sm text-gray-700 hover:text-blue-600">Upload</a>
          <a href="#" className="block text-sm text-gray-700 hover:text-blue-600">Ask</a>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        <header className="mb-6 border-b pb-4">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        </header>
        {children}
      </main>
    </div>
  )
}