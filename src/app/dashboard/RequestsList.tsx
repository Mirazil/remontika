/* ───────── src/app/dashboard/RequestsList.tsx ───────── */
'use client'

import { useEffect, useState } from 'react'
import {
  collection, query, where, orderBy,
  onSnapshot, Timestamp, limit as qLimit
} from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { db }       from '@/lib/firebase'
import RequestCard  from './RequestCard'
import Spinner      from '@/client/components/Spinner'

export type RequestDoc = {
  id:            string
  device:        string
  brand:         string
  model:         string
  description:   string
  photos:        string[]
  contactMethod: string
  contactValue:  string
  address:       string
  status:        string
  createdAt:     Timestamp | null
}

/* скільки карток на «екрані» на сторінці /dashboard/all */
const PAGE = 4

/**
 *  • якщо передано `limit` → беремо тільки N останніх, пагінації нет  
 *  • якщо `limit` не передано → виводимо всі, але дробимо їх по `PAGE`
 */
export default function RequestsList({ limit }: { limit?: number } = {}) {
  const [docs,        setDocs]   = useState<RequestDoc[]>([])
  const [loading,     setLoading]= useState(true)

  /* ------------ сторінкова навігація (тільки коли limit немає) ------------ */
  const [page, setPage] = useState(0)          // 0-based номер активної сторінки
  const pages = limit
    ? [docs]                                   // одна «сторінка» без пагінації
    : Array.from({ length: Math.ceil(docs.length / PAGE) },
        (_, i) => docs.slice(i * PAGE, (i + 1) * PAGE))

  /* -------------------- Firestore subscription -------------------- */
  useEffect(() => {
    const stop = onAuthStateChanged(getAuth(), user => {
      if (!user) { setDocs([]); setLoading(false); return }

      let q = query(
        collection(db, 'requests'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc'),
      )
      if (limit) q = query(q, qLimit(limit))

      const unsub = onSnapshot(q, snap => {
        setDocs(
          snap.docs.map(d => ({
            id: d.id,
            ...(d.data() as Omit<RequestDoc, 'id'>),
          }))
        )
        setLoading(false)
      })
      return unsub
    })
    return stop
  }, [limit])

  /* ----------- UI ----------- */
  if (loading) return <Spinner/>

  if (!docs.length)
    return <p className="pt-20 text-center text-gray-500">
      Будь ласка, перед створенням першої заявки перейдіть у Метод повідомлення та підключить бота. У вас ще немає заявок 🙂
    </p>

  return (
    <div className="relative space-y-4">
      {/* активна сторінка  */}
      {pages[page].map(r => (
        <RequestCard
          /* compact — тільки коли limit НЕ заданий */
          compact={!limit}
          key={r.id}
          {...r}
        />
      ))}

      {/* пагінація — тільки коли сторінок більше однієї */}
      {pages.length > 1 && (
        <div className="fixed bottom-8 left-1/2 z-10 -translate-x-1/2 flex gap-3">
          {pages.map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`
                flex h-10 w-10 items-center justify-center rounded-full border-2
                ${i === page
                  ? 'border-[#2C79FF] bg-[#dbe8ff] font-semibold text-[#2C79FF]'
                  : 'border-[#2C79FF]/60 hover:bg-[#eef4ff]'}
              `}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
