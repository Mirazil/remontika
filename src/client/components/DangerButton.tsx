'use client'

import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
}

export default function DangerButton({ children, className = '', ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={`relative inline-block rounded-[22px] bg-red-500 px-12 py-4 text-white font-semibold transition-transform duration-150 active:translate-y-[3px] ${className}`}
    >
      <span className="relative z-10">{children}</span>
      <span aria-hidden className="absolute inset-0 rounded-[22px] bg-red-700 translate-y-[6px]" />
    </button>
  )
}