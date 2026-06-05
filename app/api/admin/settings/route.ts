import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

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
}

const mapSettingsRow = (row: any) => ({
  heroVideoUrl: row.hero_video_url,
  heroBgImage: row.hero_bg_image,
  cardBgColor: row.card_bg_color,
  cardTextColor: row.card_text_color,
  cardAccentColor: row.card_accent_color,
  fontFamily: row.font_family,
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
  contactWhatsapp: row.contact_whatsapp,
  contactPhone: row.contact_phone,
  contactEmail: row.contact_email,
  globalColorPreset: row.global_color_preset,
})

export async function GET() {
  try {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('homepage_settings')
      .select('*')
      .eq('id', 1)
      .single()

    if (error) {
      console.warn('Warning: Could not fetch settings from Supabase, using local defaults.', error.message)
      return NextResponse.json(DEFAULT_SETTINGS)
    }

    return NextResponse.json(mapSettingsRow(data))
  } catch (err: any) {
    return NextResponse.json(DEFAULT_SETTINGS)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = getSupabaseAdmin()
    
    const dbPayload: any = {
      updated_at: new Date().toISOString()
    }

    if (body.heroVideoUrl !== undefined) dbPayload.hero_video_url = body.heroVideoUrl
    if (body.heroHeadline1 !== undefined) dbPayload.hero_headline_1 = body.heroHeadline1
    if (body.heroHeadline2 !== undefined) dbPayload.hero_headline_2 = body.heroHeadline2
    if (body.heroHeadline3 !== undefined) dbPayload.hero_headline_3 = body.heroHeadline3
    if (body.servicesSub !== undefined) dbPayload.services_sub = body.servicesSub
    if (body.servicesTitle !== undefined) dbPayload.services_title = body.servicesTitle
    if (body.servicesDesc !== undefined) dbPayload.services_desc = body.servicesDesc
    if (body.portfolioSub !== undefined) dbPayload.portfolio_sub = body.portfolioSub
    if (body.portfolioTitle !== undefined) dbPayload.portfolio_title = body.portfolioTitle
    if (body.portfolioDesc !== undefined) dbPayload.portfolio_desc = body.portfolioDesc
    if (body.contactSub !== undefined) dbPayload.contact_sub = body.contactSub
    if (body.contactTitle !== undefined) dbPayload.contact_title = body.contactTitle
    if (body.contactDesc !== undefined) dbPayload.contact_desc = body.contactDesc
    if (body.contactWhatsapp !== undefined) dbPayload.contact_whatsapp = body.contactWhatsapp
    if (body.contactPhone !== undefined) dbPayload.contact_phone = body.contactPhone
    if (body.contactEmail !== undefined) dbPayload.contact_email = body.contactEmail
    if (body.globalColorPreset !== undefined) dbPayload.global_color_preset = body.globalColorPreset
    if (body.heroBgImage !== undefined) dbPayload.hero_bg_image = body.heroBgImage
    if (body.cardBgColor !== undefined) dbPayload.card_bg_color = body.cardBgColor
    if (body.cardTextColor !== undefined) dbPayload.card_text_color = body.cardTextColor
    if (body.cardAccentColor !== undefined) dbPayload.card_accent_color = body.cardAccentColor
    if (body.fontFamily !== undefined) dbPayload.font_family = body.fontFamily

    const { data, error } = await supabase
      .from('homepage_settings')
      .update(dbPayload)
      .eq('id', 1)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    revalidatePath('/')
    return NextResponse.json(mapSettingsRow(data))
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Fatal error updating settings' }, { status: 500 })
  }
}
