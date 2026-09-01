import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Tasks from './pages/Tasks'
import Teams from './pages/Teams'
import AITaskGenerator from './pages/AITaskGenerator'
import ProjectInsights from './components/ProjectInsights'

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
      </Routes>
    </BrowserRouter>
  )
}

export default App