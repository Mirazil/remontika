"use client"
import Image from 'next/image'
type Props = {
  icon: string
  text: string
}

export default function BenefitItem({ icon, text }: Props) {
  return (
    <div className="flex items-center gap-4">
      {/* круг + картинка */}
      <div className="relative h-20 w-20 shrink-0">
        <span className="absolute inset-0 rounded-full bg-[#2C79FF]" />
        <Image
          src={icon}
          alt=""
          width={80}
          height={80}
          className="relative z-10 h-full w-full object-contain p-2"
        />
      </div>

      {/* описание */}
      <p className="text-text">{text}</p>
    </div>
  )
}
