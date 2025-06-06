"use client"
import Image from 'next/image'

type ServiceItemProps = {
  icon: string
  title: string
}

export default function ServiceItem({ icon, title }: ServiceItemProps) {
  return (
    <div className="relative flex items-center w-2xs justify-between rounded-xl  bg-[#2C79FF] p-4 ">
      {/* Внутренняя белая рамка */}
      <span className="absolute inset-0 m-1.5 rounded-xl border-3 border-white" />

      {/* Заголовок */}
      <span className="relative z-10 text-white font-semibold ">
        {title}
      </span>

      {/* Иконка */}
      <Image
        src={icon}
        alt={title}
        width={100}
        height={100}
        className="relative z-10 h-25 w-25 object-contain "
      />
    </div>
  )
}
