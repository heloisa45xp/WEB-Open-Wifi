// js/redes.js

//NOVO

(() => {

    console.log("redes.js carregado");

    // Lista de redes
    let redes = [];
    let accessPoints = [];

    console.log("🔥 redes.js EXECUTOU");


    console.log("redes.js carregado");

    // Carregar dados mockados
    async function carregarRedes() {
        try {
            const response = await fetch("redes.json");
            const data = await response.json();
            redes = data.map(rede => ({
                id: rede.id,
                ssid: rede.ssid,
                security: rede.security.type.charAt(0).toUpperCase() + rede.security.type.slice(1), // Open, Wpa2, Wpa3 -> Open, WPA2, WPA3
                vlan: rede.vlan,
                band: rede.band === "2.4" ? "2.4 GHz" : (rede.band === "5" ? "5 GHz" : "Dual"),
                aps: rede.accessPoints, // array
                connectedClients: Math.floor(Math.random() * 50) + 1, // mock
                status: rede.status === "active" ? "Active" : "Inactive"
            }));
            console.log("Redes carregadas:", redes);
        } catch (error) {
            console.error("Erro ao carregar redes:", error);
        }
    }

    async function carregarAccessPoints() {
        try {
            const response = await fetch("accesspoints.json");
            accessPoints = await response.json();
            console.log("Access Points carregados:", accessPoints);
        } catch (error) {
            console.error("Erro ao carregar Access Points:", error);
        }
    }

    // Gerar HTML da página Redes
    function gerarPaginaRedes() {
        return `
        <div id="redes-section">
            <div class="redes-header">
                <h1 class="page-title">WiFi Networks</h1>
                <p class="page-subtitle">Configure and manage your wireless networks</p>
                <button id="btnCriarRede" class="btn-primary">+ Criar Rede</button>
            </div>

            <div class="redes-list" id="listaRedes">
                <!-- cards serão renderizados aqui -->
            </div>

            <!-- Modal for creating/editing network -->
            <div id="rede-modal" class="modal">
                <div class="modal-overlay"></div>
                <div class="modal-content">
                    <h3 id="modal-title">Criar Rede</h3>
                    <form id="rede-form">
                        <label for="rede-id">Network ID *</label>
                        <input type="text" id="rede-id" required>

                        <label for="rede-ssid">SSID *</label>
                        <input type="text" id="rede-ssid" required>

                        <label for="rede-security">Segurança *</label>
                        <select id="rede-security" required>
                            <option value="Open">Open</option>
                            <option value="WPA2">WPA2</option>
                            <option value="WPA3">WPA3</option>
                        </select>

                        <label for="rede-vlan">VLAN *</label>
                        <input type="number" id="rede-vlan" required>

                        <label for="rede-band">Banda *</label>
                        <select id="rede-band" required>
                            <option value="2.4 GHz">2.4 GHz</option>
                            <option value="5 GHz">5 GHz</option>
                            <option value="Dual">Dual</option>
                        </select>

                        <label for="rede-aps">Access Points *</label>
                        <div id="aps-selector" class="aps-selector">
                            <input type="text" id="aps-filter" placeholder="Buscar APs...">
                            <div id="aps-list" class="aps-list">
                                <!-- populated dynamically -->
                            </div>
                        </div>

                        <div class="modal-buttons">
                            <button type="button" id="cancel-rede">Cancelar</button>
                            <button type="submit">Salvar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    }

    // Inicializar a seção Redes
    async function initRedesSection() {
        console.log("initRedesSection iniciou");

        const lista = document.getElementById("listaRedes");
        if (!lista) {
            console.error("listaRedes não existe no DOM");
            return;
        }

        await carregarRedes();
        await carregarAccessPoints();
        renderRedes();


        // Eventos
        document.getElementById("btnCriarRede").addEventListener("click", () => openModal());

        document.getElementById("listaRedes").addEventListener("click", (e) => {
            const btn = e.target.closest("button");
            if (btn) {
                const card = btn.closest(".network-card");
                const id = card.dataset.id;

                if (btn.classList.contains("configure")) {
                    editRede(id);
                } else if (btn.classList.contains("view-aps")) {
                    alert("View APs for network " + id);
                } else if (btn.classList.contains("remove")) {
                    deleteRede(id);
                }
            }

            const toggle = e.target.closest(".network-toggle");
            if (toggle) {
                const id = toggle.dataset.id;
                toggleStatus(id);
            }
        });

        // Modal events
        const modal = document.getElementById("rede-modal");
        const form = document.getElementById("rede-form");
        const cancelBtn = document.getElementById("cancel-rede");

        cancelBtn.addEventListener("click", () => closeModal());

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            saveRede();
        });

        // APs selector
        const apsFilter = document.getElementById("aps-filter");
        const apsList = document.getElementById("aps-list");

        apsFilter.addEventListener("input", () => populateApsList(apsFilter.value));

        apsList.addEventListener("click", (e) => {
            const item = e.target.closest(".ap-item");
            if (item) {
                const apId = item.dataset.id;
                if (selectedAps.includes(apId)) {
                    selectedAps = selectedAps.filter(id => id !== apId);
                } else {
                    selectedAps.push(apId);
                }
                populateApsList(apsFilter.value);
            }
        });
    }

    let editingId = null;
    let selectedAps = [];

    function openModal(rede = null) {
        const modal = document.getElementById("rede-modal");
        const title = document.getElementById("modal-title");
        const form = document.getElementById("rede-form");

        if (rede) {
            editingId = rede.id;
            title.textContent = "Editar Rede";
            document.getElementById("rede-id").value = rede.id;
            document.getElementById("rede-ssid").value = rede.ssid;
            document.getElementById("rede-security").value = rede.security;
            document.getElementById("rede-vlan").value = rede.vlan;
            document.getElementById("rede-band").value = rede.band;
            selectedAps = rede.aps || [];
        } else {
            editingId = null;
            title.textContent = "Criar Rede";
            form.reset();
            selectedAps = [];
        }

        populateApsList();
        modal.classList.add("show");
    }

    function closeModal() {
        document.getElementById("rede-modal").classList.remove("show");
    }

    function populateApsList(filter = "") {
        const apsList = document.getElementById("aps-list");
        if (!apsList) return;

        if (!Array.isArray(accessPoints) || accessPoints.length === 0) {
            apsList.innerHTML = "<p style='padding:10px'>Nenhum AP carregado</p>";
            return;
        }

        const filteredAps = accessPoints.filter(ap =>
            String(ap.nome || ap.name || "")
                .toLowerCase()
                .includes(filter.toLowerCase())
        );

        apsList.innerHTML = filteredAps.map(ap => `
        <div class="ap-item ${selectedAps.includes(String(ap.id)) ? 'selected' : ''}" data-id="${ap.id}">
            ${ap.nome || ap.name} (${ap.ip || "-"})
            <span>${selectedAps.includes(String(ap.id)) ? "✓" : ""}
        </div>
    `).join("");
    }


    function saveRede() {
        const id = document.getElementById("rede-id").value.trim();
        const ssid = document.getElementById("rede-ssid").value.trim();
        const security = document.getElementById("rede-security").value;
        const vlan = parseInt(document.getElementById("rede-vlan").value);
        const band = document.getElementById("rede-band").value;

        if (!id || !ssid || !security || isNaN(vlan) || !band || selectedAps.length === 0) {
            alert("Preencha todos os campos obrigatórios.");
            return;
        }

        if (editingId) {
            const rede = redes.find(r => r.id === editingId);
            rede.id = id;
            rede.ssid = ssid;
            rede.security = security;
            rede.vlan = vlan;
            rede.band = band;
            rede.aps = selectedAps; // array
        } else {
            redes.push({
                id,
                ssid,
                security,
                vlan,
                band,
                aps: selectedAps, // array
                connectedClients: Math.floor(Math.random() * 50) + 1,
                status: "Active"
            });
        }

        closeModal();
        renderRedes();
    }

    function editRede(id) {
        const rede = redes.find(r => r.id === id);
        if (rede) {
            // For edit, since aps is number, but we need the list, perhaps store in a separate way.
            // For simplicity, open modal with empty selectedAps, or assume all APs if aps > 0.
            // To fix, change the model to keep accessPoints as array.
            // Let's update the model.
            // In carregarRedes, set aps: rede.accessPoints
            // Then in render, rede.aps.length
            // Yes, better.
            // I need to update the code.
            // In the model, aps is the array.
            // In renderRedeCard, <span>APs: ${rede.aps.length}</span>
            // And for edit, selectedAps = rede.aps
            // Yes.
            // So, change in carregarRedes: aps: rede.accessPoints
            // And in render: rede.aps.length
            // And in save: rede.aps = selectedAps
            // Yes.
            // Also, for new, aps: selectedAps
            // Perfect.
            // I need to edit the code accordingly.
            // Since I'm writing now, I'll include it.
        }
        openModal(rede);
    }

    function toggleStatus(id) {
        const rede = redes.find(r => r.id === id);
        if (rede) {
            rede.status = rede.status === "Active" ? "Inactive" : "Active";
            renderRedes();
        }
    }

    function deleteRede(id) {
        redes = redes.filter(r => r.id !== id);
        renderRedes();
    }

    function renderRedes() {
        const lista = document.getElementById("listaRedes");
        lista.innerHTML = redes.map(rede => `
        <div class="network-card" data-id="${rede.id}">
            <div class="network-header">
                <h3 class="network-ssid">${rede.ssid}</h3>
                <div class="network-toggle ${rede.status === "Active" ? "active" : "inactive"}" data-id="${rede.id}"></div>
            </div>
            <div class="network-id">ID: ${rede.id}</div>
            <div class="info-grid">
                <div class="info-block">
                    <div class="info-label">Security</div>
                    <div class="info-value">${rede.security}</div>
                </div>
                <div class="info-block">
                    <div class="info-label">Band</div>
                    <div class="info-value">${rede.band}</div>
                </div>
                <div class="info-block">
                    <div class="info-label">VLAN ID</div>
                    <div class="info-value">${rede.vlan}</div>
                </div>
                <div class="info-block">
                    <div class="info-label">Connected Clients</div>
                    <div class="info-value">${rede.connectedClients}</div>
                </div>
            </div>
            <div class="network-badges">
                <span class="badge status-${rede.status.toLowerCase()}">${rede.status}</span>
                <span class="badge aps-count">${Array.isArray(rede.aps) ? rede.aps.length : rede.aps} APs</span>
            </div>
            <div class="network-actions">
                <button class="btn configure">Configure</button>
                <button class="btn view-aps">View APs</button>
                <button class="btn remove">Remove</button>
            </div>
        </div>
    `).join("");
    }

    window.gerarPaginaRedes = gerarPaginaRedes;
    window.initRedesSection = initRedesSection;

    console.log("✅ Redes exportadas com sucesso");

})();
