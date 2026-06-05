import { getProjects } from '@/lib/api/projects'
import { HomepageSettings } from '@/lib/api/settings'

interface PortfolioProps {
  settings: HomepageSettings;
}

export async function Portfolio({ settings }: PortfolioProps) {
  const projects = await getProjects();

  return (
    <section id="portfolio" className="relative py-32 bg-background">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-accent-emerald rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-muted-foreground">
              {settings.portfolioSub}
            </span>
            <div className="w-3 h-3 bg-accent-blue rounded-full animate-pulse" />
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-8">
            <span className="block mb-2">{settings.portfolioTitle}</span>
          </h2>
          
          <p className="text-lg sm:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            {settings.portfolioDesc}
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {projects.map((project) => (
            <div key={project.id} className="relative bg-card border border-border rounded-3xl overflow-hidden elevated-shadow group flex flex-col">
              {/* Image Container */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={project.imageUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800'}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {project.badge && (
                  <div className="absolute top-4 right-4">
                    <span className="glass-effect rounded-xl px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
                      {project.badge}
                    </span>
                  </div>
                )}
              </div>

              {/* Project Details */}
              <div className="p-6 lg:p-8 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-accent-purple/10 text-accent-purple px-3 py-1 rounded-full text-xs font-medium">
                    {project.industry}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {project.client}
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-accent-blue transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed mb-6 flex-1 text-sm">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-xs font-medium bg-secondary text-secondary-foreground px-2.5 py-1 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}