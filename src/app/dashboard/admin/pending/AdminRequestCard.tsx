/* ───────── src/app/dashboard/admin/pending/AdminRequestCard.tsx ───────── */
'use client'

import { useState }         from 'react'
import Image                from 'next/image'
import clsx                 from 'clsx'
import {
  Truck, Wrench, CheckCircle2, Ban, ArrowRight, X,
} from 'lucide-react'
import Spinner              from '@/client/components/Spinner'
import type { RequestDoc }  from '../in-process/page'
import { JSX }              from 'react'

/* палітра / підписи статусів */
const PALETTE: Record<string, {
  border:string; bg:string; icon:JSX.Element; label:string
}> = {
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
    border:'border-green-400', bg:'',
    icon:<CheckCircle2 size={16}/>, label:'Завершено'
  },
}

type Props = RequestDoc & {
  onReject:(id:string)=>void
  onNext :(id:string)=>void
}

export default function AdminRequestCard (p:Props) {
  const palette = PALETTE[p.status] ?? PALETTE.pending

  /* --- state для перегляду зображень --- */
  const [selected,  setSelected]  = useState(0)
  const [zoom,      setZoom]      = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const openZoom = (idx:number) => {
    setSelected(idx)
    setImgLoaded(false)
    setZoom(true)
  }

  /* показувати кнопки? */
  const showReject = p.status === 'pending'
  const showNext   = !['done','courier_to_client'].includes(p.status)

  return (
    <>
      {/* ---------------- картка ---------------- */}
      <article
        className={clsx(
          'relative rounded-3xl border-4 p-6 flex gap-6',
          palette.border, palette.bg,
        )}
      >

        {/* ---------- текст ---------- */}
        <div className="flex flex-col gap-1 flex-1">
          <h3 className="text-2xl font-semibold mb-2">
            Ремонт #{p.id.slice(-4)}
          </h3>

          <p><b>Марка:</b> {p.brand}</p>
          <p><b>Модель:</b> {p.model}</p>
          <p><b>Коментарі:</b> {p.description}</p>
          <p><b>Спосіб зв’язку:</b> {p.contactMethod}, {p.contactValue}</p>
          <p><b>Адреса:</b> {p.address==='self' ? 'Доставить сам' : p.address}</p>

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

        {/* ---------- фото + мініатюри ---------- */}
        {p.photos.length > 0 && (
          <div className="flex items-start gap-2 shrink-0 self-start">
            {/* основне фото */}
            <Image
              src={p.photos[selected]}
              alt=""
              width={180}
              height={180}
              priority
              onClick={() => openZoom(selected)}
              className="h-40 w-40 rounded-2xl object-cover cursor-pointer"
            />

            {/* вертикальна стрічка ескізів */}
            {p.photos.length > 1 && (
              <div className="flex flex-col gap-2">
                {p.photos.map((src,i) => (
                  <Image
                    key={i}
                    src={src}
                    alt=""
                    width={40}
                    height={40}
                    onClick={() => openZoom(i)}
                    className={clsx(
                      'h-10 w-10 rounded-lg object-cover cursor-pointer',
                      i===selected && 'ring-2 ring-[#2C79FF]',
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* дата */}
        <time className="absolute right-8 bottom-4 text-xs text-gray-500">
          {p.createdAt?.toDate().toLocaleString('uk-UA',{
            day:'2-digit',month:'2-digit',year:'numeric',
            hour:'2-digit',minute:'2-digit',
          })}
        </time>
      </article>

      {/* ----------------- модальне preview ---------------- */}
      {zoom && (
        <div
          className="
            fixed inset-0 z-50 flex items-center justify-center
            bg-black/60 backdrop-blur-sm
          "
          onClick={() => setZoom(false)}
        >
          {!imgLoaded && <Spinner />}

          <img
            src={p.photos[selected]}
            onLoad={() => setImgLoaded(true)}
            className={clsx(
              'max-h-[90vh] max-w-[90vw] rounded-lg transition-opacity',
              imgLoaded ? 'opacity-100' : 'opacity-0'
            )}
          />

          <button
            className="
              absolute top-4 right-4 flex h-10 w-10 items-center justify-center
              rounded-full bg-white text-gray-700
            "
            onClick={() => setZoom(false)}
          >
            <X />
          </button>
        </div>
      )}
    </>
  )
}
