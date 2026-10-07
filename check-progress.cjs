const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8'),script=html.match(/<script>\s*([\s\S]*?)<\/script>/)[1];
const els=new Map();function el(id){if(!els.has(id))els.set(id,{textContent:'',innerHTML:'',style:{},classList:{toggle(){},add(){},remove(){},contains(){return false}},appendChild(){}});return els.get(id)}
const ctx={Pi:{init(){}},document:{documentElement:{},getElementById:el,querySelectorAll(){return[]},createElement(){return {className:'',innerHTML:''}}},localStorage:{getItem(){return 'en'},setItem(){}},navigator:{},location:{},console,queueMicrotask,setTimeout,clearTimeout,setInterval,clearInterval,requestAnimationFrame:f=>f()};
vm.createContext(ctx);vm.runInContext(script+';globalThis.check={set:p=>{player={...player,...p};render()},next:showNextGoal};',ctx);
ctx.check.set({packs:0,collection:{0:1},daily:{bestScore:20,runPackGranted:false,packsOpened:0,newUnique:0}});
assert.equal(el('q1').textContent,'20/25');assert.match(el('nextGoalBtn').textContent,/Play/);assert.match(el('albumGoalHint').textContent,/23 stickers/);
ctx.check.set({packs:1,daily:{bestScore:28,runPackGranted:true,packsOpened:1,newUnique:2}});
assert.equal(el('q1').textContent,'✓');assert.match(el('nextGoalBtn').textContent,/Open/);
ctx.check.set({packs:0,collection:Object.fromEntries(Array.from({length:24},(_,i)=>[i,1]))});
assert.match(el('nextGoalBtn').textContent,/album/);assert.match(el('albumGoalHint').textContent,/complete/);
assert(!script.includes('          loadLocal();'));
assert(html.includes('sandbox: false'));assert(script.includes('amount: 0.01'));
console.log('Progress goals: threshold, earned reward, next action, album completion and authoritative login passed.');
