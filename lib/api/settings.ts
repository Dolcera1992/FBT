import { createClient } from '@/lib/supabase/client'

export interface HomepageSettings {
  heroVideoUrl: string;
  heroHeadline1: string;
  heroHeadline2: string;
  heroHeadline3: string;
  servicesSub: string;
  servicesTitle: string;
  servicesDesc: string;
  portfolioSub: string;
  portfolioTitle: string;
  portfolioDesc: string;
  contactSub: string;
  contactTitle: string;
  contactDesc: string;
}

const mapSettingsRow = (row: any): HomepageSettings => ({
  heroVideoUrl: row.hero_video_url,
  heroHeadline1: row.hero_headline_1,
  heroHeadline2: row.hero_headline_2,
  heroHeadline3: row.hero_headline_3,
  servicesSub: row.services_sub,
  servicesTitle: row.services_title,
  servicesDesc: row.services_desc,
  portfolioSub: row.portfolio_sub,
  portfolioTitle: row.portfolio_title,
  portfolioDesc: row.portfolio_desc,
  contactSub: row.contact_sub,
  contactTitle: row.contact_title,
  contactDesc: row.contact_desc,
})

export const getHomepageSettings = async (): Promise<HomepageSettings> => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('homepage_settings')
    .select('*')
    .eq('id', 1)
    .single()

  if (error) {
    console.warn('Warning: Could not fetch settings from Supabase, using local defaults.', error.message)
    return {
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
      contactTitle: "هل أنت جاهز لبناء مشروعك القادم؟",
      contactDesc: "أخبرني بمشروعك وسأتواصل معك بوضع خطة عمل لتحويل فكرتك إلى واقع رقمي ملموس.",
    };
  }

  return mapSettingsRow(data)
}

export const updateHomepageSettings = async (settings: Partial<HomepageSettings>): Promise<HomepageSettings> => {
  const updatePayload: any = {}
  
  if (settings.heroVideoUrl !== undefined) updatePayload.hero_video_url = settings.heroVideoUrl
  if (settings.heroHeadline1 !== undefined) updatePayload.hero_headline_1 = settings.heroHeadline1
  if (settings.heroHeadline2 !== undefined) updatePayload.hero_headline_2 = settings.heroHeadline2
  if (settings.heroHeadline3 !== undefined) updatePayload.hero_headline_3 = settings.heroHeadline3
  
  if (settings.servicesSub !== undefined) updatePayload.services_sub = settings.servicesSub
  if (settings.servicesTitle !== undefined) updatePayload.services_title = settings.servicesTitle
  if (settings.servicesDesc !== undefined) updatePayload.services_desc = settings.servicesDesc
  
  if (settings.portfolioSub !== undefined) updatePayload.portfolio_sub = settings.portfolioSub
  if (settings.portfolioTitle !== undefined) updatePayload.portfolio_title = settings.portfolioTitle
  if (settings.portfolioDesc !== undefined) updatePayload.portfolio_desc = settings.portfolioDesc
  
  if (settings.contactSub !== undefined) updatePayload.contact_sub = settings.contactSub
  if (settings.contactTitle !== undefined) updatePayload.contact_title = settings.contactTitle
  if (settings.contactDesc !== undefined) updatePayload.contact_desc = settings.contactDesc

  const supabase = createClient()
  const { data, error } = await supabase
    .from('homepage_settings')
    .upsert({ id: 1, ...updatePayload })
    .select()
    .single()

  if (error) {
    console.error('Error updating settings in Supabase:', error)
    throw error
  }

  return mapSettingsRow(data)
}
