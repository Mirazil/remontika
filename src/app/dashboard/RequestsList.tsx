'use client'
import { useEffect, useState } from 'react'
import {
  collection, query, where, orderBy, onSnapshot, Timestamp,
} from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { db } from '@/lib/firebase'
import RequestCard from './RequestCard'

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

export default function RequestsList () {
  const [docs, setDocs] = useState<RequestDoc[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    /** ждём, пока Firebase Auth определит пользователя */
    const stopAuth = onAuthStateChanged(getAuth(), user => {
      /* если пользователь вышел — чистим список и останавливаем listener */
      if (!user) { setDocs([]); setLoading(false); return }

      const q = query(
        collection(db, 'requests'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      )

      const stopSnap = onSnapshot(q, snap => {
        setDocs(
          snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<RequestDoc,'id'>) }))
        )
        setLoading(false)
      })

      /* при разлогине отписываемся */
      return stopSnap
    })

    return stopAuth
  }, [])

  if (loading)
    return <p className="text-center text-gray-400 pt-20">Завантаження…</p>

  if (!docs.length)
    return <p className="text-center text-gray-500 pt-20">
             У вас ще немає заявок 🙂
           </p>

  return (
    <div className="space-y-4 pb-24">
      {docs.map(r => <RequestCard key={r.id} {...r} />)}
    </div>
  )
}
