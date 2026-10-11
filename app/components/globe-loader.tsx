'use client';
import dynamic from 'next/dynamic';
const Globe=dynamic(()=>import('./globe'),{ssr:false,loading:()=> <div className="ez-globe-placeholder" aria-label="Đang tải địa cầu"><div/></div>});
export function GlobeLoader(){return <Globe/>;}
