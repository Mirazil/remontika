/* ───────── src/app/(dashboard)/modals/ChangePasswordModal.tsx ───────── */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Check } from 'lucide-react';
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from 'firebase/auth';
import { auth } from '@/client/lib/firebaseAuth';
import Fade from '@/client/components/Fade';
import ModalShell from '@/client/components/ModalShell';

export default function ChangePasswordModal({
  onClose,
}: {
  onClose: () => void;
}) {
  // Локальный state, который управляет fade-in / fade-out
  const [isVisible, setIsVisible] = useState(false);
  // После завершения fade-out нужно вызвать реальный onClose()
  const [shouldNotifyClose, setShouldNotifyClose] = useState(false);

  // Поля формы и флаг загрузки
  const [oldPwd, setOld] = useState('');
  const [newPwd, setNew] = useState('');
  const [repPwd, setRep] = useState('');
  const [busy, setBusy] = useState(false);

  // При маунте сразу запускаем fade-in
  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  // Когда нужно закрыть модалку, сперва запускаем fade-out
  const initiateClose = useCallback(() => {
    setIsVisible(false);
    setShouldNotifyClose(true);
  }, []);

  // После завершения fade-out (<Fade> вызовет onFadeOutComplete) — зовём родительский onClose
  const afterFadeOut = useCallback(() => {
    if (shouldNotifyClose) {
      onClose();
    }
  }, [shouldNotifyClose, onClose]);

  // Сохранение нового пароля
  const save = async () => {
    if (busy) return;
    if (newPwd !== repPwd) {
      alert('Паролі не співпадають');
      return;
    }

    try {
      setBusy(true);
      const user = auth.currentUser!;
      const cred = EmailAuthProvider.credential(user.email!, oldPwd);
      await reauthenticateWithCredential(user, cred); // проверяем старый пароль
      await updatePassword(user, newPwd);
      alert('Пароль змінено');
      initiateClose(); // запускаем fade-out
    } catch (e: any) {
      alert(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    // Оборачиваем всю модалку в <Fade>
    <Fade show={isVisible} duration={250} onFadeOutComplete={afterFadeOut}>
      {/* ModalShell — ваш существующий обёрточный компонент */}
      <ModalShell title="Зміна паролю" onClose={initiateClose}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
          className="pt-16 flex flex-col items-center gap-4"
        >
          <Input
            ph="Уведіть старий пароль"
            val={oldPwd}
            set={setOld}
            type="password"
          />

          <Input
            ph="Уведіть новий пароль"
            val={newPwd}
            set={setNew}
            type="password"
          />

          <Input
            ph="Підтвердіть новий пароль"
            val={repPwd}
            set={setRep}
            type="password"
          />

          <button
            type="submit"
            disabled={busy}
            className="
              mt-4 flex h-12 w-12 items-center justify-center rounded-full
              bg-[#2C79FF] text-white hover:bg-[#1D5CCA]
              disabled:opacity-50
            "
          >
            <Check size={28} />
          </button>
        </form>
      </ModalShell>
    </Fade>
  );
}

/* маленький инпут-хелпер */
function Input({
  ph,
  val,
  set,
  type = 'text',
}: {
  ph: string;
  val: string;
  set: (s: string) => void;
  type?: string;
}) {
  return (
    <input
      required
      type={type}
      placeholder={ph}
      className="
        w-80
        rounded-full
        border border-[#2C79FF]/40
        px-4 py-2
        text-center
        outline-none
        focus:ring-2 focus:ring-[#2C79FF]
      "
      value={val}
      onChange={(e) => set(e.target.value)}
    />
  );
}
