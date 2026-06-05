'use client'

import React, { useState, useEffect } from 'react'
import { FolderKanban, ArrowLeftRight, Settings, ExternalLink } from 'lucide-react'
import { getProjects, Project } from '@/lib/api/projects'
import { getServices, Service } from '@/lib/api/services'
import Link from 'next/link'

export default function AdminDashboardOverview() {
  const [projects, setProjects] = useState<Project[]>([])
  const [services, setServices] = useState<Service[]>([])

  useEffect(() => {
    getProjects().then(setProjects).catch(console.error)
    getServices().then(setServices).catch(console.error)
  }, [])

  return (
    <div className="space-y-8" dir="rtl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white mb-2">لوحة التحكم</h2>
        <p className="text-muted-foreground text-sm">
          أهلاً بك في لوحة تحكم موقعك الشخصي. يمكنك إدارة المحتوى بسهولة هنا.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-[#0d0d0e] border border-border/40 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-sm text-muted-foreground font-medium">إجمالي المشاريع</span>
            <h3 className="text-3xl font-bold text-white">{projects.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-accent-blue/15 flex items-center justify-center">
            <FolderKanban className="w-6 h-6 text-accent-blue" />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#0d0d0e] border border-border/40 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-sm text-muted-foreground font-medium">إجمالي الخدمات</span>
            <h3 className="text-3xl font-bold text-white">{services.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-accent-purple/15 flex items-center justify-center">
            <ArrowLeftRight className="w-6 h-6 text-accent-purple" />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#0d0d0e] border border-border/40 flex items-center justify-between shadow-sm">
          <div className="space-y-1 flex flex-col justify-center">
            <span className="text-sm text-muted-foreground font-medium">إعدادات الموقع</span>
            <Link 
              href="/admin/settings"
              className="text-accent-blue text-sm font-semibold hover:underline flex items-center gap-1 mt-1"
            >
              تعديل نصوص الموقع <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="w-12 h-12 rounded-xl bg-accent-emerald/15 flex items-center justify-center">
            <Settings className="w-6 h-6 text-accent-emerald" />
          </div>
        </div>
      </div>

      {/* Quick Access lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Recent Projects */}
        <div className="p-6 rounded-2xl bg-[#0d0d0e] border border-border/40 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-white">آخر المشاريع المضافة</h3>
            <Link href="/admin/projects" className="text-accent-blue text-xs hover:underline font-semibold">
              إدارة المشاريع
            </Link>
          </div>
          <div className="divide-y divide-border/20">
            {projects.slice(0, 3).map((project) => (
              <div key={project.id} className="py-3 flex justify-between items-center gap-3">
                <div>
                  <h4 className="font-bold text-white text-sm">{project.title}</h4>
                  <p className="text-xs text-muted-foreground truncate max-w-[200px]">{project.description}</p>
                </div>
                {project.tags && project.tags.length > 0 && (
                  <span className="text-xs font-semibold bg-accent/20 text-accent-foreground px-2.5 py-1 rounded-md shrink-0">
                    {project.tags[0]}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Services */}
        <div className="p-6 rounded-2xl bg-[#0d0d0e] border border-border/40 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-white">الخدمات الحالية</h3>
            <Link href="/admin/services" className="text-accent-purple text-xs hover:underline font-semibold">
              إدارة الخدمات
            </Link>
          </div>
          <div className="divide-y divide-border/20">
            {services.slice(0, 3).map((service) => (
              <div key={service.id} className="py-3 flex justify-between items-center gap-3">
                <div>
                  <h4 className="font-bold text-white text-sm">{service.title}</h4>
                  <p className="text-xs text-muted-foreground truncate max-w-xs">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
