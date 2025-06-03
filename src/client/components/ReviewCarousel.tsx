'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const IMAGES = [
  '/reviews/rev1.png',
  '/reviews/rev2.png',
  '/reviews/rev3.png',
  '/reviews/rev4.png',
  '/reviews/rev5.png',
]

export default function ReviewCarousel() {
  const [idx, setIdx] = useState(0)
  const count = IMAGES.length

  const prev = () => {
    setIdx(i => (i - 1 + count) % count)
  }

  const next = () => {
    setIdx(i => (i + 1) % count)
  }

  return (
    <section id="reviews" className="mx-auto max-w-5xl px-4 py-4 scroll-mt-24">
      <h2 className="mb-8 text-center text-3xl font-extrabold text-text">
        Відгуки
      </h2>

      <div className="relative flex items-center justify-center">
        {/* Prev */}
        <button
          onClick={prev}
          className="z-20 rounded-full bg-white p-2 shadow-md hover:bg-gray-100"
        >
          <ChevronLeft size={24} className="text-text/60" />
        </button>

        {/* «Окно» шириной под 2 карточки (вместо одной) */}
        <div
          className="
            mx-4 overflow-hidden
            w-[600px] h-[300px]              /* мобильная «рамка»: 2×300px */
            md:w-[800px] md:h-[400px]        /* desktop: 2×400px */
          "
        >
          {/* flex-контейнер, который смещается процентовкой */}
          <div
            className="flex transition-transform duration-300"
            style={{
              // Каждый шаг idx сдвигает на (100 / count)% от общей ширины flex-контейнера
              // Это ровно ширине одной карточки, поскольку flex-контейнер = count×cardWidth
              transform: `translateX(-${(idx * 100) / count}%)`
            }}
          >
            {IMAGES.map((src, i) => (
              <div
                key={i}
                className="
                  flex-none
                  w-[300px] h-[300px]        /* карточка 300×300 на моб */
                  md:w-[400px] md:h-[400px]  /* карточка 400×400 на desktop */
                  p-2
                "
              >
                <Image
                  src={src}
                  alt={`Review ${i + 1}`}
                  width={400}
                  height={400}
                  className="object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Next */}
        <button
          onClick={next}
          className="z-20 rounded-full bg-white p-2 shadow-md hover:bg-gray-100"
        >
          <ChevronRight size={24} className="text-text/60" />
        </button>
      </div>
    </section>
  )
}
