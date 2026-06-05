import { Hero } from '@/components/public/Hero'
import { Services } from '@/components/public/Services'
import { Portfolio } from '@/components/public/Portfolio'
import { Contact } from '@/components/public/Contact'
import { getServices } from '@/lib/api/services'
import { getHomepageSettings } from '@/lib/api/settings'

export default async function Home() {
  const [services, settings] = await Promise.all([
    getServices(),
    getHomepageSettings()
  ]);
  
  return (
    <main className="min-h-screen bg-background">
      <Hero settings={settings} />
      <Services services={services} settings={settings} />
      <Portfolio settings={settings} />
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
