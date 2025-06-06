'use client'

import { useEffect, useState, useRef } from 'react'
import Image              from 'next/image'
import { getAuth }        from 'firebase/auth'
import { doc, onSnapshot, updateDoc, deleteField } from 'firebase/firestore'
import { db }             from '@/lib/firebase'
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle } from 'lucide-react'
import PrimaryButton      from '@/client/components/PrimaryButton'
import DangerButton       from '@/client/components/DangerButton'
import { linkBot }        from '../notify/linkBot'
import { v4 as uuid }     from 'uuid'
import type { NewRequest, ContactMethod } from '@/types/request'

interface Props {
  data: NewRequest
  setData: React.Dispatch<React.SetStateAction<NewRequest>>
  next: () => void
  back: () => void
}

const META: Record<ContactMethod, {
  icon:string; label:string; placeholder:string;
}> = {
  telegram: {
    icon:'/dashboard/icons/telegram.svg',
    label:'Telegram',
    placeholder:'@username або +38(067)…'
  },
  viber: {
    icon:'/dashboard/icons/viber.svg',
    label:'Viber',
    placeholder:'+38(067)…'
  },
  sms: {
    icon:'/dashboard/icons/sms.svg',
    label:'SMS',
    placeholder:'+38(067)…'
  },
};

export default function Step4ContactFill({ data, setData, next, back }: Props) {
  const [botConnected, setBotConnected] = useState(false)
  const [linking, setLinking] = useState(false)
  const [unlinking, setUnlinking] = useState(false)
  const inited = useRef(false)

  /* ---- subscribe users/{uid} ---- */
  useEffect(() => {
    const uid = getAuth().currentUser?.uid
    if (!uid) return

    const ref = doc(db, 'users', uid)
    return onSnapshot(ref, snap => {
      if (snap.exists()) {
        const prof = snap.data() as { notifyValue?: string; tgChatId?: number }
        if (!inited.current && !data.contactValue.trim() && prof.notifyValue) {
          setData(prev => ({ ...prev, contactValue: prof.notifyValue! }))
        }
        inited.current = true
        setBotConnected(!!prof.tgChatId)
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

    /* ---- link bot ---- */
  const handleLinkBot = async () => {
    const docId = uuid()
    const url   = `https://t.me/RemontikaBot?start=${docId}`
    window.open(url, '_blank')
    try {
      setLinking(true)
      await linkBot(docId)
    } catch (e) {
      console.error(e)
      alert('Не вдалося відкрити бота. Спробуйте пізніше.')
    } finally {
      setLinking(false)
    }
  }

  /* ---- unlink bot ---- */
  const handleUnlinkBot = async () => {
    const uid = getAuth().currentUser?.uid
    if (!uid || !botConnected) return
    try {
      setUnlinking(true)
      await updateDoc(doc(db, 'users', uid), { tgChatId: deleteField() })
    } catch (e) {
      console.error(e)
      alert('Не вдалося видалити зв\'язок. Спробуйте пізніше.')
    } finally {
      setUnlinking(false)
    }
  }

  const canNext =
    !!data.contactValue.trim() &&
    (data.contactMethod !== 'telegram' || botConnected)


  const meta = data.contactMethod ? META[data.contactMethod] : null;
  if (!meta) return null; // safeguard

  return (
    <div className="relative mx-auto w-full max-w-[620px] px-10 py-12 text-center">
      <p className="mb-2 font-semibold">Ви обрали</p>
      <div className="mb-8 flex flex-col items-center gap-3">
        <Image src={meta.icon} alt="" width={72} height={72} />
        <h3 className="text-xl font-bold">{meta.label}</h3>
      </div>

      <div className="mx-auto flex w-80 flex-col items-center gap-2">
        <label className="text-sm font-semibold text-[#303030]">
          Вкажіть посилання чи номер телефону
        </label>
        <input
          value={data.contactValue}
          onChange={(e) =>
            setData((p) => ({ ...p, contactValue: e.target.value }))
          }
          placeholder={meta.placeholder}
          className="
            w-full rounded-full border border-[#2C79FF]/40 px-6 py-2
            text-center outline-none focus:ring-2 focus:ring-[#2C79FF]"
          required
        />
      </div>

      <div
        className={`mt-4 mx-auto flex w-max items-center gap-2 rounded-full border-2 px-6 py-2 font-semibold shadow
          ${botConnected
            ? 'border-green-500 bg-green-50 text-green-700 shadow-[0_4px_4px_rgba(74,222,128,0.4)]'
            : 'border-red-400 bg-red-50 text-red-700 shadow-[0_4px_4px_rgba(248,113,113,0.4)]'}`}
      >
        {botConnected ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
        <span>
          {botConnected ? 'Бот підʼєднаний' : 'Бот не підʼєднаний'}
        </span>
      </div>

            {data.contactMethod === 'telegram' && (
        <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
          <PrimaryButton
            onClick={handleLinkBot}
            disabled={linking || botConnected}
            className="disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {linking ? (
              <span className="flex h-5 w-5 animate-spin border-2 border-white/40 border-t-white rounded-full" />
            ) : botConnected ? (
              'Бот підʼєднаний'
            ) : (
              'Підключити бота'
            )}
          </PrimaryButton>

          <DangerButton
            onClick={handleUnlinkBot}
            disabled={unlinking || !botConnected}
            className="disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {unlinking ? (
              <span className="flex h-5 w-5 animate-spin border-2 border-white/40 border-t-white rounded-full" />
            ) : (
              'Відʼєднати бота'
            )}
          </DangerButton>
        </div>
      )}


      <div className="mt-12">
        {/* стрілки */}
        <button
          onClick={back}
          className="absolute bottom-6 left-6 flex h-12 w-12 items-center
                   justify-center rounded-full border-2 border-[#2C79FF]
                   text-[#2C79FF] hover:bg-[#2C79FF]/10"
        >
          <ChevronLeft />
        </button>
        <button
          disabled={!canNext}
          onClick={next}
          className="absolute bottom-6 right-6 flex h-12 w-12 items-center
                   justify-center rounded-full bg-[#2C79FF] text-white
                   hover:bg-[#1D5CCA] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}
