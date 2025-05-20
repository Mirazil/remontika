'use client'
import React from 'react'

export default function HeroCTA() {
  const handleClick = () => console.log('Подати заявку clicked')

  return (
    <div className="relative inline-block">
      {/* Низ под кнопкой — тень/ступенька */}
      <span
        aria-hidden
        className="
          absolute inset-0
          rounded-[28px]
          bg-[#1D5CCA]
          translate-y-[8px]
          transition-transform duration-150
          active:translate-y-[0px]
          z-0
        "
      />

      {/* Сама кнопка над тенью */}
      <button
        onClick={handleClick}
        className="
          relative
          z-10
          rounded-[28px]
          bg-[#2C79FF]
          px-12 py-5
          text-white text-lg font-semibold
          transition-transform duration-150
          active:translate-y-[2px]
          shadow-[0_12px_40px_rgba(44,121,255,0.3)]
        "
      >
        Подати заявку
      </button>
    </div>
  )
}
