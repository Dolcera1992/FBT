import { getServerSettings } from '@/lib/api/server-fetch'

export async function DynamicCssInjector() {
  const settings = await getServerSettings()

  const cardBgColor = settings.cardBgColor || '#1a0f24'
  const cardTextColor = settings.cardTextColor || '#f0e6ff'
  const cardAccentColor = settings.cardAccentColor || '#c084fc'
  
  // Map font name to variable
  const fontMap: Record<string, string> = {
    'cairo': 'var(--font-cairo)',
    'tajawal': 'var(--font-tajawal)',
    'almarai': 'var(--font-almarai)',
    'readex-pro': 'var(--font-readex-pro)',
    'ibm-plex': 'var(--font-ibm-plex)',
    'rubik': 'var(--font-rubik)',
  }
  
  const fontFamily = fontMap[settings.fontFamily || 'cairo'] || 'var(--font-cairo)'

  // Generate CSS string
  const css = `
    :root {
      --user-card-bg: ${cardBgColor};
      --user-card-text: ${cardTextColor};
      --user-card-accent: ${cardAccentColor};
      --user-font-family: ${fontFamily}, 'Syne', sans-serif;
    }
  `

  return (
    <style dangerouslySetInnerHTML={{ __html: css }} />
  )
}
