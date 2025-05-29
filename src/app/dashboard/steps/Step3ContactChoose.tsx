/* ───────── src/app/(dashboard)/steps/Step3ContactChoose.tsx ───────── */
'use client'

import Image       from 'next/image'
import {
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

/* ─── те же SVG-иконки, что й у /notifications ─── */
const METHODS: { id: ContactMethod; label: string; icon: string }[] = [
  { id: 'telegram', label: 'Telegram', icon: '/dashboard/icons/telegram.svg' },
  { id: 'viber',    label: 'Viber',    icon: '/dashboard/icons/viber.svg'    },
  { id: 'sms',      label: 'SMS',      icon: '/dashboard/icons/sms.svg'      },
]

export default function Step3ContactChoose({
  data,
  setData,
  next,
  back,
}: Props) {
  const choose = (id: ContactMethod) =>
    setData((p) => ({ ...p, contactMethod: id }))

  return (
    /* relative нужен для стрелок */
    <div className="relative mx-auto w-full max-w-[620px] px-10 py-12">
      <h2 className="mb-2 text-center text-2xl font-bold">
        Оберіть спосіб зв’язку
      </h2>
      <p className="-mt-1 mb-10 text-center text-sm text-[#303030]/60">
        (Стан звернення, повідомлення та інше)
      </p>

      {/* ───────── кнопки вибору ───────── */}
      <div className="mx-auto flex max-w-md items-start justify-between gap-8">
        {METHODS.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => choose(m.id)}
            className={`
              flex w-32 flex-col items-center gap-4 rounded-2xl p-6 transition
              ${
                data.contactMethod === m.id
                  ? "scale-105 bg-[#dbe8ff] shadow"
                  : "hover:bg-[#eef4ff]"
              }
            `}
          >
            <Image src={m.icon} alt="" width={72} height={72} />
            <span
              className={
                data.contactMethod === m.id
                  ? "font-semibold text-[#2C79FF]"
                  : "font-semibold text-[#303030]"
              }
            >
              {m.label}
            </span>
          </button>
        ))}
      </div>

      {/* ───────── навігація ───────── */}
      {/* ← */}
      <div className='mt-10'>
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

        {/* → */}
        <button
          type="button"
          disabled={!data.contactMethod}
          onClick={next}
          className="
          absolute bottom-6 right-6 flex h-12 w-12 items-center justify-center
          rounded-full bg-[#2C79FF] text-white hover:bg-[#1D5CCA]
          disabled:cursor-not-allowed disabled:opacity-40
        "
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}
