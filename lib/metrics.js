import crypto from 'node:crypto';
import {recordMetric} from './store.js';
import {inOwnerPreview} from './owner-preview.js';

// Log fixed outcome codes only. Never log identities, tokens, hashes or raw errors.
function report(status, reason) {
 const message=JSON.stringify({event:'sticker_login_metric',status,reason});
 if(status==='recorded')console.info(message);else console.warn(message);
 return {status,reason};
}
export async function recordLoginMetricWithStatus(uid,day=new Date().toISOString().slice(0,10)){
 if(inOwnerPreview())return {status:'excluded',reason:'owner_preview'};
 if(!uid)return report('failed','identity_missing');
 const secret=(process.env.STICKER_METRICS_SECRET||process.env.PI_API_KEY||'').trim();
 if(!secret)return report('failed','configuration_missing');
 try{
  const subject=crypto.createHmac('sha256',secret).update(`user:${uid}`).digest('hex');
  const recorded=await recordMetric(day,subject,'login');
  return recorded?report('recorded','write_confirmed'):report('failed','write_not_confirmed');
 }catch{return report('failed','storage_write_failed');}
}
// Only successful Mainnet sign-ins are measured. All other calls are no-ops.
export async function safeRecordMetric(uid,event,dedupeId='',value=0,eventDay=new Date().toISOString().slice(0,10)){
 if(!uid||event!=='login')return false;
 return (await recordLoginMetricWithStatus(uid,eventDay)).status==='recorded';
}

