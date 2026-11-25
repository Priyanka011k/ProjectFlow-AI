import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Tasks from './pages/Tasks'
import Teams from './pages/Teams'
import AITaskGenerator from './pages/AITaskGenerator'
import ProjectInsights from './components/ProjectInsights'
import TaskPrioritization from './pages/TaskPrioritization'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/ai-tasks" element={<AITaskGenerator />} />
        <Route path="/insights" element={<ProjectInsights />} />
        <Route
          path="/prioritize-tasks"
          element={<TaskPrioritization />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App