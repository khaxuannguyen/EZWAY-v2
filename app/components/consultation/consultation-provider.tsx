'use client';
import { useEffect,useRef,useState } from 'react';
import { X } from 'lucide-react';
import { ShippingConsultationWizard } from './shipping-wizard';
export function ConsultationProvider(){
 const [selection,setSelection]=useState<{destination:string;source:string}|null>(null),dialog=useRef<HTMLDialogElement>(null),trigger=useRef<HTMLElement|null>(null);
 useEffect(()=>{function open(e:MouseEvent){if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;const target=(e.target as Element)?.closest<HTMLAnchorElement>('a[href]');if(!target||target.target==='_blank')return;const url=new URL(target.href,location.href);if(url.origin!==location.origin)return;
  if(target.dataset.quoteDestination||url.pathname==='/gia-cuoc'&&url.hash==='#yeu-cau'||url.pathname==='/'&&url.hash==='#bao-gia'){
   e.preventDefault();trigger.current=target;setSelection({destination:target.dataset.quoteDestination||url.searchParams.get('destination')||'',source:target.dataset.quoteSource||url.searchParams.get('source')||'public_cta'});
  }}document.addEventListener('click',open);return()=>document.removeEventListener('click',open);},[]);
 useEffect(()=>{if(selection&&dialog.current){dialog.current.showModal();const old=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.body.style.overflow=old;};}},[selection]);
 function close(){dialog.current?.close();setSelection(null);trigger.current?.focus();}
 return <dialog ref={dialog} className="eq-dialog" aria-label="Tư vấn vận chuyển quốc tế" onCancel={e=>{e.preventDefault();close();}} onClick={e=>{if(e.target===dialog.current)close();}}><button className="eq-close" aria-label="Đóng tư vấn" onClick={close}><X size={20}/></button>{selection&&<ShippingConsultationWizard destination={selection.destination} source={selection.source} onClose={close}/>}</dialog>;
}
