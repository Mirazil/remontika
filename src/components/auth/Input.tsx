// src/components/auth/Input.tsx
import React from 'react'

export function Input(
  props: React.InputHTMLAttributes<HTMLInputElement>,
) {
  return (
    <input
      {...props}
      className="w-full rounded-lg bg-white px-4 py-2 text-black outline-none"
    />
  )
}
