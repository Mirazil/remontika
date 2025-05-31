// src/components/Step.tsx
'use client'

type Props = { num: string; icon: string; text: string }

export default function Step({ num, icon, text }: Props) {
  return (
    <div className="flex flex-col z-10 items-center text-center max-w-[180px] mx-auto">
      {/* номер */}
      <span className="mb-1 text-sm font-semibold text-primaryDark">{num}</span>

      {/* синій круг + іконка */}
      <div className="relative mb-3 h-24 w-24">
        <span className="absolute inset-0 rounded-full bg-[#2C79FF]" />
        <img
          src={icon}
          alt=""
          className="relative z-10 h-full w-full object-contain p-3"
        />
      </div>

      {/* опис */}
      <p className="text-sm text-text leading-snug">{text}</p>
    </div>
  )
}
