/* ───────── src/app/(dashboard)/steps/Step1SelectDevice.tsx ───────── */
'use client'

import {
  Smartphone,
  Tablet,
  Gamepad,
  Watch,
  Laptop,
  Monitor,
  ChevronRight,
} from 'lucide-react'
import type { NewRequest, DeviceType } from '@/types/request'
import { JSX } from 'react'

/* ——— справочник типов устройств ——— */
const DEVICES: { id: DeviceType; label: string; icon: JSX.Element }[] = [
  { id: 'phone',   label: 'Мобільний\nтелефон', icon: <Smartphone className="h-6 w-6" /> },
  { id: 'tablet',  label: 'Планшет',            icon: <Tablet     className="h-6 w-6" /> },
  { id: 'console', label: 'Ігрова\nконсоль',    icon: <Gamepad    className="h-6 w-6" /> },
  { id: 'watch',   label: 'Розумний\nгодинник', icon: <Watch      className="h-6 w-6" /> },
  { id: 'laptop',  label: 'Ноутбук',            icon: <Laptop     className="h-6 w-6" /> },
  { id: 'pc',      label: 'Компʼютер',          icon: <Monitor    className="h-6 w-6" /> },
]

export default function Step1SelectDevice({
  data,
  setData,
  next,
}: {
  data: NewRequest
  setData: React.Dispatch<React.SetStateAction<NewRequest>>
  next: () => void
}) {
  return (
    <>
      <h2 className="mb-6 text-2xl font-bold text-center">
        Що ремонтуємо/обслуговуємо?
      </h2>

      <div className="grid grid-cols-3 gap-6">
        {DEVICES.map((d) => (
          <button
            key={d.id}
            onClick={() => setData((s) => ({ ...s, device: d.id }))}
            className={`
              flex flex-col items-center justify-center gap-2 rounded-lg border-2 p-4
              text-sm whitespace-pre text-center
              ${data.device === d.id
                ? 'bg-[#2C79FF] text-white border-[#2C79FF]'
                : 'border-[#2C79FF]/50'}
            `}
          >
            {/* --- иконка строго по центру --- */}
            <span className="flex items-center justify-center h-8 w-8">
              {d.icon}
            </span>
            {d.label}
          </button>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          disabled={!data.device}
          onClick={next}
          className="rounded-full bg-[#2C79FF] p-3 text-white disabled:opacity-30"
        >
          <ChevronRight />
        </button>
      </div>
    </>
  )
}
