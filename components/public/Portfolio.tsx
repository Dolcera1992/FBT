'use client'

import { motion, Variants } from 'framer-motion'
import { Project } from '@/lib/api/projects'
import { HomepageSettings } from '@/lib/api/settings'
import { ArrowUpRight } from 'lucide-react'

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
            className="inline-flex items-center gap-3 mb-6 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md"
          >
            <div className="w-2.5 h-2.5 bg-accent-purple rounded-full animate-pulse" />
            <span className="text-xs font-semibold text-gray-300 tracking-wider">
              {settings.portfolioSub}
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
              whileHover={{ 
                y: -10,
                boxShadow: '0 25px 50px -12px rgba(139, 92, 246, 0.18)',
                borderColor: 'rgba(139, 92, 246, 0.35)'
              }}
              className="relative bg-card/20 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden group flex flex-col transition-all duration-500"
            >
              {/* Image Container with Zoom hover effect */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={project.imageUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800'}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out scale-100 group-hover:scale-105"
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6" />

                {project.badge && (
                  <div className="absolute top-4 right-4 z-20">
                    <span className="glass-effect border border-white/10 rounded-xl px-3.5 py-1.5 text-[11px] font-bold text-white backdrop-blur-md bg-black/40">
                      {project.badge}
                    </span>
                  </div>
                )}
              </div>

              {/* Project Details with beautiful styling */}
              <div className="p-6 lg:p-8 flex-1 flex flex-col relative">
                {/* Glow behind Details */}
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent-purple/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-accent-purple/10 text-accent-purple border border-accent-purple/20 px-3.5 py-1 rounded-full text-[11px] font-bold">
                    {project.industry}
                  </span>
                  <span className="text-xs text-gray-400 font-semibold">
                    {project.client}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-accent-purple transition-colors duration-300 tracking-tight flex items-center gap-2">
                  <span>{project.title}</span>
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 -translate-x-1 group-hover:translate-y-0 group-hover:translate-x-0" />
                </h3>
                
                <p className="text-gray-400 group-hover:text-gray-300 leading-relaxed mb-6 flex-1 text-xs sm:text-sm transition-colors duration-300">
                  {project.description}
                </p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-white/5">
                  {project.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="text-[10px] font-bold bg-white/5 border border-white/5 text-gray-300 px-3 py-1 rounded-lg transition-colors duration-300 group-hover:border-white/10 group-hover:bg-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}