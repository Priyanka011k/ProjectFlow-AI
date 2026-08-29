interface Project {
  name: string
  status: 'Planning' | 'In Progress' | 'Completed'
  progress: number
  dueDate: string
}

const projects: Project[] = [
  {
    name: 'AI Task Manager',
    status: 'In Progress',
    progress: 70,
    dueDate: 'Aug 28, 2026',
  },
  {
    name: 'E-Commerce Platform',
    status: 'Completed',
    progress: 100,
    dueDate: 'Aug 25, 2026',
  },
  {
    name: 'Portfolio Website',
    status: 'Planning',
    progress: 30,
    dueDate: 'Sep 02, 2026',
  },
]

function ProjectList() {
  return (
    <section className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Recent Projects</h2>
          <p className="mt-1 text-sm text-slate-500">
            Keep track of your latest projects.
          </p>
        </div>

        <button
          type="button"
          className="text-sm font-medium text-indigo-400 hover:text-indigo-300"
        >
          View all →
        </button>
      </div>

      <div className="mt-6 space-y-5">
        {projects.map((project) => (
          <div
            key={project.name}
            className="border-b border-slate-800 pb-5 last:border-0 last:pb-0"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-medium">{project.name}</h3>

                <p className="mt-1 text-xs text-slate-500">
                  Due {project.dueDate}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  project.status === 'Completed'
                    ? 'bg-green-500/10 text-green-400'
                    : project.status === 'In Progress'
                      ? 'bg-blue-500/10 text-blue-400'
                      : 'bg-yellow-500/10 text-yellow-400'
                }`}
              >
                {project.status}
              </span>
            </div>

            <div className="mt-4 flex items-center gap-4">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-indigo-500"
                  style={{ width: `${project.progress}%` }}
                />
              </div>

              <span className="w-10 text-right text-xs text-slate-400">
                {project.progress}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ProjectList