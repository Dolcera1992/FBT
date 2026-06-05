'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

// Use Service Role Key for Admin API access
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export interface UserData {
  id: string
  email: string
  created_at: string
  last_sign_in_at?: string
  user_metadata?: {
    display_name?: string
    role?: string
  }
}

export async function getUsers(): Promise<{ users: UserData[], error: any }> {
  try {
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers()
    
    if (error) throw error

    return { 
      users: users.map(u => ({
        id: u.id,
        email: u.email || '',
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at,
        user_metadata: u.user_metadata
      })), 
      error: null 
    }
  } catch (error: any) {
    console.error('Error fetching users:', error)
    return { users: [], error: error.message }
  }
}

export async function createUser(data: { email: string, password?: string, display_name?: string, role?: string }) {
  try {
    const { data: resData, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password || 'Temporary123!',
      email_confirm: true,
      user_metadata: {
        display_name: data.display_name || '',
        role: data.role || 'admin'
      }
    })

    if (error) throw error

    revalidatePath('/admin/users')
    return { success: true, user: resData.user }
  } catch (error: any) {
    console.error('Error creating user:', error)
    return { success: false, error: error.message }
  }
}

export async function updateUser(userId: string, data: { email?: string, password?: string, display_name?: string, role?: string }) {
  try {
    const updateData: any = {}
    if (data.email) updateData.email = data.email
    if (data.password) updateData.password = data.password
    
    if (data.display_name !== undefined || data.role !== undefined) {
      updateData.user_metadata = {}
      if (data.display_name !== undefined) updateData.user_metadata.display_name = data.display_name
      if (data.role !== undefined) updateData.user_metadata.role = data.role
    }

    const { data: resData, error } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      updateData
    )

    if (error) throw error

    revalidatePath('/admin/users')
    return { success: true, user: resData.user }
  } catch (error: any) {
    console.error('Error updating user:', error)
    return { success: false, error: error.message }
  }
}

export async function deleteUser(userId: string) {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.deleteUser(userId)
    
    if (error) throw error

    revalidatePath('/admin/users')
    return { success: true }
  } catch (error: any) {
    console.error('Error deleting user:', error)
    return { success: false, error: error.message }
  }
}
