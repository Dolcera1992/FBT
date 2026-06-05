'use client'

import { motion, Variants } from 'framer-motion'
import { Service } from '@/lib/api/services'
import { Code, MonitorSmartphone, ShoppingCart, LayoutDashboard, Sparkles } from 'lucide-react'
import { HomepageSettings } from '@/lib/api/settings'

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
                whileHover={{ 
                  y: -8, 
                  scale: 1.025,
                  boxShadow: '0 20px 40px -20px rgba(59, 130, 246, 0.15)',
                  borderColor: 'rgba(59, 130, 246, 0.35)',
                }}
                className="relative bg-card/25 backdrop-blur-xl border border-white/5 p-8 rounded-2xl flex flex-col justify-between h-full group transition-all duration-300"
              >
                {/* Accent line on hover */}
                <div className="absolute top-0 inset-x-0 h-1 rounded-t-2xl bg-gradient-to-l from-accent-blue via-accent-purple to-accent-emerald opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div>
                  {/* Icon */}
                  <div className="w-12 h-12 bg-white/5 border border-white/10 group-hover:border-accent-blue/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent-blue/10 transition-all duration-300">
                    <IconComponent className="w-5.5 h-5.5 text-gray-300 group-hover:text-accent-blue transition-colors duration-300" />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-lg font-bold text-white mb-3 tracking-tight group-hover:text-accent-blue transition-colors duration-300">
                    {service.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-400 group-hover:text-gray-300 leading-relaxed text-xs sm:text-sm transition-colors duration-300">
                    {service.description}
                  </p>
                </div>

                {/* Subtle card glowing orb behind icon */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-accent-blue/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  )
}