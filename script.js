const labirinto = document.getElementById("labirinto");
const jogador = document.getElementById("jogador");
const portal = document.getElementById("portal");
const telaFinal = document.getElementById("final");


/*
==================================================
MAPA

# = parede
. = caminho
P = jogador
F = portal

TODAS AS LINHAS POSSUEM 14 COLUNAS
==================================================
*/

const mapa = [

    "##############",

    "#P...........##",

    "#.#########..#",

    "#............#",

    "############.#",

    "#............#",

    "#.############",

    "#............#",

    "############.#",

    "#............#",

    "#.############",

    "#............#",

    "#...........F#"

];


/*
==================================================
CONFIGURAÇÕES
==================================================
*/

const colunas = 14;
const linhas = 13;

let tamanhoCelula = 0;

let jogadorX = 0;
let jogadorY = 0;

let portalX = 0;
let portalY = 0;


/*
==================================================
ATUALIZA TAMANHO
==================================================
*/

function atualizarTamanho() {

    tamanhoCelula =
        labirinto.clientWidth / colunas;

}


/*
==================================================
CRIAR LABIRINTO
==================================================
*/

const paredes = [];


function criarLabirinto() {

    document
        .querySelectorAll(".parede")
        .forEach(p => p.remove());

    paredes.length = 0;

    atualizarTamanho();


    mapa.forEach((linha, y) => {

        for (let x = 0; x < colunas; x++) {

            const celula = linha[x];


            /*
            ==============================
            PAREDE
            ==============================
            */

            if (celula === "#") {

                const parede =
                    document.createElement("div");

                parede.className = "parede";


                parede.style.left =
                    (x * tamanhoCelula) + "px";


                parede.style.top =
                    (y * tamanhoCelula) + "px";


                parede.style.width =
                    tamanhoCelula + "px";


                parede.style.height =
                    tamanhoCelula + "px";


                labirinto.appendChild(parede);

                paredes.push(parede);
            }


            /*
            ==============================
            JOGADOR
            ==============================
            */

            if (celula === "P") {

                jogadorX =
                    x * tamanhoCelula +
                    tamanhoCelula * 0.07;

                jogadorY =
                    y * tamanhoCelula +
                    tamanhoCelula * 0.07;
            }


            /*
            ==============================
            PORTAL
            ==============================
            */

            if (celula === "F") {

                portalX =
                    x * tamanhoCelula;

                portalY =
                    y * tamanhoCelula;


                portal.style.left =
                    portalX + "px";

                portal.style.top =
                    portalY + "px";
            }

        }

    });


    atualizarJogador();
}


/*
==================================================
ATUALIZAR JOGADOR
==================================================
*/

function atualizarJogador() {

    jogador.style.left =
        jogadorX + "px";

    jogador.style.top =
        jogadorY + "px";
}


/*
==================================================
COLISÃO
==================================================
*/

function colisao(x, y) {

    const tamanhoJogador =
        tamanhoCelula * 0.70;


    const esquerda = x;

    const direita =
        x + tamanhoJogador;

    const cima = y;

    const baixo =
        y + tamanhoJogador;


    for (const parede of paredes) {

        const paredeEsquerda =
            parede.offsetLeft;

        const paredeDireita =
            parede.offsetLeft +
            parede.offsetWidth;

        const paredeCima =
            parede.offsetTop;

        const paredeBaixo =
            parede.offsetTop +
            parede.offsetHeight;


        if (

            direita > paredeEsquerda &&

            esquerda < paredeDireita &&

            baixo > paredeCima &&

            cima < paredeBaixo

        ) {

            return true;
        }

    }


    return false;
}


/*
==================================================
MOVER
==================================================
*/

function mover(dx, dy) {

    const velocidade =
        tamanhoCelula * 0.50;


    let novoX =
        jogadorX +
        dx * velocidade;


    let novoY =
        jogadorY +
        dy * velocidade;


    /*
    ==============================
    COLISÃO HORIZONTAL
    ==============================
    */

    if (!colisao(novoX, jogadorY)) {

        jogadorX = novoX;
    }


    /*
    ==============================
    COLISÃO VERTICAL
    ==============================
    */

    if (!colisao(jogadorX, novoY)) {

        jogadorY = novoY;
    }


    /*
    NÃO DEIXAR SAIR DA TELA
    */

    const tamanhoJogador =
        tamanhoCelula * 0.70;


    const limiteX =
        labirinto.clientWidth -
        tamanhoJogador;


    const limiteY =
        labirinto.clientHeight -
        tamanhoJogador;


    jogadorX =
        Math.max(
            0,
            Math.min(jogadorX, limiteX)
        );


    jogadorY =
        Math.max(
            0,
            Math.min(jogadorY, limiteY)
        );


    atualizarJogador();

    verificarPortal();
}


/*
==================================================
VERIFICAR PORTAL
==================================================
*/

function verificarPortal() {

    const tamanhoJogador =
        tamanhoCelula * 0.70;

    const portalTamanho =
        tamanhoCelula * 0.84;


    const jogadorDireita =
        jogadorX +
        tamanhoJogador;

    const jogadorBaixo =
        jogadorY +
        tamanhoJogador;


    const portalDireita =
        portalX +
        portalTamanho;

    const portalBaixo =
        portalY +
        portalTamanho;


    const entrou =

        jogadorX < portalDireita &&

        jogadorDireita > portalX &&

        jogadorY < portalBaixo &&

        jogadorBaixo > portalY;


    if (entrou) {

        telaFinal.style.display =
            "flex";
    }
}


/*
==================================================
TECLADO
==================================================
*/

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "ArrowUp") {

            event.preventDefault();

            mover(0, -1);
        }


        if (event.key === "ArrowDown") {

            event.preventDefault();

            mover(0, 1);
        }


        if (event.key === "ArrowLeft") {

            event.preventDefault();

            mover(-1, 0);
        }


        if (event.key === "ArrowRight") {

            event.preventDefault();

            mover(1, 0);
        }

    }
);


/*
==================================================
REINICIAR
==================================================
*/

function reiniciar() {

    telaFinal.style.display =
        "none";

    criarLabirinto();
}


/*
==================================================
SE A TELA MUDAR DE TAMANHO
==================================================
*/

window.addEventListener(
    "resize",
    function() {

        criarLabirinto();

    }
);


/*
==================================================
COMEÇAR
==================================================
*/

criarLabirinto();