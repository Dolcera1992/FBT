'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FolderKanban, ShieldCheck, Home, ArrowLeftRight, Settings, Image, Palette } from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const navItems = [
    { name: 'الرئيسية (لوحة التحكم)', href: '/admin', icon: LayoutDashboard },
    { name: 'إدارة المشاريع', href: '/admin/projects', icon: FolderKanban },
    { name: 'إدارة الخدمات', href: '/admin/services', icon: ArrowLeftRight },
    { name: 'إدارة المستخدمين', href: '/admin/users', icon: ShieldCheck },
    { name: 'إعدادات الموقع', href: '/admin/settings', icon: Settings },
    { name: 'التصميم والواجهة', href: '/admin/design', icon: Palette },
    { name: 'مكتبة الوسائط', href: '/admin/media', icon: Image },
  ]

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#070708] text-foreground flex" dir="rtl">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0d0d0e] border-l border-border/40 flex flex-col fixed inset-y-0 right-0 z-50">
        <div className="p-6 border-b border-border/40 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent-blue/15 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-accent-blue" />
          </div>
          <div>
            <h2 className="font-bold text-lg leading-none">لوحة التحكم</h2>
            <span className="text-xs text-muted-foreground">FBT.sa</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/15' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-card/40'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border/40">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-card/40 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>عرض موقع العميل</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 pr-64 min-h-screen flex flex-col">
        {/* Top bar */}
        <header className="h-16 border-b border-border/40 bg-[#0d0d0e]/60 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="font-bold text-lg text-foreground">نظام إدارة المحتوى</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-muted-foreground">متصل بقاعدة البيانات</span>
          </div>
        </header>

        {/* Dynamic page content */}
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
