import assert from 'node:assert/strict';
process.env.UPSTASH_REDIS_REST_URL='https://mock.invalid';
process.env.UPSTASH_REDIS_REST_TOKEN='dummy';
const keys=[];let writes=false;
globalThis.fetch=async(url, options={})=>{
  if(url==='https://api.minepi.com/v2/me') {
    const token=options.headers.Authorization;
    if(token==='Bearer expired')return {ok:false};
    return {ok:true,json:async()=>({uid:'owner-uid',username:token==='Bearer owner'?'Giulex84':'OtherPioneer'})};
  }
  assert.equal(url,'https://mock.invalid');
  const args=JSON.parse(options.body);const n=args[0]==='EVAL'?Number(args[2]):1;const offset=args[0]==='EVAL'?3:1;keys.push(...args.slice(offset,offset+n));
  await new Promise(resolve=>setTimeout(resolve,1));
  return {ok:true,json:async()=>({result:args[0]==='SET'?'OK':args[0]==='EVAL'?1:null})};
};
const {ownerPreviewHandler,inOwnerPreview}=await import('../lib/owner-preview.js');
const {getPlayer,recordMetric,startRun}=await import('../lib/store.js');
function request(token='owner',mode='1',body={}){return {headers:{authorization:'Bearer '+token,...(mode?{'x-sticker-owner-preview':mode}:{})},body};}
function response(){return {headers:{},code:200,setHeader(k,v){this.headers[k]=v},status(n){this.code=n;return this},json(value){this.value=value;return this}};}
const handler=ownerPreviewHandler(async(_req,res)=>{
  if(writes)await startRun('owner-uid','Giulex84');
  const player=await getPlayer('owner-uid','Giulex84');
  if(inOwnerPreview())assert.equal(await recordMetric('2026-11-02','subject','login'),false);
  return res.json({player,private:inOwnerPreview()});
});
const normal=response(),preview=response();
await Promise.all([handler(request('owner',null),normal),handler(request(),preview)]);
assert.equal(normal.value.private,false);assert.equal(preview.value.private,true);
assert.equal(preview.value.player.level,1);assert.equal(preview.value.player.packs,1);
assert(keys.includes('sticker:mainnet:player:owner-uid'));
assert(keys.some(k=>/^sticker:owner-preview:v1:[a-f0-9]{64}:player:owner-uid$/.test(k)));
assert.equal(keys.length,2); // No metric writes in private context.
for(const [token,mode,expected] of [['other','1',403],['expired','1',401],['owner','bad',400]]){
 const res=response(),before=keys.length;await handler(request(token,mode),res);assert.equal(res.code,expected);assert.equal(keys.length,before);
}
let called=false;
const pay=ownerPreviewHandler(async()=>{called=true},{payments:true});
for(const action of ['approve','complete','recover']){const res=response();await pay(request('owner','1',{action}),res);assert.equal(res.code,403);}
assert.equal(called,false);
writes=true;keys.length=0;await handler(request(),response());assert(keys.length>4);assert(keys.every(k=>k.startsWith('sticker:owner-preview:v1:')));
assert.equal(inOwnerPreview(),false);
process.env.STICKER_OWNER_PREVIEW_DISABLED='1';
const disabled=response(),beforeDisabled=keys.length;
await handler(request(),disabled);
assert.equal(disabled.code,403);assert.equal(keys.length,beforeDisabled);
const ordinary=response();await handler(request('owner',null),ordinary);
assert.equal(ordinary.code,200);assert.equal(ordinary.value.private,false);
delete process.env.STICKER_OWNER_PREVIEW_DISABLED;
console.log('PASS private identity gate, concurrent namespace isolation, fresh profile, no public metrics, payment/recovery denial');
