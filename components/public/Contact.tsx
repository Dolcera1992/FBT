'use client'

import { useState } from 'react'
import { motion, Variants } from 'framer-motion'
import { HomepageSettings } from '@/lib/api/settings'
import { Send, CheckCircle } from 'lucide-react'

interface ContactProps {
  settings: HomepageSettings;
}

export function Contact({ settings }: ContactProps) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      alert('الرجاء تعبئة جميع الحقول')
      return
    }
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSuccess(true)
      setFormData({ name: '', email: '', message: '' })
      setIsSubmitting(false)
      setTimeout(() => setIsSuccess(false), 4000)
    }, 1200)
  }

  // Animation variants
  const elementVariants: Variants = {
    hidden: { opacity: 0, y: 25 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: 'spring',
        stiffness: 80,
        damping: 15
      }
    }
  }

  return (
    <section id="contact" className="relative py-32 bg-[#070708] overflow-hidden">
      
      {/* Background radial highlight */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute bottom-0 start-1/3 w-[600px] h-[300px] bg-accent-blue/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="inline-flex items-center gap-3 mb-6 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md"
          >
            <div className="w-2.5 h-2.5 bg-accent-emerald rounded-full animate-pulse" />
            <span className="text-xs font-semibold text-gray-300 tracking-wider">
              {settings.contactSub}
            </span>
            <div className="w-2.5 h-2.5 bg-accent-blue rounded-full animate-pulse" />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6 text-white tracking-tight"
          >
            {settings.contactTitle}
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            {settings.contactDesc}
          </motion.p>
        </div>

        {/* Contact Form with animations */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, type: 'spring', damping: 18 }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-card/10 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl relative">
            
            {/* Success Overlay */}
            {isSuccess && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-[#070708]/95 z-40 flex flex-col items-center justify-center p-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0.6, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', damping: 12 }}
                >
                  <CheckCircle className="w-16 h-16 text-accent-emerald mb-4" />
                </motion.div>
                <h3 className="text-2xl font-black text-white mb-2">تم الإرسال بنجاح!</h3>
                <p className="text-gray-400 text-sm max-w-sm">
                  شكرًا لتواصلك. لقد تم استلام رسالتك وسأقوم بالرد عليك عبر البريد الإلكتروني في أقرب وقت ممكن.
                </p>
              </motion.div>
            )}

            {/* Form Header */}
            <div className="bg-white/[0.02] border-b border-white/5 px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    أرسل رسالة مباشرة
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    املأ النموذج التالي وسأرد عليك خلال 24 ساعة كحد أقصى.
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-2 bg-accent-emerald/10 border border-accent-emerald/20 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-accent-emerald rounded-full animate-pulse" />
                  <span className="text-[10px] text-accent-emerald font-bold">متاح للعمل الحر حالياً</span>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Name Input */}
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-xs sm:text-sm font-semibold text-gray-300">الاسم الكريم</label>
                  <div className="relative rounded-xl p-[1px] bg-white/5 focus-within:bg-gradient-to-r focus-within:from-accent-blue focus-within:to-accent-emerald transition-all duration-300 focus-within:shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                    <input
                      id="name"
                      type="text"
                      maxLength={100}
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3.5 rounded-[11px] bg-[#0c0c0d] text-white placeholder:text-gray-600 focus:outline-none text-sm text-right"
                      placeholder="أدخل اسمك بالكامل"
                      required
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-gray-300">البريد الإلكتروني</label>
                  <div className="relative rounded-xl p-[1px] bg-white/5 focus-within:bg-gradient-to-r focus-within:from-accent-blue focus-within:to-accent-emerald transition-all duration-300 focus-within:shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                    <input
                      id="email"
                      type="email"
                      maxLength={255}
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3.5 rounded-[11px] bg-[#0c0c0d] text-white placeholder:text-gray-600 focus:outline-none text-sm text-right"
                      placeholder="name@example.com"
                      required
                    />
                  </div>
                </div>

              </div>

              {/* Message Input */}
              <div className="space-y-2">
                <label htmlFor="message" className="block text-xs sm:text-sm font-semibold text-gray-300">تفاصيل الرسالة</label>
                <div className="relative rounded-xl p-[1px] bg-white/5 focus-within:bg-gradient-to-r focus-within:from-accent-blue focus-within:to-accent-emerald transition-all duration-300 focus-within:shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                  <textarea
                    id="message"
                    rows={5}
                    maxLength={1000}
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-4 py-3.5 rounded-[11px] bg-[#0c0c0d] text-white placeholder:text-gray-600 focus:outline-none text-sm resize-none text-right"
                    placeholder="اكتب تفاصيل مشروعك أو سؤالك هنا..."
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-4 rounded-xl bg-white text-black font-bold text-sm sm:text-base hover:bg-white/95 transition-all duration-200 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>جاري إرسال رسالتك...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>إرسال الرسالة</span>
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* Bottom Process Blocks with animations */}
        <div className="text-center mt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-4xl mx-auto">
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-card/10 border border-white/5 rounded-2xl p-6 hover:border-accent-blue/20 transition-colors duration-300"
            >
              <div className="w-10 h-10 bg-accent-blue/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-accent-blue/15">
                <div className="w-2.5 h-2.5 bg-accent-blue rounded-full" />
              </div>
              <h4 className="font-bold text-white mb-2 text-sm sm:text-base">1. مناقشة المشروع</h4>
              <p className="text-gray-400 text-xs leading-relaxed">
                نناقش متطلباتك ورؤيتك للمشروع لتحديد الأهداف والاحتيازات بدقة متناهية.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="bg-card/10 border border-white/5 rounded-2xl p-6 hover:border-accent-emerald/20 transition-colors duration-300"
            >
              <div className="w-10 h-10 bg-accent-emerald/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-accent-emerald/15">
                <div className="w-2.5 h-2.5 bg-accent-emerald rounded-full" />
              </div>
              <h4 className="font-bold text-white mb-2 text-sm sm:text-base">2. خطة عمل مخصصة</h4>
              <p className="text-gray-400 text-xs leading-relaxed">
                تحليل دقيق لوضع منهجية عمل مخصصة تناسب متطلباتك وميزانيتك.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-card/10 border border-white/5 rounded-2xl p-6 hover:border-accent-purple/20 transition-colors duration-300"
            >
              <div className="w-10 h-10 bg-accent-purple/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-accent-purple/15">
                <div className="w-2.5 h-2.5 bg-accent-purple rounded-full" />
              </div>
              <h4 className="font-bold text-white mb-2 text-sm sm:text-base">3. خطوات واضحة للبدء</h4>
              <p className="text-gray-400 text-xs leading-relaxed">
                خارطة طريق واضحة وجدول زمني محدد لضمان تسليم مرن وعالي السرعة والجودة.
              </p>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  )
}