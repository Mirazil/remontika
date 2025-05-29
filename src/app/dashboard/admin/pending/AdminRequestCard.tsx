// ───────── src/app/dashboard/admin/pending/AdminRequestCard.tsx ─────────
'use client'
import Image      from 'next/image'
import clsx       from 'clsx'
import {
  Truck, Wrench, CheckCircle2, Ban, ArrowRight
} from 'lucide-react'
import type { RequestDoc } from '../in-process/page'
import { JSX } from 'react'

type Props = RequestDoc & {
  onReject:(id:string)=>void
  onNext :(id:string)=>void
}

/* палітра та піктограми для статусів */
const PALETTE: Record<string,{border:string;bg:string;icon:JSX.Element;label:string}> = {
  // очікує підтвердження
  pending : {
    border:'border-yellow-300', bg:'bg-yellow-50/40',
    icon:<Truck size={16}/>, label:'Очікує підтвердження'
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
    border:'border-green-400', bg:'',                   // вже не зустрінеться в адмін-панелі
    icon:<CheckCircle2 size={16}/>, label:'Завершено'
  }
}

export default function AdminRequestCard (p:Props){
  const palette = PALETTE[p.status] ?? PALETTE.pending

  /* чи показувати reject / next */
  const showReject = p.status === 'pending'
  const showNext = !['done', 'repair_done'].includes(p.status);

  return (
    <article
      className={clsx(
        'relative rounded-3xl border-4 p-6 flex gap-6',
        palette.border, palette.bg
      )}
    >
      {/* -------- текст -------- */}
      <div className="flex flex-col gap-1 flex-1">
        <h3 className="text-2xl font-semibold mb-2">Ремонт #{p.id.slice(-4)}</h3>

        <p><b>Марка:</b> {p.brand}</p>
        <p><b>Модель:</b> {p.model}</p>
        <p><b>Коментарі:</b> {p.description}</p>
        <p><b>Спосіб зв’язку:</b> {p.contactMethod}, {p.contactValue}</p>
        <p><b>Адреса:</b> {p.address==='self'?'Доставить сам':p.address}</p>

        {/* статус + кнопки */}
        <div className="mt-4 flex items-center justify-between gap-6 flex-wrap">
          <p className="flex items-center gap-2 text-ls text-gray-700">
            {palette.icon} {palette.label}
          </p>

          {showNext && (
            <div className="flex gap-4">
              {showReject && (
                <button
                  onClick={()=>p.onReject(p.id)}
                  className="flex items-center gap-2 rounded-full border-2
                             border-red-500 px-6 py-2 text-red-600 hover:bg-red-50"
                >
                  <Ban size={16}/> Відхилити
                </button>
              )}

              <button
                onClick={()=>p.onNext(p.id)}
                className="flex items-center gap-2 rounded-full border-2
                           border-green-600 bg-green-100 px-6 py-2
                           text-green-700 hover:bg-green-200"
              >
                <ArrowRight size={16}/> Наступний етап
              </button>
            </div>
          )}
        </div>
      </div>

      {/* фото */}
      {p.photos[0] && (
        <Image
          src={p.photos[0]}
          alt="photo"
          width={180}
          height={180}
          className="h-40 w-40 rounded-2xl object-cover shrink-0 self-start"
        />
      )}

      {/* дата */}
      <time className="absolute right-8 bottom-4 text-xs text-gray-500">
        {p.createdAt?.toDate().toLocaleString('uk-UA',{
          day:'2-digit', month:'2-digit', year:'numeric',
          hour:'2-digit', minute:'2-digit'
        })}
      </time>
    </article>
  )
}
