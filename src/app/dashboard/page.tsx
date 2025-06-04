// src/app/dashboard/page.tsx

'use client'

import { useState, useEffect } from 'react'
import PlusButton from "./PlusButton"
import RequestsList from "./RequestsList"
import DownButton from "./DownButton"
import "../globals.css"
import Fade from '@/client/components/Fade'
import { collection, query, where, orderBy, onSnapshot, limit as qLimit } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { db } from '@/lib/firebase'

export default function Dashboard() {
  const [isVisible, setIsVisible] = useState(false)
  const [showDownBtn, setShowDownBtn] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true)
    })
  }, [])

  // determine if user has at least three requests to display the DownButton
  useEffect(() => {
    const stopAuth = onAuthStateChanged(getAuth(), user => {
      if (!user) { setShowDownBtn(false); return }

      const q = query(
        collection(db, 'requests'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc'),
        qLimit(3)
      )

      const unsub = onSnapshot(q, snap => {
        setShowDownBtn(snap.size >= 3)
      })

      return unsub
    })

    return stopAuth
  }, [])

  return (
    <Fade show={isVisible} duration={300} onFadeOutComplete={() => {}}>
      <main className="px-4 py-8 max-w-7xl mx-auto">
        <RequestsList limit={2} />
        <PlusButton />
        <DownButton />
        {showDownBtn && <DownButton />}
      </main>
    </Fade>
  )
}