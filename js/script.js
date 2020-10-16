document.addEventListener('DOMContentLoaded', () => {

    const grid = document.querySelector('.grid');
    let width = 10;
    let squares = [];
    let bombAmount = 20;
    let isGameOver = false;
    let flags = 0;

    document.querySelector('input[type="button"]').addEventListener('click', () => {
        location.reload();
    }); 

    //creando el tablero
    function createBoard(){

        //ponemos las bombas random
        const bombsArray = Array(bombAmount).fill('bomb'); //crea un array de 20 posiciones y lo rellena con el string bomb
        const emptyArray = Array(width*width - bombAmount).fill('valid'); //crea un array con el resto de las posiciones y los rellena con el string valid
        const gameArray = emptyArray.concat(bombsArray); // juntamos los dos array anteriores.
        const shuffledArray = gameArray.sort(() => Math.random() -0.5); //TODO: aprender que paso aqui. 



        //Creo los cuadraditos
        for (let i = 0; i < width*width; i++) {
            const  square = document.createElement('div');
            square.setAttribute('id', i);
            square.classList.add(shuffledArray[i]); //le pone como clase el string sacado del array desordenado o bien valid o bien bomb BRILLANTE
            grid.appendChild(square);
            squares.push(square);

            // click derecho
            square.addEventListener('click', function(e){
                click(square);
            })

            square.oncontextmenu = function (e) { //TODO: estudiar que es esto de oncontextmenu
                e.preventDefault();
                addFlag(square);
            }
        }




        //agregar numeros a los cuadros que bordean las minas
        for (let i = 0; i < squares.length; i++) {
            let total = 0;
            const isLeftEdge = (i % width ===0); // comprobamos que no es un cuadro de la izquierda
            const isRightEdge = (i === width -1); //comprobamos que no es un cuadro de la derecha

            if (squares[i].classList.contains('valid')) { //si es valido (no bomba)
 
                if(i > 0 && !isLeftEdge && squares[i-1].classList.contains('bomb')) total++; //miramos la izquierda
                if(i > 9 && !isRightEdge && squares[i +1 -width].classList.contains('bomb')) total++; //Miramos la esquina superior derecha
                if(i > 10 && squares[i - width].classList.contains('bomb')) total++; // miramos arriba
                if (i > 11 && !isLeftEdge && squares[i - 1 -width].classList.contains('bomb')) total++; //miramos arriba izquierda
                if (i < 98 && !isRightEdge && squares[i + 1].classList.contains('bomb')) total++; //miramos a la derecha
                if(i < 90 && !isLeftEdge && squares[i -1 +width].classList.contains('bomb')) total++; //miramos abajo a la izq
                if(i < 88 && !isRightEdge && squares[i +1 +width].classList.contains('bomb')) total++; //miramos abajo a la derecha
                if(i < 89 && squares[i + width].classList.contains('bomb')) total++; //miramos abajo 
                squares[i].setAttribute('data', total); // a cada cuadro le meto el atributo data con el valor de cantita de minas
            }
    
        }




    }
    createBoard();

    function addFlag(square) {
        if(isGameOver) return;
        if (!square.classList.contains('checked') && (flags < bombAmount)) {
            if(!square.classList.contains('flag')) {
                square.classList.add('flag');
                flags++;
                checkForWin();
            } else {
                square.classList.remove('flag');
                square.innerHTML = '';
                flags--;
            }
        }
    }


    function click(square) {
        let currentId = square.id;

        if (isGameOver) return //para no seguir adelante
        if(square.classList.contains('checked') || square.classList.contains('flag')) return ///para no seguir adelante

        if(square.classList.contains('bomb')) {
            gameOver(square);
        } else {
            let total = square.getAttribute('data');
            if (total !=0) {
                square.classList.add('checked');
                square.innerHTML = total;
                return //lo usa para romper el ciclo, no se bien para que. Creo que para no seguir adelante.
            }

            checkSquare(square, currentId) 
        }
        
        square.classList.add('checked');
    }

    /**
     * Esta funcion se lanza cuando pulsamos en un cuadro vacio. el current id no es necesario, no se por que lo hace
     * ya que podriamos sacar esa informacion del square.id pero bueno
     */
    function checkSquare(square, currentId) {
        const isLeftEdge = (currentId % width ===0);
        const isRightEdge = (currentId % width === width -1);

        setTimeout(() => {
            if(currentId > 0 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) -1].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }

            if(currentId > 9 && !isRightEdge) {
                const newId = squares[parseInt(currentId) +1 -width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }

            if(currentId > 10) {
                const newId = squares[parseInt(currentId) -width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }

            if(currentId > 11 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) -1 -width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }

            if(currentId < 98 && !isRightEdge) {
                const newId = squares[parseInt(currentId) +1].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }

            if(currentId < 90 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) -1 + width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }

            if(currentId < 88 && !isRightEdge) {
                const newId = squares[parseInt(currentId) +1 + width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }

            if(currentId < 89) {
                const newId = squares[parseInt(currentId) + width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }


        }, 10)
    }


    function gameOver(square) {
        isGameOver = true;
        squares.forEach(square => {
            if(square.classList.contains('bomb')){
                square.classList.add('gameOver');
            }
        })
    }


    function checkForWin() {
        let matches = 0;

        for (let i = 0; i < squares.length; i++) {
            if(squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')){
                matches++;
            }

            if(matches === bombAmount) {
                console.log('WINNER');
                isGameOver = true;
                document.querySelector('.grid img').style.display = 'block';

            }
        }
    }

});