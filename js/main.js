/*----- constants -----*/
 const pegs = [
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
let gameStatus; //game in session = null, victory = 'W', loser = 'L'
let roundsLeft; //10 rounds means 10 guesses
let guessSlot; //array to hold the current guess slots group
let currentGuess; //array that holds the current player guesses data
//let guessCount; //int to keep track of how many guess there are
let masterCode; // array with the sequence the player has to guess
let difficulty; //4 for standard mode, 5 for MINDFLAYER
/*----- cached element references -----*/
const selectorEls = document.querySelectorAll('.selector');
const guessEls = document.querySelectorAll('.peg-cell-guess');
const clueEls = document.querySelectorAll('.peg-cell-clue');
const masterEls = document.getElementById('master-cell');
/*----- event listeners -----*/
document.querySelector('side').addEventListener('click', handlePegSelector);
//document.querySelector('.ng-button').addEventListener('click', init);
document.querySelector('.rmv-button').addEventListener('click', removePeg);
//document.querySelector('.sub-button').addEventListener('click', submitGuess);

/*----- functions -----*/
init();

function init() {
    gameStatus = null;
    difficulty = 4;
    roundsLeft = 9;
    currentGuess = [];
    masterCode = Array(difficulty).fill();
    console.log(masterCode);
    masterCode.forEach((string, idx) => {
        masterCode[idx] = pegs[Math.floor(Math.random()*8)];
    })

    loadGuessEls();
    layoutPegs();
    render();
}

function render() {
    //assign a color id for each guessEl and remove any id's that are no longer supposed to be there
    for(i=0; i<difficulty ; i++){
        if (i<currentGuess.length){
            guessEls[roundsLeft].children[i].setAttribute('id', `${currentGuess[i]}`);
        }
        else {
            guessEls[roundsLeft].children[i].setAttribute('id','');
        }
    }
    //
}

function handlePegSelector(evt){
    //update the current guesses array with the peg selected
    if (evt.target.classList.value === 'selector'){
        if (currentGuess.length >= difficulty) {
            alert('guesses full'); // need to replace later
            return;
        }
        currentGuess.push(evt.target.id);
        
        console.log(evt.target.id);
        render();
    }
}

function handlePegRemover(){
    //check if guessSlot array is empty, if true send message
    //remove a peg from the guessSlot array
}

function loadGuessEls(){
    guessSlot = guessEls[roundsLeft].children;
}
function layoutPegs(){
    let allEls = [...guessEls, ...clueEls];
    allEls.forEach(function(El){
        for(i = 0; i <difficulty; i++) {
            let peg = document.createElement('peg');
            peg.setAttribute('class','empty');
            El.appendChild(peg);
        }
    })
    for(i=0; i<difficulty; i++) {
        let peg = document.createElement('peg');
        peg.setAttribute('class' , 'mystery');
        peg.textContent = '?';
        masterEls.appendChild(peg);
        console.log(masterEls);
    }
}

function submitGuess(){
    if (guessCount.length < difficulty) alert('you have more pegs to fill');
    let correctColors = 0;
    let truelyCorrect = 0;
    
    //check guess against masterMinds answer
    //create array with white/black peg combo for the clue feedback
    //if all pegs in clue array are black, update gameStatus to victory
      //else if roundsLeft = 0, update gameStatus to Loss
      //else decrement roundsLeft and render 
  }

  function removePeg(){
    if (currentGuess.length === 0) alert('not enough pegs'); //need change this
    currentGuess.pop();
    
    render();
  }
  