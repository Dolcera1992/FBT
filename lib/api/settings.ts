export interface HomepageSettings {
  heroVideoUrl: string
  heroBgImage?: string
  heroHeadline1: string
  heroHeadline2: string
  heroHeadline3: string
  servicesSub: string
  servicesTitle: string
  servicesDesc: string
  portfolioSub: string
  portfolioTitle: string
  portfolioDesc: string
  contactSub: string
  contactTitle: string
  contactDesc: string
  contactWhatsapp?: string
  contactPhone?: string
  contactEmail?: string
  globalColorPreset?: string
}

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
  contactEmail: "info@example.com",
  globalColorPreset: "purple-neon"
}

export const getHomepageSettings = async (): Promise<HomepageSettings> => {
  const response = await fetch('/api/admin/settings', {
    method: 'GET',
    headers: { 'Cache-Control': 'no-cache' }
  })
  if (!response.ok) {
    console.error('Failed to fetch settings, falling back to default')
    return DEFAULT_SETTINGS
  }
  return await response.json()
}

export const updateHomepageSettings = async (settings: Partial<HomepageSettings>): Promise<HomepageSettings> => {
  const response = await fetch('/api/admin/settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings)
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Failed to update settings')
  }
  return await response.json()
}
