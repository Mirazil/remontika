/* ───────── src/app/(dashboard)/modals/EditFieldModal.tsx ───────── */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Check } from 'lucide-react';
import ModalShell from '@/client/components/ModalShell';
import Fade from '@/client/components/Fade';

type Props = {
  title     : string;
  label     : string;
  type?     : 'text' | 'email' | 'tel';
  initValue : string;
  onSave    : (v: string) => Promise<void>;
  onClose   : () => void;
};

export default function EditFieldModal({
  title,
  label,
  type = 'text',
  initValue,
  onSave,
  onClose,
}: Props) {
  // Стейты для fade-in / fade-out
  const [isVisible, setIsVisible] = useState(false);
  const [shouldNotifyClose, setShouldNotifyClose] = useState(false);

  // Поле ввода и флаг загрузки
  const [val, setVal] = useState(initValue);
  const [busy, setBusy] = useState(false);

  // При монтировании запускаем fade-in
  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  // Функция запуска fade-out вместо прямого onClose
  const initiateClose = useCallback(() => {
    setIsVisible(false);
    setShouldNotifyClose(true);
  }, []);

  // Когда fade-out завершился, действительно вызываем onClose
  const afterFadeOut = useCallback(() => {
    if (shouldNotifyClose) {
      onClose();
    }
  }, [shouldNotifyClose, onClose]);

  // Сохраняем новое значение
  const save = async () => {
    if (!val.trim() || busy) return;
    setBusy(true);

    try {
      await onSave(val.trim());
      initiateClose();
    } catch (e: any) {
      // Можно вывести свою ошибку
      alert(e.message || 'Щось пішло не так');
    } finally {
      setBusy(false);
    }
  };

  return (
    // Оборачиваем ModalShell в Fade
    <Fade show={isVisible} duration={250} onFadeOutComplete={afterFadeOut}>
      <ModalShell title={title} onClose={initiateClose}>
        <div className="pt-16 flex flex-col items-center gap-6">
          <label className="w-80 text-center font-semibold">
            {label}
            <input
              type={type}
              autoFocus
              required
              className="
                mt-2 w-full
                rounded-full
                border border-[#2C79FF]/40
                px-4 py-2
                text-center
                outline-none
                focus:ring-2 focus:ring-[#2C79FF]
              "
              value={val}
              onChange={(e) => setVal(e.target.value)}
            />
          </label>

          <button
            onClick={save}
            disabled={busy}
            className="
              flex h-12 w-12 items-center justify-center
              rounded-full
              bg-[#2C79FF] text-white hover:bg-[#1D5CCA]
              disabled:opacity-50
            "
          >
            <Check size={28} />
          </button>
        </div>
      </ModalShell>
    </Fade>
  );
}
