import { useState } from 'react'
import {
  useMutation,
  useQuery,
} from '@tanstack/react-query'
import {
  getProjects,
  prioritizeProjectTasks,
} from '../services/api'

function TaskPrioritization() {
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  })

  const prioritizeMutation = useMutation({
    mutationFn: prioritizeProjectTasks,
  })

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">
      <h1 className="text-3xl font-bold">
        AI Task Prioritization 🤖
      </h1>

      <p className="mt-2 text-slate-400">
        Analyze your project tasks and get AI-recommended priorities.
      </p>

      <section className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-lg font-semibold">
          Select Project
        </h2>

        <select
          value={selectedProjectId ?? ''}
          onChange={(e) => {
            const value = e.target.value

            setSelectedProjectId(
              value ? Number(value) : null
            )
          }}
          className="mt-4 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
        >
          <option value="">
            Select a project
          </option>

          {projects?.map((project) => (
            <option
              key={project.id}
              value={project.id}
            >
              {project.name}
            </option>
          ))}
        </select>

        <button
          onClick={() => {
            if (selectedProjectId) {
              prioritizeMutation.mutate(selectedProjectId)
            }
          }}
          disabled={
            !selectedProjectId ||
            prioritizeMutation.isPending
          }
          className="mt-4 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {prioritizeMutation.isPending
            ? 'Analyzing...'
            : 'Prioritize Tasks 🤖'}
        </button>

        {selectedProjectId && (
          <p className="mt-4 text-sm text-slate-400">
            Selected Project ID: {selectedProjectId}
          </p>
        )}
      </section>
    </div>
  )
}

export default TaskPrioritization