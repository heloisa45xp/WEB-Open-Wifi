console.log("🔥 app.js carregou");

//

// ==========================
// CONTROLE DO MENU
// ==========================
document.querySelector(".sidebar-menu").addEventListener("click", (e) => {
    e.preventDefault();

    const li = e.target.closest("li[data-section]");
    if (!li) return;

    document.querySelectorAll(".sidebar-menu li")
        .forEach(item => item.classList.remove("active"));

    li.classList.add("active");

    const section = li.dataset.section;
    console.log("Navegando para:", section);
    carregarSecao(section);
});

// ==========================
// NAVEGAÇÃO PRINCIPAL
// ==========================
function carregarSecao(secao) {
    const conteudo = document.getElementById("conteudo");

    // Remove previous section-specific CSS and JS
    const existingDashboardCSS = document.querySelector('link[href="css/dashboard.css"]');
    const existingDashboardJS = document.querySelector('script[src="js/dashboard.js"]');
    if (existingDashboardCSS) existingDashboardCSS.remove();
    if (existingDashboardJS) existingDashboardJS.remove();

    if (secao === "dashboard") {
        // Load dashboard CSS
        const dashboardCSS = document.createElement('link');
        dashboardCSS.rel = 'stylesheet';
        dashboardCSS.href = 'css/dashboard.css';
        document.head.appendChild(dashboardCSS);

        // Load dashboard JS
        const dashboardJS = document.createElement('script');
        dashboardJS.src = 'js/dashboard.js';
        document.body.appendChild(dashboardJS);

        // Wait for JS to load then initialize
        dashboardJS.onload = () => {
            window.initDashboardSection?.();
        };
        return;
    }

    if (secao === "ap") {
        conteudo.innerHTML = gerarPaginaAP();
        window.initAPSection?.();
        return;
    }

    if (secao === "redes") {
        console.log("gerarPaginaRedes =", window.gerarPaginaRedes);

        conteudo.innerHTML = window.gerarPaginaRedes();
        window.initRedesSection?.();
        return;
    }

    if (secao === "monitor") {
        conteudo.innerHTML = `
        <div style="text-align:center; padding:40px">
            <img src="rpi1.gif" alt="Monitorando" style="width:220px">
            <img src="gif_fofo.gif" alt="Monitorando" style="width:220px">
            <img src="gif_fofo2.gif" alt="Monitorando" style="width:220px">
            <img src="gif_fofo3.gif" alt="Monitorando" style="width:220px">
            <p>Monitorando sua rede em tempo real...</p>
        </div>
    `;
        return;
    }

    if (secao === "discover") {
    conteudo.innerHTML = `
        <div style="text-align:center; padding:40px">
            <img src="rpi1.gif" alt="Monitorando" style="width:220px">
            <img src="gif_fofo.gif" alt="Monitorando" style="width:220px">
            <img src="gif_fofo2.gif" alt="Monitorando" style="width:220px">
            <img src="gif_fofo3.gif" alt="Monitorando" style="width:220px">
            <p>Monitorando sua rede em tempo real...</p>
        </div>
    `;
    return;
    }



    conteudo.innerHTML = `<h2>${secao}</h2>`;
}

