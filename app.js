console.log("🔥 app.js carregou");

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

    conteudo.innerHTML = `<h2>${secao}</h2>`;
}
