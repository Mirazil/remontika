/* ───────── src/app/dashboard/admin/completed/page.tsx ───────── */
'use client'

import { useEffect, useRef, useState } from 'react'
import {
  collection, query, where, orderBy,
  limit, startAfter, getDocs, QueryDocumentSnapshot,
} from 'firebase/firestore'
import { db }              from '@/lib/firebase'
import Spinner              from '@/components/Spinner'
import DoneRequestCard      from './DoneRequestCard'

export type DoneDoc = {
  id: string
  brand: string
  model: string
  description: string
  address: string
  contactMethod: string
  contactValue: string
  createdAt: any              // Timestamp
}

const PAGE = 10           // размер страницы

export default function DonePage () {
  const [docs,   setDocs]   = useState<DoneDoc[]>([])
  const [cursor, setCursor] = useState<QueryDocumentSnapshot | null>(null)
  const [loading,setLoading]= useState(true)
  const [isLast, setIsLast] = useState(false)

  /* ---------- первый (единственный) автозапрос ---------- */
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      loadNext()
    }
  }, [])                                 // eslint-disable-line react-hooks/exhaustive-deps

  async function loadNext () {
    if (isLast) return
    setLoading(true)

    let q = query(
      collection(db, 'requests'),
      where('status', '==', 'done'),
      orderBy('createdAt', 'desc'),
      limit(PAGE),
    )
    if (cursor) q = query(q, startAfter(cursor))

    const snap = await getDocs(q)

    if (!snap.empty) {
      setDocs(prev => {
        const seen = new Set(prev.map(p => p.id))
        const fresh = snap.docs
          .filter(d => !seen.has(d.id))          // убираем повторы
          .map(d => ({ id: d.id, ...d.data() } as DoneDoc))

        return [...prev, ...fresh]
      })

      setCursor(snap.docs[snap.docs.length - 1])
      if (snap.docs.length < PAGE) setIsLast(true)
    } else {
      setIsLast(true)
    }

    setLoading(false)
  }

  if (loading && !docs.length) return <Spinner/>

  return (
    <div className="space-y-4 pb-32">
      {docs.map(d => <DoneRequestCard key={d.id} {...d} />)}

      {/* плавающая кнопка пагинации */}
      {!isLast && (
        <button
          onClick={loadNext}
          className="fixed bottom-8 right-8 flex h-12 w-12 items-center
                     justify-center rounded-full border-2 border-[#2C79FF]
                     bg-[#dbe8ff] text-lg font-semibold shadow"
        >
          {docs.length / PAGE + 1 /* номер следующей страницы */}
        </button>
      )}
    </div>
  )
}
