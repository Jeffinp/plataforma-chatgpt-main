// Constantes para melhorar a legibilidade e manutenção
const CONFIG = {
    LARGURA_TELA: 800,
    ALTURA_TELA: 400,
    TAMANHO_CHAO: 64,
    GRAVIDADE: 0.5,
    VELOCIDADE_INICIAL: 2.5,
    INCREMENTO_VELOCIDADE: 0.05,
    ALTURA_INICIAL_PULO: -18
};

// Estados do jogo
const ESTADO_JOGO = {
    JOGANDO: 0,
    GAME_OVER: 1
};

let estadoAtual = ESTADO_JOGO.JOGANDO;

// Objetos do Jogo
let personagem = {
    x: 50,
    y: CONFIG.ALTURA_TELA - 96 - CONFIG.TAMANHO_CHAO,
    largura: 96,
    altura: 96,
    pulando: false,
    alturaPulo: CONFIG.ALTURA_INICIAL_PULO,
    velocidadePulo: 0,
    sprite: {
        atual: 0,
        array: [],
        intervaloTroca: 10,
        contador: 0
    },
    mascara: null
};

let inimigo = {
    x: CONFIG.LARGURA_TELA,
    y: CONFIG.ALTURA_TELA - 64 - CONFIG.TAMANHO_CHAO,
    largura: 64,
    altura: 64,
    sprite: null,
    mascara: null
};

// Armazenar estado inicial para reset
const ESTADO_INICIAL_PERSONAGEM = {
    x: personagem.x,
    y: personagem.y,
    pulando: false,
    velocidadePulo: 0
};

const ESTADO_INICIAL_INIMIGO = {
    x: inimigo.x,
    y: inimigo.y
};

let chao = [];
let chaoSprite;
let puloSound;
let velocidade = CONFIG.VELOCIDADE_INICIAL;
let restartButton;
let pontuacao;

// Classe Pontuacao
class Pontuacao {
    constructor() {
        this.valor = 0;
        this.x = 30;
        this.y = 40;
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
        textAlign(LEFT, TOP);
        let textoPontuacao = this.texto + Math.floor(this.valor);
        let larguraTexto = textWidth(textoPontuacao);

        if (this.x + larguraTexto > CONFIG.LARGURA_TELA - 20) {
            this.x = CONFIG.LARGURA_TELA - larguraTexto - 20;
        }

        text(textoPontuacao, this.x, this.y);
    }

    resetar() {
        this.valor = 0;
        this.x = 30;
    }
}

// Pré-carregamento de assets
function preload() {
    personagem.sprite.array = [
        loadImage('assets/platformChar_walk1.png'),
        loadImage('assets/platformChar_walk2.png')
    ];
    inimigo.sprite = loadImage('assets/platformPack_tile043.png');
    chaoSprite = loadImage('assets/platformPack_tile013.png');
    puloSound = loadSound('assets/footstep09.ogg');
    personagem.mascara = loadImage('assets/platformChar_mask.png');
    inimigo.mascara = loadImage('assets/platformPack_tile043_mask.png');
}

// Configuração inicial
function setup() {
    let canvas = createCanvas(CONFIG.LARGURA_TELA, CONFIG.ALTURA_TELA);
    canvas.parent('canvas-container');

    reiniciarChao();

    restartButton = select('#restart-button');
    restartButton.mousePressed(reiniciarJogo);
    restartButton.style('display', 'none'); // Inicia oculto

    pontuacao = new Pontuacao();
}

// Loop principal
function draw() {
    if (estadoAtual === ESTADO_JOGO.JOGANDO) {
        atualizarJogo();
    } else if (estadoAtual === ESTADO_JOGO.GAME_OVER) {
        exibirGameOver();
    }
}

function atualizarJogo() {
    background(220);

    // Desenhar e mover o chão
    for (let tile of chao) {
        image(tile.sprite, tile.x, tile.y, tile.largura, tile.altura);
        tile.x -= velocidade;
        if (tile.x <= -CONFIG.TAMANHO_CHAO) {
            tile.x = CONFIG.LARGURA_TELA + (tile.x + CONFIG.TAMANHO_CHAO);
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
        personagem.velocidadePulo += CONFIG.GRAVIDADE;
        if (personagem.y > CONFIG.ALTURA_TELA - personagem.altura - CONFIG.TAMANHO_CHAO) {
            personagem.y = CONFIG.ALTURA_TELA - personagem.altura - CONFIG.TAMANHO_CHAO;
            personagem.pulando = false;
        }
    }

    // Desenhar e mover inimigo
    image(inimigo.sprite, inimigo.x, inimigo.y, inimigo.largura, inimigo.altura);
    inimigo.x -= velocidade;

    if (inimigo.x < -inimigo.largura) {
        inimigo.x = CONFIG.LARGURA_TELA;
        velocidade += CONFIG.INCREMENTO_VELOCIDADE;
    }

    // Atualizar e exibir a pontuação
    pontuacao.atualizar();
    pontuacao.exibir();

    // Verificar colisão com Bounding Box antes do Pixel-Perfect
    if (verificaColisaoBoundingBox(personagem, inimigo) &&
        verificaColisaoPixelPerfect(personagem, inimigo)) {
        estadoAtual = ESTADO_JOGO.GAME_OVER;
    }
}

function exibirGameOver() {
    textSize(64);
    fill(255, 0, 0);
    textAlign(CENTER, CENTER);
    text("Game Over", width / 2, height / 2 - 64);

    textSize(22);
    fill(255);
    text("Pontuação Final: " + Math.floor(pontuacao.valor), width / 2, height / 2);

    restartButton.style('display', 'block');
    noLoop();
}

// Função para reiniciar o jogo
function reiniciarJogo() {
    estadoAtual = ESTADO_JOGO.JOGANDO;
    personagem.x = ESTADO_INICIAL_PERSONAGEM.x;
    personagem.y = ESTADO_INICIAL_PERSONAGEM.y;
    personagem.pulando = ESTADO_INICIAL_PERSONAGEM.pulando;
    personagem.velocidadePulo = ESTADO_INICIAL_PERSONAGEM.velocidadePulo;
    inimigo.x = ESTADO_INICIAL_INIMIGO.x;
    inimigo.y = ESTADO_INICIAL_INIMIGO.y;
    velocidade = CONFIG.VELOCIDADE_INICIAL;

    pontuacao.resetar();
    reiniciarChao();

    restartButton.style('display', 'none');
    loop();
}

// Função para reiniciar o chão
function reiniciarChao() {
    chao = [];
    for (let i = 0; i <= CONFIG.LARGURA_TELA / CONFIG.TAMANHO_CHAO + 1; i++) {
        chao.push({
            sprite: chaoSprite,
            x: i * CONFIG.TAMANHO_CHAO,
            y: CONFIG.ALTURA_TELA - CONFIG.TAMANHO_CHAO,
            largura: CONFIG.TAMANHO_CHAO,
            altura: CONFIG.TAMANHO_CHAO
        });
    }
}

// Captura de teclas pressionadas
function keyPressed() {
    if (key === ' ' && !personagem.pulando && estadoAtual === ESTADO_JOGO.JOGANDO) {
        personagem.pulando = true;
        personagem.velocidadePulo = personagem.alturaPulo;
        puloSound.play();
    }
}

// Função para verificar colisão por bounding box
function verificaColisaoBoundingBox(obj1, obj2) {
    return obj1.x < obj2.x + obj2.largura &&
        obj1.x + obj1.largura > obj2.x &&
        obj1.y < obj2.y + obj2.altura &&
        obj1.y + obj1.altura > obj2.y;
}

// Função para verificar colisão pixel-perfect
function verificaColisaoPixelPerfect(personagem, inimigo) {
    let xMin = Math.max(personagem.x, inimigo.x);
    let yMin = Math.max(personagem.y, inimigo.y);
    let xMax = Math.min(personagem.x + personagem.largura, inimigo.x + inimigo.largura);
    let yMax = Math.min(personagem.y + personagem.altura, inimigo.y + inimigo.altura);

    for (let y = yMin; y < yMax; y++) {
        for (let x = xMin; x < xMax; x++) {
            let xPersonagem = Math.floor(x - personagem.x);
            let yPersonagem = Math.floor(y - personagem.y);
            let xInimigo = Math.floor(x - inimigo.x);
            let yInimigo = Math.floor(y - inimigo.y);

            let corPersonagem = personagem.mascara.get(xPersonagem, yPersonagem)[0];
            let corInimigo = inimigo.mascara.get(xInimigo, yInimigo)[0];

            if (corPersonagem === 255 && corInimigo === 255) {
                return true;
            }
        }
    }

    return false;
}