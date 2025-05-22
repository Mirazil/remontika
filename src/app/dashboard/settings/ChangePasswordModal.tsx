'use client';
import { useState }  from 'react';
import { Check }     from 'lucide-react';
import { reauthenticateWithCredential,
         EmailAuthProvider, updatePassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import ModalShell from '@/components/ModalShell';

export default function ChangePasswordModal({ onClose }: { onClose:()=>void }) {
  const [oldPwd,setOld]   = useState('');
  const [newPwd,setNew]   = useState('');
  const [repPwd,setRep]   = useState('');
  const [busy,setBusy]    = useState(false);

  const save = async()=>{
    if (busy) return;
    if (newPwd !== repPwd) { alert('Паролі не співпадають'); return; }

    try{
      setBusy(true);
      const user = auth.currentUser!;
      const cred = EmailAuthProvider.credential(user.email!,oldPwd);
      await reauthenticateWithCredential(user, cred);   // confirm old pwd
      await updatePassword(user, newPwd);
      alert('Пароль змінено');
      onClose();
    }catch(e:any){
      alert(e.message);
    }finally{ setBusy(false); }
  };

  return(
    <ModalShell title="Зміна паролю" onClose={onClose}>
      <form onSubmit={e=>{e.preventDefault();save();}}
            className="pt-16 flex flex-col items-center gap-4">

        <Input
          ph="Уведіть старий пароль"
          val={oldPwd} set={setOld} type="password"/>

        <Input
          ph="Уведіть новий пароль"
          val={newPwd} set={setNew} type="password"/>

        <Input
          ph="Підтвердіть новий пароль"
          val={repPwd} set={setRep} type="password"/>

        <button type="submit" disabled={busy}
                className="mt-4 flex h-12 w-12 items-center justify-center rounded-full
                           bg-[#2C79FF] text-white hover:bg-[#1D5CCA]">
          <Check size={28}/>
        </button>
      </form>
    </ModalShell>
  );
}

/* маленький инпут-helper */
function Input({ph,val,set,type='text'}:{
  ph:string,val:string,set:(s:string)=>void,type?:string}){
  return(
    <input required type={type} placeholder={ph}
           className="w-80 rounded-full border border-[#2C79FF]/40 px-4 py-2
                      text-center outline-none focus:ring-2 focus:ring-[#2C79FF]"
           value={val} onChange={e=>set(val=>e.target.value)}/>
  );
}
