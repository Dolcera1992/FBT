'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import styles from './FezCard.module.css'

interface FezCardProps {
  title: string
  description: string
  imageUrl?: string
  icon?: React.ReactNode
  badges?: { text: string; type: 'cat' | 'sale' | 'new' | 'limited' }[]
  tags?: string[]
  href?: string
  actionLabel?: string
  onClick?: () => void
}

export function FezCard({
  title,
  description,
  imageUrl,
  icon,
  badges,
  tags,
  href = '#',
  actionLabel = 'عرض التفاصيل',
  onClick,
}: FezCardProps) {
  return (
    <div className={styles.fezCardWrapper}>
      <article className={styles.cardBody} aria-label={`${title} details`}>
        
        {/* Image / Icon Well */}
        <div className={styles.imgWrap}>
          {badges && badges.length > 0 && (
            <div className={styles.badges}>
              {badges.map((b, i) => (
                <span 
                  key={i} 
                  className={`${styles.badge} ${
                    b.type === 'cat' ? styles.badgeCat : 
                    b.type === 'sale' ? styles.badgeSale : 
                    b.type === 'new' ? styles.badgeCat : /* Map new to cat for now */
                    styles.badgeCat
                  }`}
                >
                  {b.text}
                </span>
              ))}
            </div>
          )}
          
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={title} 
              className={styles.projectImage} 
            />
          ) : (
            <div className={styles.imgIcon}>
              {icon}
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className={styles.content}>
          <h3 className={styles.name}>{title}</h3>
          <p className={styles.desc}>{description}</p>
        </div>

        {/* Footer Area */}
        <div className={styles.footer}>
          <div className={styles.rule} aria-hidden="true"></div>
          
          {onClick ? (
            <button onClick={(e) => { e.preventDefault(); onClick(); }} className={styles.btn} aria-label={`${actionLabel} ${title}`}>
              {actionLabel}
              <ArrowLeft className={styles.btnIcon} />
            </button>
          ) : (
            <Link href={href} className={styles.btn} aria-label={`${actionLabel} ${title}`}>
              {actionLabel}
              <ArrowLeft className={styles.btnIcon} />
            </Link>
          )}

          {/* Trust/Tags Row */}
          {tags && tags.length > 0 && (
            <div className={styles.trust} aria-label="Tags">
              {tags.map((tag, i) => (
                <div key={i} className={styles.trustItem}>
                  {tag}
                </div>
              ))}
            </div>
          )}
        </div>
      </article>
    </div>
  )
}
