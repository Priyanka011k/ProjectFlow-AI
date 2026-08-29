import { useState } from 'react'

function AIAssistant() {
  const [prompt, setPrompt] = useState('')

  const handleAskAI = () => {
    if (!prompt.trim()) return

    console.log('AI Prompt:', prompt)
  }

  return (
    <section className="mt-8 rounded-xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-slate-900 p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/20 text-xl">
          🤖
        </div>

        <div>
          <h2 className="text-lg font-semibold">AI Project Assistant</h2>

          <p className="mt-1 text-sm text-slate-400">
            Ask AI to help you manage and plan your projects.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <textarea
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="Ask something like: What should I work on next?"
          rows={3}
          className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950 p-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-indigo-500"
        />

        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={handleAskAI}
            className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
          >
            Ask AI
          </button>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Suggested prompts
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setPrompt('Create tasks for my project')}
            className="rounded-full border border-slate-700 px-3 py-1.5 text-xs text-slate-400 hover:border-indigo-500 hover:text-white"
          >
            Create tasks
          </button>

          <button
            type="button"
            onClick={() => setPrompt('Summarize my project progress')}
            className="rounded-full border border-slate-700 px-3 py-1.5 text-xs text-slate-400 hover:border-indigo-500 hover:text-white"
          >
            Summarize project
          </button>

          <button
            type="button"
            onClick={() => setPrompt('What should I work on next?')}
            className="rounded-full border border-slate-700 px-3 py-1.5 text-xs text-slate-400 hover:border-indigo-500 hover:text-white"
          >
            Next priority
          </button>
        </div>
      </div>
    </section>
  )
}

export default AIAssistant