'use client'

import { useEffect, useState } from 'react'
import Image              from 'next/image'
import { getAuth }        from 'firebase/auth'
import { doc, getDoc }    from 'firebase/firestore'
import { db }             from '@/lib/firebase'
import { ChevronLeft, ChevronRight } from 'lucide-react'
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

  /* ---- ONE-SHOT: підставляємо value з профілю, якщо його ще нема ---- */
  useEffect(() => {
    const uid = getAuth().currentUser?.uid
    if (!uid) return

    ;(async () => {
      const snap = await getDoc(doc(db, 'users', uid))
      if (snap.exists()) {
        const prof = snap.data() as { notifyValue?: string; tgChatId?: number }
        if (!data.contactValue.trim() && prof.notifyValue) {
          setData(prev => ({ ...prev, contactValue: prof.notifyValue! }))
        }
        setBotConnected(!!prof.tgChatId)
      }
    })()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

      <p className="mt-4 text-center font-semibold">
        Бот: {botConnected ? "підключено ✅" : "не підключено ❌"}
      </p>

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
          disabled={!data.contactValue.trim()}
          onClick={next}
          className="absolute bottom-6 right-6 flex h-12 w-12 items-center
                   justify-center rounded-full bg-[#2C79FF] text-white
                   hover:bg-[#1D5CCA] disabled:opacity-40"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}
