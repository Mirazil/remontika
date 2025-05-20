'use client'
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

type FaqItemProps = {
  id: number
  question: string
  answer: string
  defaultOpen?: boolean
}

export default function FaqItem({
  id,
  question,
  answer,
  defaultOpen = false,
}: FaqItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border rounded-xl overflow-hidden">
      {/* Заголовок + стрелка */}
      <button
        className="w-full flex items-center justify-between px-6 py-4"
        onClick={() => setIsOpen((v) => !v)}
      >
        <span className="flex items-center gap-4">
          <span className="font-semibold">{id}</span>
          <span>{question}</span>
        </span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-primary" />
        ) : (
          <ChevronDown className="h-5 w-5 text-primary" />
        )}
      </button>

      {/* Разделитель */}
      <hr className="border-t border-gray-300" />

      {/* Рендерим ответ ТОЛЬКО когда открыт */}
      {isOpen && (
        <div className="px-6 pb-4 pt-2 text-sm text-text/80">
          {answer}
        </div>
      )}
    </div>
  )
}
