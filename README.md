
# 📡 Open-WIFI — Sistema de Gerenciamento de Rede Wireless

## 📖 Descrição do Projeto
O projeto Open-WiFi tem como objetivo desenvolver uma solução open-source para gerenciamento, monitoramento, controle e otimização de redes wireless utilizando dispositivos embarcados, como o Raspberry Pi. Tudo isso por meio de uma interface gráfica que permite acompanhar o desempenho da rede, detectar falhas, reduzir interferências, gerenciar usuários e oferecer uma interface gráfica intuitiva, facilitando o uso tanto para técnicos quanto para usuários menos experientes. aprimoramentos tecnológicos.

Entre as funcionalidades do sistema previstas estão: acompanhamento de desempenho da rede, detecção de falhas, redução de interferências, gerenciamento de usuários e visualização por dashboards em tempo real. O sistema também contará com relatórios históricos, algoritmos de machine learning para prever sobrecargas, sugerir ajustes automáticos, detectar anomalias e monitorar tráfego suspeito.

Além disso, a camada de controle incluirá migração inteligente de usuários, troca automática de canais, filtros de conteúdo e otimização de roaming. Do ponto de vista técnico, permitirá a criação e personalização de redes, diagnóstico automático de falhas e análise preditiva de desempenho.

## 🎨 Desenvolvimento WEB 
Devo resaltar que aqui apenas conta o Font-End do projeto, o Back-End e APIs ainda está na faze de desenvolvimeto.

## 🧩 Funcionalidades Principais

* Dashboard com visão geral da rede
* Listagem dinâmica de Access Points
* Busca, filtros e ordenação de APs
* Adição, edição e remoção de APs
* Modal interativo para cadastro
* Tema alternável (modo padrão e modo creme/noturno)
* Interface responsiva e organizada em componentes
* Persistência de dados simulada via JSON

---

## 🛠️ Tecnologias Utilizadas

* **HTML5**
* **CSS3**
* **JavaScript (ES6+)**
* Fetch API
* Web Storage (LocalStorage)
* JSON (simulação de backend)


## 📂 Estrutura do Projeto
/Open-WIFI
│── index.html
│── login.html
│── signup.html
│── css/
│   ├── ap.css
│   ├── base.css
│   ├── login.css
│   ├── redes.css
│   ├── dashboard.css
│   ├── signup.css
│── js/
│   ├── ap.js
│   ├── dashboard.js
│   ├── login.js
│   ├── redes.js
│   ├── signup.js
│── app.js
│── accesspoints.json
│── redes.json
│── styles.css
│── sool.jpg
│── wifi_icon.png
│── README.md


## ✅ Checklist de Conformidade

✔ Estruturas básicas (condicionais, laços, funções)
✔ Objetos e Arrays com uso de `map`, `filter` e `reduce`
✔ Arrow Functions (incluindo eventos)
✔ Manipulação dinâmica do DOM (criação, remoção e atualização)
✔ Requisição assíncrona com `fetch`
✔ Tratamento de erros e loading
✔ Uso de `async/await` com `try/catch`
✔ Uso explícito de `Promise` com `.then()` e `.catch()`
✔ Persistência de dados com Web Storage
✔ Organização modular de arquivos
✔ Interface responsiva, semântica e acessível

🔲 API HTML5 opcional (não utilizada)

---

## 🔄 Requisições Assíncronas

Os dados dos Access Points são carregados a partir de um arquivo JSON utilizando a **Fetch API**, com tratamento de erros e controle de estado.

O projeto também inclui uma função demonstrativa utilizando **`.then()` e `.catch()`**, criada especificamente para atender aos requisitos acadêmicos sobre Promises.



## 🚀 Como Executar o Projeto

1. Baixe ou clone o repositório
2. Abra o arquivo `index.html` em um navegador moderno
3. Navegue pelo menu para acessar as páginas do sistema

> ⚠️ Para funcionamento correto do `fetch`, recomenda-se usar um servidor local (ex: Live Server).

---

## ✨ Considerações Finais

Este projeto foi desenvolvido com fins educacionais, demonstrando domínio dos conceitos fundamentais de JavaScript moderno, manipulação do DOM e organização de aplicações front-end sem o uso de frameworks.

