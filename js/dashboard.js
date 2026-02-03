// Dashboard JavaScript

let dashboardData = {
    accessPoints: [],
    networks: []
};

async function loadDashboardData() {
    try {
        // Load access points
        const apResponse = await fetch('accesspoints.json');
        dashboardData.accessPoints = await apResponse.json();

        // Load networks
        const netResponse = await fetch('redes.json');
        dashboardData.networks = await netResponse.json();

        console.log('Dashboard data loaded:', dashboardData);
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

function calculateMetrics() {
    const aps = dashboardData.accessPoints;
    const networks = dashboardData.networks;

    // Access Points Online (assuming status 'online')
    const onlineAps = aps.filter(ap => ap.status === 'online').length;
    const totalAps = aps.length;

    // Connected Clients
    const totalClients = aps.reduce((sum, ap) => sum + (ap.clientes || 0), 0);

    // Average Signal (mock calculation)
    const signals = aps.map(ap => ap.sinal || -50);
    const avgSignal = signals.length > 0 ? Math.round(signals.reduce((a, b) => a + b) / signals.length) : 0;

    // Active Networks
    const activeNetworks = networks.filter(net => net.status === 'active').length;

    // Bandwidth Utilized (mock)
    const bandwidth = Math.floor(Math.random() * 200) + 50; // 50-250 Mbps

    // Uptime Average (mock)
    const uptime = (Math.random() * 5 + 95).toFixed(1); // 95-100%

    return {
        apsOnline: `${onlineAps}/${totalAps}`,
        clientsConnected: totalClients,
        avgSignal: `${avgSignal} dBm`,
        activeNetworks: activeNetworks,
        bandwidthUtilized: `${bandwidth} Mbps`,
        avgUptime: `${uptime}%`
    };
}

function generateDashboardHTML() {
    const metrics = calculateMetrics();

    // Get top 5 networks for status display
    const topNetworks = dashboardData.networks.slice(0, 5).map(net => {
        const connectedClients = Math.floor(Math.random() * 50) + 1; // Mock clients
        const status = net.status === 'active' ? 'Online' : 'Offline';
        const location = 'Sala de Reuniões'; // Mock location
        const ip = `192.168.${Math.floor(Math.random() * 10) + 1}.${Math.floor(Math.random() * 100) + 1}/24`; // Mock IP

        return {
            name: net.ssid,
            clients: connectedClients,
            status: status,
            location: location,
            ip: ip
        };
    });

    return `
        <div class="dashboard-header">
            <h1 class="dashboard-title">Dashboard</h1>
            <p class="dashboard-subtitle">Visão geral da sua rede wireless</p>
        </div>

        <div class="summary-cards">
            <div class="summary-card">
                <div class="summary-card-title">Access Points</div>
                <div class="summary-card-value">${metrics.apsOnline}</div>
                <div class="summary-card-desc">APs online</div>
            </div>

            <div class="summary-card">
                <div class="summary-card-title">Clientes Conectados</div>
                <div class="summary-card-value">${metrics.clientsConnected}</div>
                <div class="summary-card-desc">Total de dispositivos</div>
            </div>

            <div class="summary-card">
                <div class="summary-card-title">Sinal Médio</div>
                <div class="summary-card-value">${metrics.avgSignal}</div>
                <div class="summary-card-desc">Qualidade da rede</div>
            </div>

            <div class="summary-card">
                <div class="summary-card-title">Redes Ativas</div>
                <div class="summary-card-value">${metrics.activeNetworks}</div>
                <div class="summary-card-desc">SSIDs configurados</div>
            </div>

            <div class="summary-card">
                <div class="summary-card-title">Banda Utilizada</div>
                <div class="summary-card-value">${metrics.bandwidthUtilized}</div>
                <div class="summary-card-desc">Tráfego atual</div>
            </div>

            <div class="summary-card">
                <div class="summary-card-title">Uptime Médio</div>
                <div class="summary-card-value">${metrics.avgUptime}</div>
                <div class="summary-card-desc">Disponibilidade</div>
            </div>
        </div>

        <div class="network-status-container">
            <h2 class="network-status-title">Status Redes</h2>
            <p class="network-status-subtitle">Suas redes</p>

            <div class="network-list">
                ${topNetworks.map(net => `
                    <div class="network-item">
                        <div class="network-item-header">
                            <span class="network-name">${net.name}</span>
                            <span class="network-status ${net.status.toLowerCase()}">${net.status}</span>
                        </div>
                        <div class="network-details">
                            ${net.clients} clientes — Status da rede: ${net.status}<br>
                            ${net.location}<br>
                            ${net.ip}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

async function initDashboardSection() {
    await loadDashboardData();
    const content = document.getElementById('conteudo');
    content.innerHTML = generateDashboardHTML();
}

window.initDashboardSection = initDashboardSection;
window.gerarPaginaDashboard = generateDashboardHTML;
