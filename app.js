// Controle do menu ativo
document.querySelectorAll(".sidebar-menu li").forEach(li => {
    li.addEventListener("click", (e) => {
        e.preventDefault();

        // Remover active de todos
        document.querySelectorAll(".sidebar-menu li")
            .forEach(item => item.classList.remove("active"));

        // Adicionar active
        li.classList.add("active");

        // Lê a seção do LI
        const section = li.dataset.section;

        carregarSecao(section);
    });
});



// --------------------------
// LISTA DE ACCESS POINTS (simulada)
// --------------------------
let accessPoints = [];

async function carregarAPs() {
    try {
        const response = await fetch("accesspoints.json");
        accessPoints = await response.json();
        carregarSecao("ap"); // Depois de carregar, montar a página
    } catch (error) {
        console.error("Erro ao carregar Access Points:", error);
    }
}


window.onload = () => {
    carregarAPs();
};



// --------------------------
// FUNÇÃO PARA TROCAR O CONTEÚDO DO MAIN
// --------------------------
function carregarSecao(secao) {
    const conteudo = document.getElementById("conteudo");

    if (secao === "ap") {
        conteudo.innerHTML = gerarPaginaAP();
        // inicializa a seção AP (render, filtros, eventos)
        if (window.initAPSection) window.initAPSection();
        return;
    }

    if (secao === "rdes") {
        conteudo.innerHTML = `<h2>Página de Redes</h2>`;
        return;
    }

    if (secao === "discover") {
        conteudo.innerHTML = `<h2>Descobrir dispositivos</h2>`;
        return;
    }

    if (secao === "monitor") {
        conteudo.innerHTML = `<h2>Monitoramento</h2>`;
        return;
    }

    if (secao === "settings") {
        conteudo.innerHTML = `<h2>Configurações do Sistema</h2>`;
        return;
    }
}



// --------------------------
// GERAR HTML DA PÁGINA DE AP
// --------------------------
function gerarPaginaAP() {
    // HTML completo da seção AP (busca, filtros, ordenação, chips, lista)
    return `
        <div id="ap-section">
            <div class="ap-header">
                <div class="ap-search-row">
                    <input id="ap-search" placeholder="Buscar AP por nome, IP, MAC, modelo ou localização…" />
                </div>

                <div class="ap-sort">
                    <select id="ap-sort-select" title="Ordenar por">
                        <option value="nome">Nome</option>
                        <option value="clientes">Clientes</option>
                        <option value="sinal">Sinal</option>
                        <option value="canal">Canal</option>
                        <option value="uptime">Uptime</option>
                        <option value="status">Status</option>
                    </select>
                    <button id="ap-sort-dir" title="Alternar ordem">↑↓</button>
                </div>
            </div>

            <div class="ap-controls">
                <div class="ap-filters">
                    <div class="filter-group" data-filter="status">
                        <div class="group-title">Status</div>
                        <div class="filter-options">
                            <button data-val="online" class="status-online">Online</button>
                            <button data-val="atencao" class="status-atencao">Atenção</button>
                            <button data-val="offline" class="status-offline">Offline</button>
                        </div>
                    </div>

                    <div class="filter-group" data-filter="clientes">
                        <div class="group-title">Clientes</div>
                        <div class="filter-options">
                            <button data-val="0-10">0–10</button>
                            <button data-val="10-25">10–25</button>
                            <button data-val="25-50">25–50</button>
                            <button data-val="50+">50+</button>
                        </div>
                    </div>

                    <div class="filter-group" data-filter="canal">
                        <div class="group-title">Canal</div>
                        <div class="filter-options">
                            <button data-val="1">1</button>
                            <button data-val="6">6</button>
                            <button data-val="11">11</button>
                            <button data-val="dfs">DFS</button>
                            <button data-val="auto">Automático</button>
                        </div>
                    </div>

                    <div class="filter-group" data-filter="modelo">
                        <div class="group-title">Modelo</div>
                        <div class="filter-options" id="filter-modelo">
                            <!-- preenchido dinamicamente -->
                        </div>
                    </div>

                    <div class="filter-group" data-filter="redes">
                        <div class="group-title">Redes vinculadas</div>
                        <div class="filter-options" id="filter-redes">
                            <!-- preenchido dinamicamente -->
                        </div>
                    </div>
                </div>

                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <div class="ap-chips" id="ap-chips"></div>
                    <div>
                        <button class="clear-filters" id="clear-filters">Limpar filtros</button>
                    </div>
                </div>
            </div>

            <div class="ap-list" id="ap-list">
                <!-- cartões serão renderizados aqui -->
            </div>

            <div id="ap-no-results" class="ap-no-results" style="display:none;">
                Nenhum AP encontrado
            </div>
        </div>
    `;
}


function gerarCardAP(ap) {
    return `
    <div class="ap-card">

        <!-- STATUS -->
        <div class="ap-status ap-${ap.status}">${formatarStatus(ap.status)}</div>

        <!-- Título -->
        <h3>${ap.nome}</h3>
        <p class="ap-local">${ap.local}</p>

        <!-- Informações -->
        <div class="ap-info-grid">
            <p><strong>IP:</strong> ${ap.ip}</p>
            <p><strong>MAC:</strong> ${ap.mac}</p>
            <p><strong>Clientes:</strong> ${ap.clientes}</p>
            <p><strong>Sinal:</strong> ${ap.sinal} dBm</p>
            <p><strong>Modelo:</strong> ${ap.modelo}</p>
            <p><strong>Firmware:</strong> ${ap.firmware}</p>
            <p><strong>Canal:</strong> ${ap.canal}</p>
            <p><strong>Uptime:</strong> ${ap.uptime}</p>
        </div>

        <!-- Redes -->
        <div class="ap-redes-box">
            <strong>Redes:</strong>
            <ul>
                ${ap.redes.map(r => `<li>${r}</li>`).join("")}
            </ul>
        </div>

        <!-- Botões -->
        <div class="ap-buttons">
            <button class="configurar" data-id="${ap.id}">Configurar</button>
            <button class="reiniciar" data-id="${ap.id}">Reiniciar</button>
            <button class="remover" data-id="${ap.id}">Remover</button>
        </div>

    </div>
    `;
}


// --------------------------
// EVENTOS DA PÁGINA DE AP
// --------------------------
(function () {
    const debounce = (fn, wait) => {
        let t;
        return (...args) => {
            clearTimeout(t);
            t = setTimeout(() => fn(...args), wait);
        };
    };

    // estado dos filtros
    const state = {
        q: '',
        status: new Set(),
        clientes: new Set(),
        canal: new Set(),
        modelo: new Set(),
        redes: new Set(),
        sortBy: 'nome',
        sortDir: 'asc'
    };

    const clienteRanges = {
        '0-10': [0, 10],
        '10-25': [10, 25],
        '25-50': [25, 50],
        '50+': [50, Infinity]
    };

    function initAPSection() {
        if (typeof accessPoints === 'undefined') {
            console.warn('accessPoints não encontrado (variável global).');
            return;
        }

        const elSearch = document.getElementById('ap-search');
        const elList = document.getElementById('ap-list');
        const elChips = document.getElementById('ap-chips');
        const elNo = document.getElementById('ap-no-results');
        const elSort = document.getElementById('ap-sort-select');
        const elSortDir = document.getElementById('ap-sort-dir');
        const elModelo = document.getElementById('filter-modelo');
        const elRedes = document.getElementById('filter-redes');
        const elClear = document.getElementById('clear-filters');

        // popular modelos e redes dinamicamente
        const modelosSet = new Set();
        const redesSet = new Set();
        accessPoints.forEach(ap => {
            if (ap.modelo) modelosSet.add(ap.modelo);
            if (Array.isArray(ap.redes)) ap.redes.forEach(r => redesSet.add(r));
        });

        const createOptionButton = (text, val) => {
            const b = document.createElement('button');
            b.textContent = text;
            b.setAttribute('data-val', val);
            return b;
        };

        modelosSet.forEach(m => elModelo.appendChild(createOptionButton(m, m)));
        redesSet.forEach(r => elRedes.appendChild(createOptionButton(r, r)));

        // listeners para botões de filtro (delegation)
        document.querySelectorAll('.filter-group').forEach(group => {
            group.addEventListener('click', (ev) => {
                const btn = ev.target.closest('button[data-val]');
                if (!btn) return;
                const f = group.getAttribute('data-filter');
                const val = btn.getAttribute('data-val');
                toggleFilter(f, val, btn);
            });
        });

        function toggleFilter(filterName, val, elBtn) {
            const set = state[filterName];
            if (!set) return;
            if (set.has(val)) {
                set.delete(val);
                elBtn.classList.remove('active');
            } else {
                set.add(val);
                elBtn.classList.add('active');
            }
            applyAndRender();
        }

        // busca com debounce 200ms
        elSearch.addEventListener('input', debounce((e) => {
            state.q = e.target.value.trim().toLowerCase();
            applyAndRender();
        }, 200));

        // ordenação
        elSort.addEventListener('change', () => {
            state.sortBy = elSort.value;
            applyAndRender();
        });
        elSortDir.addEventListener('click', () => {
            state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
            elSortDir.textContent = state.sortDir === 'asc' ? '↑' : '↓';
            applyAndRender();
        });

        elClear.addEventListener('click', () => {
            clearAllFilters();
        });

        function clearAllFilters() {
            state.q = '';
            state.status.clear();
            state.clientes.clear();
            state.canal.clear();
            state.modelo.clear();
            state.redes.clear();
            state.sortBy = 'nome';
            state.sortDir = 'asc';
            document.getElementById('ap-search').value = '';
            document.querySelectorAll('.filter-options button.active').forEach(b => b.classList.remove('active'));
            elSort.value = 'nome';
            elSortDir.textContent = '↑';
            applyAndRender();
        }

        function applyAndRender() {
            const out = accessPoints.filter(ap => {
                if (state.q) {
                    const hay = [
                        ap.nome || '',
                        ap.ip || '',
                        ap.mac || '',
                        ap.modelo || '',
                        ap.local || ''
                    ].join(' ').toLowerCase();
                    if (!hay.includes(state.q)) return false;
                }

                if (state.status.size) {
                    const st = (ap.status || '').toLowerCase();
                    if (!Array.from(state.status).includes(st)) return false;
                }

                if (state.clientes.size) {
                    const clientes = Number(ap.clientes || 0);
                    let okCli = false;
                    for (const r of state.clientes) {
                        const range = clienteRanges[r];
                        if (!range) continue;
                        if (clientes >= range[0] && clientes <= range[1]) { okCli = true; break; }
                        if (r === '50+' && clientes >= 50) { okCli = true; break; }
                    }
                    if (!okCli) return false;
                }

                if (state.canal.size) {
                    const canalVal = (ap.canal || '').toString().toLowerCase();
                    let okCan = false;
                    for (const c of state.canal) {
                        if (c === 'auto' && (canalVal === 'auto' || canalVal === 'automático' || canalVal === 'automatico')) { okCan = true; break; }
                        if (c === 'dfs' && canalVal.includes('dfs')) { okCan = true; break; }
                        if (canalVal === c) { okCan = true; break; }
                    }
                    if (!okCan) return false;
                }

                if (state.modelo.size) {
                    if (!state.modelo.has(ap.modelo)) return false;
                }

                if (state.redes.size) {
                    const apRedes = new Set((ap.redes || []).map(r => String(r)));
                    let okR = false;
                    for (const r of state.redes) {
                        if (apRedes.has(r)) { okR = true; break; }
                    }
                    if (!okR) return false;
                }

                return true;
            });

            out.sort((a, b) => {
                const dir = state.sortDir === 'asc' ? 1 : -1;
                switch (state.sortBy) {
                    case 'nome':
                        return dir * String((a.nome||'')).localeCompare(String(b.nome||''), undefined, { numeric: true, sensitivity: 'base' });
                    case 'clientes':
                        return dir * ((Number(a.clientes)||0) - (Number(b.clientes)||0));
                    case 'sinal':
                        return dir * ((Number(a.sinal)||0) - (Number(b.sinal)||0));
                    case 'canal':
                        const ca = parseInt(a.canal) || 0;
                        const cb = parseInt(b.canal) || 0;
                        if (ca === 0 && cb === 0) return dir * String((a.canal||'')).localeCompare(String(b.canal||''));
                        return dir * (ca - cb);
                    case 'uptime':
                        const ua = Number(a.uptime) || 0;
                        const ub = Number(b.uptime) || 0;
                        return dir * (ua - ub);
                    case 'status':
                        const rank = s => (s==='online'?0:(s==='atencao'?1:2));
                        return dir * (rank((a.status||'').toLowerCase()) - rank((b.status||'').toLowerCase()));
                    default:
                        return 0;
                }
            });

            renderList(out);
            renderChips();
        }

        function renderList(list) {
            elList.innerHTML = '';
            if (!list.length) {
                elNo.style.display = 'block';
                return;
            } else {
                elNo.style.display = 'none';
            }

            list.forEach(ap => {
                const card = document.createElement('div');
                card.className = 'ap-card';

                const statusClass = ap.status === 'online' ? 'ap-online' : (ap.status === 'atencao' ? 'ap-atencao' : 'ap-offline');
                const statusText = ap.status ? (ap.status.charAt(0).toUpperCase() + ap.status.slice(1)) : 'Offline';

                const status = document.createElement('div');
                status.className = `ap-status ${statusClass}`;
                status.textContent = statusText;
                card.appendChild(status);

                const h3 = document.createElement('h3');
                h3.textContent = ap.nome || ap.ip || 'AP sem nome';
                card.appendChild(h3);

                const local = document.createElement('div');
                local.className = 'ap-local';
                local.textContent = ap.local || '';
                card.appendChild(local);

                const grid = document.createElement('div');
                grid.className = 'ap-info-grid';

                const infoItem = (label, val) => {
                    const d = document.createElement('div');
                    d.innerHTML = `<strong>${label}:</strong> ${val ?? ''}`;
                    return d;
                };

                grid.appendChild(infoItem('IP', ap.ip || '—'));
                grid.appendChild(infoItem('MAC', ap.mac || '—'));
                grid.appendChild(infoItem('Modelo', ap.modelo || '—'));
                grid.appendChild(infoItem('Clientes', ap.clientes ?? 0));
                grid.appendChild(infoItem('Sinal', ap.sinal ?? '—'));
                grid.appendChild(infoItem('Canal', ap.canal ?? '—'));
                grid.appendChild(infoItem('Uptime', ap.uptime || '—'));

                card.appendChild(grid);

                const redesBox = document.createElement('div');
                redesBox.className = 'ap-redes-box';
                const ul = document.createElement('ul');
                (ap.redes || []).forEach(r => {
                    const li = document.createElement('li');
                    li.textContent = r;
                    ul.appendChild(li);
                });
                redesBox.appendChild(ul);
                card.appendChild(redesBox);

                const btns = document.createElement('div');
                btns.className = 'ap-buttons';
                btns.innerHTML = `
                    <div>
                        <button class="configurar">Configurar</button>
                        <button class="reiniciar">Reiniciar</button>
                    </div>
                    <div>
                        <button class="remover">Remover</button>
                    </div>
                `;
                card.appendChild(btns);

                // ações dos botões
                btns.querySelectorAll('.remover').forEach(b => b.addEventListener('click', () => {
                    accessPoints = accessPoints.filter(x => x.id !== ap.id);
                    applyAndRender();
                }));
                btns.querySelectorAll('.reiniciar').forEach(b => b.addEventListener('click', () => alert('O AP está reiniciando...')));
                btns.querySelectorAll('.configurar').forEach(b => b.addEventListener('click', () => alert('Abriria a tela de configuração do AP (faremos depois).')));

                elList.appendChild(card);
            });
        }

        function renderChips() {
            elChips.innerHTML = '';
            const addChip = (type, text, val) => {
                const chip = document.createElement('span');
                chip.className = 'ap-chip';
                chip.setAttribute('data-type', type);
                chip.setAttribute('data-val', val);
                chip.innerHTML = `${text} <button title="Remover">✕</button>`;
                chip.querySelector('button').addEventListener('click', () => {
                    if (state[type]) {
                        state[type].delete(val);
                        document.querySelectorAll(`.filter-group[data-filter="${type}"] button[data-val="${val}"]`).forEach(b => b.classList.remove('active'));
                        applyAndRender();
                    }
                });
                elChips.appendChild(chip);
            };

            state.status.forEach(v => addChip('status', `Status: ${v}`, v));
            state.clientes.forEach(v => addChip('clientes', `Clientes: ${v}`, v));
            state.canal.forEach(v => addChip('canal', `Canal: ${v}`, v));
            state.modelo.forEach(v => addChip('modelo', `Modelo: ${v}`, v));
            state.redes.forEach(v => addChip('redes', `Rede: ${v}`, v));
        }

        applyAndRender();
    }

    window.initAPSection = initAPSection;
})();



function formatarStatus(s) {
    if (s === "online") return "Online";
    if (s === "atencao") return "Atenção";
    if (s === "offline") return "Offline";
}
