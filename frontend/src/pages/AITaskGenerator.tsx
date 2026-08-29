import { useState } from 'react'
import {
    useMutation,
    useQuery,
} from '@tanstack/react-query'
import {
    generateAITasks,
    saveAITask,
    getProjects,
    type AITask,
} from '../services/api'

function AITaskGenerator() {
    const [projectDescription, setProjectDescription] = useState('')
    const [generatedTasks, setGeneratedTasks] = useState<AITask[]>([])
    const [selectedTasks, setSelectedTasks] = useState<number[]>([])
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)

    // Get projects
    const {
        data: projects = [],
        isLoading: projectsLoading,
    } = useQuery({
        queryKey: ['projects'],
        queryFn: getProjects,
    })

    // Generate AI tasks
    const generateMutation = useMutation({
        mutationFn: generateAITasks,

        onSuccess: (data) => {
            setGeneratedTasks(data.tasks)
            setSelectedTasks([])
        },
    })

    // Save AI task
    const saveMutation = useMutation({
        mutationFn: ({
            task,
            projectId,
        }: {
            task: AITask
            projectId: number
        }) => saveAITask(task, projectId),
    })

    // Generate button
    function handleGenerate(e: React.FormEvent) {
        e.preventDefault()

        if (!selectedProjectId) {
            return
        }

        if (!projectDescription.trim()) {
            return
        }

        generateMutation.mutate(projectDescription)
    }

    // Select / unselect task
    function toggleTask(index: number) {
        setSelectedTasks((previous) =>
            previous.includes(index)
                ? previous.filter((item) => item !== index)
                : [...previous, index],
        )
    }

    // Add selected tasks
    function handleAddSelectedTasks() {
        if (!selectedProjectId || selectedTasks.length === 0) {
            return
        }

        selectedTasks.forEach((index) => {
            saveMutation.mutate({
                task: generatedTasks[index],
                projectId: selectedProjectId,
            })
        })

        setSelectedTasks([])
    }

    return (
        <div className="min-h-screen bg-slate-950 p-8 text-white">
            <div className="mx-auto max-w-6xl">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">
                        AI Task Generator 🤖
                    </h1>

                    <p className="mt-2 text-slate-400">
                        Select a project and let AI generate a development plan.
                    </p>
                </div>

                {/* Input Section */}
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">

                    <h2 className="mb-4 text-xl font-semibold">
                        Create AI Task Plan
                    </h2>

                    {/* Select Project */}
                    <div className="mb-5">
                        <label className="mb-2 block text-sm font-medium text-slate-300">
                            Select Project
                        </label>

                        <select
                            value={selectedProjectId ?? ''}
                            onChange={(e) =>
                                setSelectedProjectId(
                                    e.target.value
                                        ? Number(e.target.value)
                                        : null,
                                )
                            }
                            disabled={projectsLoading}
                            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white outline-none focus:border-blue-500"
                        >
                            <option value="">
                                {projectsLoading
                                    ? 'Loading projects...'
                                    : 'Select a project'}
                            </option>

                            {projects.map((project) => (
                                <option
                                    key={project.id}
                                    value={project.id}
                                >
                                    {project.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Project Description */}
                    <form onSubmit={handleGenerate}>
                        <textarea
                            value={projectDescription}
                            onChange={(e) =>
                                setProjectDescription(e.target.value)
                            }
                            placeholder="Example: Build an e-commerce website using React, Node.js, Express and PostgreSQL"
                            rows={5}
                            className="w-full resize-none rounded-lg border border-slate-700 bg-slate-800 p-4 text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
                        />

                        <button
                            type="submit"
                            disabled={
                                generateMutation.isPending ||
                                !selectedProjectId ||
                                !projectDescription.trim()
                            }
                            className="mt-4 rounded-lg bg-blue-600 px-6 py-3 font-medium hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {generateMutation.isPending
                                ? 'Generating...'
                                : 'Generate Tasks 🤖'}
                        </button>
                    </form>
                </div>

                {/* Error */}
                {generateMutation.isError && (
                    <div className="mt-6 rounded-lg border border-red-800 bg-red-950 p-4 text-red-300">
                        Failed to generate tasks. Please try again.
                    </div>
                )}

                {/* Generated Tasks */}
                {generatedTasks.length > 0 && (
                    <div className="mt-8">

                        {/* Section Header */}
                        <div className="mb-5">
                            <h2 className="text-2xl font-semibold">
                                Generated Tasks
                            </h2>

                            <p className="mt-1 text-slate-400">
                                Select the tasks you want to add to your project.
                            </p>
                        </div>

                        {/* Task List */}
                        <div className="space-y-4">

                            {generatedTasks.map((task, index) => (
                                <div
                                    key={index}
                                    className={`rounded-xl border p-5 transition ${
                                        selectedTasks.includes(index)
                                            ? 'border-blue-500 bg-slate-900'
                                            : 'border-slate-800 bg-slate-900'
                                    }`}
                                >
                                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                                        {/* Checkbox + Task Details */}
                                        <div className="flex items-start gap-4">

                                            <input
                                                type="checkbox"
                                                checked={selectedTasks.includes(index)}
                                                onChange={() => toggleTask(index)}
                                                className="mt-1 h-5 w-5 cursor-pointer accent-blue-600"
                                            />

                                            <div>
                                                <h3 className="text-lg font-semibold">
                                                    {index + 1}. {task.name}
                                                </h3>

                                                <p className="mt-2 text-slate-400">
                                                    {task.description}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Priority */}
                                        <span className="w-fit rounded-full bg-slate-800 px-3 py-1 text-sm text-blue-400">
                                            {task.priority}
                                        </span>
                                    </div>
                                </div>
                            ))}

                        </div>

                        {/* Selection Summary */}
                        <div className="mt-6 flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900 p-5 sm:flex-row sm:items-center sm:justify-between">

                            <div>
                                <p className="font-medium">
                                    {selectedTasks.length} task
                                    {selectedTasks.length !== 1 ? 's' : ''} selected
                                </p>

                                <p className="mt-1 text-sm text-slate-400">
                                    Selected tasks will be added to the chosen project.
                                </p>
                            </div>

                            {/* Add Selected Tasks */}
                            <button
                                type="button"
                                onClick={handleAddSelectedTasks}
                                disabled={
                                    selectedTasks.length === 0 ||
                                    saveMutation.isPending
                                }
                                className="rounded-lg bg-emerald-600 px-6 py-3 font-medium hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {saveMutation.isPending
                                    ? 'Adding Tasks...'
                                    : `Add Selected Tasks (${selectedTasks.length})`}
                            </button>

                        </div>

                    </div>
                )}

            </div>
        </div>
    )
}

export default AITaskGenerator