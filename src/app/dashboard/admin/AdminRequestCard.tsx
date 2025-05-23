// src/app/(dashboard)/admin/AdminRequestCard.tsx
'use client'
import { RequestDoc } from '../../RequestsList'
import Image from 'next/image'
import { CalendarClock, Trash2, ArrowRight } from 'lucide-react'
import clsx from 'clsx'
import { doc, deleteDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useRouter } from 'next/navigation'

export default function AdminRequestCard(r: RequestDoc) {
  const router = useRouter()

  // только для pending — показываем две кнопки
  async function handleReject() {
    await deleteDoc(doc(db, 'requests', r.id))
  }

  async function handleNext() {
    // меняем status → 'accepted' (или свой текст для in-process)
    await updateDoc(doc(db, 'requests', r.id), {
      status: 'accepted'
    })
  }

  const isPending = r.status === 'pending'

  return (
    <article className={clsx(
      'relative rounded-3xl border-4 p-6 flex gap-6',
      'border-yellow-400 bg-yellow-50/40'
    )}>
      <div className="flex flex-col gap-1 flex-1">
        <h3 className="text-xl font-semibold">Ремонт #{r.id.slice(-4)}</h3>
        <p><b>Марка:</b> {r.brand}</p>
        <p><b>Модель:</b> {r.model}</p>
        <p><b>Коментарі:</b> {r.description}</p>
        <p><b>Спосіб зв’язку:</b> {r.contactMethod}, {r.contactValue}</p>
        <p><b>Адреса:</b> {r.address==='self'?'Доставлю сам':r.address}</p>
        <p className="mt-2 flex items-center gap-1 text-sm text-gray-600">
          <CalendarClock size={16}/> Очікує підтвердження
        </p>

        {isPending && (
          <div className="mt-4 flex gap-4">
            <button
              onClick={handleReject}
              className="rounded-full border border-red-500 px-4 py-2 text-red-500"
            >
              <Trash2 size={16}/> Відхилити
            </button>
            <button
              onClick={handleNext}
              className="rounded-full border border-green-500 bg-green-100 px-4 py-2 text-green-700"
            >
              <ArrowRight size={16}/> Наступний етап
            </button>
          </div>
        )}
      </div>

      {r.photos[0] && (
        <Image
          src={r.photos[0]}
          alt="photo"
          width={180}
          height={180}
          className="h-40 w-40 rounded-2xl object-cover"
        />
      )}

      <time className="absolute right-8 bottom-4 text-xs text-gray-500">
        {r.createdAt?.toDate().toLocaleString('uk-UA', {
          day: '2-digit', month: '2-digit', year: 'numeric',
          hour: '2-digit', minute: '2-digit',
        })}
      </time>
    </article>
  )
}
