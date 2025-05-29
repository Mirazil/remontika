// src/app/(dashboard)/PlusButton.tsx
'use client'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import NewRequestModal from './NewRequestModal'

export default function PlusButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full bg-[#2C79FF] text-white flex items-center justify-center shadow-xl cursor-pointer"
      >
        <Plus className="h-6 w-6" />
      </button>

      {open && <NewRequestModal onClose={() => setOpen(false)} />}
    </>
  )
}
