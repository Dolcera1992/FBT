'use client'

import { motion } from 'framer-motion'
import { Volume2, VolumeX, Menu, X } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { HomepageSettings } from '@/lib/api/settings'

interface HeroProps {
  settings: HomepageSettings;
}

export function Hero({ settings }: HeroProps) {
  const [isMuted, setIsMuted] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Mute video setup
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = 0
      videoRef.current.muted = true
      videoRef.current.defaultMuted = true
      
      const playPromise = videoRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch(error => console.log('Autoplay blocked initially', error))
      }
    }
  }, [])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted
      videoRef.current.volume = isMuted ? 0 : 0.7
    }
  }, [isMuted])

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover scale-110"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={settings.heroVideoUrl} type="video/webm" />
        Your browser does not support the video tag.
      </video>

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/45 z-10" />

      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="fixed top-0 left-0 right-0 w-full z-[110]"
      >
        <div 
          className={`w-full px-6 sm:px-8 lg:px-12 py-4 transition-all duration-300 ease-out ${
            isScrolled 
              ? 'bg-black/80 backdrop-blur-xl border-b border-white/10' 
              : 'bg-transparent'
          }`}
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center cursor-pointer"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            >
              <span className="font-bagel text-white text-2xl tracking-wider">FBT.sa</span>
            </motion.div>

            {/* Navigation Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a 
                href="#services" 
                className="text-white hover:text-white/80 font-medium gentle-animation hover:scale-105"
              >
                الخدمات
              </a>
              <a 
                href="#portfolio" 
                className="text-white hover:text-white/80 font-medium gentle-animation hover:scale-105"
              >
                أعمالي
              </a>
              <a 
                href="#contact" 
                className="text-white hover:text-white/80 font-medium gentle-animation hover:scale-105"
              >
                تواصل معي
              </a>
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center gap-3 relative">
              <div className="relative z-50">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="glass-effect p-3 rounded-full text-white hover:bg-white/20 gentle-animation cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                
                {/* Sound On Indicator */}
                {isMuted && (
                  <div className="absolute -bottom-10 start-0 flex items-center text-white/80">
                    <span className="whitespace-nowrap font-medium text-sm ms-2">تشغيل الصوت</span>
                    <span className="text-lg">↖</span>
                  </div>
                )}
              </div>
              
              {/* Call to Action */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const contactSection = document.getElementById('contact')
                  contactSection?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="hidden sm:block bg-red-600 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-md hover:bg-red-700 gentle-animation cursor-pointer"
              >
                احجز مكالمة
              </motion.button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden glass-effect p-3 rounded-full text-white hover:bg-white/20 active:bg-white/30 gentle-animation cursor-pointer z-[120] relative"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-md z-[80] cursor-pointer"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isMobileMenuOpen ? '0%' : '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="md:hidden fixed top-0 right-0 h-full w-72 max-w-[85vw] bg-black/90 backdrop-blur-xl border-l border-white/10 z-[90] mobile-menu-panel pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full justify-between p-6 pt-24">
          <div className="flex flex-col gap-4 text-white">
            <a 
              href="#services" 
              className="px-4 py-3 hover:text-white/80 hover:bg-white/10 rounded-lg gentle-animation font-medium text-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              الخدمات
            </a>
            <a 
              href="#portfolio" 
              className="px-4 py-3 hover:text-white/80 hover:bg-white/10 rounded-lg gentle-animation font-medium text-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              أعمالي
            </a>
            <a 
              href="#contact" 
              className="px-4 py-3 hover:text-white/80 hover:bg-white/10 rounded-lg gentle-animation font-medium text-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              تواصل معي
            </a>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const contactSection = document.getElementById('contact')
              contactSection?.scrollIntoView({ behavior: 'smooth' })
              setIsMobileMenuOpen(false)
            }}
            className="w-full bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 active:bg-red-800 gentle-animation cursor-pointer"
          >
            احجز مكالمة
          </motion.button>
        </div>
      </motion.div>

      {/* Main Headline (Bottom Right for RTL) */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-12 right-6 sm:right-8 lg:right-12 z-40"
      >
        <div className="max-w-2xl text-right">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight text-white">
            <span className="block">{settings.heroHeadline1}</span>
            <span className="block text-accent-blue">{settings.heroHeadline2}</span>
            <span className="block">{settings.heroHeadline3}</span>
          </h1>
        </div>
      </motion.div>
    </div>
  )
}