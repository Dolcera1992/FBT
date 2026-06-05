'use server'

import { createClient } from '@supabase/supabase-js'

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key_for_build',
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string; // Using icon name to map to Lucide icons
}

const mockServices: Service[] = [
  {
    id: "1",
    title: "تطوير ويب متكامل (Full-Stack)",
    description: "تطوير تطبيقات الويب من البداية إلى النهاية باستخدام أحدث التقنيات مثل Next.js و React و Node.js. بناء حلول قابلة للتوسع وآمنة وعالية الأداء.",
    icon: "Code"
  },
  {
    id: "2",
    title: "واجهات وتجربة المستخدم (UI/UX)",
    description: "تصميم واجهات مستخدم متميزة تركز على رفع معدلات التحويل بتأثيرات بصرية حديثة، وتأثيرات الزجاج البلوري (Glassmorphism)، ورسوم متحركة سلسة.",
    icon: "MonitorSmartphone"
  },
  {
    id: "3",
    title: "حلول التجارة الإلكترونية",
    description: "بناء متاجر إلكترونية قوية مع بوابات دفع آمنة، وإدارة المخزون، وتجارب تسوق مخصصة وسلسة لزيادة المبيعات.",
    icon: "ShoppingCart"
  },
  {
    id: "4",
    title: "لوحات التحكم المخصصة وأنظمة ERP",
    description: "تطوير لوحات تحكم إدارية معقدة، وأدوات داخلية، وتكامل مع أنظمة ERP لتحسين وتبسيط العمليات التجارية للمؤسسات.",
    icon: "LayoutDashboard"
  }
];

const mapServiceRow = (row: any): Service => ({
  id: row.id,
  title: row.title,
  description: row.description,
  icon: row.icon,
})

export const getServices = async (): Promise<Service[]> => {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching services, falling back to local mock data:', error.message)
    return mockServices
  }

  return (data || []).map(mapServiceRow)
}

export const addService = async (service: Omit<Service, 'id'>): Promise<Service> => {
  const supabase = getSupabaseAdmin()
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

  const supabase = getSupabaseAdmin()
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
  const supabase = getSupabaseAdmin()
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
