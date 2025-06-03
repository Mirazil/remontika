// src/app/dashboard/page.tsx

'use client'

import { useState, useEffect } from 'react'
import PlusButton from "./PlusButton"
import RequestsList from "./RequestsList"
import DownButton from "./DownButton"
import "../globals.css"
import Fade from '@/client/components/Fade'

export default function Dashboard() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true)
    })
  }, [])

  return (
    <Fade show={isVisible} duration={300} onFadeOutComplete={() => {}}>
      <main className="px-4 py-8 max-w-7xl mx-auto">
        <RequestsList limit={2} />
        <PlusButton />
        <DownButton />
      </main>
    </Fade>
  )
}
