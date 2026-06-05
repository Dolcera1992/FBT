'use client'

import React, { useState, useEffect } from 'react'
import type { HomepageSettings } from '@/lib/api/settings'
import { getHomepageSettings, updateHomepageSettings } from '@/lib/api/settings'
import { Save, Palette, Type } from 'lucide-react'

const FONTS = [
  { id: 'cairo', name: 'Cairo (كايرو)' },
  { id: 'tajawal', name: 'Tajawal (تجوال)' },
  { id: 'almarai', name: 'Almarai (المراعي)' },
  { id: 'readex-pro', name: 'Readex Pro (ريدكس برو)' },
  { id: 'ibm-plex', name: 'IBM Plex Sans Arabic' },
  { id: 'rubik', name: 'Rubik (روبيك)' },
]

export default function DesignClient() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Design States
  const [cardBgColor, setCardBgColor] = useState('#1a0f24')
  const [cardTextColor, setCardTextColor] = useState('#f0e6ff')
  const [cardAccentColor, setCardAccentColor] = useState('#c084fc')
  const [fontFamily, setFontFamily] = useState('cairo')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const data = await getHomepageSettings()
      
      // Set design fields
      if (data.cardBgColor) setCardBgColor(data.cardBgColor)
      if (data.cardTextColor) setCardTextColor(data.cardTextColor)
      if (data.cardAccentColor) setCardAccentColor(data.cardAccentColor)
      if (data.fontFamily) setFontFamily(data.fontFamily)
        
    } catch (err) {
      console.error('Error fetching settings:', err)
      alert('حدث خطأ أثناء تحميل إعدادات التصميم')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const updated = {
      cardBgColor,
      cardTextColor,
      cardAccentColor,
      fontFamily,
    }

    try {
      await updateHomepageSettings(updated as any)
      alert('تم حفظ إعدادات التصميم بنجاح! سيتم تطبيق الألوان فوراً.')
      // Refresh to apply dynamic CSS
      window.location.reload()
    } catch (error: any) {
      alert(`حدث خطأ أثناء الحفظ: ${error.message || 'يرجى المحاولة لاحقاً'}`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">جاري تحميل إعدادات التصميم...</div>
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">التصميم والواجهة</h2>
        <p className="text-muted-foreground text-sm">تحكم في ألوان الكروت، الخطوط، والمظهر العام للموقع.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Card Colors Section */}
        <div className="p-6 rounded-2xl bg-[#0d0d0e] border border-border/40 space-y-6">
          <div className="flex items-center gap-2 border-b border-border/20 pb-3">
            <Palette className="w-5 h-5 text-accent-blue" />
            <h3 className="text-lg font-bold text-white">ألوان الكروت (المشاريع والخدمات)</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-foreground">لون خلفية الكرت</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={cardBgColor}
                  onChange={(e) => setCardBgColor(e.target.value)}
                  className="w-12 h-12 rounded cursor-pointer bg-transparent border-0 p-0"
                />
                <input 
                  type="text" 
                  value={cardBgColor}
                  onChange={(e) => setCardBgColor(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue/50 uppercase"
                  dir="ltr"
                />
              </div>
              <p className="text-xs text-muted-foreground">يحدد لون الخلفية الداكنة للكرت.</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-foreground">لون النصوص والعناوين</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={cardTextColor}
                  onChange={(e) => setCardTextColor(e.target.value)}
                  className="w-12 h-12 rounded cursor-pointer bg-transparent border-0 p-0"
                />
                <input 
                  type="text" 
                  value={cardTextColor}
                  onChange={(e) => setCardTextColor(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue/50 uppercase"
                  dir="ltr"
                />
              </div>
              <p className="text-xs text-muted-foreground">يحدد لون النصوص الوصفية وعناوين الكرت.</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-foreground">اللون المميز (Accent Glow)</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={cardAccentColor}
                  onChange={(e) => setCardAccentColor(e.target.value)}
                  className="w-12 h-12 rounded cursor-pointer bg-transparent border-0 p-0"
                />
                <input 
                  type="text" 
                  value={cardAccentColor}
                  onChange={(e) => setCardAccentColor(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue/50 uppercase"
                  dir="ltr"
                />
              </div>
              <p className="text-xs text-muted-foreground">لون الأيقونات والتوهج حول الكرت.</p>
            </div>
          </div>
          
          {/* Live Preview Miniature */}
          <div className="mt-8 p-6 border border-border/20 rounded-xl bg-black flex flex-col items-center justify-center">
             <p className="text-xs text-muted-foreground mb-4 font-semibold uppercase tracking-widest">معاينة مباشرة (Live Preview)</p>
             <div 
               style={{ 
                 backgroundColor: cardBgColor,
                 borderColor: cardAccentColor,
                 boxShadow: `0 0 20px ${cardAccentColor}20`
               }}
               className="w-full max-w-sm rounded-2xl p-6 border transition-all duration-300"
             >
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-all duration-300"
                  style={{ backgroundColor: `${cardAccentColor}15`, color: cardAccentColor }}
                >
                  <Palette className="w-6 h-6" />
                </div>
                <h4 style={{ color: cardTextColor }} className="text-xl font-bold mb-2 transition-all duration-300">عنوان تجريبي</h4>
                <p style={{ color: `${cardTextColor}cc` }} className="text-sm leading-relaxed transition-all duration-300">
                  هذا نص تجريبي لمعاينة كيف ستبدو ألوان النصوص المتناسقة مع خلفية الكرت والألوان المميزة.
                </p>
             </div>
          </div>
        </div>

        {/* Typography Section */}
        <div className="p-6 rounded-2xl bg-[#0d0d0e] border border-border/40 space-y-6">
          <div className="flex items-center gap-2 border-b border-border/20 pb-3">
            <Type className="w-5 h-5 text-accent-purple" />
            <h3 className="text-lg font-bold text-white">الخطوط (Typography)</h3>
          </div>
          
          <div className="max-w-md space-y-3">
            <label className="block text-sm font-semibold text-foreground">نوع الخط (Font Family)</label>
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
            >
              {FONTS.map(font => (
                <option key={font.id} value={font.id}>
                  {font.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground">هذا الخط سيتم تطبيقه على جميع النصوص والعناوين في الموقع.</p>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-blue hover:bg-accent-blue/90 text-white font-bold transition-all disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-5 h-5" />
            <span>{saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
