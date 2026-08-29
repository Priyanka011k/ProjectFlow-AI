import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import StatCard from '../components/StatCard'
import ProjectList from '../components/ProjectList'
import AIAssistant from '../components/AIAssistant'
import useAppStore from '../store/useAppStore'
import { useQuery } from '@tanstack/react-query'
import { checkBackendHealth } from '../services/api'

function Dashboard() {
    const selectedProjectId = useAppStore(
  (state) => state.selectedProjectId,
)
const { data, isLoading, isError } = useQuery({
  queryKey: ['backend-health'],
  queryFn: checkBackendHealth,
})
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Sidebar />

      <main className="ml-64 min-h-screen p-8">
        <Header />
        <div className="mt-6">
           {isLoading && (
          <p className="text-sm text-slate-500">
               Checking backend connection...
        </p>
        )}

        {isError && (
        <p className="text-sm text-red-400">
            Backend connection failed
        </p>
      )}

       {data && (
           <p className="text-sm text-green-400">
           🟢 {data.message}
          </p>
         )}
        </div>

        <section className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Projects"
            value={12}
            description="+2 this week"
          />

          <StatCard
            title="Tasks"
            value={48}
            description="+8 this week"
          />

          <StatCard
            title="Completed"
            value={32}
            description="+5 this week"
          />

          <StatCard
            title="Team Members"
            value={8}
            description="+1 this week"
          />
        </section>
        <ProjectList />
        <AIAssistant />
        <p className="mt-4 text-xs text-slate-600">
           Selected project: {selectedProjectId ?? 'None'}
        </p>
      </main>
    </div>
  )
}

export default Dashboard