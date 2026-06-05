export interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  imageUrl: string
  liveUrl?: string
  githubUrl?: string
  createdAt?: string
}

export const getProjects = async (): Promise<Project[]> => {
  const response = await fetch('/api/admin/projects', {
    method: 'GET',
    headers: { 'Cache-Control': 'no-cache' }
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Failed to fetch projects')
  }
  return await response.json()
}

export const addProject = async (project: Omit<Project, 'id'>): Promise<Project> => {
  const response = await fetch('/api/admin/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project)
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Failed to add project')
  }
  return await response.json()
}

export const updateProject = async (project: Project): Promise<Project> => {
  const response = await fetch('/api/admin/projects', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project)
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Failed to update project')
  }
  return await response.json()
}

export const deleteProject = async (id: string): Promise<boolean> => {
  const response = await fetch(`/api/admin/projects?id=${encodeURIComponent(id)}`, {
    method: 'DELETE'
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Failed to delete project')
  }
  return true
}
