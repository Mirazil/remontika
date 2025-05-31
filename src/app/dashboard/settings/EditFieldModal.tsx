'use client';
import { useState } from 'react';
import { Check }    from 'lucide-react';
import ModalShell   from '@/client/components/ModalShell';

type Props = {
  title     : string;
  label     : string;
  type?     : 'text' | 'email' | 'tel';
  initValue : string;
  onSave    : (v:string) => Promise<void>;
  onClose   : () => void;
};

export default function EditFieldModal({
  title, label, type = 'text', initValue, onSave, onClose,
}: Props) {
  const [val, setVal]   = useState(initValue);
  const [busy,setBusy]  = useState(false);

  const save = async()=>{
    if(!val.trim() || busy) return;
    setBusy(true);
    await onSave(val.trim());
    onClose();
  };

  return (
    <ModalShell title={title} onClose={onClose}>
      <div className="pt-16 flex flex-col items-center gap-6">

        <label className="w-80 text-center font-semibold">
          {label}
          <input type={type} autoFocus required
                 className="mt-2 w-full rounded-full border border-[#2C79FF]/40
                            px-4 py-2 text-center outline-none
                            focus:ring-2 focus:ring-[#2C79FF]"
                 value={val} onChange={e=>setVal(e.target.value)}/>
        </label>

        <button onClick={save} disabled={busy}
                className="flex h-12 w-12 items-center justify-center rounded-full
                           bg-[#2C79FF] text-white hover:bg-[#1D5CCA]">
          <Check size={28}/>
        </button>
      </div>
    </ModalShell>
  );
}
