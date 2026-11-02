const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const script=fs.readFileSync('index.html','utf8').match(/<script>\s*([\s\S]*?)<\/script>/)[1];
(async()=>{
for(const privateMode of [false,true]){
 const cache=new Map([['sticker-player','REAL ACCOUNT CACHE']]),elements=new Map();let payments=0,request;
 const node=()=>({style:{},classList:{add(){},remove(){},toggle(){},contains(){return false}},append(){},appendChild(){},setAttribute(){},focus(){},hidden:false,textContent:''});
 const el=id=>{if(!elements.has(id))elements.set(id,node());return elements.get(id)};
 const ctx={URLSearchParams,Headers,location:{search:privateMode?'?ownerPreview=1':'',pathname:'/'},Pi:{init(){},createPayment(){payments++}},document:{body:{style:{},prepend(){}},documentElement:{},addEventListener(){},getElementById:el,querySelectorAll:()=>[],createElement:node},localStorage:{getItem:k=>cache.get(k)||null,setItem:(k,v)=>cache.set(k,v),removeItem:k=>cache.delete(k)},fetch:async(url,o)=>{request={url,o};return{}},navigator:{},console,queueMicrotask,setTimeout,clearTimeout,setInterval,clearInterval,requestAnimationFrame:f=>f()};
 vm.createContext(ctx);vm.runInContext(script+';globalThis.probe={request:()=>gameFetch("/api/state",{method:"POST"}),write:()=>gameStorage.setItem("sticker-player","TEST"),buy:()=>{authData={accessToken:"dummy"};return buyPack()}}',ctx);
 await ctx.probe.request();assert.equal(request.o.headers.get('X-Sticker-Owner-Preview'),privateMode?'1':null);
 ctx.probe.write();assert.equal(cache.get(privateMode?'owner-preview:v1:sticker-player':'sticker-player'),'TEST');
 if(privateMode){assert.equal(cache.get('sticker-player'),'REAL ACCOUNT CACHE');await ctx.probe.buy();assert.equal(payments,0);assert.equal(el('payBtn').hidden,true);}
}
console.log('PASS browser cache separation, private request routing and disabled payment initiation');
})().catch(e=>{console.error(e);process.exitCode=1});
