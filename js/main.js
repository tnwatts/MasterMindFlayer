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
let gameRoundsLeft; //10 rounds means 10 guesses
let gameStatus; //game in session = null, victory = 'W', loser = 'L'
let guessSlot; //array to hold the current play group
let currentGuess; //array that holds the current guesses
let guessCount; //int to keep track of how many guess there are
/*----- cached element references -----*/
const selectorEls = document.querySelectorAll('.selector');
const guessEls = document.querySelectorAll('.peg-cell-guess');
const clueEls = document.querySelectorAll('.peg-cell-clue');
/*----- event listeners -----*/
document.querySelector('side').addEventListener('click', handlePegSelector);
/*----- functions -----*/
init();

function init() {
    gameStatus = null;
    gameRoundsLeft = 9;

    currentGuess = [];
    loadGuessEls();
    layoutDivs();
    // selectorEls.forEach(function(selecorEl, idx){

    // })
        // selectorEl.backgroundColor = pegs[idx]
    // selectorEls[0].style.background = pegs[1];
    render();
}

function render() {
    //assign current guesses to elements
    //guessSlot[currentGuess.length-1].setAttribute('id', `${currentGuess}`);
}

function handlePegSelector(evt){
    //update the current guesses array with the peg selected
    if (evt.target.classList.value === 'selector'){
        if (currentGuess.length >= 4) {
            alert('guesses full');
            return;
        }
        currentGuess.push(evt.target.id);
        
        console.log(evt.target.id);
    }
}

function handlePegRemover(){
    //check if guessSlot array is empty, if true send message
    //remove a peg from the guessSlot array
}

function loadGuessEls(){
    guessSlot = guessEls[gameRoundsLeft].children;
}
function layoutDivs(){
    let allEls = [...guessEls, ...clueEls];
    allEls.forEach(function(El){
        for(i = 0; i <4; i++) {
            let peg = document.createElement('peg');
            peg.setAttribute('class','empty');
            El.appendChild(peg);
        }
    })
    console.log(allEls);
}

