
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useState } from 'react'
import {
  createTask,
  deleteTask,
  getProjects,
  getTasks,
  updateTask,
  type Task,
} from '../services/api'

function Tasks() {
  const queryClient = useQueryClient()

  // ---------------- CREATE FORM ----------------

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('Todo')
  const [priority, setPriority] = useState('Medium')
  const [projectId, setProjectId] = useState<number | null>(null)

  // ---------------- EDIT FORM ----------------

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editStatus, setEditStatus] = useState('Todo')
  const [editPriority, setEditPriority] = useState('Medium')
  const [editProjectId, setEditProjectId] = useState<number | null>(null)

  // ---------------- GET TASKS ----------------

  const {
    data: tasks,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
  })

  // ---------------- GET PROJECTS ----------------

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  })

  // ---------------- CREATE TASK ----------------

  const createTaskMutation = useMutation({
    mutationFn: createTask,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tasks'],
      })

      setName('')
      setDescription('')
      setStatus('Todo')
      setPriority('Medium')
      setProjectId(null)
    },
  })

  // ---------------- DELETE TASK ----------------

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tasks'],
      })
    },
  })

  // ---------------- UPDATE TASK ----------------

  const updateTaskMutation = useMutation({
    mutationFn: ({
      id,
      task,
    }: {
      id: number
      task: {
        name: string
        description: string
        status: string
        priority: string
        project_id: number | null
      }
    }) => updateTask(id, task),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tasks'],
      })
      queryClient.invalidateQueries({
        queryKey: ['projects'],
      })

      setEditingId(null)
    },
  })

  // ---------------- CREATE HANDLER ----------------

  const handleCreate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    createTaskMutation.mutate({
      name,
      description,
      status,
      priority,
      project_id: projectId,
    })
  }

  // ---------------- START EDITING ----------------

  const startEditing = (task: Task) => {
    setEditingId(task.id)
    setEditName(task.name)
    setEditDescription(task.description)
    setEditStatus(task.status)
    setEditPriority(task.priority)
    setEditProjectId(task.project_id)
  }

  // ---------------- UPDATE HANDLER ----------------

  const handleUpdate = (taskId: number) => {
    updateTaskMutation.mutate({
      id: taskId,
      task: {
        name: editName,
        description: editDescription,
        status: editStatus,
        priority: editPriority,
        project_id: editProjectId,
      },
    })
  }

  // ---------------- PROJECT NAME ----------------

  const getProjectName = (id: number | null) => {
    if (!id || !projects) {
      return 'No project'
    }

    const project = projects.find((item) => item.id === id)

    return project ? project.name : 'No project'
  }

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">
      <h1 className="text-3xl font-bold">Tasks</h1>

      <p className="mt-2 text-slate-400">
        Create and manage tasks for your projects.
      </p>

      {/* ================= CREATE TASK ================= */}

      <section className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-lg font-semibold">
          Create New Task
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Add a task to your workspace.
        </p>

        <form
          onSubmit={handleCreate}
          className="mt-6 space-y-5"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Task Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Enter task name"
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Description
            </label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Describe the task"
              rows={3}
              required
              className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-indigo-500"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Status
              </label>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value)
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
              >
                <option value="Todo">Todo</option>
                <option value="In Progress">
                  In Progress
                </option>
                <option value="Done">
                  Done
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Priority
              </label>

              <select
                value={priority}
                onChange={(event) =>
                  setPriority(event.target.value)
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Project
              </label>

              <select
                value={projectId ?? ''}
                onChange={(event) =>
                  setProjectId(
                    event.target.value
                      ? Number(event.target.value)
                      : null,
                  )
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
              >
                <option value="">No project</option>

                {projects?.map((project) => (
                  <option
                    key={project.id}
                    value={project.id}
                  >
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={createTaskMutation.isPending}
              className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {createTaskMutation.isPending
                ? 'Creating...'
                : 'Create Task'}
            </button>
          </div>

          {createTaskMutation.isError && (
            <p className="text-sm text-red-400">
              Failed to create task. Please try again.
            </p>
          )}

          {createTaskMutation.isSuccess && (
            <p className="text-sm text-green-400">
              Task created successfully! 🎉
            </p>
          )}
        </form>
      </section>

      {/* ================= TASK LIST ================= */}

      <section className="mt-8">
        <h2 className="text-xl font-semibold">
          All Tasks
        </h2>

        {isLoading && (
          <p className="mt-6 text-slate-500">
            Loading tasks...
          </p>
        )}

        {isError && (
          <p className="mt-6 text-red-400">
            Failed to load tasks.
          </p>
        )}

        {tasks && tasks.length === 0 && (
          <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
            <p className="text-slate-400">
              No tasks yet. Create your first task above.
            </p>
          </div>
        )}

        {tasks && tasks.length > 0 && (
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="rounded-xl border border-slate-800 bg-slate-900 p-6"
              >
                {editingId === task.id ? (
                  /* ================= EDIT ================= */

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
                        setEditDescription(
                          event.target.value,
                        )
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
                      <option value="Todo">Todo</option>
                      <option value="In Progress">
                        In Progress
                      </option>
                      <option value="Done">
                        Done
                      </option>
                    </select>

                    <select
                      value={editPriority}
                      onChange={(event) =>
                        setEditPriority(
                          event.target.value,
                        )
                      }
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white outline-none focus:border-indigo-500"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>

                    <select
                      value={editProjectId ?? ''}
                      onChange={(event) =>
                        setEditProjectId(
                          event.target.value
                            ? Number(event.target.value)
                            : null,
                        )
                      }
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white outline-none focus:border-indigo-500"
                    >
                      <option value="">
                        No project
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

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdate(task.id)
                        }
                        disabled={
                          updateTaskMutation.isPending
                        }
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500 disabled:opacity-50"
                      >
                        {updateTaskMutation.isPending
                          ? 'Saving...'
                          : 'Save Changes'}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setEditingId(null)
                        }
                        className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ================= VIEW ================= */

                  <>
                    <h3 className="text-lg font-semibold">
                      {task.name}
                    </h3>

                    <p className="mt-3 text-sm text-slate-400">
                      {task.description}
                    </p>

                    <div className="mt-4 space-y-2 text-sm">
                      <p className="text-indigo-400">
                        Status: {task.status}
                      </p>

                      <p className="text-amber-400">
                        Priority: {task.priority}
                      </p>

                      <p className="text-slate-400">
                        Project:{' '}
                        {getProjectName(
                          task.project_id,
                        )}
                      </p>
                    </div>

                    <div className="mt-5 flex gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          startEditing(task)
                        }
                        className="rounded-lg border border-indigo-500/30 px-4 py-2 text-sm text-indigo-400 hover:bg-indigo-500/10"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (
                            window.confirm(
                              `Are you sure you want to delete "${task.name}"?`,
                            )
                          ) {
                            deleteTaskMutation.mutate(
                              task.id,
                            )
                          }
                        }}
                        disabled={
                          deleteTaskMutation.isPending
                        }
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
      </section>
    </div>
  )
}

export default Tasks
