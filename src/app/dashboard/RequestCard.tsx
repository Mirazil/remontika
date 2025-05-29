// ───────── src/app/(dashboard)/RequestCard.tsx ─────────
'use client'

import Image   from 'next/image'
import clsx    from 'clsx'
import {
  Truck, Wrench, CheckCircle2, CalendarClock
} from 'lucide-react'
import { doc, updateDoc } from 'firebase/firestore'
import { db }             from '@/lib/firebase'
import type { RequestDoc } from './RequestsList'
import { JSX } from 'react'

/* палітра та піктограми для статусів */
const PALETTE: Record<
  string,
  { border:string; bg:string; icon:JSX.Element; label:string }
> = {
  pending : {
    border:'border-yellow-300', bg:'bg-yellow-50/40',
    icon:<CalendarClock size={16}/>, label:'Очікує підтвердження'
  },
  delivery_wait : {
    border:'border-blue-400', bg:'bg-blue-50/40',
    icon:<Truck size={16}/>, label:'Очікує початку доставки'
  },
  repair : {
    border:'border-blue-400', bg:'bg-blue-50/40',
    icon:<Wrench size={16}/>, label:'Процес ремонту'
  },
  repair_done : {
    border:'border-green-400', bg:'bg-green-50/40',
    icon:<Wrench size={16}/>, label:'Ремонт завершено'
  },
  courier_to_client : {
    border:'border-green-400', bg:'bg-green-50/40',
    icon:<Truck size={16}/>, label:'Кур’єр прямує до клієнта'
  },
  done : {
    border:'border-green-400', bg:'bg-green-50/40',
    icon:<CheckCircle2 size={16}/>, label:'Завершено'
  }
}

interface CardProps extends RequestDoc {
  compact?: boolean        // <—— новый проп
}

export default function RequestCard (r: CardProps) {
  const pal = PALETTE[r.status] ?? PALETTE.pending

  /* ===== компактный вариант (используется в “/dashboard/all”) ===== */
  if (r.compact) {
    return (
      <article
        className={clsx(
          'rounded-full border-2', pal.border, pal.bg,
          'px-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-8'
        )}
      >
        <div className="flex-1 ml-8 space-y-1">
          <h3 className="font-semibold">Ремонт #{r.id.slice(-4)}</h3>

          <div className="grid gap-x-8 gap-y-1 sm:grid-cols-2">
            <p><b>Марка:</b> {r.brand}</p>
            <p><b>Адреса:</b> {r.address==='self'?'Доставлю сам':r.address}</p>

            <p><b>Модель:</b> {r.model}</p>
            <p><b>Коментарі:</b> {r.description || '—'}</p>
          </div>

          <p className="text-sm italic text-gray-600">
            {r.contactMethod}, {r.contactValue}
          </p>
        </div>

        <time className="shrink-0 text-sm text-gray-500 mt-auto sm:mt-1">
          {r.createdAt?.toDate().toLocaleString('uk-UA',{
            day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'
          })}
        </time>
      </article>
    )
  }

  /* ===== подробная (старая) карточка ===== */
  async function confirmDone () {
    await updateDoc(doc(db,'requests',r.id),{ status:'done' })
  }

  return (
    <article
      className={clsx(
        'relative rounded-3xl border-4 p-6 flex gap-6',
        pal.border, pal.bg
      )}
    >
      <div className="flex flex-col gap-1 flex-1">
        <h3 className="text-xl font-semibold">Ремонт #{r.id.slice(-4)}</h3>

        <p><b>Марка:</b> {r.brand}</p>
        <p><b>Модель:</b> {r.model}</p>
        <p><b>Коментарі:</b> {r.description}</p>
        <p><b>Спосіб зв’язку:</b> {r.contactMethod}, {r.contactValue}</p>
        <p><b>Адреса:</b> {r.address==='self'?'Доставлю сам':r.address}</p>

        <p className="mt-3 flex items-center gap-2 text-sm text-gray-700">
          {pal.icon} {pal.label}
        </p>

        {r.status==='courier_to_client' && (
          <button
            onClick={confirmDone}
            className="
              mt-4 self-start flex items-center gap-2 rounded-full border-2
              border-green-600 bg-green-100 px-6 py-2 text-green-700
              hover:bg-green-200 transition
            "
          >
            Підтвердити отримання
          </button>
        )}
      </div>

      {r.photos[0] && (
        <Image
          src={r.photos[0]}
          alt=""
          width={180} height={180}
          className="h-40 w-40 rounded-2xl object-cover shrink-0 self-start"
        />
      )}

      <time className="absolute right-8 bottom-4 text-xs text-gray-500">
        {r.createdAt?.toDate().toLocaleString('uk-UA',{
          day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'
        })}
      </time>
    </article>
  )
}
