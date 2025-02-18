game = {
    canvas: null,
    ctx: null,
    imagen: null,
    caratula: true,
    imagenEnemigo: null,
    teclaPulsada: null,
    tecla: [],
    colorBala: "#f4f738",
    colorBala2: "#5bf3ff",
    balas_array: new Array(),
    balasEnemigas_array: new Array(),
    enemigos_array: new Array(),
    disparo: false,
    puntos: 0,
    finJuego: false,
    boing: null,
    disparoJugador: null,
    intro: null,
    fin: null
}

//constantes que nos permiten mover las naves

const KEY_ENTER = 13;
const KEY_LEFT = 37;
const KEY_UP = 30;
const KEY_RIGHT = 39;
const KEY_DOWN = 40;
const BARRA = 32;


//OBJETOS 

function Bala(x, y, w, h) { // Añade el parámetro h (alto)
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h; // Añade el alto de la bala
    this.dibujar = function () {
        game.ctx.save();
        game.ctx.fillStyle = game.colorBala;
        game.ctx.fillRect(this.x, this.y, this.w, this.h); // Usa this.h como cuarto parámetro
        this.y = this.y - 5; // Mueve la bala hacia arriba
        game.ctx.restore();
    };

    this.disparar = function (){
        game.ctx.save();
        game.ctx.fillStyle = game.colorBala2;
        game.ctx.fillRect(this.x, this.y, this.w, this.h);
        this.y = this.y + 6;
        game.ctx.restore();
    };
}

function Jugador (x){
    this.x = game.canvas.width / 2 - 37.5; // Centrado horizontalmente
    this.y = game.canvas.height - 96; // Parte de abajo del canvas
    this.w = 75;
    this.h = 96;
    this.dibujar = function (x){
        this.x = x;
        game.ctx.drawImage(game.imagen, this.x, this.y, this.w, this.h);
    };
}

function Enemigo(x, y){
    this.x = x;
    this.y = y;
    this.w = 35;
    this.veces = 0;
    this.dx = 5;
    this.ciclos = 0;
    this.num = 14;
    this.figura = true;
    this.vive = true;
    this.dibujar = function () { 

        //retraso de enemigos
        if(this.ciclos>30){

            //saltitos
            if(this.veces>this.num){
                this.dx*= -1;
                this.veces = 0;
                this.num = 28;
                this.y += 20;
                this.dx = (this.dx>0)? this.dx++ : this.dx--;//if else (operador ternario)
            }
            else{
                this.x += this.dx;
            }
            this.veces++;
            this.ciclos = 0;
            this.figura = !this.figura;
    
        }else{
            this.ciclos++;

        }


        if(this.figura){
            game.ctx.drawImage(game.imagenEnemigo, 0, 0, 40, 30, this.x, this.y, 35, 30);
        }else{
            game.ctx.drawImage(game.imagenEnemigo, 50, 0, 35, 30, this.x, this.y, 35, 30);
        }

    };
}

//funciones

const caratula = () => {
    let imagen = new Image();
    imagen.src = "/navecitas/imagenes/caratula.jpg";
    imagen.onload = () => {
        game.ctx.drawImage(imagen, 0, 0, game.canvas.width, game.canvas.height);
    }
}

const seleccionar = (e) =>{
    if (game.caratula){
        inicio();
    }
}

const inicio = () =>{
    game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
    game.caratula = false;
    game.Jugador = new Jugador(0);
    game.x = game.canvas.width/2; //dividiendo el ancho del canvas
    game.Jugador.dibujar(game.x);
    game.intro.play();
    animar();
}

var x = 100, y = 100;

const animar = () =>{
    if(game.finJuego == false){
        requestAnimationFrame(animar); //se actualiza el juego
        verificar();
        pintar();
        colisiones();
    }
}

const colisiones = () =>{
    let enemigo, bala;
    for(var i = 0; i<game.enemigos_array.length; i++){
        for(var j = 0; j<game.balas_array.length; j++){
            enemigo = game.enemigos_array[i];
            bala = game.balas_array[j];

            if(enemigo != null && bala != null){
                if((bala.x>enemigo.x) && (bala.x<enemigo.x+enemigo.w) && (bala.y>enemigo.y) && (bala.y<enemigo.y+enemigo.w)){
                    game.ctx.drawImage(game.imagenEnemigo, 100, 0, 30, 30, enemigo.x, enemigo.y, 35, 30);
                    enemigo.vive = false;
                    game.enemigos_array[i] = null;
                    game.balas_array.splice(j, 1); // Elimina la bala del array
                    game.disparo = false; // Reinicia la variable de disparo
                    game.puntos += 10;
                    game.boing.play();
                }
            }
        }
    }


    //colisiones balas enemigas

    for(var j = 0; j<game.balasEnemigas_array.length; j++){
        bala = game.balasEnemigas_array[j];
        if(bala != null){
            if((bala.x > game.Jugador.x) && (bala.x < game.Jugador.x + game.Jugador.w) && (bala.y > game.Jugador.y) && (bala.y < game.Jugador.y + game.Jugador.h)){
                gameOver();
            }
        }
    }

}

const gameOver = () => {
    game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
    game.balas_array = [];
    game.enemigos_array = [];
    game.balasEnemigas_array = [];
    game.finJuego = true;
    game.intro.pause();
    game.intro.currentTime = 0;
    game.fin.play();

    let centerX = game.canvas.width / 2;
    let startY = game.canvas.height / 3; // Posición inicial
    let spacing = 50; // Espaciado entre mensajes

    mensaje("GAME OVER :(", 40, startY);
    mensaje("Lograste: " + game.puntos + " puntos", 30, startY + spacing);

    if (game.puntos > 100 && game.puntos <= 200) {
        mensaje("Casi lo logras", 30, startY + spacing * 2);
    } else if (game.puntos > 200) {
        mensaje("Felicidades", 30, startY + spacing * 2);
    } else {
        mensaje("Fallaste", 30, startY + spacing * 2);
    }
};


const mensaje = (cadena, tamano = 40, y = 0) =>{
    let medio = (game.canvas.width)/2;
    game.ctx.save();
    game.ctx.fillStyle = "green";
    game.ctx.strokeStyle = "blue";
    game.ctx.textBaseline = "top";
    game.ctx.font = tamano + "px Pixelify Sans";
    game.ctx.textAlign = "center";
    game.ctx.fillText(cadena, medio, y);
    game.ctx.restore();
}

const verificar = () =>{
    
    if(game.tecla[KEY_RIGHT])game.x+=10;
    if(game.tecla[KEY_LEFT])game.x-=10;

    //verificacion del jugador

    if (game.x > game.canvas.width - 75) game.x = game.canvas.width - 75; // 75 es el ancho del jugador
    if (game.x < 0) game.x = 0;
    
    //disparo
    if(game.tecla[BARRA]){

        if(game.disparo == false){
            game.balas_array.push(new Bala(game.Jugador.x + 30, game.Jugador.y - 10, 5, 10));
            game.tecla[BARRA] = false;
            game.disparo = true;
            game.disparoJugador.play();
        }
    }

    //disparo enemigo
    if(Math.random()>0.95){
        dispararEnemigo();
    }


}

const dispararEnemigo = () =>{
    var ultimos = new Array();
    for(var i=game.enemigos_array.length-1; i>0; i--){
        if(game.enemigos_array[i] != null){
            ultimos.push(i);
        }

        if(ultimos.length==10) break;
    }

    d = ultimos[Math.floor(Math.random() * 10)];
    game.balasEnemigas_array.push(new Bala(game.enemigos_array[d].x+game.enemigos_array[d].w/2, game.enemigos_array[d].y, 5, 10));
}

const pintar = () =>{
    game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height); //limpia el canvas en cada fotograma
    score();
    game.Jugador.dibujar(game.x);

    //mover las balas
    for (var i=0; i<game.balas_array.length;i++){

        if(game.balas_array[i]!=null){
            game.balas_array[i].dibujar();
            if(game.balas_array[i].y<0){
                game.balas_array.splice(i, 1); // Elimina la bala del array
                i--; // Ajusta el índice después de eliminar un elemento
                game.disparo = false; // Reinicia la variable de disparo
            }
        }
    }

    //balas enemigas
    for(var i = 0; i<game.balasEnemigas_array.length; i++){
        if(game.balasEnemigas_array[i] != null){
            game.balasEnemigas_array[i].disparar();
            if(game.balasEnemigas_array[i].y>game.canvas.height){
                game.balasEnemigas_array[i] = null;

            }
        }
    }

    //enemigos
    for(var i=0; i<game.enemigos_array.length; i++){
        if(game.enemigos_array[i] != null){
            game.enemigos_array[i].dibujar();
        }
    }
}

const score = ()=>{
    game.ctx.save();
    game.ctx.fillStyle = "white";
    game.ctx.font = "20px Pixelify Sans";
    game.ctx.fillText("SCORE: " + game.puntos, 10, 20);
    game.ctx.restore();
}


//listener
document.addEventListener("keydown", function(e){
    game.tecla[e.keyCode] = true;
});

document.addEventListener("keyup", function(e){
    game.tecla[e.keyCode] = false;
});


//funcion para que el juego funcione en cualquier navegador
window.requestAnimationFrame = (function (){
    return window.requestAnimationFrame || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame ||
        function (callback) { window.setTimeout(callback, 17);} //por si no esta disponible 
})();

window.onload=function(){
    game.canvas = document.getElementById("canvas");

    if(game.canvas && game.canvas.getContext){
        game.ctx = game.canvas.getContext("2d");

        if(game.ctx){
            //sonidos
            game.boing = document.getElementById("boing");
            game.disparoJugador = document.getElementById("disparo");
            game.intro = document.getElementById("intro");
            game.fin = document.getElementById("fin");


            game.imagen = new Image();
            game.imagen.src = "/navecitas/imagenes/masterchief.png";

            //crear enemigos
            game.imagenEnemigo = new Image();
            game.imagenEnemigo.src = "/navecitas/imagenes/covenant.png"
            game.imagenEnemigo.onload = function(){
                for(var i = 0; i<5; i++){
                    for(var j = 0; j<11; j++){
                        game.enemigos_array.push(new Enemigo(100+40*j, 30+45*i));
                    }
                }
            }

            caratula();
            game.canvas.addEventListener("click", seleccionar, false);
            
        }
        else{
            alert("No soporta etiqueta canvas.")
        }
    }
}