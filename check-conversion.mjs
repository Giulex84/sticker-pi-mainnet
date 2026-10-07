import assert from 'node:assert/strict';
process.env.UPSTASH_REDIS_REST_URL='https://mock.invalid';
process.env.UPSTASH_REDIS_REST_TOKEN='test-only';
const db=new Map();let loseResponse=false,conflict=false;
globalThis.fetch=async(url,options)=>{
  assert.equal(url,'https://mock.invalid');
  const a=JSON.parse(options.body);let result;
  if(a[0]==='GET')result=db.get(a[1])??null;
  else if(a[0]==='SET'){
    if(a.includes('NX')&&db.has(a[1]))result=null;
    else{db.set(a[1],a[2]);result='OK'}
  }else if(a[0]==='EVAL'&&a[2]==='1'){
    result=db.get(a[3])===a[4]?Number(db.delete(a[3])):0;
  }else if(a[0]==='EVAL'&&a[2]==='2'){
    const [,script,,pk,rk,old,player,receipt]=a;assert.match(script,/redis.call\('SET',KEYS\[2\]/);
    if(conflict){db.set(pk,JSON.stringify({...JSON.parse(db.get(pk)),xp:999}));conflict=false}
    result=(db.get(pk)||'')===old&&!db.has(rk)?1:0;
    if(result){db.set(pk,player);db.set(rk,receipt)}
    if(loseResponse){loseResponse=false;throw new Error('Response lost after commit')}
  }else if(['INCR','EXPIRE','ZADD'].includes(a[0])){result=a[0]==='INCR'?(Number(db.get(a[1])||0)+1):1;if(a[0]==='INCR')db.set(a[1],result)}else throw new Error('Unsupported test Redis command '+a[0]);
  return {ok:true,json:async()=>({result})};
};
const {defaultPlayer,savePlayer,getPlayer,quoteDuplicateConversion,convertDuplicates,conversionCatalog,grantPaidPack,openPlayerPack,recordRun,serverDay}=await import('./lib/store.js');
const uid='tester',name='Tester';
async function seed(collection){db.clear();const p=defaultPlayer(uid,name);p.collection=collection;p.duplicates=Object.fromEntries(Object.entries(collection).map(([i,n])=>[i,Math.max(0,n-1)]));await savePlayer(p);return p}
const request=(plan,id='conversion_test_0001')=>({target:plan.target,quote:plan.quote,conversionId:id});
let p=await seed({0:5,1:4});
let plan=quoteDuplicateConversion(p,2);assert.equal(plan.cost,4);assert.deepEqual(plan.consumed,[{index:0,count:4}]);
let d=await convertDuplicates(uid,name,request(plan));assert.equal(d.player.collection[0],1);assert.equal(d.player.collection[1],4);assert.equal(d.player.collection[2],1);assert.equal(d.player.daily.newUnique,1);
d=await convertDuplicates(uid,name,request(plan));assert.equal(d.alreadyConverted,true);assert.equal(d.player.daily.newUnique,1);
await assert.rejects(()=>convertDuplicates(uid,name,{...request(plan),target:3}),/another sticker/);
assert.throws(()=>quoteDuplicateConversion(d.player,0),/already own/);
assert.throws(()=>quoteDuplicateConversion(d.player,23),/Not enough/);
assert.throws(()=>quoteDuplicateConversion(d.player,2.5),/Invalid/);
assert.throws(()=>quoteDuplicateConversion(d.player,'2'),/Invalid/);
p=await seed({0:10});plan=quoteDuplicateConversion(p,1);
await assert.rejects(()=>convertDuplicates(uid,name,{...request(plan),quote:'tampered'}),/changed/);
assert.equal((await getPlayer(uid,name)).collection[0],10);
conflict=true;await assert.rejects(()=>convertDuplicates(uid,name,request(plan)),/collection changed/);
assert.equal((await getPlayer(uid,name)).xp,999);assert.equal((await getPlayer(uid,name)).collection[0],10);
p=await seed({0:9});plan=quoteDuplicateConversion(p,1);loseResponse=true;
await assert.rejects(()=>convertDuplicates(uid,name,request(plan)),/Response lost/);
d=await convertDuplicates(uid,name,request(plan));assert.equal(d.alreadyConverted,true);assert.equal(d.player.collection[0],1);assert.equal(d.player.collection[1],1);
p=await seed({0:9});plan=quoteDuplicateConversion(p,2);
const parallel=await Promise.allSettled([convertDuplicates(uid,name,request(plan,'concurrent_request_01')),convertDuplicates(uid,name,request(plan,'concurrent_request_02'))]);
assert.equal(parallel.filter(x=>x.status==='fulfilled').length,1);assert.equal((await getPlayer(uid,name)).collection[0],5);
p=await seed(Object.fromEntries(Array.from({length:23},(_,i)=>[i,i===0?25:1])));plan=quoteDuplicateConversion(p,23);
d=await convertDuplicates(uid,name,request(plan));assert.equal(d.albumCompleted,true);assert.equal(d.player.xp,250);assert.equal(d.player.packs,4);assert.equal(conversionCatalog(d.player).targets.length,0);
d=await convertDuplicates(uid,name,request(plan));assert.equal(d.player.xp,250);assert.equal(d.player.packs,4);
await grantPaidPack(uid,name,'verified-payment');d=await grantPaidPack(uid,name,'verified-payment');assert.equal(d.alreadyGranted,true);assert.equal(d.player.packs,5);
console.log('Conversion tests passed: cost, spare-copy preservation, invalid/stale requests, durable replay, lost response, concurrency, CAS conflict, album reward once, paid-pack replay.');

p=await seed({0:1});const yesterday=new Date(Date.now()-86400000).toISOString().slice(0,10);p.lastDaily=yesterday;p.streak=1;p.activeRun={id:'verified-run',startedAt:Date.now()-30000,day:serverDay()};await savePlayer(p);
d=await recordRun(uid,name,{runId:'verified-run',score:28,bestCombo:11,hits:24,misses:3});assert.equal(d.player.streak,2);assert.equal(d.packGranted,true);const runXp=d.player.xp;
d=await recordRun(uid,name,{runId:'verified-run',score:28,bestCombo:11,hits:24,misses:3});assert.equal(d.alreadyRecorded,true);assert.equal(d.player.xp,runXp);
d=await openPlayerPack(uid,name,{openId:'regression-pack'});const afterPack=JSON.stringify(d.player);
d=await openPlayerPack(uid,name,{openId:'regression-pack'});assert.equal(d.alreadyOpened,true);assert.equal(JSON.stringify(d.player),afterPack);
const {default:handler}=await import('./api/state.js');
async function api(body,authorization){const res={status(n){this.code=n;return this},json(value){this.body=value;return this},setHeader(){}};await handler({method:'POST',headers:{authorization},body},res);return res}
const unauthorized=await api({action:'convert_duplicates',target:2});assert.equal(unauthorized.code,401);
const redisFetch=globalThis.fetch;globalThis.fetch=(url,options)=>url==='https://api.minepi.com/v2/me'?Promise.resolve({ok:true,json:async()=>({uid,username:name})}):redisFetch(url,options);
p=await seed({0:5});const quoteResponse=await api({action:'conversion_quote',target:2},'Bearer test');assert.equal(quoteResponse.code,200);
const convertedResponse=await api({action:'convert_duplicates',...request(quoteResponse.body),cost:0,consumed:[]},'Bearer test');assert.equal(convertedResponse.code,200);assert.equal(convertedResponse.body.cost,4);assert.equal(convertedResponse.body.player.collection[0],1);
console.log('Regression and API tests passed: streak, run/pack replay, authentication, server-owned conversion cost.');
