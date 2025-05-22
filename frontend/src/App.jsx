import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import QueryPage from "./pages/QueryPage";
import DataPage from "./pages/DataPage";
import DocsPage from "./pages/DocsPage";
import { Menu } from "lucide-react";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Mobile header */}
        <header className="md:hidden bg-gray-900 text-white flex items-center justify-between px-4 py-3">
          <div className="text-lg font-bold">🧠 ContextUI</div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Sidebar */}
        <aside className={`${sidebarOpen ? "block" : "hidden"} md:block w-full md:w-64 bg-gray-900 text-white flex flex-col justify-between`}>
          <div>
            <div className="px-6 py-4 text-xl font-bold border-b border-gray-700 hidden md:block">🧠 ContextUI</div>
            <nav className="px-6 py-4 space-y-2">
              <Link to="/" onClick={() => setSidebarOpen(false)} className="block hover:text-blue-400">Query</Link>
              <Link to="/data" onClick={() => setSidebarOpen(false)} className="block hover:text-blue-400">Data Management</Link>
              <Link to="/docs" onClick={() => setSidebarOpen(false)} className="block hover:text-blue-400">Documentation</Link>
            </nav>
          </div>
          <footer className="px-6 py-4 text-xs border-t border-gray-700 text-gray-400">
            Built by <a href="http://linkedin.com/in/sean-pope" target="_blank" rel="noreferrer" className="underline hover:text-white">Sean Pope</a><br/>
            © 2025 Personal Concierge
          </footer>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
          <Routes>
            <Route path="/" element={<QueryPage />} />
            <Route path="/data" element={<DataPage />} />
            <Route path="/docs" element={<DocsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}