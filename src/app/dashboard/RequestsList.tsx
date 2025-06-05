/* ───────── src/app/dashboard/RequestsList.tsx ───────── */
'use client'

import { useEffect, useState, useRef, useLayoutEffect } from 'react'
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

/*
 * Кількість карток на «екрані». Для мобільних завжди показуємо 4,
 * на ширших екранах визначаємо динамічно, щоб уникнути вертикального
 * скролу на сторінці «Показати всі».
 */
const MOBILE_PAGE = 4

/**
 *  • якщо передано `limit` → беремо тільки N останніх, пагінації нет  
 *  • якщо `limit` не передано → виводимо всі, але дробимо їх по `PAGE`
 *  • якщо передано `limit` → беремо тільки N останніх, пагінації нет
 *  • якщо `limit` не передано → виводимо всі, але дробимо їх по `pageSize`
 */

export default function RequestsList(
  { limit, doneOnly = false }: { limit?: number; doneOnly?: boolean } = {}
) {
  const [docs,        setDocs]    = useState<RequestDoc[]>([])
  const [loading,     setLoading] = useState(true)
  const [pageSize,    setPageSize]= useState(MOBILE_PAGE)
  const containerRef  = useRef<HTMLDivElement>(null)

  /* --------------------- визначаємо pageSize --------------------- */
  useLayoutEffect(() => {
    if (limit) return

    const update = () => {
      if (window.innerWidth < 640) { // мобільні
        setPageSize(MOBILE_PAGE)
        return
      }
      const card = containerRef.current?.querySelector('article') as HTMLElement | null
      if (!card) return
      const cardHeight = card.offsetHeight + 16 // приблизний gap
      const rect = containerRef.current!.getBoundingClientRect()
      const available = window.innerHeight - rect.top - 100 // запас під пагінацію
      const n = Math.max(1, Math.floor(available / cardHeight))
      setPageSize(n)
    }

    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [docs, limit])

  /* ------------ сторінкова навігація (тільки коли limit немає) ------------ */
  const [page, setPage] = useState(0)          // 0-based номер активної сторінки
  const pages = limit
    ? [docs]                                   // одна «сторінка» без пагінації
    : Array.from({ length: Math.ceil(docs.length / pageSize) },
        (_, i) => docs.slice(i * pageSize, (i + 1) * pageSize))

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
      if (doneOnly) q = query(q, where('status', '==', 'done'))

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
  }, [limit, doneOnly])

  /* ----------- UI ----------- */
  if (loading) return <Spinner/>

  if (!docs.length)
    return <p className="pt-20 text-center text-gray-500 whitespace-pre-line">
      Будь ласка, перед створенням першої заявки перейдіть у Метод повідомлення та підключить бота. У вас ще немає заявок 🙂
    </p>

  return (
    <div ref={containerRef} className="relative space-y-4" data-requests-list>
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
