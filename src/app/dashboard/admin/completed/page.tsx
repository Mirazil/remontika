/* ───────── src/app/dashboard/admin/completed/page.tsx ───────── */
'use client'

import { useEffect, useRef, useState } from 'react'
import {
  collection, query, where, orderBy,
  limit, startAfter, getDocs, QueryDocumentSnapshot,
} from 'firebase/firestore'
import { db }             from '@/lib/firebase'
import Spinner             from '@/client/components/Spinner'
import DoneRequestCard     from './DoneRequestCard'

export type DoneDoc = {
  id:            string
  brand:         string
  model:         string
  description:   string
  address:       string
  contactMethod: string
  contactValue:  string
  createdAt:     any          // Timestamp
}

const PAGE = 4                   // скільки карток на екрані

export default function DonePage () {
  /* ---------- state ---------- */
  const [docs,    setDocs   ] = useState<DoneDoc[]>([])
  const [cursor,  setCursor ] = useState<QueryDocumentSnapshot|null>(null)
  const [loading, setLoading] = useState(true)
  const [isLast , setIsLast ] = useState(false)

  /* пагінація */
  const [page, setPage] = useState(0)          // активна сторінка (0-based)

  /* ---------- перший автозапит ---------- */
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      loadNext()
    }
  }, [])                                        // eslint-disable-line react-hooks/exhaustive-deps

  /* ---------- завантаження наступної пачки ---------- */
  async function loadNext () {
    if (isLast) return
    setLoading(true)

    let q = query(
      collection(db, 'requests'),
      where   ('status', '==', 'done'),
      orderBy ('createdAt', 'desc'),
      limit   (PAGE),
    )
    if (cursor) q = query(q, startAfter(cursor))

    const snap = await getDocs(q)

    if (!snap.empty) {
      setDocs(prev => {
        const seen  = new Set(prev.map(p => p.id))
        const fresh = snap.docs
          .filter(d => !seen.has(d.id))         // прибираємо дублікати
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

  /* ---------- сторінки з уже завантажених карток ---------- */
  const pages = Array.from(
    { length: Math.ceil(docs.length / PAGE) },
    (_, i) => docs.slice(i * PAGE, (i + 1) * PAGE),
  )

  /* якщо адмін натиснув сторінку, якої ще немає — догружаємо */
  const goTo = async (idx:number) => {
    if (idx < pages.length) {           // уже є
      setPage(idx)
      return
    }
    /* доки не будемо мати потрібний chunks.length */
    while (!isLast && idx >= pages.length) {
      await loadNext()
    }
    setPage(Math.min(idx, pages.length - 1))
  }

  /* ---------- UI ---------- */
  if (loading && !docs.length) return <Spinner/>

  return (
    <div className="relative space-y-4 pb-32">
      {/* активна сторінка */}
      {pages[page]?.map(d => <DoneRequestCard key={d.id} {...d} />)}

      {/* пагінація */}
      {pages.length > 1 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {pages.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
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
          {/* кнопка «далі», якщо ще є дані у Firestore */}
          {!isLast && (
            <button
              onClick={() => goTo(page + 1)}
              className="flex h-10 w-10 items-center justify-center rounded-full
                         border-2 border-[#2C79FF]/60 hover:bg-[#eef4ff]"
            >
              {pages.length + 1}
            </button>
          )}
        </div>
      )}

      {/* overlay-loader під час догрузки чергової пачки */}
      {loading && docs.length > 0 && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-white/40">
          <Spinner/>
        </div>
      )}
    </div>
  )
}
