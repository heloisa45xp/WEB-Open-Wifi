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
        conteudo.innerHTML = gerarPaginaAP()
        ;
        adicionarEventosAP();
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
    return `
        <div class="ap-header">
            <input type="text" id="ap-search" placeholder="🔍 Buscar por nome, IP, MAC ou local...">
            <button class="btn add-ap-btn">Adicionar AP</button>
        </div>

        <div class="ap-list" id="ap-list">
            ${accessPoints.map(ap => gerarCardAP(ap)).join("")}
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
function adicionarEventosAP() {

    // Remover
    document.querySelectorAll(".remover").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = Number(btn.dataset.id);
            accessPoints = accessPoints.filter(ap => ap.id !== id);
            carregarSecao("ap");
        });
    });

    // Reiniciar
    document.querySelectorAll(".reiniciar").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = Number(btn.dataset.id);
            alert("O AP está reiniciando...");
        });
    });

    // Configurar
    document.querySelectorAll(".configurar").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = Number(btn.dataset.id);
            alert("Abriria a tela de configuração do AP (faremos depois).");
        });
    });

        // 🔍 Pesquisa em tempo real
    const campoBusca = document.getElementById("ap-search");

    if (campoBusca) {
        campoBusca.addEventListener("input", function () {
            const termo = this.value.toLowerCase();
            const cards = document.querySelectorAll(".ap-card");

            cards.forEach(card => {
                const texto = card.innerText.toLowerCase();
                card.style.display = texto.includes(termo) ? "block" : "none";
            });
        });
    }


}



function formatarStatus(s) {
    if (s === "online") return "Online";
    if (s === "atencao") return "Atenção";
    if (s === "offline") return "Offline";
}
