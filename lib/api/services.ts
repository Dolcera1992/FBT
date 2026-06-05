import { supabase } from '@/lib/supabase'

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string; // Using icon name to map to Lucide icons
}

const mapServiceRow = (row: any): Service => ({
  id: row.id,
  title: row.title,
  description: row.description,
  icon: row.icon,
})

export const getServices = async (): Promise<Service[]> => {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching services:', error)
    return []
  }

  return (data || []).map(mapServiceRow)
}

export const addService = async (service: Omit<Service, 'id'>): Promise<Service> => {
  const { data, error } = await supabase
    .from('services')
    .insert({
      title: service.title,
      description: service.description,
      icon: service.icon,
    })
    .select()
    .single()

  if (error) {
    console.error('Error adding service:', error)
    throw error
  }

  return mapServiceRow(data)
}

export const updateService = async (id: string, updatedData: Partial<Service>): Promise<Service> => {
  const updatePayload: any = {}
  if (updatedData.title !== undefined) updatePayload.title = updatedData.title
  if (updatedData.description !== undefined) updatePayload.description = updatedData.description
  if (updatedData.icon !== undefined) updatePayload.icon = updatedData.icon

  const { data, error } = await supabase
    .from('services')
    .update(updatePayload)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating service:', error)
    throw error
  }

  return mapServiceRow(data)
}

export const deleteService = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting service:', error)
    return false
  }

  return true
}
