/* ───────── src/app/(dashboard)/steps/Step2DeviceInfo.tsx ───────── */
'use client'

import {
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  useEffect,
} from 'react'
import {
  ImagePlus,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import type { NewRequest } from '@/types/request'

interface Props {
  data: NewRequest
  setData: React.Dispatch<React.SetStateAction<NewRequest>>
  next: () => void
  back: () => void
}

/* максимум файлов */
const MAX_PHOTOS = 3

export default function Step2DeviceInfo({
  data,
  setData,
  next,
  back,
}: Props) {
  /* превьюшки создаём из File[] */
  const [previews, setPreviews] = useState<string[]>([])
  const fileInput = useRef<HTMLInputElement>(null)

  /* генерируем / чистим preview-URL */
  useEffect(() => {
    /* очищаем старые Blob-URL */
    previews.forEach((url) => URL.revokeObjectURL(url))
    setPreviews(data.photos.map((f) => URL.createObjectURL(f)))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.photos])

  /* ---------------- обработка файла ---------------- */
  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (data.photos.length >= MAX_PHOTOS) return

    setData((p) => ({ ...p, photos: [...p.photos, file] }))
    /* input можно сбросить, чтобы повторно выбирать тот же файл при желании */
    e.target.value = ''
  }

  /* ---------------- удалить фото ---------------- */
  const removePhoto = (idx: number) => {
    setData((p) => ({
      ...p,
      photos: p.photos.filter((_, i) => i !== idx),
    }))
  }

  /* ---------------- submit ---------------- */
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    next()
  }

  /* разрешаем «вперёд», когда все поля заполнены */
  const canGoNext =
    !!data.brand.trim() &&
    !!data.model.trim() &&
    !!data.description.trim()

  return (
    /* relative нужен для стрелок, mx-auto — равные поля слева/справа */
    <div className="relative mx-auto w-full max-w-[620px] px-10 py-12">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-6"
      >
        {/* ───────── бренд ───────── */}
        <label className="flex w-80 flex-col gap-1 text-center text-sm font-semibold text-[#303030]">
          Яка марка вашого пристрою?
          <input
            type="text"
            required
            placeholder="Samsung, Apple, Xiaomi…"
            value={data.brand}
            onChange={(e) =>
              setData((p) => ({ ...p, brand: e.target.value }))
            }
            className="rounded-full border border-[#2C79FF]/40 px-4 py-2 text-center outline-none focus:ring-2 focus:ring-[#2C79FF]"
          />
        </label>

        {/* ───────── модель ───────── */}
        <label className="flex w-80 flex-col gap-1 text-center text-sm font-semibold text-[#303030]">
          Яка модель вашого пристрою?
          <input
            type="text"
            required
            placeholder="Galaxy S21, iPhone 15 Pro…"
            value={data.model}
            onChange={(e) =>
              setData((p) => ({ ...p, model: e.target.value }))
            }
            className="rounded-full border border-[#2C79FF]/40 px-4 py-2 text-center outline-none focus:ring-2 focus:ring-[#2C79FF]"
          />
        </label>

        {/* ───────── опис + кнопка фото ───────── */}
        <label className="relative flex w-80 flex-col gap-1 text-center text-sm font-semibold text-[#303030]">
          Що сталося? <span className="text-[#2C79FF]">*</span>
          <textarea
            required
            rows={3}
            placeholder="Побився екран, хочу замінити…"
            value={data.description}
            onChange={(e) =>
              setData((p) => ({ ...p, description: e.target.value }))
            }
            className="resize-none rounded-[28px] border border-[#2C79FF]/40 px-4 py-2 text-center leading-tight outline-none focus:ring-2 focus:ring-[#2C79FF]"
          />

          {/* кнопка «додати фото» (блокируем при 3-х) */}
          <button
            type="button"
            disabled={data.photos.length >= MAX_PHOTOS}
            onClick={() => fileInput.current?.click()}
            title={
              data.photos.length >= MAX_PHOTOS
                ? 'Максимум 3 фото'
                : 'Додати фото'
            }
            className={`
              absolute -right-12 top-1/2 -translate-y-1/2
              flex h-10 w-10 items-center justify-center rounded-md
              ${data.photos.length >= MAX_PHOTOS
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-[#2C79FF] text-white hover:bg-[#1D5CCA]'}
            `}
          >
            <ImagePlus size={22} />
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            hidden
            onChange={handleFile}
          />
        </label>

        {/* ───────── превьюшки фото ───────── */}
        {previews.length > 0 && (
          <div className="flex gap-4">
            {previews.map((src, i) => (
              <div key={i} className="relative group">
                <img
                  src={src}
                  alt={`preview-${i}`}
                  className="h-20 w-20 rounded-lg object-cover ring-2 ring-[#2C79FF]"
                />
                {/* крестик удаления */}
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="
                    absolute -top-2 -right-2 hidden h-5 w-5 items-center
                    justify-center rounded-full bg-red-500 text-[10px]
                    text-white group-hover:flex
                  "
                  title="Видалити"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </form>

      <div className="mt-12">

      {/* ───────── стрелка «назад» ───────── */}
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

      {/* ───────── стрелка «вперёд» ───────── */}
      <button
        type="submit"
        onClick={handleSubmit}
        disabled={!canGoNext}
        className="
          absolute bottom-6 right-6 flex h-12 w-12 items-center justify-center
          rounded-full bg-[#2C79FF] text-white hover:bg-[#1D5CCA]
          disabled:opacity-30
        "
      >
        <ChevronRight />
      </button>
      </div>
    </div>
  )
}
