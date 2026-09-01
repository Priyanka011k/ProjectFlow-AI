import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
    getProjects,
    generateProjectInsights,
} from '../services/api'

interface AIInsights {
    summary: string
    health: string
    risks: string[]
    recommendations: string[]
    next_steps: string[]
}

function ProjectInsights() {
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
        null,
    )

    const { data: projects = [], isLoading: projectsLoading } = useQuery({
        queryKey: ['projects'],
        queryFn: getProjects,
    })

    const insightsMutation = useMutation({
        mutationFn: generateProjectInsights,
    })

    function handleAnalyze() {
        if (!selectedProjectId) {
            return
        }

        insightsMutation.mutate(selectedProjectId)
    }

    function parseInsights(data: string | AIInsights): AIInsights | null {
        if (typeof data === 'object') {
            return data
        }

        try {
            return JSON.parse(data)
        } catch {
            return null
        }
    }

    const insights = insightsMutation.data
        ? parseInsights(insightsMutation.data.insights)
        : null

    return (
        <div className="min-h-screen bg-slate-950 p-8 text-white">
            <div className="mx-auto max-w-6xl">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">
                        AI Project Insights 🤖
                    </h1>

                    <p className="mt-2 text-slate-400">
                        Analyze your project's progress, risks and next steps
                        using AI.
                    </p>
                </div>

                {/* Project Selection */}
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
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

                    <button
                        onClick={handleAnalyze}
                        disabled={
                            !selectedProjectId ||
                            insightsMutation.isPending
                        }
                        className="mt-4 rounded-lg bg-blue-600 px-6 py-3 font-medium hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {insightsMutation.isPending
                            ? 'Analyzing...'
                            : 'Analyze Project 🤖'}
                    </button>
                </div>

                {/* Error */}
                {insightsMutation.isError && (
                    <div className="mt-6 rounded-xl border border-red-800 bg-red-950 p-5">
                        <h3 className="font-semibold text-red-300">
                            AI Analysis Failed
                        </h3>

                        <p className="mt-2 text-sm text-red-400">
                            {insightsMutation.error instanceof Error
                                ? insightsMutation.error.message
                                : 'Unable to generate project insights.'}
                        </p>
                    </div>
                )}

                {/* AI Results */}
                {insightsMutation.isSuccess && (
                    <div className="mt-8 space-y-6">

                        {/* Project Name + Health */}
                        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                                <div>
                                    <p className="text-sm text-slate-500">
                                        Project
                                    </p>

                                    <h2 className="mt-1 text-2xl font-bold">
                                        {insightsMutation.data.project_name}
                                    </h2>
                                </div>

                                {insights && (
                                    <div className="rounded-full bg-slate-800 px-4 py-2">
                                        <span className="text-sm text-slate-400">
                                            Health:{' '}
                                        </span>

                                        <span className="font-semibold text-blue-400">
                                            {insights.health}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {insights ? (
                            <>
                                {/* Summary */}
                                <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                                    <h3 className="text-lg font-semibold">
                                        📊 Project Summary
                                    </h3>

                                    <p className="mt-3 leading-7 text-slate-400">
                                        {insights.summary}
                                    </p>
                                </div>

                                {/* Risks */}
                                <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                                    <h3 className="text-lg font-semibold">
                                        ⚠️ Risks
                                    </h3>

                                    <div className="mt-4 space-y-3">
                                        {insights.risks.length > 0 ? (
                                            insights.risks.map((risk, index) => (
                                                <div
                                                    key={index}
                                                    className="rounded-lg bg-slate-800 p-4 text-slate-300"
                                                >
                                                    <span className="mr-2 text-red-400">
                                                        •
                                                    </span>

                                                    {risk}
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-slate-500">
                                                No major risks identified.
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Recommendations */}
                                <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                                    <h3 className="text-lg font-semibold">
                                        💡 Recommendations
                                    </h3>

                                    <div className="mt-4 space-y-3">
                                        {insights.recommendations.map(
                                            (recommendation, index) => (
                                                <div
                                                    key={index}
                                                    className="rounded-lg bg-slate-800 p-4 text-slate-300"
                                                >
                                                    <span className="mr-2 text-blue-400">
                                                        •
                                                    </span>

                                                    {recommendation}
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>

                                {/* Next Steps */}
                                <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                                    <h3 className="text-lg font-semibold">
                                        🚀 Next Steps
                                    </h3>

                                    <div className="mt-4 space-y-3">
                                        {insights.next_steps.map(
                                            (step, index) => (
                                                <div
                                                    key={index}
                                                    className="rounded-lg bg-slate-800 p-4 text-slate-300"
                                                >
                                                    <span className="mr-3 font-semibold text-emerald-400">
                                                        {index + 1}.
                                                    </span>

                                                    {step}
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="rounded-xl border border-yellow-800 bg-yellow-950 p-5 text-yellow-300">
                                AI returned a response, but it could not be
                                converted into the expected insights format.
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    )
}

export default ProjectInsights