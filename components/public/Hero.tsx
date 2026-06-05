'use client'

import { motion, Variants } from 'framer-motion'
import { Volume2, VolumeX, Menu, X, ArrowUpRight } from 'lucide-react'
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

  // Framer Motion Animation Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.6,
      }
    }
  }

  const wordRevealVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      rotateX: 65,
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotateX: 0,
      transition: { 
        type: 'spring',
        damping: 18,
        stiffness: 90,
        duration: 0.85
      }
    }
  }

  const overlayVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1.5 } }
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black font-sans">
      {/* Background Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover scale-[1.03]"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={settings.heroVideoUrl} type="video/webm" />
        Your browser does not support the video tag.
      </video>

      {/* Cinematic Overlays (Radial Gradient & Dark overlay) */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={overlayVariants}
        className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/20 z-10" 
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_20%,rgba(0,0,0,0.85)_100%)] z-10 pointer-events-none" />

      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="fixed top-0 left-0 right-0 w-full z-[110]"
      >
        <div 
          className={`w-full px-6 sm:px-8 lg:px-12 py-5 transition-all duration-500 ease-out ${
            isScrolled 
              ? 'bg-black/30 backdrop-blur-2xl border-b border-white/5 shadow-2xl shadow-black/40' 
              : 'bg-transparent'
          }`}
        >
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center cursor-pointer"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            >
              <span className="font-bagel text-white text-2xl tracking-wider hover:text-accent-blue transition-colors">FBT.sa</span>
            </motion.div>

            {/* Navigation Menu (RTL aligned, right to left spacing) */}
            <div className="hidden md:flex items-center gap-10">
              <a 
                href="#services" 
                className="text-gray-300 hover:text-white font-medium transition-all hover:scale-105 duration-200 text-sm relative group"
              >
                الخدمات
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-blue transition-all duration-300 group-hover:w-full" />
              </a>
              <a 
                href="#portfolio" 
                className="text-gray-300 hover:text-white font-medium transition-all hover:scale-105 duration-200 text-sm relative group"
              >
                أعمالي
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-purple transition-all duration-300 group-hover:w-full" />
              </a>
              <a 
                href="#contact" 
                className="text-gray-300 hover:text-white font-medium transition-all hover:scale-105 duration-200 text-sm relative group"
              >
                تواصل معي
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-emerald transition-all duration-300 group-hover:w-full" />
              </a>
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center gap-4 relative">
              <div className="relative z-50">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="glass-effect p-3 rounded-full text-white hover:bg-white/15 active:scale-90 duration-300 gentle-animation cursor-pointer border border-white/5"
                >
                  {isMuted ? <VolumeX className="w-4.5 h-4.5" /> : <Volume2 className="w-4.5 h-4.5" />}
                </button>
                
                {/* Sound On Indicator */}
                {isMuted && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2, duration: 0.5 }}
                    className="absolute -bottom-12 start-0 flex items-center text-white/70"
                  >
                    <span className="whitespace-nowrap font-medium text-xs ms-1">تشغيل الصوت</span>
                    <span className="text-sm">↖</span>
                  </motion.div>
                )}
              </div>
              
              {/* Call to Action with animated gradient */}
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 10px 20px -10px rgba(59, 130, 246, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const contactSection = document.getElementById('contact')
                  contactSection?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-accent-blue via-accent-purple to-accent-emerald text-white text-sm font-bold px-6 py-3.5 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer relative overflow-hidden group shadow-lg"
              >
                <span>احجز مكالمة</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </motion.button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden glass-effect p-3 rounded-full text-white hover:bg-white/15 active:scale-95 duration-200 gentle-animation cursor-pointer border border-white/5 z-[120] relative"
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
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-md z-[80] cursor-pointer"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isMobileMenuOpen ? '0%' : '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="md:hidden fixed top-0 right-0 h-full w-72 max-w-[85vw] bg-black/90 backdrop-blur-2xl border-l border-white/5 z-[90] mobile-menu-panel pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full justify-between p-6 pt-24">
          <div className="flex flex-col gap-4 text-white">
            <a 
              href="#services" 
              className="px-4 py-3 hover:text-white/90 hover:bg-white/5 rounded-xl gentle-animation font-medium text-lg border border-transparent hover:border-white/5"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              الخدمات
            </a>
            <a 
              href="#portfolio" 
              className="px-4 py-3 hover:text-white/90 hover:bg-white/5 rounded-xl gentle-animation font-medium text-lg border border-transparent hover:border-white/5"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              أعمالي
            </a>
            <a 
              href="#contact" 
              className="px-4 py-3 hover:text-white/90 hover:bg-white/5 rounded-xl gentle-animation font-medium text-lg border border-transparent hover:border-white/5"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              تواصل معي
            </a>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              const contactSection = document.getElementById('contact')
              contactSection?.scrollIntoView({ behavior: 'smooth' })
              setIsMobileMenuOpen(false)
            }}
            className="w-full bg-gradient-to-r from-accent-blue via-accent-purple to-accent-emerald text-white font-bold py-3.5 rounded-xl transition-all duration-300 cursor-pointer shadow-lg"
          >
            احجز مكالمة
          </motion.button>
        </div>
      </motion.div>

      {/* Main Headline (Staggered 3D Reveal on Bottom Right for RTL) */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="absolute bottom-20 right-6 sm:right-10 lg:right-16 z-40 max-w-3xl text-right select-none"
      >
        <div className="space-y-2.5 overflow-hidden">
          <div className="overflow-hidden h-fit py-1">
            <motion.span 
              variants={wordRevealVariants}
              className="block text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-white leading-none"
            >
              {settings.heroHeadline1}
            </motion.span>
          </div>

          <div className="overflow-hidden h-fit py-1">
            <motion.span 
              variants={wordRevealVariants}
              className="block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black bg-gradient-to-l from-accent-blue via-accent-purple to-accent-emerald bg-clip-text text-transparent leading-none filter drop-shadow-sm"
            >
              {settings.heroHeadline2}
            </motion.span>
          </div>

          <div className="overflow-hidden h-fit py-1">
            <motion.span 
              variants={wordRevealVariants}
              className="block text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-white/90 leading-none"
            >
              {settings.heroHeadline3}
            </motion.span>
          </div>
        </div>
      </motion.div>

      {/* Elegant Bottom Radial Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#070708] to-transparent z-40 pointer-events-none" />
    </div>
  )
}