export interface Service {
  id: string
  title: string
  description: string
  icon: string
  createdAt?: string
}

export const getServices = async (): Promise<Service[]> => {
  const response = await fetch('/api/admin/services', {
    method: 'GET',
    headers: { 'Cache-Control': 'no-cache' }
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Failed to fetch services')
  }
  return await response.json()
}

export const addService = async (service: Omit<Service, 'id'>): Promise<Service> => {
  const response = await fetch('/api/admin/services', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(service)
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Failed to add service')
  }
  return await response.json()
}

export const updateService = async (service: Service): Promise<Service> => {
  const response = await fetch('/api/admin/services', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(service)
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Failed to update service')
  }
  return await response.json()
}

export const deleteService = async (id: string): Promise<boolean> => {
  const response = await fetch(`/api/admin/services?id=${encodeURIComponent(id)}`, {
    method: 'DELETE'
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Failed to delete service')
  }
  return true
}
