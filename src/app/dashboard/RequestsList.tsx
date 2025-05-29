'use client'
import { useEffect, useState } from 'react'
import {
  collection, query, where, orderBy, onSnapshot, Timestamp, limit as qLimit
} from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { db }       from '@/lib/firebase'
import RequestCard  from './RequestCard'
import Spinner      from '@/components/Spinner'

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

/**
 * Если `limit` передан → берём только N последних заявок,
 * иначе — подписываемся на все.
 */
export default function RequestsList({ limit }: { limit?: number } = {}) {
  const [docs,    setDocs   ] = useState<RequestDoc[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stopAuth = onAuthStateChanged(getAuth(), user => {
      if (!user) { setDocs([]); setLoading(false); return }

      /* базовый запрос */
      let q = query(
        collection(db, 'requests'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc'),
      )
      /* ограничиваем, если нужно показать только верхушку */
      if (limit) q = query(q, qLimit(limit))

      const stopSnap = onSnapshot(q, snap => {
        setDocs(
          snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<RequestDoc,'id'>) }))
        )
        setLoading(false)
      })

      return stopSnap
    })

    return stopAuth
  }, [limit])

  if (loading)     return <Spinner/>
  if (!docs.length)
    return (
      <p className="text-center text-gray-500 pt-20">
        У вас ще немає заявок 🙂
      </p>
    )

  return (
    <div className="space-y-4 pb-24">
      {docs.map(r => (
        <RequestCard
          key={r.id}
          {...r}
          /* Теперь наоборот:
             • если limit передан (главная страница → 2 заявки) → полный вид
             • если limit НЕ передан  (страница “/dashboard/all”)   → компактный */
          compact={!limit}
          {...r}
        />
      ))}
    </div>
  )
}
