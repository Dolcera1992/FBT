'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import Head from 'next/head'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isErrorShake, setIsErrorShake] = useState(false)

  // Refs for physics and animations
  const lampRef = useRef<SVGSVGElement>(null)
  const cordRef = useRef<SVGPathElement>(null)
  const hitRef = useRef<SVGCircleElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // ══════════════════════════════════════════════════════════════
    // CORD PHYSICS (From original JS)
    // ══════════════════════════════════════════════════════════════
    const ROOT = document.documentElement
    const cord = cordRef.current
    const hit = hitRef.current
    const lampEl = lampRef.current
    const card = cardRef.current

    if (!cord || !hit || !lampEl || !card) return

    // SVG anchor (top of cord) and tassel rest position
    const AX = 124, AY = 190
    const REST_X = 124, REST_Y = 348
    const TRIGGER_DIST = 55

    let dragging = false
    let animating = false
    let lightOn = false
    let curX = REST_X, curY = REST_Y

    // Preload audio
    const clickAudio = new Audio("/click-sound.mp3")

    function toSVG(sx: number, sy: number) {
      if (!lampEl) return { x: sx, y: sy }
      const pt = lampEl.createSVGPoint()
      pt.x = sx
      pt.y = sy
      const ctm = lampEl.getScreenCTM()
      if (!ctm) return pt
      return pt.matrixTransform(ctm.inverse())
    }

    function buildCord(tx: number, ty: number) {
      const dx = tx - AX, dy = ty - AY
      const sag = Math.max(4, 30 - Math.hypot(dx, dy) * 0.06)
      const c1x = AX + dx * 0.15 + sag, c1y = AY + dy * 0.30 + sag
      const c2x = AX + dx * 0.70 - sag * 0.3, c2y = AY + dy * 0.72 - sag * 0.2
      return `M${AX},${AY} C${c1x},${c1y} ${c2x},${c2y} ${tx},${ty}`
    }

    function updateCord(tx: number, ty: number) {
      curX = tx
      curY = ty
      if (cord) {
        cord.setAttribute('d', buildCord(tx, ty))
        const tension = Math.min(Math.hypot(tx - REST_X, ty - REST_Y) / 120, 1)
        cord.style.stroke = `hsl(270, 0%, ${Math.round(38 + tension * 52)}%)`
      }
    }

    function springBack(fromX: number, fromY: number, triggered: boolean) {
      if (animating) return
      animating = true
      const dur = triggered ? 380 : 500
      const t0 = performance.now()

      function tick(now: number) {
        const t = Math.min((now - t0) / dur, 1)
        const fn = triggered ? easeElastic(t) : easeOutBounce(t)
        updateCord(fromX + (REST_X - fromX) * fn, fromY + (REST_Y - fromY) * fn)
        if (t < 1) {
          requestAnimationFrame(tick)
          return
        }
        updateCord(REST_X, REST_Y)
        if (cord) cord.style.stroke = ''
        animating = false
      }
      requestAnimationFrame(tick)
    }

    function easeElastic(t: number) {
      if (!t || t === 1) return t
      return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI / 3)) + 1
    }

    function easeOutBounce(t: number) {
      if (t < 1 / 2.75) return 7.5625 * t * t
      if (t < 2 / 2.75) { t -= 1.5 / 2.75; return 7.5625 * t * t + 0.750 }
      if (t < 2.5 / 2.75) { t -= 2.25 / 2.75; return 7.5625 * t * t + 0.9375 }
      t -= 2.625 / 2.75; return 7.5625 * t * t + 0.984375
    }

    function client(e: MouseEvent | TouchEvent) {
      if (window.TouchEvent && e instanceof TouchEvent && e.touches.length > 0) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY }
      }
      return { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY }
    }

    function onDown(e: Event) {
      if (animating) return
      e.preventDefault()
      dragging = true
    }

    function onMove(e: Event) {
      if (!dragging) return
      e.preventDefault()
      const { x, y } = client(e as any)
      const sv = toSVG(x, y)
      updateCord(sv.x, Math.max(AY + 20, sv.y))
    }

    function onUp() {
      if (!dragging) return
      dragging = false
      const dist = Math.hypot(curX - REST_X, curY - REST_Y)
      if (dist > TRIGGER_DIST) toggleLight()
      springBack(curX, curY, dist > TRIGGER_DIST)
    }

    function toggleLight() {
      clickAudio.currentTime = 0
      clickAudio.play().catch(e => console.error("Audio play failed", e))
      lightOn = !lightOn
      ROOT.style.setProperty('--on', lightOn ? '1' : '0')
      if (card) {
        if (lightOn) {
          card.classList.add('is-active')
        } else {
          card.classList.remove('is-active')
        }
      }
    }

    hit.addEventListener('mousedown', onDown)
    hit.addEventListener('touchstart', onDown, { passive: false })
    cord.addEventListener('mousedown', onDown)
    cord.addEventListener('touchstart', onDown, { passive: false })
    
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchmove', onMove, { passive: false })
    window.addEventListener('touchend', onUp)

    // Cleanup
    return () => {
      hit.removeEventListener('mousedown', onDown)
      hit.removeEventListener('touchstart', onDown)
      cord.removeEventListener('mousedown', onDown)
      cord.removeEventListener('touchstart', onDown)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onUp)
      // Reset --on when leaving
      ROOT.style.setProperty('--on', '0')
    }
  }, [])

  const handleSubmit = async () => {
    if (!email || !password) {
      setIsErrorShake(true)
      setTimeout(() => setIsErrorShake(false), 400)
      return
    }

    setIsSubmitting(true)
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      toast.success('تم تسجيل الدخول بنجاح! يتم توجيهك...')
      router.push('/admin')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'فشل تسجيل الدخول. تأكد من صحة البيانات.')
      setIsErrorShake(true)
      setTimeout(() => setIsErrorShake(false), 400)
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;800&family=Syne:wght@700;800&display=swap" rel="stylesheet" />
      </Head>

      <div className="lamp-login-body" dir="rtl">
        {/* CSS Scoped specifically for this page to match the exact 1:1 design */}
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --on: 0;
            --opening: hsl(270, calc((10 + var(--on) * 70) * 1%), calc((18 + var(--on) * 68) * 1%));
            --base-top: hsl(270, calc(var(--on) * 25%), calc((30 + var(--on) * 38) * 1%));
            --base-side: hsl(270, calc(var(--on) * 25%), calc((15 + var(--on) * 35) * 1%));
            --post: hsl(270, calc(var(--on) * 20%), calc((18 + var(--on) * 35) * 1%));
            --shade-l: hsl(270, calc(var(--on) * 35%), calc((28 + var(--on) * 55) * 1%));
            --shade-m: hsl(270, calc(var(--on) * 35%), calc((16 + var(--on) * 32) * 1%));
            --shade-d: hsl(270, calc(var(--on) * 35%), calc((9 + var(--on) * 18) * 1%));
            --blend-a: hsla(270, calc(var(--on) * 30%), calc((45 + var(--on) * 50) * 1%), 0.85);
            --blend-b: hsla(270, calc(var(--on) * 30%), calc((18 + var(--on) * 28) * 1%), 0.25);
            --blend-c: hsla(270, calc(var(--on) * 30%), calc((18 + var(--on) * 28) * 1%), 0.50);
            --glow-a: hsla(270, calc(var(--on) * 40%), calc((40 + var(--on) * 55) * 1%), 0.85);
            --cord-l: calc((38 + var(--on) * 52) * 1%);

            --bg: #07000d;
            --pm: #3d0070;
            --pg: #8b2fc9;
            --pb: #c678f5;
            --pu: #e0a8ff;
            --acc: #bf5af2;
            --tp: #f0e4ff;
            --tm: #a07ec0;
            --glass: rgba(26, 4, 50, 0.65);
            --border: rgba(140, 50, 200, 0.28);
            --ibg: rgba(255, 255, 255, 0.043);
            --ibr: rgba(180, 100, 255, 0.18);
            --ease-spring: 0.88s cubic-bezier(0.22, 1, 0.36, 1);
          }

          .lamp-login-body {
            font-family: 'Cairo', 'DM Sans', sans-serif;
            background: var(--bg);
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100vw;
            height: 100vh;
            overflow: hidden;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1000;
          }

          .lamp-login-body::after {
            content: '';
            position: absolute;
            inset: 0;
            background: radial-gradient(ellipse 50% 65% at 40% 50%, rgba(100, 20, 180, .38) 0%, rgba(40, 5, 80, .12) 52%, transparent 75%);
            opacity: var(--on);
            transition: opacity .9s ease;
            pointer-events: none;
            z-index: 0;
          }

          .lamp-scene {
            position: relative;
            z-index: 10;
            display: flex;
            align-items: center;
            gap: 80px;
            flex-direction: row-reverse;
          }

          .lamp {
            height: 46vmin;
            min-height: 300px;
            max-height: 420px;
            overflow: visible !important;
            flex-shrink: 0;
          }

          .lamp-cord { stroke: hsl(270, 0%, var(--cord-l)); transition: stroke .1s; }
          .lamp-light { opacity: var(--on); }
          .fill-opening { fill: var(--opening); }
          .fill-base-top { fill: var(--base-top); }
          .fill-base-side { fill: var(--base-side); }
          .fill-post { fill: var(--post); }
          .fill-shade { fill: var(--shade-d); }
          .lamp-hit { cursor: grab; fill: transparent; }
          .lamp-hit:active { cursor: grabbing; }

          .lamp-card {
            width: 320px;
            padding: 32px 28px 28px;
            background: var(--glass);
            backdrop-filter: blur(28px) saturate(1.5);
            -webkit-backdrop-filter: blur(28px) saturate(1.5);
            border-radius: 22px;
            border: 1px solid var(--border);
            box-shadow: 0 22px 56px rgba(0, 0, 0, .72);
            opacity: 0;
            transform: scale(.90) translateX(-12px);
            transition: opacity var(--ease-spring), transform var(--ease-spring), border-color var(--ease-spring), box-shadow var(--ease-spring);
            pointer-events: none;
            position: relative;
            overflow: hidden;
            text-align: right;
          }

          .lamp-card::before {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: 22px;
            background: linear-gradient(-138deg, rgba(255, 255, 255, .05) 0%, transparent 55%);
            pointer-events: none;
          }

          .lamp-card.is-active {
            opacity: 1;
            transform: scale(1) translateX(0);
            pointer-events: auto;
            border-color: rgba(170, 65, 255, .38);
            box-shadow: 0 22px 56px rgba(0, 0, 0, .65), 0 0 44px 3px rgba(118, 30, 192, .16), 0 0 80px 12px rgba(55, 7, 110, .10);
          }

          .brand { display: flex; align-items: center; gap: 10px; margin-bottom: 22px; }
          .brand-icon { width: 32px; height: 32px; border-radius: 9px; background: linear-gradient(-135deg, var(--pm), var(--pg)); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(125, 38, 196, .5); flex-shrink: 0; }
          .brand-icon svg { width: 15px; height: 15px; fill: #fff; }
          .brand-name { font-family: 'Syne', sans-serif; font-size: 1.10rem; font-weight: 800; letter-spacing: -.02em; background: linear-gradient(-130deg, var(--pu), var(--pb) 55%, #fff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; line-height: 1.1; }
          .brand-tag { font-family: 'Cairo', sans-serif; font-size: .65rem; color: var(--tm); font-weight: 600; text-transform: uppercase; }

          .card-title { font-family: 'Cairo', sans-serif; font-size: 1.25rem; font-weight: 800; color: var(--tp); margin-bottom: 5px; }
          .card-sub { font-size: .8rem; color: var(--tm); margin-bottom: 18px; font-weight: 600; }
          .card-sep { width: 26px; height: 2px; background: linear-gradient(-90deg, var(--pg), transparent); border-radius: 2px; margin-bottom: 16px; margin-right: 0; }

          .field { margin-bottom: 12px; }
          .field label { display: block; font-size: .7rem; font-weight: 700; color: var(--tm); margin-bottom: 5px; }
          .field-wrap { position: relative; display: flex; align-items: center; }
          .field-icon { position: absolute; right: 11px; color: var(--tm); pointer-events: none; display: flex; transition: color .28s; }
          .field-wrap:focus-within .field-icon { color: var(--acc); }
          .field-wrap input { width: 100%; padding: 10px 35px 10px 11px; background: var(--ibg); border: 1px solid var(--ibr); border-radius: 10px; color: var(--tp); font-family: 'DM Sans', sans-serif; font-size: .84rem; outline: none; transition: border-color .28s, box-shadow .28s, background .28s; text-align: left; direction: ltr;}
          .field-wrap input:focus { border-color: var(--acc); background: rgba(140, 47, 201, .07); box-shadow: 0 0 0 3px rgba(140, 47, 201, .12); }
          .field-toggle { position: absolute; left: 10px; background: none; border: none; cursor: pointer; color: var(--tm); display: flex; transition: color .25s; padding: 0; }
          .field-toggle:hover { color: var(--acc); }

          .forgot { display: flex; justify-content: flex-start; margin-top: -4px; margin-bottom: 16px; }
          .forgot a { font-size: .7rem; font-weight: 600; color: var(--pb); text-decoration: none; transition: color .22s; }
          .forgot a:hover { color: var(--pu); }

          .btn-submit { width: 100%; padding: 11px; background: linear-gradient(-135deg, var(--pm), var(--pg)); color: #fff; font-family: 'Cairo', sans-serif; font-size: .95rem; font-weight: 800; border: none; border-radius: 10px; cursor: pointer; position: relative; overflow: hidden; transition: transform .18s, box-shadow .28s, background .28s; box-shadow: 0 4px 20px rgba(85, 13, 165, .42); }
          .btn-submit::after { content: ''; position: absolute; top: -50%; right: -60%; width: 45%; height: 200%; background: rgba(255, 255, 255, .13); transform: skewX(20deg); transition: right .42s ease; }
          .btn-submit:hover::after { right: 115%; }
          .btn-submit:hover { transform: translateY(-2px); box-shadow: 0 8px 26px rgba(85, 13, 165, .55); }
          .btn-submit:active { transform: scale(.98); }
          .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }

          @keyframes shake-error {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(6px); }
            40% { transform: translateX(-6px); }
            60% { transform: translateX(4px); }
            80% { transform: translateX(-4px); }
          }
          
          .shake-animation { animation: shake-error 0.4s ease; }
        `}} />

        <div className="lamp-scene">
          {/* ══════════════════════════════════════════
             LAMP
          ══════════════════════════════════════════ */}
          <svg ref={lampRef} className="lamp" viewBox="0 0 333 484" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse className="fill-opening" cx="165" cy="220" rx="130" ry="20" />
              <ellipse cx="165" cy="220" rx="130" ry="20" fill="url(#grad-opening)" style={{opacity: 'calc(1 - var(--on))'}} />
              <path className="fill-base-side" d="M165 464c44.183 0 80-8.954 80-20v-14h-22.869c-14.519-3.703-34.752-6-57.131-6-22.379 0-42.612 2.297-57.131 6H85v14c0 11.046 35.817 20 80 20z" />
              <path d="M165 464c44.183 0 80-8.954 80-20v-14h-22.869c-14.519-3.703-34.752-6-57.131-6-22.379 0-42.612 2.297-57.131 6H85v14c0 11.046 35.817 20 80 20z" fill="url(#grad-side)" />
              <ellipse className="fill-base-top" cx="165" cy="430" rx="80" ry="20" />
              <ellipse cx="165" cy="430" rx="80" ry="20" fill="url(#grad-base)" />
              <path className="fill-post" d="M180 142h-30v286c0 3.866 6.716 7 15 7 8.284 0 15-3.134 15-7V142z" />
              <path d="M180 142h-30v286c0 3.866 6.716 7 15 7 8.284 0 15-3.134 15-7V142z" fill="url(#grad-post)" />
              <path ref={cordRef} className="lamp-cord" d="M124 190 L124 348" strokeWidth="6" strokeLinecap="round" />
              <path className="lamp-light" d="M290.5 193H39L0 463.5c0 11.046 75.478 20 165.5 20s167-11.954 167-23l-42-267.5z" fill="url(#grad-light)" />
              <path className="fill-shade" fillRule="evenodd" clipRule="evenodd" d="M164.859 0c55.229 0 100 8.954 100 20l29.859 199.06C291.529 208.451 234.609 200 164.859 200S38.189 208.451 35 219.06L64.859 20c0-11.046 44.772-20 100-20z" />
              <path fillRule="evenodd" clipRule="evenodd" d="M164.859 0c55.229 0 100 8.954 100 20l29.859 199.06C291.529 208.451 234.609 200 164.859 200S38.189 208.451 35 219.06L64.859 20c0-11.046 44.772-20 100-20z" fill="url(#grad-shade)" />
              <defs>
                  <linearGradient id="grad-opening" x1="35" y1="220" x2="295" y2="220" gradientUnits="userSpaceOnUse"><stop /><stop offset="1" stopOpacity="0" /></linearGradient>
                  <linearGradient id="grad-base" x1="85" y1="444" x2="245" y2="444" gradientUnits="userSpaceOnUse"><stop stopColor="var(--blend-a)" /><stop offset=".8" stopColor="var(--blend-b)" stopOpacity="0" /></linearGradient>
                  <linearGradient id="grad-side" x1="119" y1="430" x2="245" y2="430" gradientUnits="userSpaceOnUse"><stop stopColor="var(--blend-c)" /><stop offset="1" stopColor="var(--blend-b)" stopOpacity="0" /></linearGradient>
                  <linearGradient id="grad-post" x1="150" y1="288" x2="180" y2="288" gradientUnits="userSpaceOnUse"><stop stopColor="var(--blend-a)" /><stop offset="1" stopColor="var(--blend-b)" stopOpacity="0" /></linearGradient>
                  <linearGradient id="grad-light" x1="165.5" y1="218.5" x2="165.5" y2="340" gradientUnits="userSpaceOnUse"><stop stopColor="var(--glow-a)" stopOpacity=".10" /><stop offset="1" stopColor="var(--glow-a)" stopOpacity="0" /></linearGradient>
                  <linearGradient id="grad-shade" x1="56" y1="110" x2="295" y2="110" gradientUnits="userSpaceOnUse"><stop stopColor="var(--shade-l)" stopOpacity=".8" /><stop offset="1" stopColor="var(--shade-m)" stopOpacity="0" /></linearGradient>
              </defs>
              <circle ref={hitRef} className="lamp-hit" cx="124" cy="348" r="60" />
          </svg>

          {/* ══════════════════════════════════════════
             LOGIN CARD (RTL Localized)
          ══════════════════════════════════════════ */}
          <div ref={cardRef} className={`lamp-card ${isErrorShake ? 'shake-animation' : ''}`}>
              <div className="brand">
                  <div className="brand-icon">
                      <svg viewBox="0 0 24 24">
                          <path d="M12 3L1 9l4 2.18V15c0 2.67 4.67 5 7 5s7-2.33 7-5v-3.82L22 9l-10-6zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 14.99c0 .72-2.13 2.01-5 2.01s-5-1.29-5-2V11.4l5 2.72 5-2.72v3.59z" />
                      </svg>
                  </div>
                  <div>
                      <div className="brand-name">FBT.sa</div>
                      <div className="brand-tag">لوحة تحكم الإدارة</div>
                  </div>
              </div>

              <h1 className="card-title">مرحباً بك مجدداً</h1>
              <p className="card-sub">قم بتسجيل الدخول للمتابعة</p>
              <div className="card-sep"></div>

              <div className="field">
                  <label htmlFor="email">البريد الإلكتروني</label>
                  <div className="field-wrap">
                      <span className="field-icon">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                              <polyline points="22,6 12,13 2,6" />
                          </svg>
                      </span>
                      <input 
                        type="email" 
                        id="email" 
                        placeholder="admin@example.com" 
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                  </div>
              </div>

              <div className="field">
                  <label htmlFor="password">كلمة المرور</label>
                  <div className="field-wrap">
                      <span className="field-icon">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="11" width="18" height="11" rx="2" />
                              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                          </svg>
                      </span>
                      <input 
                        type={showPassword ? "text" : "password"} 
                        id="password" 
                        placeholder="••••••••" 
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button 
                        className="field-toggle" 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                      >
                          {showPassword ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
                            </svg>
                          ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                            </svg>
                          )}
                      </button>
                  </div>
              </div>

              <div className="forgot"><a href="#">نسيت كلمة المرور؟</a></div>

              <button 
                className="btn-submit" 
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'جاري التحقق...' : 'تسجيل الدخول'}
              </button>
          </div>
        </div>
      </div>
    </>
  )
}
