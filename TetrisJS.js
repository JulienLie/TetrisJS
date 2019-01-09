const colors = ['#ff0000', '#00ffff', '#696969', '#800000', '#ff00ff', '#0000ff', '#00ff00'];

let grille = [];
let boucle = null;
let depla = null;
let key = -1;
let tet = null;
let score = 0;
let lines = 0;
let level = 1;

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
            checklines();
            getTetraminos();
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
    let nbr = 0;
    let pos = -1;       
    for(let i = grille.length-1; i >= 0; i--){
        let bool = true;
        for(let j = 0; j < grille[i].length && bool; j++){
            if(grille[i][j] === '#ffffff') bool = false;
        }
        if(bool){
            for(let j = 0; j < grille[i].length; j++){
                grille[i][j] = '#ffffff';
            }
            nbr++;
            if(pos < 0) pos = i;
        }
    }
    if(nbr === 0) return;
    for(let i = pos-nbr; i >= 0; i--){
        for(let j = 0; j < grille[i].length; j++){
            grille[i+nbr][j] = grille[i][j];
        }
    }
    let s = 80*(nbr+1);
    setLine(lines+nbr);
    setScore(score + s);
}

function setLine(l){
    addLines = function(n){
        for(let i = 0; i < n; i++){
            lines += 1;
            if(lines !== 0 && (lines % 10) === 0) setLevel(level+1);
        }
    }
    if(l === 0) lines = 0;
    else if(l > lines) addLines(l-lines); 
    document.getElementById('lines').innerHTML = "Ligne: " + lines;
}



function setLevel(l){
    level = l;
    document.getElementById('level').innerHTML = "Level: " + level; 
}

function setScore(s){
    score = s;
    document.getElementById('score').innerHTML = 'Score:'+s;
}

function getTetraminos() {
    r = Math.floor(Math.random() * 6.9999999999999);
    tetraminos(r);
}

function tetraminos(i) {
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
    let c = colors[i];
    tet = new Tetraminos([0, r], pos, c);
    if(tet.canPlace()){
        for(let j = 0; j < pos.length; j++){
            for(let i = 0; i < pos[0].length; i++){
                if(pos[j][i] === 1) grille[j][r+i] = c;
            }
        }
    }
    else tetraminos(i+1);
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
                setScore(score+1);
                break;
        }
        key = -1;
        console.log(level);
        if((nbr+1) % (51-(level*2)) === 0) move();
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
    setLine(0);
    setScore(0);
    setLevel(1);
    grille = [];
    for(let i = 0; i < 24; i++){
        grille.push([]);
        for(let j = 0; j < 12; j++){
            grille[i][j] = '#ffffff';
        }
    }
    //console.log('test:' + ('#ffffff' !== '#ffffff'));
    getTetraminos();
    draw();
}
