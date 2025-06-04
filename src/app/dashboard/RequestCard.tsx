/* ───────── src/app/(dashboard)/RequestCard.tsx ───────── */
'use client'

import { useState } from 'react'
import Image        from 'next/image'
import clsx         from 'clsx'
import {
  Truck,
  Wrench,
  CheckCircle2,
  CalendarClock,
  X,
} from 'lucide-react'
import { doc, updateDoc } from 'firebase/firestore'
import { db }             from '@/lib/firebase'
import type { RequestDoc } from './RequestsList'
import { JSX }            from 'react'
import Spinner from '@/client/components/Spinner'

/* палітра статусів */
const PALETTE: Record<
  string,
  { border: string; bg: string; icon: JSX.Element; label: string; shadow: string }
> = {
  pending: {
    border: 'border-yellow-300',
    bg: 'bg-yellow-50/40',
    icon: <CalendarClock size={16} />,
    label: 'Очікує підтвердження',
    shadow: 'shadow-[0_4px_4px_rgba(253,224,71,0.4)]',
  },
  delivery_wait: {
    border: 'border-blue-400',
    bg: 'bg-blue-50/40',
    icon: <Truck size={16} />,
    label: 'Очікує початку доставки',
    shadow: 'shadow-[0_4px_4px_rgba(96,165,250,0.4)]',
  },
  repair: {
    border: 'border-blue-400',
    bg: 'bg-blue-50/40',
    icon: <Wrench size={16} />,
    label: 'Процес ремонту',
    shadow: 'shadow-[0_4px_4px_rgba(96,165,250,0.4)]',
  },
  repair_done: {
    border: 'border-green-400',
    bg: 'bg-green-50/40',
    icon: <Wrench size={16} />,
    label: 'Ремонт завершено',
    shadow: 'shadow-[0_4px_4px_rgba(74,222,128,0.4)]',
  },
  courier_to_client: {
    border: 'border-green-400',
    bg: 'bg-green-50/40',
    icon: <Truck size={16} />,
    label: 'Кур’єр прямує до клієнта',
    shadow: 'shadow-[0_4px_4px_rgba(74,222,128,0.4)]',
  },
  done: {
    border: 'border-green-400',
    bg: 'bg-green-50/40',
    icon: <CheckCircle2 size={16} />,
    label: 'Завершено',
    shadow: 'shadow-[0_4px_4px_rgba(74,222,128,0.4)]',
  },
}

interface CardProps extends RequestDoc {
  compact?: boolean
}

export default function RequestCard(r: CardProps) {
  const pal = PALETTE[r.status] ?? PALETTE.pending

  
  /* ---------------- state для preview ---------------- */
  const [selected,  setSelected]  = useState(0)     // активне фото
  const [zoom,      setZoom]      = useState(false) // показ модалки
  const [imgLoaded, setImgLoaded] = useState(false) // чи завантажилась <img>
  
    const openZoom = (idx: number) => {
    setSelected(idx)
    setImgLoaded(false)   // починаємо з «loader»
    setZoom(true)
  }

  /* ------------------------------------------------------------------ */
  /*  компактий режим (використовується у “/dashboard/all”)              */
  /* ------------------------------------------------------------------ */
  if (r.compact) {
    return (
      <article
        className={clsx(
          "rounded-full border-2",
          pal.border,
          pal.bg,
          pal.shadow,
          "px-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-8"
        )}
      >
        <div className="flex-1 ml-8 space-y-1">
          <h3 className="font-semibold">Ремонт #{r.id.slice(-4)}</h3>

          <div className="grid gap-x-8 gap-y-1 sm:grid-cols-2">
            <p>
              <b>Марка:</b> {r.brand}
            </p>
            <p>
              <b>Модель:</b> {r.model}
            </p>
            <p>
              <b>Коментарі:</b> {r.description || "—"}
            </p>
            <p>
              <b>Адреса:</b> {r.address === "self" ? "Доставлю сам" : r.address}
            </p>
          </div>

          <p className="text-sm italic text-gray-600">
            {r.contactMethod}, {r.contactValue}
          </p>
        </div>

        <time className="shrink-0 text-sm text-gray-500 mr-8 mt-auto sm:mt-1">
          {r.createdAt?.toDate().toLocaleString("uk-UA", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </time>
      </article>
    );
  }

  /* ------------------------------------------------------------------ */
  /*  докладна картка                                                   */
  /* ------------------------------------------------------------------ */



  async function confirmDone() {
    await updateDoc(doc(db, 'requests', r.id), { status: 'done' })
  }

  return (
    <>
      {/* --------------------- основний вміст картки ------------------- */}
      <article
        className={clsx(
          'relative rounded-3xl border-4 p-6 flex gap-6 flex-col sm:flex-row',
          pal.border,
          pal.bg,
          pal.shadow,
        )}
      >
        {/* -------- текст -------- */}
        <div className="flex flex-col gap-1 flex-1">
          <h3 className="text-xl font-semibold">Ремонт #{r.id.slice(-4)}</h3>

          <p>
            <b>Марка:</b> {r.brand}
          </p>
          <p>
            <b>Модель:</b> {r.model}
          </p>
          <p>
            <b>Коментарі:</b> {r.description}
          </p>
          <p>
            <b>Спосіб зв’язку:</b> {r.contactMethod}, {r.contactValue}
          </p>
          <p>
            <b>Адреса:</b> {r.address === 'self' ? 'Доставлю сам' : r.address}
          </p>

          {/* статус */}
          <p className="mt-3 flex items-center gap-2 text-sm text-gray-700">
            {pal.icon} {pal.label}
          </p>

          {/* кнопка підтвердження для користувача */}
          {r.status === 'courier_to_client' && (
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

        {/* -------- фото + мініатюри -------- */}
        {r.photos.length > 0 && (
          <div className="flex items-start gap-2 shrink-0 self-start">
            {/* головне фото */}
            <Image
              src={r.photos[selected]}
              alt=""
              width={180}
              height={180}
              priority
              onClick={() => openZoom(selected)}
              className="h-40 w-40 rounded-2xl object-cover cursor-pointer"
            />

            {/* ескізи */}
            {r.photos.length > 1 && (
              <div className="flex flex-col gap-2">
                {r.photos.map((p, i) => (
                  <Image
                    key={i}
                    src={p}
                    alt=""
                    width={40}
                    height={40}
                    onClick={() => openZoom(i)}
                    className={clsx(
                      'h-10 w-10 rounded-lg object-cover cursor-pointer',
                      i === selected && 'ring-2 ring-[#2C79FF]',
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* дата */}
        <time className="text-xs text-gray-500 sm:absolute sm:right-8 sm:bottom-4 mt-2 self-end">
          {r.createdAt?.toDate().toLocaleString('uk-UA', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </time>
      </article>

  {/* ----------------------- модальне збільшення ------------------- */}
  {zoom && (
    <div
      className="
        fixed inset-0 z-50 flex items-center justify-center
        bg-black/60 backdrop-blur-sm
      "
      onClick={() => setZoom(false)}
    >
      {/* spinner поки <img> не заванта­житься */}
      {!imgLoaded && <Spinner />}

      <img
        src={r.photos[selected]}
        onLoad={() => setImgLoaded(true)}
        className={clsx(
          'max-h-[90vh] max-w-[90vw] rounded-lg transition-opacity',
          imgLoaded ? 'opacity-100' : 'opacity-0'
        )}
      />

      {/* кнопка закриття */}
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
