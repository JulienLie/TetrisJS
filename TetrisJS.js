const colors = ['#ff0000', '#0000ff', '#00ff00', '#000000'];

let grille = [];
let boucle = null;
let key = -1;

function draw(){
    let canvas = document.getElementById('canvas');
    if(canvas === null) return;
    let ctx = canvas.getContext('2d');
    for(let i = 0; i < 24; i++){
        for(let j = 0; j < 12; j++){
            ctx.fillStyle = grille[i][j];
            ctx.fillRect(j*20, i*20, 20, 20);
        }
    }
}

function canPlace(start, pos) {
    for (let j = 0; j < 2; j++) {
        for (let i = 0; i < 4; i++) {
            if (start + i >= 12) return false;
            if (pos[j][i] === 1 && grille[j][start + i] !== '#ffffff') return false;
        }
    }
    return true;
}

function getTetraminos() {
    let r = Math.round(Math.random() * 3);
    let c = colors[r];
    r = Math.round(Math.random() * 6);
    tetraminos(r, c);
}

function tetraminos(i, c) {
    if(i > 6) {
        end();
        return;
    }
    let r;
    let pos;
    switch (i){
        case 0:
            r = Math.round(Math.random()*7);
            pos = [[1, 1, 1, 1], [0, 0, 0, 0]];
            break;
        case 1:
            r = Math.round(Math.random()*9);
            pos = [[1, 1, 0, 0], [1, 1, 0, 0]];
            break;
        case 2:
            r = Math.round(Math.random()*8);
            pos = [[1, 1, 1, 0], [0, 1, 0, 0]];
            break;
        case 3:
            r = Math.round(Math.random()*8);
            pos = [[1, 1, 1, 0], [1, 0, 0, 0]];
            break;
        case 4:
            r = Math.round(Math.random()*8);
            pos = [[1, 1, 1, 0], [0, 0, 1, 0]];
            break;
        case 5:
            r = Math.round(Math.random()*8);
            pos = [[1, 1, 0, 0], [0, 1, 1, 0]];
            break;
        case 6:
            r = Math.round(Math.random()*8);
            pos = [[1, 1, 0, 0], [1, 1, 0, 0]];
            break;
    }
    console.log('r:'+r+' i:' + i);
    if(canPlace(r, pos)){
        for(let j = 0; j < 2; j++){
            for(let i = 0; i < 4; i++){
                if(pos[j][i] === 1) grille[j][r+i] = c;
            }
        }
    }
    else tetraminos(i+1, c);
}

window.onkeypress = function (e) {
    key = e.keyCode ? e.keyCode : e.which;
    if(key === 114){
        init();
    }

};

function move(){
    
}

function interval(){
    boucle = setInterval(() =>{
        move();
    }, 100);
}

function end() {
    if(boucle !== null){
        clearInterval(boucle);
    }
}

function init() {
    boucle = null;
    for(let i = 0; i < 24; i++){
        grille.push([]);
        for(let j = 0; j < 12; j++){
            grille[i][j] = '#ffffff';
        }
    }
    console.log('test:' + ('#ffffff' !== '#ffffff'));
    getTetraminos();
    draw();
}