'use client'

import { motion, Variants } from 'framer-motion'
import { Project } from '@/lib/api/projects'
import { HomepageSettings } from '@/lib/api/settings'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import { FezCard } from '@/components/ui/FezCard'

interface PortfolioProps {
  projects: Project[];
  settings: HomepageSettings;
}

export function Portfolio({ projects, settings }: PortfolioProps) {
  // Stagger Container
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      }
    }
  }

  // Card Reveal
  const cardVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 50 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: 'spring',
        stiffness: 70,
        damping: 14,
        duration: 0.8
      }
    }
  }

  return (
    <section id="portfolio" className="relative py-28 bg-[#070708] overflow-hidden">
      
      {/* Background Lighting Detail */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-purple/5 rounded-full blur-[130px]" />
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
            <div className="absolute inset-0 bg-gradient-to-r from-accent-purple/30 via-accent-blue/30 to-accent-emerald/30 blur-2xl opacity-40 group-hover:opacity-80 transition-opacity duration-700 rounded-full" />
            
            {/* Premium Glass Badge */}
            <div className="relative flex items-center gap-3 px-6 py-2.5 rounded-full bg-black/40 backdrop-blur-2xl border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),_0_4px_20px_rgba(0,0,0,0.5)] group-hover:border-white/25 group-hover:bg-black/60 transition-all duration-500">
              
              {/* Left Sparkle */}
              <Sparkles className="w-4 h-4 text-accent-purple animate-pulse drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
              
              {/* Text */}
              <span className="text-xs sm:text-sm font-bold tracking-[0.2em] bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
                {settings.portfolioSub}
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
            {settings.portfolioTitle}
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto"
          >
            {settings.portfolioDesc}
          </motion.p>
        </div>

        {/* Projects Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
        >
          {projects.map((project) => (
            <motion.div 
              key={project.id} 
              variants={cardVariants}
              className="h-full"
            >
              <FezCard 
                title={project.title}
                description={project.description}
                imageUrl={project.imageUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800'}
                badges={[
                  { text: project.tags?.[0] || 'تطوير', type: 'cat' },
                ]}
                tags={project.tags}
                actionLabel="عرض المشروع"
                colorPreset={project.colorPreset}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}