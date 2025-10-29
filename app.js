/* app.js — protótipo Open-WiFi (JS puro) */
/* Utiliza: let/const, arrow functions, DOM, fetch(.then) e async/await, localStorage, Canvas */

const STATE_KEY = 'openwifi:state-v1';
const defaultState = { devices: [], aps: [] };

/* ---------- Helper: state persistence ---------- */
const loadState = () => {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    return raw ? JSON.parse(raw) : structuredClone(defaultState);
  } catch (e) {
    console.error('Erro ao carregar state', e);
    return structuredClone(defaultState);
  }
};
const saveState = (s) => localStorage.setItem(STATE_KEY, JSON.stringify(s));

let state = loadState();

/* ---------- DOM refs ---------- */
const discoveredList = document.getElementById('discovered-list');
const btnScan = document.getElementById('btn-scan');
const scanStatus = document.getElementById('scan-status');

const deviceForm = document.getElementById('device-form');
const deviceNameInput = document.getElementById('device-name');
const deviceIpInput = document.getElementById('device-ip');
const formMsg = document.getElementById('form-msg');

const apList = document.getElementById('ap-list');
const btnAddAp = document.getElementById('btn-add-ap');
const btnLoadSample = document.getElementById('btn-load-sample');

const canvas = document.getElementById('traffic-canvas');
const chartStatus = document.getElementById('chart-status');
const btnRefreshChart = document.getElementById('btn-refresh-chart');

const btnExport = document.getElementById('btn-export');
const btnClear = document.getElementById('btn-clear');

/* ---------- Utilities (arrow functions) ---------- */
const rand = (min,max) => Math.floor(Math.random()*(max-min+1))+min;
const ipRandom = () => `192.168.1.${rand(2,250)}`;
const now = () => new Date().toLocaleString();

/* ---------- Render functions (DOM) ---------- */

function renderDiscovered(list){
  discoveredList.innerHTML = '';
  list.forEach(dev=>{
    const li = document.createElement('li');
    li.innerHTML = `<div>
      <strong>${escapeHTML(dev.name)}</strong>
      <div class="muted">IP: ${escapeHTML(dev.ip)} • ${escapeHTML(dev.mac || '')}</div>
    </div>
    <div>
      <button data-ip="${dev.ip}" class="btn-register">Registrar</button>
    </div>`;
    discoveredList.appendChild(li);
  });
}

/* Safety: simple escape to avoid injection when injecting strings */
function escapeHTML(str=''){
  return String(str).replace(/[&<>"']/g, s=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[s]));
}

function renderAPs(){
  apList.innerHTML = '';

  // We'll use sort and map to show APs
  const sorted = state.aps.slice().sort((a,b)=>b.clients - a.clients); // sort
  sorted.map(ap=>{
    const li = document.createElement('li');
    li.innerHTML = `<div>
      <strong>${escapeHTML(ap.name)}</strong>
      <div class="muted">SSID: ${escapeHTML(ap.ssid)} • Canal: ${ap.channel} • Clientes: ${ap.clients}</div>
    </div>
    <div>
      <button data-id="${ap.id}" class="btn-view">Ver</button>
      <button data-id="${ap.id}" class="btn-remove">Remover</button>
    </div>`;
    apList.appendChild(li);
  });
}

/* ---------- Events ---------- */

/* Simula "scan" na rede, acha 1 a 3 dispositivos */
btnScan.addEventListener('click', () => {
  scanStatus.textContent = 'Procurando...';
  btnScan.disabled = true;

  // Simulação de tempo de scan usando Promise
  new Promise((resolve) => {
    setTimeout(()=> {
      const count = rand(1,3);
      const found = Array.from({length:count}).map((_,i)=>({
        name:`Rasp-scan-${rand(100,999)}`,
        ip: ipRandom(),
        mac: `b8:27:eb:${rand(10,99)}:${rand(10,99)}:${rand(10,99)}`
      }));
      resolve(found);
    }, 1000 + rand(0,800));
  }).then(found=>{
    scanStatus.textContent = `Encontrados ${found.length} dispositivo(s) às ${now()}`;
    renderDiscovered(found);

    // botões de registrar nos itens
    discoveredList.querySelectorAll('.btn-register').forEach(btn=>{
      btn.addEventListener('click', (e)=>{
        const ip = e.currentTarget.dataset.ip;
        // preenche o formulário automaticamente
        deviceIpInput.value = ip;
        deviceNameInput.value = `Rasp-registrar-${ip.split('.').pop()}`;
        deviceNameInput.focus();
      });
    });
  }).catch(err=>{
    console.error(err);
    scanStatus.textContent = 'Erro no scan.';
  }).finally(()=>{
    btnScan.disabled = false;
  });
});

/* Formulário de cadastro de dispositivo */
deviceForm.addEventListener('submit', (ev) => {
  ev.preventDefault();
  formMsg.textContent = '';
  const name = deviceNameInput.value.trim();
  const ip = deviceIpInput.value.trim();

  // estruturas básicas: condicionais + laços (uso de for abaixo)
  if(!name || !ip){
    formMsg.textContent = 'Preencha nome e IP.';
    return;
  }

  // evita duplicados por IP
  const exists = state.devices.find(d => d.ip === ip);
  if(exists){
    formMsg.textContent = `Dispositivo com IP ${ip} já cadastrado.`;
    return;
  }

  const newDev = { name, ip, registeredAt: new Date().toISOString() };
  state.devices.push(newDev);
  saveState(state);
  formMsg.textContent = `Cadastrado ${name} — ${ip}`;
  deviceForm.reset();
  // Atualizações de UI podem incluir a lista de devices (aqui mostramos no discoveredList)
  renderDiscovered(state.devices);
});

/* Botão para adicionar AP exemplo (cria um AP com dados aleatórios) */
btnAddAp.addEventListener('click', ()=>{
  const id = `ap-${Date.now()}`;
  const ap = {
    id,
    name: `AP ${rand(100,999)}`,
    ssid: `OpenWiFi_${rand(10,99)}`,
    channel: [1,6,11][rand(0,2)],
    clients: rand(0,40),
    traffic: Array.from({length:6}, ()=>rand(2,50))
  };
  state.aps.push(ap);
  saveState(state);
  renderAPs();
  drawChart();
});

/* Delegation para lista de APs (ver/remover) */
apList.addEventListener('click', (ev)=>{
  const btn = ev.target.closest('button');
  if(!btn) return;
  const id = btn.dataset.id;
  if(btn.classList.contains('btn-remove')){
    state.aps = state.aps.filter(a=>a.id !== id); // filter
    saveState(state);
    renderAPs();
    drawChart();
  } else if(btn.classList.contains('btn-view')){
    const ap = state.aps.find(a=>a.id===id); // find
    if(ap){
      alert(`AP: ${ap.name}\nSSID: ${ap.ssid}\nCanal: ${ap.channel}\nClientes: ${ap.clients}`);
    }
  }
});

/* Export / Clear */
btnExport.addEventListener('click', ()=>{
  const blob = new Blob([JSON.stringify(state, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'openwifi-export.json';
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
});

btnClear.addEventListener('click', ()=>{
  if(!confirm('Limpar localStorage e estado?')) return;
  state = structuredClone(defaultState);
  saveState(state);
  renderAPs();
  renderDiscovered([]);
  drawChart();
});

/* ---------- Fetch sample-data.json usando .then/.catch (requisito) ---------- */
btnLoadSample.addEventListener('click', ()=>{
  btnLoadSample.disabled = true;
  btnLoadSample.textContent = 'Carregando...';
  fetch('sample-data.json')
    .then(res => {
      if(!res.ok) throw new Error('Falha ao carregar sample-data.json');
      return res.json();
    })
    .then(json => {
      // usa map e reduce para demonstrar
      const incomingAPs = json.aps.map(ap => ({...ap, id:ap.id || `ap-${Date.now()+rand(0,999)}`}));
      // merge simples: evitar duplicatas por id
      const existingIds = new Set(state.aps.map(a=>a.id));
      incomingAPs.forEach(ap => { if(!existingIds.has(ap.id)) state.aps.push(ap); });
      // exemplo de reduce: total de clientes
      const totalClients = state.aps.reduce((acc, a) => acc + (a.clients||0), 0);
      saveState(state);
      renderAPs();
      drawChart();
      alert(`Dados carregados. Total de clientes em todos os APs: ${totalClients}`);
    })
    .catch(err => {
      console.error(err);
      alert('Não foi possível carregar sample-data.json (ver console).');
    })
    .finally(()=>{
      btnLoadSample.disabled = false;
      btnLoadSample.textContent = 'Carregar sample-data.json (.then/.catch)';
    });
});

/* ---------- Canvas: desenhar gráfico simples ---------- */
function drawChart(){
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0,0,w,h);

  // coleta dados: média de tráfego por AP (map)
  const apAverages = state.aps.map(ap=>{
    const sum = (ap.traffic || []).reduce((s,v)=>s+v,0);
    const avg = (ap.traffic && ap.traffic.length) ? Math.round(sum / ap.traffic.length) : 0;
    return { id:ap.id, name:ap.name, avg };
  });

  // eixo y: máximo
  const maxY = Math.max(20, ...apAverages.map(a=>a.avg));
  // desenha barras
  const barW = Math.max(20, Math.floor(w / Math.max(1, apAverages.length)) - 10);
  apAverages.forEach((a, idx)=>{
    const x = idx * (barW + 10) + 20;
    const barH = (a.avg / maxY) * (h - 40);
    ctx.fillStyle = '#0ea5a4';
    ctx.fillRect(x, h - barH - 20, barW, barH);
    ctx.fillStyle = '#cfeff0';
    ctx.font = '12px sans-serif';
    ctx.fillText(a.name, x, h - 5);
    ctx.fillText(a.avg + ' Mbps', x, h - barH - 25);
  });

  if(apAverages.length===0){
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '14px sans-serif';
    ctx.fillText('Nenhum AP cadastrado — clique em "Adicionar AP (exemplo)"', 20, h/2);
  }
}

/* ---------- Async/await flow (simula um ML prediction / saúde da rede) ---------- */
async function fetchPrediction(){
  chartStatus.textContent = 'Rodando previsão...';
  btnRefreshChart.disabled = true;
  try {
    // Simula chamada a um serviço remoto (aqui usamos Promise com timeout)
    const prediction = await new Promise((resolve, reject) => {
      // possibilidade de erro aleatório para demonstrar try/catch
      setTimeout(()=>{
        if(Math.random() < 0.08) return reject(new Error('Serviço de previsão indisponível'));
        // aggregate clients e decide "saudável"/"sobrecarga"
        const totalClients = state.aps.reduce((s,a)=>s + (a.clients||0), 0);
        const risk = totalClients > 60 ? 'alto' : totalClients > 30 ? 'médio' : 'baixo';
        resolve({ totalClients, risk, ts: new Date().toISOString() });
      }, 900 + rand(0,800));
    });

    chartStatus.textContent = `Previsão: risco ${prediction.risk} — clientes ${prediction.totalClients} (${new Date(prediction.ts).toLocaleTimeString()})`;
    // ação automática demo: se risco alto, diminuir clients (simulação de migração)
    if(prediction.risk === 'alto'){
      // exemplo de utilização de map/filter: reduzimos clientes simulando migração
      state.aps = state.aps.map(ap=>{
        return {...ap, clients: Math.max(1, Math.round(ap.clients * 0.8))};
      });
      saveState(state);
      renderAPs();
      drawChart();
    }
  } catch (err) {
    console.error(err);
    chartStatus.textContent = 'Erro na previsão — veja console.';
  } finally {
    btnRefreshChart.disabled = false;
  }
}

btnRefreshChart.addEventListener('click', () => fetchPrediction());

/* ---------- inicialização ---------- */
document.addEventListener('DOMContentLoaded', ()=>{
  renderAPs();
  // mostra devices cadastrados como "discovered" para visualização
  renderDiscovered(state.devices);
  drawChart();
});
