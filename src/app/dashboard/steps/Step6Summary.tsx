// src/app/(dashboard)/steps/Step6Summary.tsx
'use client'

import { ChevronLeft, Check } from 'lucide-react'
import type { NewRequest } from '@/types/request'

interface Props {
  data: NewRequest
  back: () => void
  submit: () => Promise<void>
  loading: boolean
}

export default function Step6Summary (props: Props) {
  const { data, back, submit, loading } = props
  /** красиво перетворюємо код пристрою → текст */
  const deviceLabel: Record<NonNullable<NewRequest['device']>, string> = {
    phone   : 'мобільний телефон',
    tablet  : 'планшет',
    console : 'ігрова консоль',
    watch   : 'розумний годинник',
    laptop  : 'ноутбук',
    pc      : 'компʼютер',
  }

  return (
    <>
      {/* заголовок */}
      <h2 className="mb-8 text-center text-2xl font-bold">
        Перевірте інформацію
      </h2>

      {/* таблиця-зведення */}
      <div className="mx-auto flex max-w-[480px] flex-col gap-3 text-sm">
        <Row label="Ремонт:"         value={deviceLabel[data.device!]} />
        <Row label="Марка/модель:"  value={`${data.brand} ${data.model}`} />
        <Row label="Коментарі:"      value={data.description} />

        {/* фото, якщо є */}
        {data.photos.length > 0 &&
          <div className="flex items-start gap-2">
            <span className="w-[110px] shrink-0 font-semibold">Фото:</span>
            <div className="flex gap-2">
              {data.photos.map((f, i) => (
                <img
                  key={i}
                  src={URL.createObjectURL(f)}
                  className="h-16 w-16 rounded-md object-cover"
                  alt={`photo-${i + 1}`}
                />
              ))}
            </div>
          </div>
        }

        <Row
          label="Спосіб зв’язку:"
          value={`${data.contactMethod}, ${data.contactValue}`}
        />

        <Row
          label="Адреса:"
          value={data.selfDelivery ? 'Доставлю сам' : data.address}
        />
      </div>

      <form
        onSubmit={e => {             // ✔  submit через form-submit
          e.preventDefault()
          submit()                   //   викликає addDoc → onClose()
        }}
        className="relative mt-10 w-full"
      >
        {/* ← назад */}
        <button type="button" onClick={back} className="absolute left-0 …">
          <ChevronLeft/>
        </button>

        {/* ✓ підтвердити */}
        <button
          type="submit"              // ← type="submit", а не button
          disabled={loading}
          className="absolute right-0 … disabled:opacity-40"
        >
          <Check size={28}/>
        </button>
      </form>

      {/* лічильник тут залишився, другий ми приберемо у модалці */}
      <p className="mt-8 text-center text-xl font-semibold">6 / 6</p>
    </>
  )
}

/* ---------------------------- helper row ---------------------------- */

function Row ({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex">
      <span className="w-[110px] shrink-0 font-semibold">{label}</span>
      <span className="break-all">{value}</span>
    </div>
  )
}
