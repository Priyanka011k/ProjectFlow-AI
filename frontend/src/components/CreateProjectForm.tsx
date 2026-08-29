import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createProject } from '../services/api'

function CreateProjectForm() {
  const queryClient = useQueryClient()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('Planning')
  const [progress, setProgress] = useState(0)

  const createProjectMutation = useMutation({
    mutationFn: createProject,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['projects'],
      })

      setName('')
      setDescription('')
      setStatus('Planning')
      setProgress(0)
    },
  })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    createProjectMutation.mutate({
      name,
      description,
      status,
      progress,
    })
  }

  return (
    <section className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-lg font-semibold">Create New Project</h2>

      <p className="mt-1 text-sm text-slate-500">
        Add a new project to your workspace.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label
            htmlFor="project-name"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Project Name
          </label>

          <input
            id="project-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter project name"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-indigo-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="project-description"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Description
          </label>

          <textarea
            id="project-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Describe your project"
            rows={4}
            className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-indigo-500"
            required
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="project-status"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Status
            </label>

            <select
              id="project-status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
            >
              <option value="Planning">Planning</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="project-progress"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Progress (%)
            </label>

            <input
              id="project-progress"
              type="number"
              min="0"
              max="100"
              value={progress}
              onChange={(event) => setProgress(Number(event.target.value))}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={createProjectMutation.isPending}
            className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {createProjectMutation.isPending
              ? 'Creating...'
              : 'Create Project'}
          </button>
        </div>

        {createProjectMutation.isError && (
          <p className="text-sm text-red-400">
            Failed to create project. Please try again.
          </p>
        )}

        {createProjectMutation.isSuccess && (
          <p className="text-sm text-green-400">
            Project created successfully! 🎉
          </p>
        )}
      </form>
    </section>
  )
}

export default CreateProjectForm