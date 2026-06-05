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

const mockProjects: Project[] = [
  {
    id: "1",
    title: "بوابة قمة الأصيل",
    client: "قمة الأصيل العقارية",
    description: "بوابة عقارية شاملة وتجربة عرض متميزة تتميز بجمالية تصميم مستوحاة من أسلوب آبل، وشبكة بينتو مخصصة ونماذج تفاعلية للأجهزة ثلاثية الأبعاد لهوية تجارية راقية.",
    industry: "العقارات",
    format: "تطبيق ويب",
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2000",
    badge: "أحدث مشروع",
    tags: ["Next.js", "Tailwind CSS", "Framer Motion", "Real Estate"]
  },
  {
    id: "2",
    title: "متجر دولسيرا الإلكتروني",
    client: "دولسيرا",
    description: "منصة تجارة إلكترونية حديثة وعالية الأداء مصممة لتجربة مستخدم مثالية ومعدلات تحويل عالية. تشمل الميزات الدفع السلس، وإدارة المخزون الديناميكية، والتحديثات الفورية.",
    industry: "التجزئة / التجارة الإلكترونية",
    format: "تطبيق ويب",
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000",
    tags: ["React", "Supabase", "E-Commerce", "Stripe"]
  },
  {
    id: "3",
    title: "متجر الهدايا المثالية (Flawless)",
    client: "فلوليس",
    description: "منصة هدايا فاخرة تتيح للمستخدمين تخصيص وإرسال صناديق هدايا راقية. تتميز المنصة ببناء هدايا تفاعلي وواجهة مستخدم أنيقة.",
    industry: "تجزئة المنتجات الفاخرة",
    format: "تطبيق ويب",
    imageUrl: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=2000",
    tags: ["Next.js", "UI/UX", "Animation"]
  }
];

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
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching projects, falling back to local mock data:', error.message)
    return mockProjects
  }

  return (data || []).map(mapProjectRow)
}

export const addProject = async (project: Omit<Project, 'id'>): Promise<Project> => {
  const supabase = getSupabaseAdmin()
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

  const supabase = getSupabaseAdmin()
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
  const supabase = getSupabaseAdmin()
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
