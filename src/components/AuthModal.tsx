'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import PrimaryButton from '@/components/PrimaryButton'
import { Input } from './auth/Input'
import { X } from 'lucide-react'

type Props = { onClose: () => void }
type Tab  = 'register' | 'login'

export default function AuthModal({ onClose }: Props) {
  const [tab,    setTab]    = useState<Tab>('register')
  const [error,  setError]  = useState('')
  const [loading,setLoading]= useState(false)
  const router              = useRouter()

  /* ---------- отправка --------- */
  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const f = e.currentTarget
    const email    = (f.email    as HTMLInputElement).value
    const password = (f.password as HTMLInputElement).value
    const repeat   = (f.repeat   as HTMLInputElement).value
    const login    = (f.login    as HTMLInputElement).value

    if (password !== repeat) {
      setError('Паролі не співпадають')
      setLoading(false)
      return
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(cred.user, { displayName: login })
      onClose()
      router.push('/dashboard')
    } catch (e:any) {
      setError(e.message)
    } finally { setLoading(false) }
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const f = e.currentTarget
    const email    = (f.email    as HTMLInputElement).value
    const password = (f.password as HTMLInputElement).value

    try {
      await signInWithEmailAndPassword(auth, email, password)
      onClose()
      router.push('/dashboard')
    } catch (e:any) {
      setError(e.message)
    } finally { setLoading(false) }
  }

  /* ---------- UI --------- */
  return createPortal(
    <>
      <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" onClick={onClose}/>
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[24rem] rounded-2xl bg-[#323232] p-8 text-white">
        {/* close */}
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400"><X/></button>
        {/* logo */}
        <div className="mb-6 flex justify-center"><img src="/images/remontika_logo.svg" className="h-20" /></div>

        {/* tabs */}
        <div className="mb-6 flex justify-center gap-10 text-sm font-semibold">
          <button
            className={tab==='register'?'text-primary border-b-2 border-primary pb-1':'text-gray-400 pb-1'}
            onClick={()=>setTab('register')}>Створити запис</button>
          <button
            className={tab==='login'?'text-primary border-b-2 border-primary pb-1':'text-gray-400 pb-1'}
            onClick={()=>setTab('login')}>Увійти</button>
        </div>

        {error && <p className="mb-4 text-center text-sm text-red-400">{error}</p>}

        {tab==='register'
          ? <RegisterForm loading={loading} onSubmit={handleRegister}/>
          : <LoginForm    loading={loading} onSubmit={handleLogin}/>}
      </div>
    </>,
    document.body
  )
}

/* ---------- формы ---------- */
function RegisterForm({ loading, onSubmit }:{loading:boolean,onSubmit:(e:React.FormEvent<HTMLFormElement>)=>void}) {
  return (
    <form className="flex flex-col space-y-4" onSubmit={onSubmit}>
      <Input name="login"    placeholder="Логін *"      required/>
      <Input name="password" type="password" placeholder="Пароль *" required/>
      <Input name="repeat"   type="password" placeholder="Підтвердження паролю *" required/>
      <Input name="email"    type="email"    placeholder="Email"     required/>
      <Input name="phone"    type="tel"      placeholder="Номер телефону"/>
      <div className="flex justify-center">
        <PrimaryButton disabled={loading}>
          {loading?'…':'Створити обліковий запис'}
        </PrimaryButton>
      </div>
    </form>
  )
}

function LoginForm({ loading, onSubmit }:{loading:boolean,onSubmit:(e:React.FormEvent<HTMLFormElement>)=>void}) {
  return (
    <form className="flex flex-col space-y-4" onSubmit={onSubmit}>
      <Input name="email"    type="email"    placeholder="Email"     required/>
      <Input name="password" type="password" placeholder="Пароль"    required/>
      <div className="flex justify-center">
        <PrimaryButton className="px-10" disabled={loading}>
          {loading?'…':'Увійти'}
        </PrimaryButton>
      </div>
    </form>
  )
}
