/*----- constants -----*/
 const pegs = [
    'empty',
    'red',
    'green',
    'blue',
    'yellow',
    'brown',
    'orange',
    'black',
    'white'
];

/*----- app's state (variables) -----*/
let gameRound; //10 rounds means 10 guesses
let gameStatus; //game in session = null, victory = 'W', loser = 'L'
let guessSlot; //array to hold the current 4 guess's
/*----- cached element references -----*/
const selectorEls = document.querySelectorAll('.selector');
const guessEls = document.querySelectorAll('#guess');
/*----- event listeners -----*/
document.querySelector('side').addEventListener('click', handlePegSelector);
/*----- functions -----*/
init();

function init() {
    gameStatus = null;
    gameRound = 0;
    loadGuessEls();
    // selectorEls.forEach(function(selecorEl, idx){

    // })
        // selectorEl.backgroundColor = pegs[idx]
    // selectorEls[0].style.background = pegs[1];
    render();
}

function render() {

}


function handlePegSelector(evt){
    if (evt.target.classList.value === 'selector'){
        console.log(evt.target.classList);
    }

    gameRound++;
}

function loadGuessEls(){

}