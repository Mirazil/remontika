// ───────── src/app/dashboard/admin/pending/page.tsx ─────────
/**
 * Admin «Очікують підтвердження»
 * - показує всі заявки зі статусом "pending"
 * - кнопка «Відхилити» — видаляє документ
 * - кнопка «Наступний етап» — переводить у статус
 *   "Очікує початку доставки" (waitingDelivery) і
 *   перекидывает в колекції «У процесі» у realtime‑UI
 */
'use client'

import { useEffect, useState } from 'react'
import { collection, query, where, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import Spinner from '@/components/Spinner'
import AdminRequestCard from './AdminRequestCard'

import type { Timestamp } from 'firebase/firestore'

export type RequestDoc = {
  id: string
  userId: string
  brand: string
  model: string
  description: string
  photos: string[]
  contactMethod: string
  contactValue: string
  address: string
  status: 'pending' | 'waitingDelivery' | 'inProgress' | 'done'
  createdAt: Timestamp | null
}

export default function PendingRequestsPage () {
  const [docs, setDocs] = useState<RequestDoc[]>()

  useEffect(() => {
    const q = query(collection(db, 'requests'), where('status', '==', 'pending'))
    return onSnapshot(q, snap => {
      setDocs(snap.docs.map(d => ({ id:d.id, ...(d.data() as Omit<RequestDoc,'id'>) })))
    })
  }, [])

  if (!docs) return <Spinner/>
  if (!docs.length) return <p className="text-center text-gray-400 pt-20">У вас ще немає заявок 🙂</p>

  /* ----- handlers (вынесены, чтобы не пересоздавать) ----- */
  const reject = (id:string) => deleteDoc(doc(db,'requests',id))
  const accept = (id:string) => updateDoc(doc(db,'requests',id),{ status:'delivery_wait' })

  return (
    <div className="space-y-6 pb-24">
      {docs.map(r => (
        <AdminRequestCard key={r.id} {...r} onReject={reject} onNext={accept}/>
      ))}
    </div>
  )
}
