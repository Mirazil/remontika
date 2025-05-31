/* eslint-disable @next/next/no-img-element */
'use client'
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
      <img
        src={icon}
        alt={title}
        className="relative z-10 h-25 w-25 object-contain "
      />
    </div>
  )
}
