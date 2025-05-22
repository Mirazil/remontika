// src/app/(dashboard)/RequestCard.tsx
'use client'
import { RequestDoc } from './RequestsList'
import Image from 'next/image'
import { CalendarClock } from 'lucide-react'
import clsx from 'clsx'

export default function RequestCard (r: RequestDoc) {
  /* кольори рамки / фону залежно від статусу */
  const palette = {
    pending  : { border: 'border-yellow-400', backdrop: 'bg-yellow-50/40' },
    accepted : { border: 'border-blue-400',   backdrop: 'bg-blue-50/40' },
    done     : { border: 'border-green-400',  backdrop: 'bg-green-50/40' },
  }[r.status as 'pending' | 'accepted' | 'done'] ?? { border: 'border-gray-300', backdrop: '' }

  return (
    <article
      className={clsx(
        'relative rounded-3xl border-4 p-6 flex gap-6',
        palette.border, palette.backdrop,
      )}
    >
      {/* текстова частина */}
      <div className="flex flex-col gap-1 flex-1">
        <h3 className="text-xl font-semibold">
          Ремонт #{r.id.slice(-4)}
        </h3>

        <p><b>Марка:</b> {r.brand}</p>
        <p><b>Модель:</b> {r.model}</p>
        <p><b>Коментарі:</b> {r.description}</p>
        <p><b>Спосіб зв’язку:</b> {r.contactMethod}, {r.contactValue}</p>
        <p><b>Адреса:</b> {r.address === 'self' ? 'Доставлю сам' : r.address}</p>

        {/* статус-текст */}
        {r.status === 'pending' && (
          <p className="mt-2 flex items-center gap-1 text-sm text-gray-600">
            <CalendarClock size={16} /> Очікує підтвердження
          </p>
        )}
      </div>

      {/* головне фото (перше) */}
      {r.photos[0] && (
        <Image
          src={r.photos[0]}
          alt="photo"
          width={180}
          height={180}
          className="h-40 w-40 rounded-2xl object-cover shrink-0 self-start"
        />
      )}

      {/* дата у правому нижньому куті */}
      <time className="absolute right-8 bottom-4 text-xs text-gray-500">
        {r.createdAt?.toDate().toLocaleString('uk-UA', {
          day: '2-digit', month: '2-digit', year: 'numeric',
          hour: '2-digit', minute: '2-digit',
        })}
      </time>
    </article>
  )
}
