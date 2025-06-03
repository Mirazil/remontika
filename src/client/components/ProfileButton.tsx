// components/ProfileButton.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/client/lib/firebaseAuth';
import AuthModal from '@/client/components/AuthModal';

export default function ProfileButton({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  function handleClick() {
    if (user) {
      router.push('/dashboard');
    } else {
      setShowAuthModal(true);
    }
  }

  return (
    <>
      <div className="relative inline-block">
        <span
          aria-hidden="true"
          className="
            absolute inset-0
            rounded-[13px]
            bg-[#1D5CCA]
            translate-y-[8px]
            transition-transform duration-150
            active:translate-y-[0px]
            z-0
          "
        />

        <button
          onClick={handleClick}
          className="
            relative
            z-10
            rounded-[13px]
            bg-[#2C79FF]
            px-12 py-3
            text-white text-lg font-semibold
            transition-transform duration-150
            active:translate-y-[2px]
            shadow-[0_12px_40px_rgba(44,121,255,0.3)]
            flex items-center justify-center
            cursor-pointer
          "
        >
          {/* Здесь мы рендерим именно {children} */}
          {children}
        </button>
      </div>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  );
}
