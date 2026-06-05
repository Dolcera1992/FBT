'use client'

import React from 'react'
import { CARD_COLOR_PRESETS } from '@/lib/utils/colors'
import { Check } from 'lucide-react'

interface ColorPresetPickerProps {
  value?: string
  onChange: (presetId: string) => void
}

export function ColorPresetPicker({ value, onChange }: ColorPresetPickerProps) {
  return (
    <div className="space-y-3">
      <label className="block text-xs font-semibold text-foreground">تدرج الألوان المخصص (اختياري)</label>
      <div className="flex flex-wrap gap-3">
        {CARD_COLOR_PRESETS.map((preset) => {
          const isSelected = value === preset.id
          
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onChange(preset.id)}
              title={preset.name}
              className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                isSelected ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-[#0d0d0e]' : 'hover:scale-105 opacity-80 hover:opacity-100'
              }`}
              style={{ 
                background: `linear-gradient(135deg, ${preset.cssVars['--clr-accent']}, ${preset.cssVars['--clr-accent-deep']})`,
                boxShadow: isSelected ? `0 0 15px ${preset.cssVars['--clr-glow-strong']}` : 'none'
              }}
            >
              {isSelected && <Check className="w-5 h-5 text-white drop-shadow-md" />}
            </button>
          )
        })}
      </div>
      <p className="text-[11px] text-muted-foreground mt-2">
        اختر اللون الذي يتناسب مع هوية الخدمة/المشروع.
      </p>
    </div>
  )
}
