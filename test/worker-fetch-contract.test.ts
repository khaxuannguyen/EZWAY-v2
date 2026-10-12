import test from 'node:test';
import assert from 'node:assert/strict';
import { Miniflare,convertV4MiniflareOptions } from 'miniflare';
test('real workerd accepts manual redirect and rejects Node-only error mode before sending',async()=>{
 let outboundCalls=0;
 const mf=new Miniflare(convertV4MiniflareOptions({name:'fetch-contract',modules:true,compatibilityDate:'2026-10-12',outboundService:async()=>{outboundCalls++;return new Response('{"ok":true}',{headers:{'Content-Type':'application/json'}});},script:`export default {async fetch(){let results=[];for(const mode of ['error','manual']){try{const response=await fetch('https://provider.example.test',{method:'POST',redirect:mode,body:'{}'});results.push({mode,status:response.status});}catch(e){results.push({mode,error:e.name});}}return Response.json(results)}}`}));
 try{const results=await (await mf.dispatchFetch('http://localhost/test')).json();assert.deepEqual(results,[{mode:'error',error:'TypeError'},{mode:'manual',status:200}]);assert.equal(outboundCalls,1);}finally{await mf.dispose();}
});
