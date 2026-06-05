export interface ColorPreset {
  id: string;
  name: string;
  cssVars: {
    '--clr-accent': string;
    '--clr-accent-deep': string;
    '--clr-glow': string;
    '--clr-glow-strong': string;
    '--clr-card'?: string;
    '--clr-card-hover'?: string;
    '--clr-img-well'?: string;
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
      '--clr-card': '#1a0f24',
      '--clr-card-hover': '#1e1229',
      '--clr-img-well': '#110920'
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
      '--clr-card': '#0b1426',
      '--clr-card-hover': '#0f1b33',
      '--clr-img-well': '#060b15'
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
      '--clr-card': '#0a1a14',
      '--clr-card-hover': '#0d221a',
      '--clr-img-well': '#050f0c'
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
      '--clr-card': '#211005',
      '--clr-card-hover': '#291406',
      '--clr-img-well': '#140a03'
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
      '--clr-card': '#1f1a05',
      '--clr-card-hover': '#262006',
      '--clr-img-well': '#141103'
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
      '--clr-card': '#210c18',
      '--clr-card-hover': '#2b0f1f',
      '--clr-img-well': '#14070e'
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
      '--clr-card': '#240a10',
      '--clr-card-hover': '#2e0c14',
      '--clr-img-well': '#16060a'
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
      '--clr-card': '#210810',
      '--clr-card-hover': '#2c0b15',
      '--clr-img-well': '#14050a'
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
      '--clr-card': '#0b1120',
      '--clr-card-hover': '#0e1629',
      '--clr-img-well': '#060912'
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
      '--clr-card': '#0f1a08',
      '--clr-card-hover': '#14220b',
      '--clr-img-well': '#091005'
    }
  }
];

export function getPresetCssVars(presetId?: string): React.CSSProperties | undefined {
  if (!presetId) return undefined;
  const preset = CARD_COLOR_PRESETS.find(p => p.id === presetId);
  return preset ? (preset.cssVars as React.CSSProperties) : undefined;
}
