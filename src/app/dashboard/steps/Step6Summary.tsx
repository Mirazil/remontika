/* ───────── src/app/(dashboard)/steps/Step6Summary.tsx ───────── */
'use client'

import {
  ChevronLeft,
  Check,
} from 'lucide-react'
import type { NewRequest } from '@/types/request'

interface Props {
  data: NewRequest
  back: () => void
  submit: () => Promise<void>
  loading: boolean
}

/* -------------------------------------------------------------------------- */
/*                               COMPONENT                                    */
/* -------------------------------------------------------------------------- */

export default function Step6Summary({
  data,
  back,
  submit,
  loading,
}: Props) {
  /* зручний мап-переказ для назви пристрою */
  const deviceLabel: Record<NonNullable<NewRequest['device']>, string> = {
    phone: 'мобільний телефон',
    tablet: 'планшет',
    console: 'ігрова консоль',
    watch: 'розумний годинник',
    laptop: 'ноутбук',
    pc: 'компʼютер',
  }

  return (
    /* relative — щоб коректно розмістити стрілки */
    <div className="relative mx-auto w-full max-w-[620px] px-10 py-12">
      <h2 className="mb-8 text-center text-2xl font-bold">
        Перевірте інформацію
      </h2>

      {/* ---------------- таблиця-зведення ---------------- */}
      <div className="mx-auto flex max-w-[480px] flex-col gap-3 text-sm">
        <Row label="Ремонт:"        value={deviceLabel[data.device!]} />
        <Row label="Марка/модель:" value={`${data.brand} ${data.model}`} />
        <Row label="Коментарі:"     value={data.description} />

        {data.photos.length > 0 && (
          <div className="flex items-start gap-2">
            <span className="w-[110px] shrink-0 text-right font-semibold">Фото:</span>
            <div className="flex gap-2">
              {data.photos.map((f, i) => (
                <img
                  key={i}
                  src={URL.createObjectURL(f)}
                  alt={`photo-${i + 1}`}
                  className="h-16 w-16 rounded-md object-cover"
                />
              ))}
            </div>
          </div>
        )}

        <Row
          label="Спосіб зв’язку:"
          value={`${data.contactMethod}, ${data.contactValue}`}
        />
        <Row
          label="Адреса:"
          value={data.selfDelivery ? 'Доставлю сам' : data.address}
        />
      </div>

      {/* ---------------- навігація ---------------- */}
      <form className='mt-10'
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
      >
        {/* ← назад */}
        <button
          type="button"
          onClick={back}
          className="
            absolute bottom-6 left-6 flex h-12 w-12 items-center justify-center
            rounded-full border-2 border-[#2C79FF] text-[#2C79FF]
            hover:bg-[#2C79FF]/10
          "
        >
          <ChevronLeft />
        </button>

        {/* ✓ підтвердити */}
        <button
          type="submit"
          disabled={loading}
          className="
            absolute bottom-6 right-6 flex h-12 w-12 items-center justify-center
            rounded-full bg-[#2C79FF] text-white hover:bg-[#1D5CCA]
            disabled:cursor-not-allowed disabled:opacity-40
          "
        >
          <Check size={26} />
        </button>
      </form>

    </div>
  )
}

/* ---------------------------- helper row ---------------------------- */
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex text-right ">
      <span className="w-[110px] mr-1 shrink-0 font-semibold">{label}</span>
      <span className="break-all">{value}</span>
    </div>
  )
}
