'use client'

import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
}

export default function DangerButton({ children, className = '', ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={`relative inline-block rounded-[22px] bg-red-500 px-12 py-4 text-white font-semibold whitespace-nowrap transition-transform duration-150 active:translate-y-[3px] ${className}`}
    >
      <span className="relative z-10">{children}</span>
    </button>
  )
}