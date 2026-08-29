function Header() {
  return (
    <header className="flex items-center justify-between border-b border-slate-800 pb-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <p className="mt-1 text-sm text-slate-400">
          Welcome back! Here's your project overview.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="rounded-lg border border-slate-800 px-3 py-2 text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          🔔
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 font-semibold">
            P
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-medium">Priyanka</p>
            <p className="text-xs text-slate-500">Developer</p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header