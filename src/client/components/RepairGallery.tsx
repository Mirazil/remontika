// src/components/RepairGallery.tsx
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import clsx from 'clsx'

// Список вкладок
const TABS = [
  { id: 'smartphones', label: 'Смартфони' },
  { id: 'notebooks',   label: 'Ноутбуки'  },
  { id: 'tablets',     label: 'Планшети'  },
] as const

// Словарь URL-ов для каждой вкладки
const IMAGES: Record<(typeof TABS)[number]['id'], string[]> = {
  smartphones: [
    '/images/repair_results/smartphones/brokensmart1.png',
    '/images/repair_results/smartphones/brokensmart2.png',
  ],
  notebooks: [
    '/images/repair_results/notebooks/brokenlaptop1.png',
    '/images/repair_results/notebooks/brokenlaptop2.png',
  ],
  tablets: [
    '/images/repair_results/tablets/brokentablet1.png',
    '/images/repair_results/tablets/brokentablet2.png',
  ],
}

export default function RepairGallery() {
  const [active, setActive] = useState<(typeof TABS)[number]['id']>('smartphones')

  // Предзагрузка изображений при первом маунте
  useEffect(() => {
    Object.values(IMAGES).forEach(arrayOfUrls => {
      arrayOfUrls.forEach((src) => {
        const img = new window.Image()
        img.src = src
      })
    })
  }, [])

  return (
    <section id="works" className="mx-auto max-w-7xl px-4 py-24 scroll-mt-8">
      <h2 className="mb-8 text-center text-3xl font-extrabold text-text">
        Наші роботи говорять самі за себе
      </h2>

      {/* вкладки */}
      <div className="mb-12 flex justify-center gap-10">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={clsx(
              'text-lg font-semibold transition-colors',
              active === tab.id ? 'text-[#2C79FF]' : 'text-text/60 hover:text-text'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* колаж */}
      <div className="grid gap-8 sm:grid-cols-2">
        {IMAGES[active].map(src => (
          <Image
            key={src}
            src={src}
            alt=""
            width={600}
            height={400}
            className="w-full rounded-[30px] object-cover"
          />
        ))}
      </div>
    </section>
  )
}
