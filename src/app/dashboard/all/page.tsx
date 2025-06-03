// src/app/dashboard/all/page.tsx
'use client'

import { useState, useEffect } from 'react'
import RequestsList from '../RequestsList'
import Fade from '@/client/components/Fade'

export default function AllRequestsPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Запускаем fade-in после монтирования
    requestAnimationFrame(() => {
      setIsVisible(true)
    })
  }, [])

  return (
    <Fade show={isVisible} duration={300} onFadeOutComplete={() => {}}>
      <main className="px-4 py-8 max-w-7xl mx-auto">
        <RequestsList />    {/* без limit → полный список с пагинацией */}
      </main>
    </Fade>
  )
}
