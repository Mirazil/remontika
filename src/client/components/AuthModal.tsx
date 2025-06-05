// components/AuthModal.tsx
'use client';

import { useState, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { auth } from '@/client/lib/firebaseAuth';
import PrimaryButton from '@/client/components/PrimaryButton';
import { Input } from './auth/Input';
import { X } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Fade from './Fade'; // наш новый компонент

type Props = { onClose: () => void };
type Tab = 'register' | 'login';

export default function AuthModal({ onClose }: Props) {
  const [showModal, setShowModal] = useState(true); // флаг видимости модалки
  const [tab, setTab] = useState<Tab>('register');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const closeHandler = () => {
    // вместо непосредственного onClose() мы сначала скрываем окно (showModal = false),
    // а затем, когда Fade завершит анимацию, вызывем onClose()
    setShowModal(false);
  };

  // Будет вызвано после окончания fade-out внутри Fade
  const afterFadeOut = () => {
    onClose();
  };

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const f = e.currentTarget;
    const email = (f.email as HTMLInputElement).value;
    const password = (f.password as HTMLInputElement).value;
    const repeat = (f.repeat as HTMLInputElement).value;
    const login = (f.login as HTMLInputElement).value;
    const phone = (f.phone as HTMLInputElement).value;

    if (password !== repeat) {
      setError('Паролі не співпадають');
      setLoading(false);
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: login });
      await setDoc(doc(db, 'users', cred.user.uid), {
        phone,
        address: '',
      });
      closeHandler();
      router.push('/dashboard');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const f = e.currentTarget;
    const email = (f.email as HTMLInputElement).value;
    const password = (f.password as HTMLInputElement).value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      closeHandler();
      router.push('/dashboard');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  // Портал в body, чтобы элемент рендерился поверх всего
  return createPortal(
    <>
      {/*
        Фон (backdrop). Он тоже обёрнут в <Fade>,
        чтобы плавно появляться и исчезать вместе с модалкой.
      */}
      <Fade
        show={showModal}
        duration={400}
        onFadeOutComplete={() => {
          /* когда фон исчезнет, ничего дополнительного делать не нужно */
        }}
      >
        <div
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
          onClick={closeHandler}
        />
      </Fade>

      {/*
        Сама модалка (контейнер с формой). Его тоже оборачиваем в <Fade>,
        но передаём onFadeOutComplete, который после завершения скрытия вызовет onClose().
      */}
      <Fade show={showModal} duration={250} onFadeOutComplete={afterFadeOut}>
        <div
          className="fixed left-1/2 top-1/2 
                      -translate-x-1/2 -translate-y-1/2 
                      z-50 w-[24rem] rounded-2xl bg-[#323232] p-8 text-white"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Кнопка закрытия */}
          <button
            onClick={closeHandler}
            className="absolute right-4 top-4 text-gray-400"
            aria-label="Закрити"
          >
            <X size={20} />
          </button>

          {/* Логотип */}
          <div className="mb-6 flex justify-center">
            <img src="/images/remontika_logo.svg" className="h-20" />
          </div>

          {/* Табы */}
          <div className="mb-6 flex justify-center gap-10 text-sm font-semibold">
            <button
              className={
                tab === 'register'
                  ? 'text-[#2C79FF] border-b-2 border-primary pb-1'
                  : 'text-gray-400 border-b-2 border-transparent pb-1'
              }
              onClick={() => setTab('register')}
            >
              Створити запис
            </button>
            <button
              className={
                tab === 'login'
                  ? 'text-[#2C79FF] border-b-2 border-primary pb-1'
                  : 'text-gray-400 border-b-2 border-transparent pb-1'
              }
              onClick={() => setTab('login')}
            >
              Увійти
            </button>
          </div>

          {/* Ошибка */}
          {error && (
            <p className="mb-4 text-center text-sm text-red-400">{error}</p>
          )}

          {tab === 'register' ? (
            <RegisterForm loading={loading} onSubmit={handleRegister} />
          ) : (
            <LoginForm loading={loading} onSubmit={handleLogin} />
          )}
        </div>
      </Fade>
    </>,
    document.body,
  );
}

// Формы не меняются:
function RegisterForm({
  loading,
  onSubmit,
}: {
  loading: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form className="flex flex-col space-y-4" onSubmit={onSubmit}>
      <Input name="login" placeholder="Логін *" required />
      <Input name="password" type="password" placeholder="Пароль *" required />
      <Input
        name="repeat"
        type="password"
        placeholder="Підтвердження паролю *"
        required
      />
      <Input name="email" type="email" placeholder="Email" required />
      <Input
        name="phone"
        type="tel"
        placeholder="Номер телефону"
        required
      />
      <div className="flex justify-center">
        <PrimaryButton disabled={loading}>
          {loading ? '…' : 'Створити обліковий запис'}
        </PrimaryButton>
      </div>
    </form>
  );
}

function LoginForm({
  loading,
  onSubmit,
}: {
  loading: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form className="flex flex-col space-y-4" onSubmit={onSubmit}>
      <Input name="email" type="email" placeholder="Email" required />
      <Input name="password" type="password" placeholder="Пароль" required />
      <div className="flex justify-center">
        <PrimaryButton className="px-10" disabled={loading}>
          {loading ? '…' : 'Увійти'}
        </PrimaryButton>
      </div>
    </form>
  );
}
