'use client'

import { useState } from 'react'
import { motion, Variants, AnimatePresence } from 'framer-motion'
import { Service } from '@/lib/api/services'
import { Code, MonitorSmartphone, ShoppingCart, LayoutDashboard, Sparkles, Phone, Mail, MessageCircle, X } from 'lucide-react'
import { HomepageSettings } from '@/lib/api/settings'
import { FezCard } from '@/components/ui/FezCard'

const IconMap: Record<string, React.ElementType> = {
  Code,
  MonitorSmartphone,
  ShoppingCart,
  LayoutDashboard
};

interface ServicesProps {
  services: Service[];
  settings: HomepageSettings;
}

export function Services({ services, settings }: ServicesProps) {
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  // Stagger Container
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
      }
    }
  }

  // Card Reveal
  const cardVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 40 
    },
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
    <section id="services" className="relative py-28 bg-[#070708] overflow-hidden border-b border-white/5">
      
      {/* Cinematic Animated Background Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <motion.div 
          animate={{
            x: [0, 40, -30, 0],
            y: [0, -60, 40, 0],
            scale: [1, 1.15, 0.9, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-10 start-1/4 w-[450px] h-[450px] bg-accent-blue/5 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{
            x: [0, -50, 40, 0],
            y: [0, 50, -50, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{
            duration: 26,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -bottom-20 end-1/4 w-[400px] h-[400px] bg-accent-purple/5 rounded-full blur-[140px]" 
        />
      </div>

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10 max-w-7xl">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="group relative inline-flex items-center justify-center mb-8 cursor-default"
          >
            {/* Animated Ambient Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/30 via-accent-purple/30 to-accent-emerald/30 blur-2xl opacity-40 group-hover:opacity-80 transition-opacity duration-700 rounded-full" />
            
            {/* Premium Glass Badge */}
            <div className="relative flex items-center gap-3 px-6 py-2.5 rounded-full bg-black/40 backdrop-blur-2xl border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),_0_4px_20px_rgba(0,0,0,0.5)] group-hover:border-white/25 group-hover:bg-black/60 transition-all duration-500">
              
              {/* Left Sparkle */}
              <Sparkles className="w-4 h-4 text-accent-emerald animate-pulse drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              
              {/* Text */}
              <span className="text-xs sm:text-sm font-bold tracking-[0.2em] bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
                {settings.servicesSub}
              </span>

              {/* Right Dot */}
              <div className="w-1.5 h-1.5 rounded-full bg-accent-blue shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-pulse" style={{ animationDelay: '1s' }} />

            </div>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6 text-white tracking-tight"
          >
            {settings.servicesTitle}
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto"
          >
            {settings.servicesDesc}
          </motion.p>
        </div>

        {/* Services Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {services.map((service) => {
            const IconComponent = IconMap[service.icon] || Code;
            
            return (
              <motion.div
                key={service.id}
                variants={cardVariants}
                className="h-full"
              >
                <FezCard 
                  title={service.title}
                  description={service.description}
                  icon={<IconComponent className="w-full h-full object-contain" />}
                  badges={[{ text: 'خدمة تقنية', type: 'cat' }]}
                  actionLabel="طلب الخدمة"
                  onClick={() => setSelectedService(service)}
                  colorPreset={service.colorPreset || settings.globalColorPreset}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Social Expanding Links Modal */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative z-10 w-full max-w-md"
              dir="rtl"
            >
              <div className="relative bg-[#0a0510]/95 backdrop-blur-xl border border-white/10 rounded-[30px] shadow-2xl p-8 sm:p-10 flex flex-col items-center">
                <button 
                  onClick={() => setSelectedService(null)}
                  className="absolute top-4 left-4 p-2 text-white/50 hover:text-white transition-colors rounded-full hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>

                <h3 className="text-2xl font-bold text-white mb-2 text-center">{selectedService.title}</h3>
                <p className="text-white/60 mb-8 text-center text-sm">اختر وسيلة التواصل المناسبة لطلب الخدمة</p>

                {/* Social Wrapper */}
                <div className="flex flex-wrap sm:flex-nowrap justify-center gap-4">
                  {/* WhatsApp */}
                  {settings.contactWhatsapp && (
                    <a 
                      href={`https://wa.me/${settings.contactWhatsapp.replace(/\+/g, '')}?text=${encodeURIComponent(`مرحباً، أود الاستفسار عن خدمة: ${selectedService.title}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="group relative flex items-center justify-start h-[60px] w-[60px] sm:hover:w-[160px] p-4 rounded-full no-underline text-[#9d8dbb] bg-white/5 border border-white/10 overflow-hidden transition-all duration-500 hover:text-white hover:-translate-y-1 hover:bg-[#25D366] hover:border-[#25D366] hover:shadow-[0_10px_20px_rgba(37,211,102,0.4)]"
                    >
                      <MessageCircle className="w-[22px] h-[22px] shrink-0 z-10 transition-transform duration-500 group-hover:rotate-[360deg]" />
                      <span className="text-base font-bold whitespace-nowrap mr-4 opacity-0 z-10 translate-x-4 transition-all duration-400 group-hover:opacity-100 group-hover:translate-x-0 hidden sm:block">واتساب</span>
                    </a>
                  )}

                  {/* Phone */}
                  {settings.contactPhone && (
                    <a 
                      href={`tel:${settings.contactPhone}`}
                      className="group relative flex items-center justify-start h-[60px] w-[60px] sm:hover:w-[160px] p-4 rounded-full no-underline text-[#9d8dbb] bg-white/5 border border-white/10 overflow-hidden transition-all duration-500 hover:text-white hover:-translate-y-1 hover:bg-[#0077b5] hover:border-[#0077b5] hover:shadow-[0_10px_20px_rgba(0,119,181,0.4)]"
                    >
                      <Phone className="w-[22px] h-[22px] shrink-0 z-10 transition-transform duration-500 group-hover:rotate-[360deg]" />
                      <span className="text-base font-bold whitespace-nowrap mr-4 opacity-0 z-10 translate-x-4 transition-all duration-400 group-hover:opacity-100 group-hover:translate-x-0 hidden sm:block">اتصال مباشر</span>
                    </a>
                  )}

                  {/* Email */}
                  {settings.contactEmail && (
                    <a 
                      href={`mailto:${settings.contactEmail}?subject=${encodeURIComponent(`طلب خدمة: ${selectedService.title}`)}`}
                      className="group relative flex items-center justify-start h-[60px] w-[60px] sm:hover:w-[160px] p-4 rounded-full no-underline text-[#9d8dbb] bg-white/5 border border-white/10 overflow-hidden transition-all duration-500 hover:text-white hover:-translate-y-1 hover:bg-[#ea4335] hover:border-[#ea4335] hover:shadow-[0_10px_20px_rgba(234,67,53,0.4)]"
                    >
                      <Mail className="w-[22px] h-[22px] shrink-0 z-10 transition-transform duration-500 group-hover:rotate-[360deg]" />
                      <span className="text-base font-bold whitespace-nowrap mr-4 opacity-0 z-10 translate-x-4 transition-all duration-400 group-hover:opacity-100 group-hover:translate-x-0 hidden sm:block">البريد</span>
                    </a>
                  )}
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}