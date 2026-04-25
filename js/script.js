// ════════════════════════════════════════
// THREE.JS 3D SCENE
// ════════════════════════════════════════
(function() {
  const canvas = document.getElementById('c3d');
  const R = new THREE.WebGLRenderer({canvas, alpha:true, antialias:true});
  R.setPixelRatio(Math.min(devicePixelRatio, 2));
  R.setSize(innerWidth, innerHeight);

  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(60, innerWidth/innerHeight, 0.1, 1000);
  cam.position.z = 32;

  const COLS = [0x00d4ff, 0xff0080, 0x7c3aed, 0x00ff88, 0xffd700, 0x06b6d4];
  const cubes = [];

  // Floating wireframe cubes
  for (let i = 0; i < 18; i++) {
    const sz = Math.random() * 2.2 + 0.5;
    const geo = new THREE.BoxGeometry(sz, sz, sz);
    const edges = new THREE.EdgesGeometry(geo);
    const mat = new THREE.LineBasicMaterial({
      color: COLS[i % COLS.length],
      transparent: true,
      opacity: 0.55 + Math.random() * 0.25
    });
    const mesh = new THREE.LineSegments(edges, mat);
    mesh.position.set(
      (Math.random()-.5)*68,
      (Math.random()-.5)*44,
      (Math.random()-.5)*22
    );
    mesh.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
    scene.add(mesh);
    cubes.push({
      m: mesh,
      rx: (Math.random()-.5)*.009,
      ry: (Math.random()-.5)*.013,
      rz: (Math.random()-.5)*.007,
      fy: Math.random()*.004+.001,
      fo: Math.random()*Math.PI*2,
      base: mesh.position.y
    });
  }

  // Particle field
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(1200);
  for (let i = 0; i < 1200; i++) pPos[i] = (Math.random()-.5)*110;
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({
    color: 0x00d4ff, size: .06, transparent:true, opacity:.45
  })));

  // Pink particles
  const p2Geo = new THREE.BufferGeometry();
  const p2Pos = new Float32Array(600);
  for (let i = 0; i < 600; i++) p2Pos[i] = (Math.random()-.5)*110;
  p2Geo.setAttribute('position', new THREE.BufferAttribute(p2Pos, 3));
  scene.add(new THREE.Points(p2Geo, new THREE.PointsMaterial({
    color: 0xff0080, size: .05, transparent:true, opacity:.3
  })));

  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = (e.clientX/innerWidth-.5)*2;
    my = -(e.clientY/innerHeight-.5)*2;
  });

  const clk = new THREE.Clock();
  (function loop() {
    requestAnimationFrame(loop);
    const t = clk.getElapsedTime();
    cubes.forEach(c => {
      c.m.rotation.x += c.rx;
      c.m.rotation.y += c.ry;
      c.m.rotation.z += c.rz;
      c.m.position.y = c.base + Math.sin(t*c.fy*5 + c.fo)*1.6;
    });
    cam.position.x += (mx*3.5 - cam.position.x)*.018;
    cam.position.y += (my*2.2 - cam.position.y)*.018;
    cam.lookAt(scene.position);
    R.render(scene, cam);
  })();

  window.addEventListener('resize', () => {
    cam.aspect = innerWidth/innerHeight;
    cam.updateProjectionMatrix();
    R.setSize(innerWidth, innerHeight);
  });
})();

// ════════════════════════════════════════
// STATE
// ════════════════════════════════════════
let products = [];
let baseRevenue = 0;
let countdown = 30;
let cdInt, skuChart, ltvChart, simChart;

const FAKESTORE = 'https://fakestoreapi.com/products';

// ════════════════════════════════════════
// UTILS
// ════════════════════════════════════════
function fmt(n) {
  if (n >= 1e6) return '$'+(n/1e6).toFixed(2)+'M';
  if (n >= 1e3) return '$'+(n/1e3).toFixed(1)+'K';
  return '$'+n.toFixed(2);
}
function fmtPlain(n) {
  if (n >= 1e6) return (n/1e6).toFixed(2)+'M';
  if (n >= 1e3) return (n/1e3).toFixed(1)+'K';
  return n.toFixed(2);
}

function counter(id, from, to, format, ms=1600) {
  const el = document.getElementById(id);
  if (!el) return;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now-start)/ms, 1);
    const ease = 1-Math.pow(1-p, 3);
    el.textContent = format(from + (to-from)*ease);
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ════════════════════════════════════════
// FETCH & PROCESS
// ════════════════════════════════════════
async function fetchData() {
  try {
    const r = await fetch(FAKESTORE);
    products = await r.json();
  } catch(e) {
    products = fallbackProducts();
  }
  render();
}

function render() {
  if (!products.length) return;

  // Simulate units sold per product (varied)
  const units = products.map(p => Math.floor(Math.random()*55 + 8));
  const revs = products.map((p,i) => p.price * units[i]);
  const total = revs.reduce((a,b)=>a+b, 0);
  baseRevenue = total;

  const avgPrice = products.reduce((a,p)=>a+p.price,0)/products.length;
  const aband = 62.3 + (Math.random()*8-4);
  const ltv = avgPrice * 3.4 * (1 + Math.random()*.08);
  const orders = Math.floor(total / (avgPrice*1.6));
  const aov = total / orders;

  counter('v-rev', 0, total, v=>fmt(v));
  counter('v-prod', 0, products.length, v=>Math.floor(v));
  counter('v-aband', 0, aband, v=>v.toFixed(1)+'%');
  counter('v-ltv', 0, ltv, v=>fmt(v));
  counter('v-ord', 0, orders, v=>Math.floor(v).toLocaleString());
  counter('v-aov', 0, aov, v=>fmt(v));

  document.getElementById('ts').textContent = 'UPDATED '+new Date().toLocaleTimeString();
  document.getElementById('sr-cur').textContent = fmt(total);
  document.getElementById('sr-proj').textContent = fmt(total);
  document.getElementById('sr-up').textContent = '+$0';
  document.getElementById('sr-pct').textContent = '+0%';

  renderSKU(revs);
  renderLTV();
  renderHeatmap();
  renderSim();
}

function fallbackProducts() {
  return [
    {id:1,title:"Men's Cotton Jacket",price:55.99,category:"men's clothing"},
    {id:2,title:"Fjallraven Backpack",price:109.95,category:"men's clothing"},
    {id:3,title:"Slim Fit T-Shirt",price:22.30,category:"men's clothing"},
    {id:4,title:"WD 2TB Elements",price:64.00,category:"electronics"},
    {id:5,title:"SanDisk 1TB SSD",price:109.00,category:"electronics"},
    {id:6,title:"Silicon Power SSD",price:58.99,category:"electronics"},
    {id:7,title:"WD Internal SSD",price:55.49,category:"electronics"},
    {id:8,title:"Lock and Love Jacket",price:13.00,category:"women's clothing"},
    {id:9,title:"Rain Jacket Women",price:39.99,category:"women's clothing"},
    {id:10,title:"John Hardy Bracelet",price:695.00,category:"jewelery"},
    {id:11,title:"Solid Gold Petite",price:168.00,category:"jewelery"},
    {id:12,title:"Pierced Owl Rings",price:10.99,category:"jewelery"},
    {id:13,title:"Elegant Dress",price:7.95,category:"women's clothing"},
    {id:14,title:"MBJ Tops",price:9.85,category:"women's clothing"},
    {id:15,title:"Opna Short Sleeve",price:7.99,category:"men's clothing"},
    {id:16,title:"DANVOUY T-Shirt",price:12.99,category:"women's clothing"},
    {id:17,title:"Acer SB220Q Monitor",price:599.00,category:"electronics"},
    {id:18,title:"Samsung Galaxy Tab",price:699.99,category:"electronics"},
    {id:19,title:"Laptop Rucksack",price:57.99,category:"men's clothing"},
    {id:20,title:"Pierced Gold Ring",price:10.99,category:"jewelery"},
  ];
}

// ════════════════════════════════════════
// CHARTS
// ════════════════════════════════════════
const CHART_DEFAULTS = {
  color: '#94a3b8',
  font: {family:"'JetBrains Mono', monospace", size:10},
  gridColor: 'rgba(0,212,255,0.05)',
  tipBg: 'rgba(1,10,24,0.95)',
  tipBorder: 'rgba(0,212,255,0.3)',
};

function renderSKU(revs) {
  if (skuChart) skuChart.destroy();
  const sorted = products.map((p,i)=>({...p,rev:revs[i]}))
    .sort((a,b)=>b.rev-a.rev).slice(0,5);

  const ctx = document.getElementById('chart-sku').getContext('2d');
  const COLORS = ['#00d4ff','#ff0080','#7c3aed','#00ff88','#ffd700'];
  skuChart = new Chart(ctx, {
    type:'bar',
    data:{
      labels: sorted.map(p=>p.title.substring(0,22)+(p.title.length>22?'…':'')),
      datasets:[{
        data: sorted.map(p=>Math.round(p.rev)),
        backgroundColor: COLORS.map(c=>c+'99'),
        borderColor: COLORS,
        borderWidth:1, borderRadius:2, borderSkipped:false
      }]
    },
    options:{
      indexAxis:'y', responsive:true, maintainAspectRatio:true,
      animation:{duration:900, easing:'easeOutQuart'},
      plugins:{
        legend:{display:false},
        tooltip:{
          backgroundColor:CHART_DEFAULTS.tipBg,
          borderColor:CHART_DEFAULTS.tipBorder, borderWidth:1,
          titleColor:'#00d4ff', bodyColor:'#e2e8f0',
          titleFont:{family:"'JetBrains Mono',monospace",size:11},
          bodyFont:{family:"'JetBrains Mono',monospace",size:11},
          callbacks:{label:c=>' Revenue: $'+c.parsed.x.toLocaleString()}
        }
      },
      scales:{
        x:{grid:{color:CHART_DEFAULTS.gridColor},ticks:{color:CHART_DEFAULTS.color,font:CHART_DEFAULTS.font,callback:v=>'$'+v.toLocaleString()}},
        y:{grid:{display:false},ticks:{color:CHART_DEFAULTS.color,font:{...CHART_DEFAULTS.font,size:9}}}
      }
    }
  });
}

function renderLTV() {
  if (ltvChart) ltvChart.destroy();
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const base = 240;
  const data = months.map((_,i)=>Math.round(base + i*19 + (Math.random()*28-14)));

  const ctx = document.getElementById('chart-ltv').getContext('2d');
  const grad = ctx.createLinearGradient(0,0,0,270);
  grad.addColorStop(0,'rgba(0,255,136,0.35)');
  grad.addColorStop(1,'rgba(0,255,136,0)');

  ltvChart = new Chart(ctx, {
    type:'line',
    data:{
      labels:months,
      datasets:[{
        data,fill:true,
        backgroundColor:grad,
        borderColor:'#00ff88',borderWidth:2,
        pointBackgroundColor:'#00ff88',
        pointBorderColor:'#010a18',
        pointBorderWidth:2,pointRadius:4,
        tension:0.42
      }]
    },
    options:{
      responsive:true, maintainAspectRatio:true,
      animation:{duration:900},
      plugins:{
        legend:{display:false},
        tooltip:{
          backgroundColor:CHART_DEFAULTS.tipBg,
          borderColor: 'rgba(0,255,136,0.3)',borderWidth:1,
          titleColor:'#00ff88',bodyColor:'#e2e8f0',
          titleFont:{family:"'JetBrains Mono',monospace",size:11},
          bodyFont:{family:"'JetBrains Mono',monospace",size:11},
          callbacks:{label:c=>' LTV: $'+c.parsed.y}
        }
      },
      scales:{
        x:{grid:{color:CHART_DEFAULTS.gridColor},ticks:{color:CHART_DEFAULTS.color,font:CHART_DEFAULTS.font}},
        y:{grid:{color:CHART_DEFAULTS.gridColor},ticks:{color:CHART_DEFAULTS.color,font:CHART_DEFAULTS.font,callback:v=>'$'+v}}
      }
    }
  });
}

function renderHeatmap() {
  const cats = [...new Set(products.map(p=>p.category))];
  const slots = ['6–9AM','9–12PM','12–3PM','3–6PM','6–9PM','9–12AM'];
  const container = document.getElementById('heatmap');

  // Build grid structure
  let html = `<div class="heat-grid" style="grid-template-columns:110px repeat(${slots.length},1fr)">`;

  // Header
  html += `<div class="heat-lbl"></div>`;
  slots.forEach(s => {
    html += `<div style="text-align:center;font-family:'JetBrains Mono',monospace;font-size:.58rem;color:var(--t2);padding-bottom:5px">${s}</div>`;
  });

  cats.forEach(cat => {
    html += `<div class="heat-lbl">${cat}</div>`;
    slots.forEach(slot => {
      const v = Math.floor(Math.random()*100);
      const norm = v/100;
      let r,g,b;
      if (norm < .5) {
        r = Math.round(0 + norm*2*0);
        g = Math.round(100 + norm*2*112);
        b = Math.round(200 + norm*2*55);
      } else {
        const p = (norm-.5)*2;
        r = Math.round(0 + p*255);
        g = Math.round(212 - p*212);
        b = Math.round(255 - p*175);
      }
      const alpha = 0.18 + norm*.65;
      html += `<div class="heat-cell" style="background:rgba(${r},${g},${b},${alpha})" data-tip="${cat} · ${slot}: ${v} orders">${v}</div>`;
    });
  });
  html += '</div>';
  container.innerHTML = html;
}

function renderSim() {
  const a = +document.getElementById('sl-a').value;
  const b = +document.getElementById('sl-b').value;
  const c = +document.getElementById('sl-c').value;

  document.getElementById('sv-a').textContent = a+'%';
  document.getElementById('sv-b').textContent = b+'%';
  document.getElementById('sv-c').textContent = c+'%';

  const base = baseRevenue || 35000;
  const mult = (1 + (a/100)*.32) * (1 + b/100) * (1 + c/100);
  const proj = base * mult;
  const uplift = proj - base;
  const upliftPct = ((uplift/base)*100).toFixed(1);

  document.getElementById('sr-cur').textContent = fmt(base);
  document.getElementById('sr-proj').textContent = fmt(proj);
  document.getElementById('sr-up').textContent = (uplift>=0?'+':'')+fmt(Math.abs(uplift));
  document.getElementById('sr-pct').textContent = (uplift>=0?'+':'')+upliftPct+'%';

  // Sim chart
  if (simChart) simChart.destroy();
  const ctx = document.getElementById('chart-sim').getContext('2d');
  simChart = new Chart(ctx, {
    type:'bar',
    data:{
      labels:['Current Revenue','Projected Revenue'],
      datasets:[{
        data:[Math.round(base), Math.round(proj)],
        backgroundColor:['rgba(0,212,255,0.35)','rgba(0,255,136,0.35)'],
        borderColor:['#00d4ff','#00ff88'],
        borderWidth:1.5,borderRadius:3,borderSkipped:false
      }]
    },
    options:{
      responsive:true,maintainAspectRatio:true,
      animation:{duration:400,easing:'easeInOutCubic'},
      plugins:{legend:{display:false},tooltip:{
        backgroundColor:CHART_DEFAULTS.tipBg,
        borderColor:CHART_DEFAULTS.tipBorder,borderWidth:1,
        titleColor:'#00d4ff',bodyColor:'#e2e8f0',
        titleFont:{family:"'JetBrains Mono',monospace",size:11},
        bodyFont:{family:"'JetBrains Mono',monospace",size:11},
        callbacks:{label:c=>' '+fmt(c.parsed.y)}
      }},
      scales:{
        x:{grid:{display:false},ticks:{color:CHART_DEFAULTS.color,font:CHART_DEFAULTS.font}},
        y:{grid:{color:CHART_DEFAULTS.gridColor},ticks:{color:CHART_DEFAULTS.color,font:CHART_DEFAULTS.font,callback:v=>fmt(v)}}
      }
    }
  });
}

['sl-a','sl-b','sl-c'].forEach(id => {
  document.getElementById(id).addEventListener('input', renderSim);
});

// ════════════════════════════════════════
// LIVE ORDER FEED
// ════════════════════════════════════════
const PRODS = ['Wireless ANC Headphones','4K Gaming Monitor','Carbon Fiber Wallet','Running Shoes Pro','Smart Watch Series X','Mechanical Keyboard','Bamboo Desk Mat','USB-C Hub 11-in-1','Ergonomic Chair Pad','Portable SSD 2TB','LED Ring Light Kit','Minimalist Laptop Bag'];
const STATUSES = ['completed','processing','pending','failed'];
const SBADGE = {completed:'b-comp',processing:'b-proc',pending:'b-pend',failed:'b-fail'};
let ordCount = 1000;

function makeOrder() {
  const id = '#ORD-'+(ordCount++);
  const prod = PRODS[Math.floor(Math.random()*PRODS.length)];
  const amt = (Math.random()*320+18).toFixed(2);
  const st = STATUSES[Math.floor(Math.random()*STATUSES.length)];
  return {id,prod,amt,st};
}

function pushOrder(o) {
  const feed = document.getElementById('feed');
  const el = document.createElement('div');
  el.className = 'feed-item';
  el.innerHTML = `
    <span class="f-id">${o.id}</span>
    <span class="f-prod">${o.prod}</span>
    <span class="f-amt">$${o.amt}</span>
    <span class="f-badge ${SBADGE[o.st]}">${o.st.toUpperCase()}</span>
  `;
  feed.insertBefore(el, feed.firstChild);
  if (feed.children.length > 18) feed.removeChild(feed.lastChild);
}

function seedFeed() {
  for (let i=0; i<10; i++) setTimeout(()=>pushOrder(makeOrder()), i*100);
}

function startLiveFeed() {
  setInterval(()=>{
    if (Math.random()>.28) pushOrder(makeOrder());
  }, 3500);
}

// ════════════════════════════════════════
// CARD REVEAL ANIMATION
// ════════════════════════════════════════
function revealCards() {
  const items = document.querySelectorAll('.kpi, .card, .feed-card, .sim-card');
  items.forEach((el, i) => {
    setTimeout(() => {
      el.style.transition = 'opacity .55s ease, transform .55s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, i * 90);
  });
}

// ════════════════════════════════════════
// REFRESH COUNTDOWN
// ════════════════════════════════════════
function startCountdown() {
  clearInterval(cdInt);
  countdown = 30;
  cdInt = setInterval(() => {
    countdown--;
    document.getElementById('timer').textContent = `REFRESH IN ${countdown}s`;
    if (countdown <= 0) {
      countdown = 30;
      fetchData();
    }
  }, 1000);
}

// ════════════════════════════════════════
// LOADING SEQUENCE
// ════════════════════════════════════════
const loadMsgs = [
  'INITIALIZING INTELLIGENCE MATRIX...',
  'CONNECTING TO DATA STREAMS...',
  'CALIBRATING ANALYTICS ENGINE...',
  'RENDERING COMMAND CENTER...'
];

window.addEventListener('load', () => {
  const bar = document.getElementById('lbar');
  const txt = document.getElementById('ltxt');
  bar.style.width = '100%';
  let mi = 0;
  const msgInt = setInterval(()=>{ if(++mi<loadMsgs.length) txt.textContent=loadMsgs[mi]; },380);

  setTimeout(() => {
    clearInterval(msgInt);
    const ld = document.getElementById('loading');
    ld.style.opacity = '0';
    setTimeout(()=>ld.remove(), 600);
    revealCards();
    setTimeout(() => {
      fetchData();
      seedFeed();
      startLiveFeed();
      startCountdown();
    }, 400);
  }, 1700);
});
