// src/app/(dashboard)/admin/pending/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import AdminRequestCard from '../AdminRequestCard'
import Spinner from '@/components/Spinner'

export default function PendingPage() {
  const [docs, setDocs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(
      collection(db, 'requests'),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    )
    return onSnapshot(q, snap => {
      setDocs(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
  }, [])

  if (loading) return <Spinner/>
  if (!docs.length) return <p>Немає нових заявок.</p>

  return <div className="space-y-4">{docs.map(r => <AdminRequestCard key={r.id} {...r}/>)}</div>
}
