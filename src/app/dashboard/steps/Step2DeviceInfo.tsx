// src/app/(dashboard)/steps/Step2DeviceInfo.tsx
'use client'

import { useRef, useState, type ChangeEvent } from 'react'
import { ImagePlus, ChevronLeft, ChevronRight } from 'lucide-react'
import type { NewRequest } from '@/types/request'

interface Props {
  data: NewRequest
  setData: React.Dispatch<React.SetStateAction<NewRequest>>
  next: () => void
  back: () => void
}

export default function Step2DeviceInfo({
  data,
  setData,
  next,
  back,
}: Props) {
  const fileInput = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)

  // обработчик добавления фото
  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    // добавляем в массив photos
    setData((prev) => ({
      ...prev,
      photos: [...prev.photos, file],
    }))
    setPreview(URL.createObjectURL(file))
  }

  return (
    <div className="w-full max-w-[620px] px-10 py-12">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          next()
        }}
        className="flex flex-col items-center gap-6"
      >
        {/* ───── Бренд ───── */}
        <label className="flex w-80 flex-col gap-1 text-center text-sm font-semibold text-[#303030]">
          Яка марка вашого пристрою?
          <input
            type="text"
            required
            placeholder="Samsung, Apple, Xiaomi…"
            value={data.brand}
            onChange={(e) =>
              setData((prev) => ({ ...prev, brand: e.target.value }))
            }
            className="rounded-full border border-[#2C79FF]/40 px-4 py-2 text-center outline-none focus:ring-2 focus:ring-[#2C79FF]"
          />
        </label>

        {/* ───── Модель ───── */}
        <label className="flex w-80 flex-col gap-1 text-center text-sm font-semibold text-[#303030]">
          Яка модель вашого пристрою?
          <input
            type="text"
            required
            placeholder="Galaxy S21, iPhone 15 Pro…"
            value={data.model}
            onChange={(e) =>
              setData((prev) => ({ ...prev, model: e.target.value }))
            }
            className="rounded-full border border-[#2C79FF]/40 px-4 py-2 text-center outline-none focus:ring-2 focus:ring-[#2C79FF]"
          />
        </label>

        {/* ───── Описание + фото ───── */}
        <label className="relative flex w-80 flex-col gap-1 text-center text-sm font-semibold text-[#303030]">
          Що сталося? <span className="text-[#2C79FF]">*</span>
          <textarea
            required
            rows={3}
            placeholder="Побився екран, хочу замінити…"
            value={data.description}
            onChange={(e) =>
              setData((prev) => ({ ...prev, description: e.target.value }))
            }
            className="resize-none rounded-[28px] border border-[#2C79FF]/40 px-4 py-2 text-center leading-tight outline-none focus:ring-2 focus:ring-[#2C79FF]"
          />

          {/* кнопка выбора фото */}
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            title="Додати фото"
            className="absolute -right-12 top-6 flex h-10 w-10 items-center justify-center rounded-md bg-[#2C79FF] text-white hover:bg-[#1D5CCA] active:translate-y-[1px]"
          >
            <ImagePlus size={20} />
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            hidden
            onChange={handleFile}
          />
        </label>

        {/* превью последнего файла */}
        {preview && (
          <img
            src={preview}
            alt="preview"
            className="mt-2 h-24 w-24 rounded-lg object-cover ring-2 ring-[#2C79FF]"
          />
        )}

        {/* ───── Навигация ───── */}
        <div className="relative mt-10 w-full">
          <button
            type="button"
            onClick={back}
            className="absolute left-0 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#2C79FF] text-[#2C79FF] hover:bg-[#2C79FF]/10"
          >
            <ChevronLeft />
          </button>

          <span className="block text-center text-xl font-semibold">
            {data.step}/6
          </span>

          <button
            type="submit"
            className="absolute right-0 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-[#2C79FF] text-white hover:bg-[#1D5CCA]"
          >
            <ChevronRight />
          </button>
        </div>
      </form>
    </div>
  )
}
