export interface UserData {
  id: string
  email: string
  created_at: string
  last_sign_in_at?: string
  user_metadata?: any
}

export const getUsers = async (): Promise<{ users: UserData[], error: any }> => {
  try {
    const response = await fetch('/api/admin/users', {
      method: 'GET',
      headers: { 'Cache-Control': 'no-cache' }
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return { users: [], error: errorData.error || 'Failed to fetch users' }
    }
    return await response.json()
  } catch (error: any) {
    return { users: [], error: error.message }
  }
}

export const createUser = async (data: { email: string, password?: string, display_name?: string, role?: string }): Promise<{ success: boolean, user?: UserData, error?: string }> => {
  try {
    const response = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return { success: false, error: errorData.error || 'Failed to create user' }
    }
    const res = await response.json()
    return { success: true, user: res.user }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export const updateUser = async (userId: string, data: { email?: string, password?: string, display_name?: string, role?: string }): Promise<{ success: boolean, user?: UserData, error?: string }> => {
  try {
    const response = await fetch('/api/admin/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: userId, ...data })
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return { success: false, error: errorData.error || 'Failed to update user' }
    }
    const res = await response.json()
    return { success: true, user: res.user }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export const deleteUser = async (userId: string): Promise<{ success: boolean, error?: string }> => {
  try {
    const response = await fetch(`/api/admin/users?id=${encodeURIComponent(userId)}`, {
      method: 'DELETE'
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return { success: false, error: errorData.error || 'Failed to delete user' }
    }
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
