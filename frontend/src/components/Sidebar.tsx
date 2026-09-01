
import { Link } from 'react-router-dom'

function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-slate-800 bg-slate-950 p-6 text-white">
      <h1 className="text-xl font-bold">ProjectFlow AI</h1>

      <nav className="mt-10 space-y-2">
        <Link
          to="/"
          className="block rounded-lg bg-slate-800 px-4 py-3 text-sm font-medium"
        >
          Dashboard
        </Link>

        <Link
          to="/projects"
          className="block rounded-lg px-4 py-3 text-sm text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          Projects
        </Link>

        <Link
          to="/tasks"
          className="block rounded-lg px-4 py-3 text-sm text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          Tasks
        </Link>

        <Link
          to="/teams"
          className="block rounded-lg px-4 py-3 text-sm text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          Team
        </Link>

        <Link
          to="/insights"
          className="block rounded-lg px-4 py-3 text-sm text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          AI Insights 🤖
        </Link>
      </nav>

      <div className="absolute bottom-6 left-6 right-6">
        <Link
          to="#"
          className="block rounded-lg px-4 py-3 text-sm text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          Settings
        </Link>
      </div>
    </aside>
  )
}

export default Sidebar
