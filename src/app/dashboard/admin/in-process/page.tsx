/* ───────── src/app/dashboard/admin/in-process/page.tsx ───────── */
'use client'

import { useEffect, useState }      from 'react'
import {
  collection, query, where,
  orderBy, onSnapshot, updateDoc, doc
} from 'firebase/firestore'
import { db }                       from '@/lib/firebase'
import Spinner                      from '@/components/Spinner'
import AdminRequestCard             from '../pending/AdminRequestCard'

export type RequestDoc = {
  id: string
  brand: string
  model: string
  description: string
  photos: string[]
  contactMethod: string
  contactValue: string
  address: string
  status: string
  createdAt: any     // Timestamp
}

/* послідовність етапів для кнопки «Наступний етап» */
const NEXT: Record<string,string|undefined> = {
  pending:           'delivery_wait',
  delivery_wait:     'repair',
  repair:            'repair_done',
  repair_done:       'courier_to_client',
  courier_to_client: 'done'
}

export default function InProcessPage () {
  const [docs,setDocs] = useState<RequestDoc[]>()

  /* слухаємо ВСІ заявки, status != 'pending' && status != 'done' */
  useEffect(()=>{
    const q = query(
      collection(db,'requests'),
      where('status','in',[
        'delivery_wait','repair','repair_done','courier_to_client'
      ]),
      orderBy('createdAt','desc')
    )
    return onSnapshot(q,snap=>{
      setDocs(snap.docs.map(d=>({ id:d.id, ...d.data() } as RequestDoc)))
    })
  },[])

  if (!docs)         return <Spinner/>
  if (!docs.length)  return <p className="pt-20 text-center text-gray-500">
                           Немає заявок у процесі 🚚
                         </p>

  /* helper-дії */
  const next = async(id:string,cur:string)=>{
    const nxt = NEXT[cur]
    if(!nxt) return           // вже останній статус
    await updateDoc(doc(db,'requests',id),{ status:nxt })
  }

  return (
    <div className="space-y-6 pb-24">
      {docs.map(r=>(
        <AdminRequestCard
          key={r.id}
          {...r}
          onReject={()=>{/* reject не показуємо -> no-op */}}
          onNext ={id=>next(id,r.status)}
        />
      ))}
    </div>
  )
}
