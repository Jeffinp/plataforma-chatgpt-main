// Constantes
const LARGURA_TELA = 800;
const ALTURA_TELA = 400;
const TAMANHO_CHAO = 64;
const ALTURA_PERSONAGEM = 96;
const LARGURA_PERSONAGEM = 96;
const ALTURA_INIMIGO = 64;
const LARGURA_INIMIGO = 64;
const ALTURA_INICIAL_PULO = -18;
const GRAVIDADE = 0.5;
const VELOCIDADE_INICIAL = 2.5;
const INCREMENTO_VELOCIDADE = 0.05;

// Variáveis
let personagem = {
    x: 50,
    y: ALTURA_TELA - ALTURA_PERSONAGEM - TAMANHO_CHAO,
    largura: LARGURA_PERSONAGEM,
    altura: ALTURA_PERSONAGEM,
    pulando: false,
    alturaPulo: ALTURA_INICIAL_PULO,
    velocidadePulo: 0,
    gravidade: GRAVIDADE,
    sprite: {
        atual: 0,
        array: [],
        intervaloTroca: 10,
        contador: 0
    },
    mascara: null
};

let inimigo = {
    x: LARGURA_TELA,
    y: ALTURA_TELA - ALTURA_INIMIGO - TAMANHO_CHAO,
    largura: LARGURA_INIMIGO,
    altura: ALTURA_INIMIGO,
    sprite: null,
    mascara: null
};

let chao = [];
let chaoSprite;
let puloSound;
let velocidade = VELOCIDADE_INICIAL;
let restartButton;

// Classe Pontuacao
class Pontuacao {
    constructor() {
        this.valor = 0;
        this.x = 30; // Posição X da pontuação
        this.y = 40; // Posição Y da pontuação
        this.tamanhoFonte = 30;
        this.cor = color(255);
        this.texto = "Pontuação: ";
    }

    atualizar() {
        this.valor += velocidade;
    }

    exibir() {
        textSize(this.tamanhoFonte);
        fill(this.cor);
        textAlign(LEFT, TOP); // Define o alinhamento do texto como esquerda e topo
        let textoPontuacao = this.texto + Math.floor(this.valor);
        let larguraTexto = textWidth(textoPontuacao);

        // Verifica se a pontuação está saindo da tela pela direita
        if (this.x + larguraTexto > LARGURA_TELA - 20) {
            this.x = LARGURA_TELA - larguraTexto - 20; // Ajusta a posição X se estiver saindo
        }

        text(textoPontuacao, this.x, this.y);
    }

    resetar() {
        this.valor = 0;
        this.x = 30; // Resetar a posição X
    }
}

let pontuacao; // Instância da classe Pontuacao

// Pré-carregamento de assets
function preload() {
    personagem.sprite.array = [
        loadImage('assets/platformChar_walk1.png'),
        loadImage('assets/platformChar_walk2.png')
    ];
    inimigo.sprite = loadImage('assets/platformPack_tile043.png');
    chaoSprite = loadImage('assets/platformPack_tile013.png');
    puloSound = loadSound('assets/footstep09.ogg');

    // Carrega as máscaras de colisão
    personagem.mascara = loadImage('assets/platformChar_mask.png');
    inimigo.mascara = loadImage('assets/platformPack_tile043_mask.png');
}

// Configuração inicial
function setup() {
    let canvas = createCanvas(LARGURA_TELA, ALTURA_TELA);
    canvas.parent('canvas-container');

    // Inicialização do chão
    reiniciarChao();

    restartButton = select('#restart-button');
    restartButton.mousePressed(reiniciarJogo);

    // Cria a instância da classe Pontuacao
    pontuacao = new Pontuacao();
}

// Loop principal
function draw() {
    background(220);

    // Desenhar e mover o chão
    for (let tile of chao) {
        image(tile.sprite, tile.x, tile.y, tile.largura, tile.altura);
        tile.x -= velocidade;
        if (tile.x <= -TAMANHO_CHAO) {
            tile.x = LARGURA_TELA + (tile.x + TAMANHO_CHAO);
        }
    }

    // Animação do personagem
    personagem.sprite.contador++;
    if (personagem.sprite.contador >= personagem.sprite.intervaloTroca) {
        personagem.sprite.atual = (personagem.sprite.atual + 1) % 2;
        personagem.sprite.contador = 0;
    }

    // Desenhar personagem
    image(personagem.sprite.array[personagem.sprite.atual], personagem.x, personagem.y, personagem.largura, personagem.altura);

    // Lógica do pulo
    if (personagem.pulando) {
        personagem.y += personagem.velocidadePulo;
        personagem.velocidadePulo += personagem.gravidade;
        if (personagem.y > ALTURA_TELA - ALTURA_PERSONAGEM - TAMANHO_CHAO) {
            personagem.y = ALTURA_TELA - ALTURA_PERSONAGEM - TAMANHO_CHAO;
            personagem.pulando = false;
        }
    }

    // Desenhar e mover inimigo
    image(inimigo.sprite, inimigo.x, inimigo.y, inimigo.largura, inimigo.altura);
    inimigo.x -= velocidade;

    if (inimigo.x < -inimigo.largura) {
        inimigo.x = LARGURA_TELA;
        velocidade += INCREMENTO_VELOCIDADE;
    }

    // Atualizar e exibir a pontuação
    pontuacao.atualizar();
    pontuacao.exibir();

    // Verificar colisão (Pixel-Perfect)
    if (verificaColisaoPixelPerfect(personagem, inimigo)) {
        console.log("Colisão detectada!");

        // Exibe a mensagem de Game Over
        textSize(64);
        fill(255, 0, 0);
        textAlign(CENTER, CENTER);
        text("Game Over", width / 2, height / 2 - 64);

        // Exibe a pontuação final
        textSize(22);
        fill(255);
        text("Pontuação Final: " + Math.floor(pontuacao.valor), width / 2, height / 2);

        // Mostra o botão de reiniciar
        restartButton.style('display', 'block');

        noLoop();
    }
}

// Função para reiniciar o jogo
function reiniciarJogo() {
    personagem.x = 50;
    personagem.y = ALTURA_TELA - ALTURA_PERSONAGEM - TAMANHO_CHAO;
    personagem.pulando = false;
    personagem.velocidadePulo = 0;
    inimigo.x = LARGURA_TELA;
    inimigo.y = ALTURA_TELA - ALTURA_INIMIGO - TAMANHO_CHAO;
    velocidade = VELOCIDADE_INICIAL;

    // Reinicializar a pontuação
    pontuacao.resetar();

    // Reinicializar o chão
    reiniciarChao();

    restartButton.style('display', 'none');
    loop();
}

// Função para reiniciar o chão
function reiniciarChao() {
    chao = [];
    for (let i = 0; i <= LARGURA_TELA / TAMANHO_CHAO + 1; i++) {
        chao.push({
            sprite: chaoSprite,
            x: i * TAMANHO_CHAO,
            y: ALTURA_TELA - TAMANHO_CHAO,
            largura: TAMANHO_CHAO,
            altura: TAMANHO_CHAO
        });
    }
}

// Captura de teclas pressionadas
function keyPressed() {
    if (key === ' ' && !personagem.pulando) {
        personagem.pulando = true;
        personagem.velocidadePulo = personagem.alturaPulo;
        puloSound.play();
    }
}

// Função para verificar colisão pixel-perfect
function verificaColisaoPixelPerfect(personagem, inimigo) {

    // Obtém a área de sobreposição entre o personagem e o inimigo
    let xMin = Math.max(personagem.x, inimigo.x);
    let yMin = Math.max(personagem.y, inimigo.y);
    let xMax = Math.min(personagem.x + personagem.largura, inimigo.x + inimigo.largura);
    let yMax = Math.min(personagem.y + personagem.altura, inimigo.y + inimigo.altura);

    // Itera sobre os pixels da área de sobreposição
    for (let y = yMin; y < yMax; y++) {
        for (let x = xMin; x < xMax; x++) {

            // Converte as coordenadas do canvas para coordenadas relativas às imagens
            let xPersonagem = Math.floor(x - personagem.x);
            let yPersonagem = Math.floor(y - personagem.y);
            let xInimigo = Math.floor(x - inimigo.x);
            let yInimigo = Math.floor(y - inimigo.y);

            // Obtém a cor do pixel nas máscaras
            let corPersonagem = personagem.mascara.get(xPersonagem, yPersonagem)[0];
            let corInimigo = inimigo.mascara.get(xInimigo, yInimigo)[0];

            // Se ambos os pixels forem brancos (255)
            if (corPersonagem === 255 && corInimigo === 255) {
                return true;
            }
        }
    }

    // Se nenhum pixel branco se sobrepuser, não há colisão
    return false;
}