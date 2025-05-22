// src/app/(dashboard)/steps/Step3ContactChoose.tsx
'use client'

import {
  MessageCircle,
  Send,
  Smartphone,
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

const METHODS: {
  id: ContactMethod
  label: string
  icon: React.ReactNode
}[] = [
  { id: 'telegram', label: 'Telegram', icon: <Send size={56} /> },
  { id: 'viber',    label: 'Viber',    icon: <MessageCircle size={56} /> },
  { id: 'sms',      label: 'SMS',      icon: <Smartphone size={56} /> },
]

export default function Step3ContactChoose ({
  data,
  setData,
  next,
  back,
}: Props) {
  const choose = (id: ContactMethod) =>
    setData(prev => ({ ...prev, contactMethod: id }))

  return (
    <>
      <h2 className="mb-2 text-2xl font-bold text-center">
        Оберіть спосіб зв’язку
      </h2>
      <p className="-mt-1 mb-8 text-center text-sm text-[#303030]/60">
        (Стан звернення, повідомлення та інше)
      </p>

      {/* кнопки вибору */}
      <div className="mx-auto flex max-w-md items-start justify-between gap-6">
        {METHODS.map(m => (
          <button
            key={m.id}
            type="button"
            onClick={() => choose(m.id)}
            className={`
              flex w-32 flex-col items-center gap-2 rounded-lg p-4
              transition
              ${
                data.contactMethod === m.id
                  ? 'bg-[#dbe8ff] text-[#2C79FF]'
                  : 'text-[#303030]'
              }
            `}
          >
            {m.icon}
            <span className="font-semibold">{m.label}</span>
          </button>
        ))}
      </div>

      {/* навігація */}
      <div className="mt-10 flex w-full items-center justify-between">
        <button
          type="button"
          onClick={back}
          className="
            flex h-12 w-12 items-center justify-center
            rounded-full border-2 border-[#2C79FF] text-[#2C79FF]
            hover:bg-[#2C79FF]/10
          "
        >
          <ChevronLeft />
        </button>

        <span className="text-xl font-semibold">3/6</span>

        <button
          type="button"
          disabled={!data.contactMethod}
          onClick={next}
          className="
            flex h-12 w-12 items-center justify-center rounded-full
            bg-[#2C79FF] text-white hover:bg-[#1D5CCA]
            disabled:cursor-not-allowed disabled:opacity-40
          "
        >
          <ChevronRight />
        </button>
      </div>
    </>
  )
}
