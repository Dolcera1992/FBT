'use client'

import { useState, useEffect } from 'react'
import { Service } from '@/lib/api/services'
import { Code, MonitorSmartphone, ShoppingCart, LayoutDashboard } from 'lucide-react'
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
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredService, setHoveredService] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section id="services" className="relative py-20 bg-black overflow-hidden">
      
      {/* Ambient lighting effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 start-1/4 w-96 h-96 bg-accent-blue/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 end-1/4 w-64 h-64 bg-accent-purple/10 rounded-full blur-2xl" />
      </div>

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className={`inline-flex items-center gap-3 mb-6 transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <div className="w-3 h-3 bg-accent-blue rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-gray-300">
              {settings.servicesSub}
            </span>
            <div className="w-3 h-3 bg-accent-emerald rounded-full animate-pulse" />
          </div>
          
          <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6 text-white transform transition-all duration-1000 delay-200 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
          }`}>
            {settings.servicesTitle}
          </h2>
          
          <p className={`text-lg sm:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto transform transition-all duration-1000 delay-400 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            {settings.servicesDesc}
          </p>
        </div>

        {/* Services Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto transform transition-all duration-1000 delay-600 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
        }`}>
          {services.map((service, index) => {
            const IconComponent = IconMap[service.icon] || Code;
            
            return (
              <div
                key={service.id}
                className={`relative bg-card/50 backdrop-blur-md border border-border p-8 rounded-2xl elevated-shadow transform transition-all duration-500 ${
                  hoveredService === service.id ? 'scale-105 -translate-y-2 border-accent-blue/30' : 'scale-100'
                }`}
                style={{
                  transitionDelay: `${index * 100}ms`
                }}
                onMouseEnter={() => setHoveredService(service.id)}
                onMouseLeave={() => setHoveredService(null)}
              >
                <div className="w-12 h-12 bg-accent-blue/10 rounded-xl flex items-center justify-center mb-6">
                  <IconComponent className="w-6 h-6 text-accent-blue" />
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-4 leading-tight">
                  {service.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  )
}