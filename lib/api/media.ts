export interface MediaItem {
  id: string
  name: string
  url: string
  fileType: string
  size: number
  storagePath: string
  createdAt: string
}

export const getMedia = async (): Promise<MediaItem[]> => {
  const response = await fetch('/api/admin/media', {
    method: 'GET',
    headers: { 'Cache-Control': 'no-cache' }
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Failed to fetch media')
  }
  return await response.json()
}

export const uploadMedia = async (formData: FormData): Promise<MediaItem> => {
  const response = await fetch('/api/admin/media', {
    method: 'POST',
    body: formData
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Failed to upload media')
  }
  return await response.json()
}

export const deleteMedia = async (id: string, storagePath: string): Promise<boolean> => {
  const response = await fetch(`/api/admin/media?id=${encodeURIComponent(id)}&storagePath=${encodeURIComponent(storagePath)}`, {
    method: 'DELETE'
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Failed to delete media')
  }
  return true
}
