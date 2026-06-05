import { Hero } from '@/components/public/Hero'
import { Services } from '@/components/public/Services'
import { Portfolio } from '@/components/public/Portfolio'
import { Contact } from '@/components/public/Contact'
import { getServerProjects, getServerServices, getServerSettings } from '@/lib/api/server-fetch'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const [services, settings, projects] = await Promise.all([
    getServerServices(),
    getServerSettings(),
    getServerProjects()
  ]);
  
  return (
    <main className="min-h-screen bg-background">
      <Hero settings={settings} />
      <Services services={services} settings={settings} />
      <Portfolio projects={projects} settings={settings} />
      <Contact settings={settings} />
      
      {/* Simple Footer */}
      <footer className="py-8 text-center border-t border-border bg-black/40">
        <p className="text-muted-foreground text-sm font-sans">
          © {new Date().getFullYear()} FBT.sa. جميع الحقوق محفوظة.
        </p>
      </footer>
    </main>
  );
}
