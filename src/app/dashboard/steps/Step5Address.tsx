// src/app/(dashboard)/steps/Step5Address.tsx
'use client'

import { ChevronLeft, ChevronRight, Ban } from 'lucide-react'
import type { NewRequest } from '@/types/request'

interface Props {
  data: NewRequest
  setData: React.Dispatch<React.SetStateAction<NewRequest>>
  next: () => void
  back: () => void
}

/* -------------------------------------------------------------------------- */
/*                               COMPONENT                                    */
/* -------------------------------------------------------------------------- */

export default function Step5Address ({
  data,
  setData,
  next,
  back,
}: Props) {
  /* --- helpers --- */
  const save = (v: string) =>
    setData(prev => ({ ...prev, address: v, selfDelivery: false }))

  const toggleSelf = () =>
    setData(prev => ({
      ...prev,
      selfDelivery: !prev.selfDelivery,
      address: '',
    }))

  /* кнопка «далі» активна, якщо: введена адреса - або вибрано selfDelivery */
  const canNext = data.selfDelivery || data.address.trim().length > 3

  return (
    <>
      {/* заголовок */}
      <h2 className="mb-2 text-center text-2xl font-bold">
        Вкажіть свою адресу
      </h2>
      <p className="mb-8 text-center text-sm text-text/70">
        Кур’єр отримає ваш пристрій та&nbsp;доставить до нашого сервісу
      </p>

      {/* адресний інпут */}
      <input
        disabled={data.selfDelivery}
        value={data.address}
        onChange={(e) => save(e.target.value)}
        placeholder="вул. Солом’янська 7"
        className={`
          mx-auto mb-6 block w-80 rounded-full border
          border-[#2C79FF]/40 px-4 py-2 text-center outline-none
          focus:ring-2 focus:ring-[#2C79FF]
          ${data.selfDelivery && 'opacity-40'}
        `}
      />

      {/* або */}
      <p className="mb-4 text-center font-semibold">або</p>

      {/* кнопка «доставлю сам» */}
      <button
        type="button"
        onClick={toggleSelf}
        className={`
          mx-auto flex items-center gap-2 rounded-full border-2 px-6 py-2
          ${data.selfDelivery
            ? 'border-[#2C79FF] bg-[#2C79FF] text-white'
            : 'border-red-500 text-red-600 hover:bg-red-50'}
        `}
      >
        <Ban size={18} />
        Доставлю сам
      </button>

      {/* навігація */}
      <div className="relative mt-12 w-full">
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
          disabled={!canNext}
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


    </>
  )
}
