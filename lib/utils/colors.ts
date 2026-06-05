export interface ColorPreset {
  id: string;
  name: string;
  cssVars: {
    '--clr-accent': string;
    '--clr-accent-deep': string;
    '--clr-glow': string;
    '--clr-glow-strong': string;
  };
}

export const CARD_COLOR_PRESETS: ColorPreset[] = [
  {
    id: 'purple-neon',
    name: 'النيون البنفسجي',
    cssVars: {
      '--clr-accent': '#c084fc',
      '--clr-accent-deep': '#9333ea',
      '--clr-glow': 'rgba(192, 132, 252, 0.28)',
      '--clr-glow-strong': 'rgba(192, 132, 252, 0.60)',
    }
  },
  {
    id: 'ocean-aqua',
    name: 'محيط الأكوا',
    cssVars: {
      '--clr-accent': '#38bdf8',
      '--clr-accent-deep': '#0284c7',
      '--clr-glow': 'rgba(56, 189, 248, 0.28)',
      '--clr-glow-strong': 'rgba(56, 189, 248, 0.60)',
    }
  },
  {
    id: 'emerald-glow',
    name: 'الزمرد الساطع',
    cssVars: {
      '--clr-accent': '#34d399',
      '--clr-accent-deep': '#059669',
      '--clr-glow': 'rgba(52, 211, 153, 0.28)',
      '--clr-glow-strong': 'rgba(52, 211, 153, 0.60)',
    }
  },
  {
    id: 'fire-flame',
    name: 'النار المشتعلة',
    cssVars: {
      '--clr-accent': '#fb923c',
      '--clr-accent-deep': '#ea580c',
      '--clr-glow': 'rgba(251, 146, 60, 0.28)',
      '--clr-glow-strong': 'rgba(251, 146, 60, 0.60)',
    }
  },
  {
    id: 'royal-gold',
    name: 'الذهب الملكي',
    cssVars: {
      '--clr-accent': '#facc15',
      '--clr-accent-deep': '#ca8a04',
      '--clr-glow': 'rgba(250, 204, 21, 0.28)',
      '--clr-glow-strong': 'rgba(250, 204, 21, 0.60)',
    }
  },
  {
    id: 'cyberpunk',
    name: 'سايبر بانك',
    cssVars: {
      '--clr-accent': '#f472b6',
      '--clr-accent-deep': '#db2777',
      '--clr-glow': 'rgba(244, 114, 182, 0.28)',
      '--clr-glow-strong': 'rgba(244, 114, 182, 0.60)',
    }
  },
  {
    id: 'rose-pink',
    name: 'الورد الجوري',
    cssVars: {
      '--clr-accent': '#fb7185',
      '--clr-accent-deep': '#e11d48',
      '--clr-glow': 'rgba(251, 113, 133, 0.28)',
      '--clr-glow-strong': 'rgba(251, 113, 133, 0.60)',
    }
  },
  {
    id: 'sunset',
    name: 'شروق الشمس',
    cssVars: {
      '--clr-accent': '#f43f5e',
      '--clr-accent-deep': '#9f1239',
      '--clr-glow': 'rgba(244, 63, 94, 0.28)',
      '--clr-glow-strong': 'rgba(244, 63, 94, 0.60)',
    }
  },
  {
    id: 'midnight-blue',
    name: 'أزرق منتصف الليل',
    cssVars: {
      '--clr-accent': '#60a5fa',
      '--clr-accent-deep': '#1e3a8a',
      '--clr-glow': 'rgba(96, 165, 250, 0.28)',
      '--clr-glow-strong': 'rgba(96, 165, 250, 0.60)',
    }
  },
  {
    id: 'forest-green',
    name: 'الأخضر الغابي',
    cssVars: {
      '--clr-accent': '#a3e635',
      '--clr-accent-deep': '#4d7c0f',
      '--clr-glow': 'rgba(163, 230, 53, 0.28)',
      '--clr-glow-strong': 'rgba(163, 230, 53, 0.60)',
    }
  }
];

export function getPresetCssVars(presetId?: string): React.CSSProperties | undefined {
  if (!presetId) return undefined;
  const preset = CARD_COLOR_PRESETS.find(p => p.id === presetId);
  return preset ? (preset.cssVars as React.CSSProperties) : undefined;
}
