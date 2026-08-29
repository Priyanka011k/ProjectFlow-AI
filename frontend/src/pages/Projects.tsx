import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useState } from 'react'
import {
  getProjects,
  deleteProject,
  updateProject,
  type Project,
} from '../services/api'
import CreateProjectForm from '../components/CreateProjectForm'

function Projects() {
  const queryClient = useQueryClient()

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editStatus, setEditStatus] = useState('Planning')
  const [editProgress, setEditProgress] = useState(0)

  const deleteProjectMutation = useMutation({
    mutationFn: deleteProject,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['projects'],
      })
    },
  })

  const updateProjectMutation = useMutation({
    mutationFn: ({
      id,
      project,
    }: {
      id: number
      project: {
        name: string
        description: string
        status: string
        progress: number
      }
    }) => updateProject(id, project),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['projects'],
      })

      setEditingId(null)
    },
  })

  const {
    data: projects,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  })

  const startEditing = (project: Project) => {
    setEditingId(project.id)
    setEditName(project.name)
    setEditDescription(project.description)
    setEditStatus(project.status)
    setEditProgress(project.progress)
  }

  const handleUpdate = (projectId: number) => {
    updateProjectMutation.mutate({
      id: projectId,
      project: {
        name: editName,
        description: editDescription,
        status: editStatus,
        progress: editProgress,
      },
    })
  }

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">
      <h1 className="text-3xl font-bold">Projects</h1>

      <p className="mt-2 text-slate-400">
        Manage all your projects in one place.
      </p>

      <CreateProjectForm />

      {isLoading && (
        <p className="mt-8 text-slate-500">
          Loading projects...
        </p>
      )}

      {isError && (
        <p className="mt-8 text-red-400">
          Failed to load projects.
        </p>
      )}

      {projects && (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="rounded-xl border border-slate-800 bg-slate-900 p-6"
            >
              {editingId === project.id ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editName}
                    onChange={(event) =>
                      setEditName(event.target.value)
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white outline-none focus:border-indigo-500"
                  />

                  <textarea
                    value={editDescription}
                    onChange={(event) =>
                      setEditDescription(event.target.value)
                    }
                    rows={3}
                    className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white outline-none focus:border-indigo-500"
                  />

                  <select
                    value={editStatus}
                    onChange={(event) =>
                      setEditStatus(event.target.value)
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white outline-none focus:border-indigo-500"
                  >
                    <option value="Planning">Planning</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>

                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editProgress}
                    onChange={(event) =>
                      setEditProgress(Number(event.target.value))
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white outline-none focus:border-indigo-500"
                  />

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleUpdate(project.id)}
                      disabled={updateProjectMutation.isPending}
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500 disabled:opacity-50"
                    >
                      {updateProjectMutation.isPending
                        ? 'Saving...'
                        : 'Save Changes'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-lg font-semibold">
                    {project.name}
                  </h2>

                  <p className="mt-3 text-sm text-slate-400">
                    {project.description}
                  </p>

                  <p className="mt-4 text-sm text-indigo-400">
                    {project.status} — {project.progress}%
                  </p>

                  <div className="mt-5 flex gap-3">
                    <button
                      type="button"
                      onClick={() => startEditing(project)}
                      className="rounded-lg border border-indigo-500/30 px-4 py-2 text-sm text-indigo-400 hover:bg-indigo-500/10"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Are you sure you want to delete "${project.name}"?`,
                          )
                        ) {
                          deleteProjectMutation.mutate(project.id)
                        }
                      }}
                      disabled={deleteProjectMutation.isPending}
                      className="rounded-lg border border-red-500/30 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Projects