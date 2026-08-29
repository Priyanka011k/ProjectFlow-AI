const API_BASE_URL = 'http://127.0.0.1:8000'

export async function checkBackendHealth() {
  const response = await fetch(`${API_BASE_URL}/api/health`)

  if (!response.ok) {
    throw new Error('Backend health check failed')
  }

  return response.json()
}

export interface Project {
  id: number
  name: string
  description: string
  status: 'Planning' | 'In Progress' | 'Completed'
  progress: number
}

export async function getProjects(): Promise<Project[]> {
  const response = await fetch(`${API_BASE_URL}/api/projects`)

  if (!response.ok) {
    throw new Error('Failed to fetch projects')
  }

  return response.json()
}
export async function createProject(project: {
  name: string
  description: string
  status: string
  progress: number
}) {
  const response = await fetch(`${API_BASE_URL}/api/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(project),
  })

  if (!response.ok) {
    throw new Error('Failed to create project')
  }

  return response.json()
}
export async function deleteProject(projectId: number) {
  const response = await fetch(
    `${API_BASE_URL}/api/projects/${projectId}`,
    {
      method: 'DELETE',
    },
  )

  if (!response.ok) {
    throw new Error('Failed to delete project')
  }

  return response.json()
}

export async function updateProject(
  projectId: number,
  project: {
    name: string
    description: string
    status: string
    progress: number
  },
) {
  const response = await fetch(
    `${API_BASE_URL}/api/projects/${projectId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    },
  )

  if (!response.ok) {
    throw new Error('Failed to update project')
  }

  return response.json()
}



export interface Task {
  id: number
  name: string
  description: string
  status: 'Todo' | 'In Progress' | 'Completed'
  priority: 'Low' | 'Medium' | 'High'
  project_id: number | null
}

export async function getTasks(): Promise<Task[]> {
  const response = await fetch(`${API_BASE_URL}/api/tasks`)

  if (!response.ok) {
    throw new Error('Failed to fetch tasks')
  }

  return response.json()
}

export async function createTask(task: {
  name: string
  description: string
  status: string
  priority: string
  project_id: number | null
}) {
  const response = await fetch(`${API_BASE_URL}/api/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  })

  if (!response.ok) {
    throw new Error('Failed to create task')
  }

  return response.json()
}

export async function updateTask(
  taskId: number,
  task: {
    name: string
    description: string
    status: string
    priority: string
    project_id: number | null
  },
) {
  const response = await fetch(
    `${API_BASE_URL}/api/tasks/${taskId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    },
  )

  if (!response.ok) {
    throw new Error('Failed to update task')
  }

  return response.json()
}

export async function deleteTask(taskId: number) {
  const response = await fetch(
    `${API_BASE_URL}/api/tasks/${taskId}`,
    {
      method: 'DELETE',
    },
  )

  if (!response.ok) {
    throw new Error('Failed to delete task')
  }

  return response.json()
}


export interface TeamMember {
  id: number
  name: string
  email: string
  role: string
}

export async function getTeam(): Promise<TeamMember[]> {
  const response = await fetch(`${API_BASE_URL}/api/team`)

  if (!response.ok) {
    throw new Error('Failed to fetch team')
  }

  return response.json()
}

export async function createTeamMember(member: {
  name: string
  email: string
  role: string
}) {
  const response = await fetch(`${API_BASE_URL}/api/team`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(member),
  })

  if (!response.ok) {
    throw new Error('Failed to create team member')
  }

  return response.json()
}

export async function updateTeamMember(
  memberId: number,
  member: {
    name: string
    email: string
    role: string
  },
) {
  const response = await fetch(
    `${API_BASE_URL}/api/team/${memberId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(member),
    },
  )

  if (!response.ok) {
    throw new Error('Failed to update team member')
  }

  return response.json()
}

export async function deleteTeamMember(memberId: number) {
  const response = await fetch(
    `${API_BASE_URL}/api/team/${memberId}`,
    {
      method: 'DELETE',
    },
  )

  if (!response.ok) {
    throw new Error('Failed to delete team member')
  }

  return response.json()
}

export interface AITask {
  name: string
  description: string
  priority: string
}

export async function generateAITasks(
  projectDescription: string,
): Promise<{ tasks: AITask[] }> {
  const response = await fetch(
    `${API_BASE_URL}/api/ai/generate-tasks`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        project_description: projectDescription,
      }),
    },
  )

  if (!response.ok) {
    throw new Error('Failed to generate AI tasks')
  }

  return response.json()
}

export async function saveAITask(task: {
  name: string
  description: string
  priority: string
}) {
  const response = await fetch(`${API_BASE_URL}/api/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: task.name,
      description: task.description,
      priority: task.priority,
      status: 'Todo',
      project_id: null,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to save AI task')
  }

  return response.json()
}