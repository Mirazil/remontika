'use client';
import { X } from 'lucide-react';
import { ReactNode } from 'react';

type Props = {
  title : string;
  children : ReactNode;
  onClose : () => void;
};

export default function ModalShell({ title, children, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="relative w-[620px] max-w-full rounded-[32px]
                      border-2 border-[#2C79FF] bg-white p-10
                      shadow-[0_4px_4px_rgba(44,121,255,0.4)]">
        {/* крестик */}
        <button onClick={onClose}
                className="absolute top-4 right-4 text-[#2C79FF]">
          <X size={24}/>
        </button>

        {/* заголовок */}
        <h1 className="absolute -top-6 left-8 rounded-t-[24px]
                       bg-[#dbe8ff] px-4 py-1 text-2xl italic">
          {title}
        </h1>

        {children}
      </div>
    </div>
  );
}
