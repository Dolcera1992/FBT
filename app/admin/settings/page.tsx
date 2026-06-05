'use client'

export const runtime = 'edge'

import React, { useState, useEffect } from 'react'
import type { HomepageSettings } from '@/lib/api/settings'
import { getHomepageSettings, updateHomepageSettings } from '@/lib/api/settings'
import { Save } from 'lucide-react'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<HomepageSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Form states
  const [heroVideoUrl, setHeroVideoUrl] = useState('')
  const [heroHeadline1, setHeroHeadline1] = useState('')
  const [heroHeadline2, setHeroHeadline2] = useState('')
  const [heroHeadline3, setHeroHeadline3] = useState('')
  
  const [servicesSub, setServicesSub] = useState('')
  const [servicesTitle, setServicesTitle] = useState('')
  const [servicesDesc, setServicesDesc] = useState('')
  
  const [portfolioSub, setPortfolioSub] = useState('')
  const [portfolioTitle, setPortfolioTitle] = useState('')
  const [portfolioDesc, setPortfolioDesc] = useState('')
  
  const [contactSub, setContactSub] = useState('')
  const [contactTitle, setContactTitle] = useState('')
  const [contactDesc, setContactDesc] = useState('')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const data = await getHomepageSettings()
      setSettings(data)
      
      // Set fields
      setHeroVideoUrl(data.heroVideoUrl)
      setHeroHeadline1(data.heroHeadline1)
      setHeroHeadline2(data.heroHeadline2)
      setHeroHeadline3(data.heroHeadline3)
      
      setServicesSub(data.servicesSub)
      setServicesTitle(data.servicesTitle)
      setServicesDesc(data.servicesDesc)
      
      setPortfolioSub(data.portfolioSub)
      setPortfolioTitle(data.portfolioTitle)
      setPortfolioDesc(data.portfolioDesc)
      
      setContactSub(data.contactSub)
      setContactTitle(data.contactTitle)
      setContactDesc(data.contactDesc)
    } catch (err) {
      console.error('Error fetching settings:', err)
      alert('حدث خطأ أثناء تحميل الإعدادات')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const updated = {
      heroVideoUrl,
      heroHeadline1,
      heroHeadline2,
      heroHeadline3,
      servicesSub,
      servicesTitle,
      servicesDesc,
      portfolioSub,
      portfolioTitle,
      portfolioDesc,
      contactSub,
      contactTitle,
      contactDesc
    }

    try {
      await updateHomepageSettings(updated)
      alert('تم حفظ إعدادات الصفحة الرئيسية بنجاح!')
    } catch (error: any) {
      alert(`حدث خطأ أثناء الحفظ: ${error.message || 'يرجى المحاولة لاحقاً'}`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">جاري تحميل إعدادات الموقع...</div>
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">إعدادات محتوى الموقع</h2>
        <p className="text-muted-foreground text-sm">عدل النصوص الأساسية وروابط الفيديو المعروضة بالصفحة الرئيسية.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Hero Section */}
        <div className="p-6 rounded-2xl bg-[#0d0d0e] border border-border/40 space-y-4">
          <h3 className="text-lg font-bold text-white border-b border-border/20 pb-2">قسم الواجهة (Hero Section)</h3>
          
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">رابط فيديو الخلفية (webm/mp4)</label>
            <input
              type="text"
              value={heroVideoUrl}
              onChange={(e) => setHeroVideoUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">العنوان السطر الأول</label>
              <input
                type="text"
                value={heroHeadline1}
                onChange={(e) => setHeroHeadline1(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">العنوان السطر الثاني (ملون)</label>
              <input
                type="text"
                value={heroHeadline2}
                onChange={(e) => setHeroHeadline2(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">العنوان السطر الثالث</label>
              <input
                type="text"
                value={heroHeadline3}
                onChange={(e) => setHeroHeadline3(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Services Section */}
        <div className="p-6 rounded-2xl bg-[#0d0d0e] border border-border/40 space-y-4">
          <h3 className="text-lg font-bold text-white border-b border-border/20 pb-2">قسم الخدمات (Services)</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">العنوان الفرعي للخدمات</label>
              <input
                type="text"
                value={servicesSub}
                onChange={(e) => setServicesSub(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">عنوان قسم الخدمات الرئيسي</label>
              <input
                type="text"
                value={servicesTitle}
                onChange={(e) => setServicesTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">وصف قسم الخدمات</label>
            <textarea
              rows={3}
              value={servicesDesc}
              onChange={(e) => setServicesDesc(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue/50 resize-none"
            />
          </div>
        </div>

        {/* Section 3: Portfolio Section */}
        <div className="p-6 rounded-2xl bg-[#0d0d0e] border border-border/40 space-y-4">
          <h3 className="text-lg font-bold text-white border-b border-border/20 pb-2">قسم معرض الأعمال (Portfolio)</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">العنوان الفرعي لمعرض الأعمال</label>
              <input
                type="text"
                value={portfolioSub}
                onChange={(e) => setPortfolioSub(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">عنوان قسم الأعمال الرئيسي</label>
              <input
                type="text"
                value={portfolioTitle}
                onChange={(e) => setPortfolioTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">وصف قسم الأعمال</label>
            <textarea
              rows={3}
              value={portfolioDesc}
              onChange={(e) => setPortfolioDesc(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue/50 resize-none"
            />
          </div>
        </div>

        {/* Section 4: Contact Section */}
        <div className="p-6 rounded-2xl bg-[#0d0d0e] border border-border/40 space-y-4">
          <h3 className="text-lg font-bold text-white border-b border-border/20 pb-2">قسم اتصل بي (Contact)</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">العنوان الفرعي لقسم الاتصال</label>
              <input
                type="text"
                value={contactSub}
                onChange={(e) => setContactSub(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">عنوان قسم الاتصال الرئيسي</label>
              <input
                type="text"
                value={contactTitle}
                onChange={(e) => setContactTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">وصف قسم الاتصال</label>
            <textarea
              rows={3}
              value={contactDesc}
              onChange={(e) => setContactDesc(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue/50 resize-none"
            />
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-blue hover:bg-accent-blue/90 text-white font-bold transition-all disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-5 h-5" />
            <span>{saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
