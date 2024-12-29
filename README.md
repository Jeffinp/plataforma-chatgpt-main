# Jogo de Plataforma

Este projeto é um jogo de plataforma 2D desenvolvido em JavaScript com a biblioteca p5.js. O jogo foi iniciado com base no código fornecido por [guilhermesilveira](https://github.com/guilhermesilveira/plataforma-chatgpt) e, desde então, passou por significativas modificações e melhorias.

## ✨ Funcionalidades

*   **Animação Suave:** Animação de corrida do personagem com velocidade ajustável para uma experiência visual mais agradável.
*   **Inimigos:** Um inimigo se move da direita para a esquerda, causando "Game Over" em caso de colisão.
*   **Colisão Pixel-Perfect:** Sistema de colisão preciso que detecta a sobreposição de pixels entre os sprites do personagem e do inimigo.
*   **Pontuação:** Sistema de pontuação que aumenta continuamente com o tempo de jogo.
*   **Reinício do Jogo:** Botão para reiniciar o jogo após "Game Over", redefinindo o estado do jogo para as condições iniciais.
*   **Interface Aprimorada:** Interface de usuário melhorada com a adição de ícones (da biblioteca [Iconify](https://iconify.design/)) e um design mais limpo e moderno.

## 🚀 Tecnologias Utilizadas

*   **[p5.js](https://p5js.org/):** Biblioteca JavaScript para criação de gráficos e interações.
*   **[p5.sound](https://p5js.org/reference/#/libraries/p5.sound):** Extensão do p5.js para manipulação de áudio.
*   **[Iconify](https://iconify.design/):** Biblioteca para inclusão de ícones de forma fácil e eficiente.
*   **HTML5:** Estruturação do conteúdo do jogo.
*   **CSS3:** Estilização e layout do jogo.
*   **JavaScript (ES6+):** Lógica e interatividade do jogo.

## 🛠️ Instalação e Execução

Para executar o jogo localmente, siga os passos abaixo:

1.  **Clone o repositório:**

    ```bash
    git clone URL_DO_SEU_REPOSITÓRIO
    ```
    _Substitua `URL_DO_SEU_REPOSITÓRIO` pela URL do seu repositório._

2.  **Navegue até a pasta do projeto:**

    ```bash
    cd NOME_DA_PASTA_DO_PROJETO
    ```

3.  **Execute um servidor local.** Você pode usar qualquer um dos seguintes métodos:

    *   **Live Server (VS Code):** Se você estiver usando o VS Code, instale a extensão "Live Server". Depois, clique com o botão direito no arquivo `index.html` e selecione "Open with Live Server".
    *   **Python:** Se você tem o Python instalado, execute um dos seguintes comandos no terminal:
        *   Python 2: `python -m SimpleHTTPServer 8000`
        *   Python 3: `python -m http.server 8000`
    *   **Node.js (http-server):** Se você tem o Node.js instalado, instale o `http-server` globalmente: `npm install -g http-server`. Depois, execute: `http-server`.

4.  **Abra o jogo no navegador:**

    *   Acesse `http://localhost:8000` (ou a porta especificada pelo seu servidor local).

## 🌟 Agradecimentos

*   Agradecimento especial a [guilhermesilveira](https://github.com/guilhermesilveira/plataforma-chatgpt) pelo código base que serviu para eu treinar e demonstrar como melhorar o código.

