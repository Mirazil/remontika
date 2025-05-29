// src/app/(dashboard)/DownButton.tsx
'use client'
import { ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function DownButton() {
  const router = useRouter()
  return (
    <button
      onClick={() => router.push('/dashboard/all')}
      className="
        fixed bottom-6 left-1/2 -translate-x-1/2
        h-12 w-12 rounded-full bg-[#dbe8ff] border-2 border-[#2C79FF]
        flex items-center justify-center shadow-xl
      "
    >
      <ChevronDown className="h-6 w-6 text-[#2C79FF]" />
    </button>
  )
}
