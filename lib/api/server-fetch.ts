import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { Project } from './projects'
import { Service } from './services'
import { HomepageSettings } from './settings'

export async function getServerProjects(): Promise<Project[]> {
  const supabase = getSupabaseAdmin()
  const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: true })
  
  return (data || []).map((row: any) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    tags: row.tags || [],
    imageUrl: row.image_url,
    liveUrl: row.live_url,
    githubUrl: row.github_url,
    colorPreset: row.color_preset,
  }))
}

export async function getServerServices(): Promise<Service[]> {
  const supabase = getSupabaseAdmin()
  const { data } = await supabase.from('services').select('*').order('created_at', { ascending: true })
  
  return (data || []).map((row: any) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    icon: row.icon,
    colorPreset: row.color_preset,
  }))
}

export async function getServerSettings(): Promise<HomepageSettings> {
  const DEFAULT_SETTINGS = {
    heroVideoUrl: "https://mojli.s3.us-east-2.amazonaws.com/Mojli+Website+upscaled+(12mb).webm",
    heroHeadline1: "تطوير ويب",
    heroHeadline2: "متكامل",
    heroHeadline3: "بلا حدود",
    servicesSub: "الخبرات التقنية",
    servicesTitle: "خدماتي المهنية",
    servicesDesc: "تقديم حلول رقمية عالية الأداء وقابلة للتطوير وذات تصاميم جذابة.",
    portfolioSub: "المشاريع المميزة",
    portfolioTitle: "أعمالي السابقة",
    portfolioDesc: "استعراض لأحدث التجارب الرقمية وتطبيقات الويب التي قمت ببنائها باستخدام التقنيات الحديثة.",
    contactSub: "دعنا نعمل معاً",
    contactTitle: "جاهز لبدء مشروعك القادم؟",
    contactDesc: "تواصل معي لمناقشة أفكارك وتحويلها إلى واقع ملموس.",
    contactWhatsapp: "966500000000",
    contactPhone: "966500000000",
    contactEmail: "info@example.com"
  }
  
  try {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase.from('homepage_settings').select('*').eq('id', 1).single()
    
    if (error || !data) return DEFAULT_SETTINGS
    
    return {
      heroVideoUrl: data.hero_video_url,
      heroBgImage: data.hero_bg_image,
      heroHeadline1: data.hero_headline_1,
      heroHeadline2: data.hero_headline_2,
      heroHeadline3: data.hero_headline_3,
      servicesSub: data.services_sub,
      servicesTitle: data.services_title,
      servicesDesc: data.services_desc,
      portfolioSub: data.portfolio_sub,
      portfolioTitle: data.portfolio_title,
      portfolioDesc: data.portfolio_desc,
      contactSub: data.contact_sub,
      contactTitle: data.contact_title,
      contactDesc: data.contact_desc,
      contactWhatsapp: data.contact_whatsapp || DEFAULT_SETTINGS.contactWhatsapp,
      contactPhone: data.contact_phone || DEFAULT_SETTINGS.contactPhone,
      contactEmail: data.contact_email || DEFAULT_SETTINGS.contactEmail,
      globalColorPreset: data.global_color_preset || 'purple-neon',
    }
  } catch (err) {
    return { ...DEFAULT_SETTINGS, globalColorPreset: 'purple-neon' }
  }
}
