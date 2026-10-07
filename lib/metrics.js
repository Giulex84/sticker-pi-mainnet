import crypto from 'node:crypto';
import {recordMetric} from './store.js';

const EVENTS=new Set(['login','run_started','run_completed','pack_opened','album_completed','paid_pack_purchased','duplicates_converted','xp_pack_earned','player_first_run','player_repeat_run']);
const day=()=>new Date().toISOString().slice(0,10);
function pseudonym(value){
  const secret=(process.env.STICKER_METRICS_SECRET||process.env.PI_API_KEY||'').trim();
  if(!secret)throw new Error('Metrics secret is not configured');
  return crypto.createHmac('sha256',secret).update(value).digest('hex');
}
export async function safeRecordMetric(uid,event,dedupeId=''){
  if(!uid||!EVENTS.has(event))return false;
  try{
    const subject=pseudonym(`user:${uid}`);
    const dedupe=dedupeId?pseudonym(`event:${uid}:${event}:${dedupeId}`):'';
    return await recordMetric(day(),subject,event,dedupe);
  }catch{return false}
}
