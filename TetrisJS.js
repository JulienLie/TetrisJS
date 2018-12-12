const colors = ['#ff0000', '#0000ff', '#00ff00', '#ff7700', '#ffff00', '#00ffed'];

let grille = [];
let boucle = null;
let depla = null;
let key = -1;
let tet = null;

class Tetraminos{
    constructor(pos, tab, color){
        this.pos = pos;
        this.tab = tab;
        this.color = color;
    }

    canPlace() {
        for (let j = 0; j < this.tab.length; j++) {
            for (let i = 0; i < this.tab[0].length; i++) {
                let x = this.pos[0]+j;
                let y = this.pos[1]+i;
                if (y >= 12 || x >= 24) return false;
                //console.log('j:' + j + ' i:' + i + ' pos:' + this.tab);
                if (this.tab[j][i] === 1 && grille[x][y] !== '#ffffff') return false;
            }
        }
        return true;
    }

    effacer(){
        for(let i = 0; i < this.tab.length; i++){
            for(let  j = 0; j < this.tab[0].length; j++){
                let x = this.pos[0]+i;
                let y = this.pos[1]+j;
                if(this.tab[i][j] === 1) grille[x][y] = '#ffffff';
            }
        }
    }

    mettre(){
        for(let i = 0; i < this.tab.length; i++){
            for(let j = 0; j < this.tab[0].length; j++){
                let x = this.pos[0]+i;
                let y = this.pos[1]+j;
                if(this.tab[i][j] === 1) grille[x][y] = this.color;
            }
        }
    }

    down(){
        this.effacer();
        this.pos[0] += 1;
        let bool = this.canPlace();
        if(!bool) this.pos[0] -= 1;
        this.mettre();
        if(!bool){
            getTetraminos();
            checklines();
        }
    }

    left(){
        this.effacer();
        this.pos[1] -= 1;
        let bool = this.canPlace();
        if(!bool) this.pos[1] += 1;
        this.mettre();
    }

    right(){
        this.effacer();
        this.pos[1] += 1;
        let bool = this.canPlace();
        if(!bool) this.pos[1] -= 1;
        this.mettre();
    }

    // 11 21 12 11
    // 21 22 22 12
    // 31 23 32 13

    rotate(){
        this.effacer();
        let newTab =[];
        for(let i = 0; i < this.tab[0].length; i++){
            newTab.push([]);
            for(let j = 0; j < this.tab.length; j++){
                newTab[i].unshift(this.tab[j][i]);
            }
        }
        let save = this.tab;
        this.tab = newTab;
        let bool = this.canPlace();
        if(!bool) this.tab = save;
        this.mettre();
    }
}

function draw(){
    let canvas = document.getElementById('canvas');
    if(canvas === null) return;
    let ctx = canvas.getContext('2d');
    for(let i = 0; i < 24; i++){
        for(let j = 0; j < 12; j++){
            ctx.fillStyle = grille[i][j];
            ctx.fillRect(j*20, i*20, 20, 20);
            ctx.fillStyle = '#000000';
            ctx.strokeRect(j*20, i*20, 20, 20);
        }
    }
}

function checklines(){
    
}

function getTetraminos() {
    let r = Math.round(Math.random() * (colors.length-1));
    let c = colors[r];
    r = Math.round(Math.random() * 6);
    tetraminos(r, c);
}

function tetraminos(i, c) {
    if(i > 6) {
        end();
        return;
    }
    switch (i){
        case 0:
            r = Math.round(Math.random()*7);
            pos = [[1, 1, 1, 1]];
            break;
        case 1:
            r = Math.round(Math.random()*9);
            pos = [[1, 1], [1, 1]];
            break;
        case 2:
            r = Math.round(Math.random()*8);
            pos = [[1, 1, 1], [0, 1, 0]];
            break;
        case 3:
            r = Math.round(Math.random()*8);
            pos = [[1, 1, 1], [1, 0, 0]];
            break;
        case 4:
            r = Math.round(Math.random()*8);
            pos = [[1, 1, 1], [0, 0, 1]];
            break;
        case 5:
            r = Math.round(Math.random()*8);
            pos = [[1, 1, 0], [0, 1, 1]];
            break;
        case 6:
            r = Math.round(Math.random()*8);
            pos = [[0, 1, 1], [1, 1, 0]];
            break;
    }
    tet = new Tetraminos([0, r], pos, c);
    if(tet.canPlace()){
        for(let j = 0; j < pos.length; j++){
            for(let i = 0; i < pos[0].length; i++){
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
    else if(key === 13 || key === 32){
        interval();
    }
    //console.log(key);
};

function move(){
    tet.down();
}

function interval(){    
    end();
    let nbr = 0;
    boucle = setInterval(() =>{
        switch(key){
            case 37:
            case 113:
                tet.left();
                break;
            case 39:
            case 100:
                tet.right();
                break;
            case 38:
            case 122:
                tet.rotate();
                break;
            case 40:
            case 115:
                tet.down();
                break;
        }
        key = -1;
        if((nbr+1) % 50 === 0) move();
        draw();
        nbr++;
    }, 10);
}

function end() {
    if(boucle !== null){
        clearInterval(boucle);
    }
    if(depla !== null){
        clearInterval(depla);
    }
    boucle = null;
    depla = null;
}

function init() {
    end();
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