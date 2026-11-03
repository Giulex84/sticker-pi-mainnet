import assert from 'node:assert/strict';
process.env.UPSTASH_REDIS_REST_URL='https://mock.invalid';
process.env.UPSTASH_REDIS_REST_TOKEN='dummy-storage-secret';
process.env.PI_API_KEY='dummy-api-secret';
const logs=[],calls=[];let mode='ok';
const original={info:console.info,warn:console.warn};
console.info=message=>logs.push(message);console.warn=message=>logs.push(message);
globalThis.fetch=async(url,options={})=>{
 if(url==='https://api.minepi.com/v2/me')return {ok:true,json:async()=>({uid:'private-user-id',username:'Giulex84'})};
 assert.equal(url,'https://mock.invalid');const args=JSON.parse(options.body);calls.push(args);
 if(args[0]==='INCR')return {ok:true,json:async()=>({result:1})};
 if(args[0]==='EXPIRE')return {ok:true,json:async()=>({result:1})};
 if(mode==='throw')throw Error('private-user-id dummy-api-secret');
 if(mode==='http')return {ok:false};
 if(mode==='redis')return {ok:true,json:async()=>({error:'sensitive backend detail'})};
 return {ok:true,json:async()=>({result:mode==='unconfirmed'?0:1})};
};
try{
 const {recordLoginMetricWithStatus,safeRecordMetric}=await import('../lib/metrics.js');
 const {default:auth}=await import('../api/auth.js');
 const req=preview=>({method:'POST',headers:{authorization:'Bearer dummy-token',...(preview?{'x-sticker-owner-preview':'1'}:{})},body:{}});
 const res=()=>({code:200,setHeader(){},status(code){this.code=code;return this},json(body){this.body=body;return this}});
 assert.deepEqual(await recordLoginMetricWithStatus('private-user-id'),{status:'recorded',reason:'write_confirmed'});
 for(const failure of ['throw','http','redis','unconfirmed']){
  mode=failure;const response=res();await auth(req(false),response);
  assert.equal(response.code,200);assert.equal(response.body.success,true);assert.equal(response.body.loginMetric.status,'failed');
 }
 mode='ok';let response=res();await auth(req(false),response);assert.equal(response.body.loginMetric.status,'recorded');
 const before=calls.length,logCount=logs.length;
 response=res();await auth(req(true),response);assert.deepEqual(response.body.loginMetric,{status:'excluded',reason:'owner_preview'});
 assert.equal(logs.length,logCount);
 assert(calls.slice(before).every(a=>a[0]!=='EVAL')); // Private login never writes public attendance.
 delete process.env.PI_API_KEY;
 assert.deepEqual(await recordLoginMetricWithStatus('private-user-id'),{status:'failed',reason:'configuration_missing'});
 const noops=logs.length;assert.equal(await safeRecordMetric('private-user-id','paid_pack_purchased'),false);assert.equal(logs.length,noops);
 for(const line of logs){const record=JSON.parse(line);assert.equal(record.event,'sticker_login_metric');assert(!/private-user-id|dummy-|sensitive|Bearer/.test(line));assert.deepEqual(Object.keys(record).sort(),['event','reason','status']);}
}finally{console.info=original.info;console.warn=original.warn;}
console.log('PASS login success survives metric failures; fixed diagnostics, confirmed writes, owner exclusion and no secret/identity logging');
