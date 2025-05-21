'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import PrimaryButton from '@/components/PrimaryButton'

type Props = {
  onClose: () => void
}
// внутри AuthModal.tsx или отдельного файла Input.tsx
type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  placeholder: string
}



export default function AuthModal({ onClose }: Props) {
  const [activeTab, setActiveTab] = useState<'register' | 'login'>('register')

  // Монтируем в <body> через портал
  return createPortal(
    <>
      {/*  overlay + размытие */}
      <div
        className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/*  сама карточка */}
      <div
        className="
          fixed left-1/2 top-1/2 z-50 w-[24rem] -translate-x-1/2 -translate-y-1/2
          rounded-2xl bg-[#323232] p-8 text-white
        "
      >
        {/* крестик */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>

        {/* логотип */}
        <div className="flex justify-center mb-6">
          <img src="/images/remontika_logo.svg" alt="R logo" className="h-24" />
        </div>

        {/* табы */}
        <div className="mb-6 flex justify-center gap-10 text-sm font-semibold">
          <button
            onClick={() => setActiveTab('register')}
            className={`pb-1 ${
              activeTab === 'register'
                ? 'border-b-2 border-primary text-[#2C79FF]'
                : 'text-gray-300'
            }`}
          >
            Створити запис
          </button>
          <button
            onClick={() => setActiveTab('login')}
            className={`pb-1 ${
              activeTab === 'login'
                ? 'border-b-2 border-primary text-[#2C79FF]'
                : 'text-gray-300'
            }`}
          >
            Увійти
          </button>
        </div>

        {activeTab === 'register' ? <RegisterForm /> : <LoginForm />}
      </div>
    </>,
    document.body
  )
}

/* ---------- формы ---------- */

export function Input({ placeholder, type = 'text', ...rest }: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      {...rest}
      className="w-full rounded-lg bg-white px-4 py-2 text-black outline-none"
    />
  )
}
function RegisterForm() {
  return (
    <form className="space-y-4">
      <Input type="text" placeholder="Логін *" />
      <Input type="password" placeholder="Пароль *" />
      <Input type="password" placeholder="Підтвердження паролю *" />
      <Input type="email" placeholder="Email" />
      <Input type="tel" placeholder="Номер телефону" />
      <div className="flex justify-center">
        <PrimaryButton className="mx-auto block ">
          Створити обліковий запис
        </PrimaryButton>
      </div>
    </form>
  );
}

function LoginForm() {
  return (
    <form className="space-y-4">
      <Input type="text" placeholder="Логін" />
      <Input type="password" placeholder="Пароль" />

      <div className="flex justify-center">
        <PrimaryButton className="mx-auto block w-fit px-10">
          Увійти
        </PrimaryButton>
      </div>
    </form>
  );
}

