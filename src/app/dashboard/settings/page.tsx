'use client';
import { useEffect, useState }         from 'react';
import {
  getAuth, updateProfile,
  updateEmail,
}                                       from 'firebase/auth';
import { db }                           from '@/lib/firebase';
import { doc, onSnapshot, setDoc }      from 'firebase/firestore';
import Spinner                           from '@/client/components/Spinner';
import EditFieldModal                    from './EditFieldModal';
import ChangePasswordModal               from './ChangePasswordModal';

/* ───── тип модалки, которую нужно показать ───── */
type Modal =
  | { type: 'login'   }
  | { type: 'email'   }
  | { type: 'phone'   }
  | { type: 'address' }
  | { type: 'password'}
  | null;

export default function SettingsPage() {
  /* текущий юзер */
  const user = getAuth().currentUser;
  if (!user) return <p className="p-8 text-center">Ви не авторизовані 🙃</p>;

  /* profile из коллекции `users` */
  const [profile, setProfile] = useState<{ address:string; phone:string }>();
  const [modal,   setModal]   = useState<Modal>(null);

  /* ---------- подписка на документ users/{uid} ---------- */
  useEffect(() => {
    const ref = doc(db, 'users', user.uid);
    return onSnapshot(ref, snap => {
      if (snap.exists()) setProfile(snap.data() as any);
      else {                       // первый визит – создаём заглушку
        setDoc(ref, { address:'', phone:'' });
        setProfile({ address:'', phone:'' });
      }
    });
  }, []);

  if (!profile) return <Spinner/>;

  /* ---------- функции сохранения (их ждут модалки) ---------- */
  const saveLogin   = (v:string) => updateProfile(user, { displayName: v });
  const saveEmail   = (v:string) => updateEmail   (user, v);
  const savePhone   = (v:string) => setDoc(doc(db,'users',user.uid),{phone:v},{merge:true});
  const saveAddress = (v:string) => setDoc(doc(db,'users',user.uid),{address:v},{merge:true});

  /* ---------- UI ---------- */
  return (
    <>
      {/* ===== основная страница ===== */}
      <div className="space-y-12 mt-4 lg:mt-0">

        {/* --- аккаунт --- */}
        <section className="space-y-6 rounded-[28px] border-2 border-[#2C79FF] bg-[#dbe8ff]/60 p-8 shadow-[0_4px_4px_rgba(44,121,255,0.4)]">
          <h2 className="text-2xl font-bold">Мій акаунт Remontika</h2>

          <div className="grid grid-cols-1 gap-6 text-sm sm:grid-cols-3">
            <Field
              label="Логін (імʼя)"
              value={user.displayName ?? '—'}
              onEdit={() => setModal({ type:'login' })}
            />
            <Field
              label="Email"
              value={user.email ?? '—'}
              onEdit={() => setModal({ type:'email' })}
            />
            <Field
              label="Номер"
              value={profile.phone || '—'}
              onEdit={() => setModal({ type:'phone' })}
            />
          </div>

          <button
            onClick={() => setModal({ type:'password' })}
            className="mt-4 rounded-full border border-[#2C79FF] px-6 py-2 hover:bg-[#2C79FF]/10"
          >
            Змінити Пароль
          </button>
        </section>

        {/* --- адреса --- */}
        <section className="space-y-4 rounded-[28px] border-2 border-[#2C79FF] bg-[#dbe8ff]/60 p-8 shadow-[0_4px_4px_rgba(44,121,255,0.4)]">
          <h2 className="text-2xl font-bold">Моя адреса</h2>

          <p className="text-lg">
            {profile.address || <span className="text-gray-400">— не вказано —</span>}
          </p>

          <button
            onClick={() => setModal({ type:'address' })}
            className="rounded-full border border-[#2C79FF] px-6 py-2 hover:bg-[#2C79FF]/10"
          >
            Змінити Адресу
          </button>
        </section>
      </div>

      {/* ===== модалки (показываются по modal.type) ===== */}
      {modal?.type === 'login' &&
        <EditFieldModal
          title="Зміна імені"
          label="Нове імʼя"
          initValue={user.displayName ?? ''}
          onSave={saveLogin}
          onClose={() => setModal(null)}
        />
      }

      {modal?.type === 'email' &&
        <EditFieldModal
          title="Зміна email"
          label="Новий email"
          type="email"
          initValue={user.email ?? ''}
          onSave={saveEmail}
          onClose={() => setModal(null)}
        />
      }

      {modal?.type === 'phone' &&
        <EditFieldModal
          title="Зміна номера"
          label="Новий номер"
          type="tel"
          initValue={profile.phone}
          onSave={savePhone}
          onClose={() => setModal(null)}
        />
      }

      {modal?.type === 'address' &&
        <EditFieldModal
          title="Зміна адреси"
          label="Нова адреса"
          initValue={profile.address}
          onSave={saveAddress}
          onClose={() => setModal(null)}
        />
      }

      {modal?.type === 'password' &&
        <ChangePasswordModal onClose={() => setModal(null)}/>
      }
    </>
  );
}

/* маленький helper-компонент для поля */
function Field({ label, value, onEdit }:{
  label:string; value:string; onEdit:()=>void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-gray-400">{label}</p>
      <p>{value}</p>
      <button
        onClick={onEdit}
        className="rounded-full border border-[#2C79FF] px-4 py-1 text-xs hover:bg-[#2C79FF]/10"
      >
        Змінити
      </button>
    </div>
  );
}
