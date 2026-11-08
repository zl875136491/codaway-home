const path=require('node:path');
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
let intervals=new Set(),timeouts=new Set(),next=0,nodes=new Map();
const node=()=>({style:{},dataset:{},value:'fixture@example.invalid',textContent:'',disabled:false,classList:{add(){},remove(){},toggle(){}},setAttribute(){},addEventListener(){},focus(){}});
const sandbox={console,document:{getElementById(id){if(!nodes.has(id))nodes.set(id,node());return nodes.get(id)},querySelector(){return node()},querySelectorAll(){return []}},setInterval(){let id=++next;intervals.add(id);return id},clearInterval(id){intervals.delete(id)},setTimeout(){let id=++next;timeouts.add(id);return id},clearTimeout(id){timeouts.delete(id)},fetch:async()=>({ok:true,json:async()=>({}),text:async()=>''})};
sandbox.window=sandbox;vm.createContext(sandbox);
function scripts(name){return [...fs.readFileSync(path.join(__dirname,'..',name),'utf8').matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(x=>x[1]).filter(x=>x.trim())}
(async()=>{for(let i=0;i<3;i++){
 for(const script of scripts('index.html'))vm.runInContext(script,sandbox);
 assert.equal(intervals.size,1);sandbox.disposePage();assert.equal(intervals.size,0);
 nodes=new Map();for(const script of scripts('register.html'))vm.runInContext(script,sandbox);
 await sandbox.sendVerifyCode();assert.equal(intervals.size,1);sandbox.switchAuthTab('reset');sandbox.disposePage();assert.equal(intervals.size,0);
} console.log('Home JS: repeated home/register navigation and timer cleanup passed (3 cycles)')})().catch(e=>{console.error(e);process.exitCode=1});
