import { supabase } from '@/lib/supabase'

export interface Project {
  id: string;
  title: string;
  description: string;
  client: string;
  industry: string;
  format: string;
  imageUrl?: string;
  badge?: string;
  tags: string[];
}

const mapProjectRow = (row: any): Project => ({
  id: row.id,
  title: row.title,
  description: row.description,
  client: row.client,
  industry: row.industry,
  format: row.format,
  imageUrl: row.image_url || undefined,
  badge: row.badge || undefined,
  tags: row.tags || [],
})

export const getProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching projects:', error)
    return []
  }

  return (data || []).map(mapProjectRow)
}

export const addProject = async (project: Omit<Project, 'id'>): Promise<Project> => {
  const { data, error } = await supabase
    .from('projects')
    .insert({
      title: project.title,
      client: project.client,
      description: project.description,
      industry: project.industry,
      format: project.format,
      image_url: project.imageUrl || null,
      badge: project.badge || null,
      tags: project.tags,
    })
    .select()
    .single()

  if (error) {
    console.error('Error adding project:', error)
    throw error
  }

  return mapProjectRow(data)
}

export const updateProject = async (id: string, updatedData: Partial<Project>): Promise<Project> => {
  const updatePayload: any = {}
  if (updatedData.title !== undefined) updatePayload.title = updatedData.title
  if (updatedData.client !== undefined) updatePayload.client = updatedData.client
  if (updatedData.description !== undefined) updatePayload.description = updatedData.description
  if (updatedData.industry !== undefined) updatePayload.industry = updatedData.industry
  if (updatedData.format !== undefined) updatePayload.format = updatedData.format
  if (updatedData.imageUrl !== undefined) updatePayload.image_url = updatedData.imageUrl || null
  if (updatedData.badge !== undefined) updatePayload.badge = updatedData.badge || null
  if (updatedData.tags !== undefined) updatePayload.tags = updatedData.tags

  const { data, error } = await supabase
    .from('projects')
    .update(updatePayload)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating project:', error)
    throw error
  }

  return mapProjectRow(data)
}

export const deleteProject = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting project:', error)
    return false
  }

  return true
}
