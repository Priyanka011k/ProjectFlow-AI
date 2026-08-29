import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createTeamMember,
  deleteTeamMember,
  getTeam,
  updateTeamMember,
  type TeamMember,
} from '../services/api'
import { useState } from 'react'

export default function Team() {
  const queryClient = useQueryClient()

  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')

  const { data: team, isLoading, isError } = useQuery({
    queryKey: ['team'],
    queryFn: getTeam,
  })

  const createMutation = useMutation({
    mutationFn: createTeamMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] })
      clearForm()
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      member,
    }: {
      id: number
      member: {
        name: string
        email: string
        role: string
      }
    }) => updateTeamMember(id, member),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] })
      clearForm()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTeamMember,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] })
    },
  })

  function clearForm() {
    setName('')
    setEmail('')
    setRole('')
    setEditingMember(null)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!name || !email || !role) {
      return
    }

    const memberData = {
      name,
      email,
      role,
    }

    if (editingMember) {
      updateMutation.mutate({
        id: editingMember.id,
        member: memberData,
      })
    } else {
      createMutation.mutate(memberData)
    }
  }

  function handleEdit(member: TeamMember) {
    setEditingMember(member)
    setName(member.name)
    setEmail(member.email)
    setRole(member.role)
  }

  function handleDelete(id: number) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this team member?',
    )

    if (confirmed) {
      deleteMutation.mutate(id)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 p-8 text-white">
        <p>Loading team...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-slate-950 p-8 text-white">
        <p className="text-red-400">Failed to load team members.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Team</h1>
          <p className="mt-2 text-slate-400">
            Manage your project team members.
          </p>
        </div>

        {/* Form */}
        <div className="mb-8 rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-5 text-xl font-semibold">
            {editingMember ? 'Edit Team Member' : 'Add Team Member'}
          </h2>

          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-3">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
            />

            <input
              type="text"
              placeholder="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
            />

            <div className="flex gap-3 md:col-span-3">
              <button
                type="submit"
                disabled={
                  createMutation.isPending || updateMutation.isPending
                }
                className="rounded-lg bg-blue-600 px-5 py-3 font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {editingMember
                  ? updateMutation.isPending
                    ? 'Updating...'
                    : 'Update Member'
                  : createMutation.isPending
                    ? 'Adding...'
                    : 'Add Member'}
              </button>

              {editingMember && (
                <button
                  type="button"
                  onClick={clearForm}
                  className="rounded-lg bg-slate-700 px-5 py-3 font-medium hover:bg-slate-600"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Team list */}
        <div className="rounded-xl border border-slate-800 bg-slate-900">
          <div className="border-b border-slate-800 p-6">
            <h2 className="text-xl font-semibold">Team Members</h2>
          </div>

          {team && team.length > 0 ? (
            <div className="divide-y divide-slate-800">
              {team.map((member) => (
                <div
                  key={member.id}
                  className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <h3 className="text-lg font-semibold">{member.name}</h3>

                    <p className="text-sm text-slate-400">
                      {member.email}
                    </p>

                    <span className="mt-2 inline-block rounded-full bg-slate-800 px-3 py-1 text-sm text-blue-400">
                      {member.role}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(member)}
                      className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(member.id)}
                      disabled={deleteMutation.isPending}
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400">
              No team members yet.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}