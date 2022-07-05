/*----- constants -----*/
 const pegs = [
    'red',
    'green',
    'blue',
    'yellow',
    'brown',
    'orange'
];

/*----- app's state (variables) -----*/
let gameStatus; //game in session = null, victory = 'W', loser = 'L'
let roundsLeft; //9 roundsLeft means 10 guesses total
let roundChanged; //variable that tracks if the round has changed
let guessSlot; //array to hold the current guess slots group
let currentGuess; //array that holds the current player guesses data
let masterCode; // array with the sequence the player has to guess, MASTERMINDS CODE
let difficulty; //4 for standard mode, 5 for MINDFLAYER(icebox), this represents how many pegs make up masterminds code
let clues; //array that holds the guess feed back clues
/*----- cached element references -----*/
const selectorEls = document.querySelectorAll('.selector');
const guessEls = document.querySelectorAll('.peg-cell-guess');
const clueEls = document.querySelectorAll('.peg-cell-clue');
const masterEls = document.getElementById('master-cell');
const trackerEls = document.querySelectorAll('.tracker');
const greetingContainer = document.querySelector('.greeting');
const greetingEl = document.querySelector('.greeting > div');
const rulesEl = document.querySelector('.greeting > a');
/*----- event listeners -----*/
document.querySelector('side').addEventListener('click', handlePegSelector);
document.querySelector('.ng-button').addEventListener('click', handleNewGame);
document.querySelector('.rmv-button').addEventListener('click', handlePegRemover);
document.querySelector('.sub-button').addEventListener('click', handleSubmitGuess);
document.querySelector('.greeting').addEventListener('click' , handleGreeting);
/*----- functions -----*/

init();

function init() {
    gameStatus = null;
    difficulty = 4; //Icebox item = 2 difficulty modes selectable by user
    roundsLeft = 9; 
    roundChanged = false;
    clues = [];
    currentGuess = [];
    masterCode = randomUniquePegs(difficulty);   //MASTERMIND IS PICKING HIS CODE HERE
    trackerEls.forEach((el) => el.textContent = '');
    trackerEls[9].textContent = `<--Turn: 1`;
    layoutPegs();
    render();
    
}

//init functions-->
function render() {
    for(i=0; i<difficulty ; i++){
        //render guesses
        if (i<currentGuess.length){
            guessEls[roundsLeft].children[i].setAttribute('id', `${currentGuess[i]}`);
        } else {
            guessEls[roundsLeft].children[i].setAttribute('id','');
        }
        //render clues
        if (i<clues.length){
            clueEls[roundsLeft].children[i].setAttribute('id', `${clues[i]}`);
        } else {
            clueEls[roundsLeft].children[i].setAttribute('id', '');
        }
    }
    if (roundChanged && (!(!!gameStatus))){
        trackerEls[roundsLeft].textContent = '';
        trackerEls[roundsLeft-1].textContent = `<--Turn: ${10-(--roundsLeft)}`;
        roundChanged = false;
    }

    if(gameStatus === 'W'){
        alert('YOU WON');
        revealMasterCode();
        
    }else if(gameStatus === 'L'){
       alert('YOU LOST');
       revealMasterCode();
    }
}
function randomUniquePegs(length){
    let rando;
    let uniqueArr = new Array(length).fill('');
    for( i=0 ; i<length ; i++ ){
        rando = Math.floor(Math.random()*pegs.length);
        if (uniqueArr.includes(pegs[rando])){i--}
        else {uniqueArr[i] = pegs[rando]};
    }
        return uniqueArr;
   }


function removeAllChildren(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function layoutPegs() {
    let allEls = [...guessEls, ...clueEls];
    allEls.forEach(function(el){
        removeAllChildren(el);                      //need to remove all children for games after the first
        for(i = 0; i <difficulty; i++) {
            let peg = document.createElement('peg');
            peg.setAttribute('class','empty');
            el.appendChild(peg);
        }
    });
    removeAllChildren(masterEls);
    for(i=0; i<difficulty; i++) {
        let peg = document.createElement('peg');
        peg.setAttribute('class' , 'mystery');
        peg.textContent = '?';
        masterEls.appendChild(peg);
        //console.log(masterEls);
    }
}
//<---init functions


//<----handlers
function handleSubmitGuess(){
    if (!!gameStatus) return alert("CLICK NEW GAME TO PLAY AGAIN!");
    if (currentGuess.length < difficulty) return alert('you have more pegs to fill');
    let whitePegCount = 0;
    let blackPegCount = 0;
    currentGuess.forEach(function(peg, idx){
        if(peg === masterCode[idx]){blackPegCount++}
        else if(masterCode.includes(peg)){whitePegCount++}
    });
    
    clues = Array(difficulty).fill('black', 0 , blackPegCount);
    clues.fill('white' , blackPegCount , (blackPegCount + whitePegCount));
    
    if (blackPegCount >= difficulty) {
        gameStatus = 'W';
    } else if(roundsLeft < 1) {
        gameStatus = 'L';
    }
    roundChanged = true;
    render();
    clues = [];
    currentGuess = [];
}

function handlePegRemover () {
    if (!!gameStatus) return alert("CLICK NEW GAME TO PLAY AGAIN!");
    if (currentGuess.length === 0) return alert('not enough pegs'); //need change this
    currentGuess.pop();
    render();
  }

function handlePegSelector (evt) {
    
    //Gaurd
    if (evt.target.classList.value === 'selector'){
        if (!!gameStatus) return alert("CLICK NEW GAME TO PLAY AGAIN!");
        if (currentGuess.length >= difficulty) {
            alert('guesses full'); // need to replace later
            return;
        }
        currentGuess.push(evt.target.id);
        render();
    }
}

function handleNewGame () {
    if (!(!!gameStatus)) {}//ask if sure
    init();//
}

function handleGreeting (evt) {
    // console.log(evt.target.childNodes);
    // const spanNode; =  rulesEl.childNodes[1].cloneNode(true);
    // console.log(spanNode);
    if (greetingContainer.classList.value === 'greeting-rules'){
        greetingContainer.classList.value = 'greeting';
        greetingEl.innerText = "MasterMind!";
        rulesEl.innerText = "Click here for rules";
        
    } else {
        greetingContainer.classList.value = 'greeting-rules';
        greetingEl.innerText = "";
        rulesEl.innerText = "You must guess the code. The code is 4 unique pegs. You have 10 guesses. Black clue pegs indicate a peg is the correct color and in the correct position. A white peg indicates only a correct color. The orientation of the pegs does not indicate which peg is correct.";
    }
    // check which class it is and either add rules text or remove rules text

}
function revealMasterCode() {
    for( i=0 ; i<difficulty ;i++ ){
        masterEls.children[i].setAttribute('id' , `${masterCode[i]}`);
        masterEls.children[i].textContent = '';
    }
}