// src/app/(dashboard)/steps/Step4ContactFill.tsx
'use client'

import {
  Send,            // Telegram
  MessageCircle,   // Viber
  Smartphone,      // SMS
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

import type { NewRequest, ContactMethod } from '@/types/request'

interface Props {
  data: NewRequest
  setData: React.Dispatch<React.SetStateAction<NewRequest>>
  next: () => void
  back: () => void
}

/* -------------------------------------------------------------------------- */
/*                             icon + label helper                            */
/* -------------------------------------------------------------------------- */

const META: Record<
  ContactMethod,
  { icon: React.ReactNode; label: string; placeholder: string }
> = {
  telegram: {
    icon: <Send size={72} className="text-[#2C79FF]" />,
    label: 'Telegram',
    placeholder: '@username або +38(067)…',
  },
  viber: {
    icon: <MessageCircle size={72} className="text-[#7c4dff]" />,
    label: 'Viber',
    placeholder: '+38(067)…',
  },
  sms: {
    icon: <Smartphone size={72} className="text-[#2C79FF]" />,
    label: 'SMS',
    placeholder: '+38(067)…',
  },
}

/* -------------------------------------------------------------------------- */

export default function Step4ContactFill ({
  data,
  setData,
  next,
  back,
}: Props) {
  const meta = data.contactMethod ? META[data.contactMethod] : null

  if (!meta) {
    // теоретично не повинно statуватися, але на всяк випадок
    return (
      <div className="text-center">
        <p className="text-lg font-semibold text-red-600">
          Спосіб зв’язку не обрано
        </p>
      </div>
    )
  }

  const save = (v: string) =>
    setData(prev => ({ ...prev, contactValue: v }))

  return (
    <>
      {/* верхівка */}
      <p className="mb-2 text-center font-semibold">Ви обрали</p>
      <div className="mb-6 flex flex-col items-center gap-2">
        {meta.icon}
        <h3 className="text-xl font-bold">{meta.label}</h3>
      </div>

      {/* інпут */}
      <div className="flex flex-col items-center gap-2">
        <label className="text-center text-sm font-semibold text-[#303030]">
          Вкажіть посилання чи номер телефону
        </label>
        <input
          value={data.contactValue}
          onChange={(e) => save(e.target.value)}
          placeholder={meta.placeholder}
          className="
            w-80 rounded-full border border-[#2C79FF]/40 px-4 py-2
            text-center outline-none focus:ring-2 focus:ring-[#2C79FF]
          "
          required
        />
      </div>

      {/* навігація */}
      <div className="relative mt-10 w-full">
        {/* ← */}
        <button
          type="button"
          onClick={back}
          className="
            absolute left-0 top-1/2 -translate-y-1/2 flex h-12 w-12
            items-center justify-center rounded-full border-2 border-[#2C79FF]
            text-[#2C79FF] hover:bg-[#2C79FF]/10
          "
        >
          <ChevronLeft />
        </button>

        {/* → */}
        <button
          type="button"
          disabled={!data.contactValue.trim()}
          onClick={next}
          className="
            absolute right-0 top-1/2 -translate-y-1/2 flex h-12 w-12
            items-center justify-center rounded-full bg-[#2C79FF] text-white
            hover:bg-[#1D5CCA] disabled:opacity-40 disabled:cursor-not-allowed
          "
        >
          <ChevronRight />
        </button>
      </div>

      {/* лічильник */}
      <p className="mt-8 text-center text-xl font-semibold">4/6</p>
    </>
  )
}
