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
const warningEl = document.querySelector('.warning');
const backEl = document.querySelector('.background-container');
/*----- event listeners -----*/
document.querySelector('side').addEventListener('click', handlePegSelector);
document.querySelector('.ng-button').addEventListener('click', handleNewGame);
document.querySelector('.rmv-button').addEventListener('click', handlePegRemover);
document.querySelector('.sub-button').addEventListener('click', handleSubmitGuess);
document.querySelector('.greeting').addEventListener('click' , handleGreeting);
document.querySelector('#mindflayer').addEventListener('click', handleMindflayer);
/*----- functions -----*/

init(4);

function init(int) {
    gameStatus = null;
    difficulty = int;
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

//init functions--->
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
        document.querySelector('.status').innerText = 'You Won!'
        revealMasterCode();
        //add mindFlayer button
    }else if(gameStatus === 'L'){
        document.querySelector('.status').innerText = 'You Lost!'
        revealMasterCode();
    }else {
        document.querySelector('.status').innerText = 'Game On!'
        
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

//handlers--->
function handleSubmitGuess(){
    if (!!gameStatus) return displayWarning('Press New Game!');
    if (currentGuess.length < difficulty) return displayWarning('Empty Row!');
    let whitePegCount = 0;
    let blackPegCount = 0;
    let masterCopy = masterCode.slice();
    let guessCopy = currentGuess.slice();

    guessCopy.forEach(function(peg, idx){
        if(peg === masterCopy[idx]){
            blackPegCount++;
            masterCopy[idx] = null;
            guessCopy[idx] = null;
        } 
    })
    
    masterCopy = masterCopy.filter((el) => el !== null);
    guessCopy = guessCopy.filter((el) => el !== null);

    guessCopy.forEach(function(peg){
        if(masterCopy.includes(peg)){
            whitePegCount++;
            masterCopy = masterCopy.filter((el) => el !== peg);
            
        }
    })
    
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
    if (!!gameStatus) return displayWarning('Press New Game!');
    if (currentGuess.length === 0) return displayWarning('Empty Row!'); //need change this
    currentGuess.pop();
    render();
  }

function handlePegSelector (evt) {
    
    //Gaurd
    if (evt.target.classList.value === 'selector'){
        if (!!gameStatus) return displayWarning('Press New Game!');
        if (currentGuess.length >= difficulty) {
            displayWarning('Full Row!'); // need to replace later
            return;
        }
        currentGuess.push(evt.target.id);
        render();
    }
}

function handleNewGame () {
    if (!(!!gameStatus)) {}//ask if sure
    init(difficulty);//
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
        rulesEl.innerText = "You must guess the code.\nThe code is 4 unique pegs.\nYou have 10 guesses.\nBlack clue pegs indicate a peg\n is the correct color and\n in the correct position.\nA white peg indicates\nonly a correct color.\nThe orientation of the black and white pegs does not indicate which colored peg is correct.";
    }
    // check which class it is and either add rules text or remove rules text   
}

function handleMindflayer(){
    if(difficulty === 5) return turnOffMF();
    backEl.style.opacity = '1';
    //change background color/styling for everything, body/message boxs/selector boxes/buttons
    //increase containers 
    guessEls.forEach(function(el){
        el.style.gridTemplateColumns = '1fr 1fr 1fr 1fr 1fr';
    })
    guessEls.forEach(function(el){
        el.style.width = '30vmin';
    })
    clueEls.forEach(function(el){
        el.style.width = '100%';
    })
    clueEls.forEach(function(el){
        //reorient the clue empty slots
    })
    masterEls.style.width = '30vmin';
    masterEls.style.gridTemplateColumns = '1fr 1fr 1fr 1fr 1fr';
    document.querySelector('#mindflayer').innerText = 'Run Away!';
    if(difficulty === 4) init(5);
}
//<---handler functions

//render functions--->
function revealMasterCode() {
    for( i=0 ; i<difficulty ;i++ ){
        masterEls.children[i].setAttribute('id' , `${masterCode[i]}`);
        masterEls.children[i].textContent = '';
    }
}

function displayWarning(str) {
    warningEl.innerText = str;
    warningEl.style.opacity = '1';
    setTimeout(function () { warningEl.style.opacity = '0';}, 5000);
}
function turnOffMF() {
    backEl.style.opacity = '0';
    guessEls.forEach(function(el){
        el.style.gridTemplateColumns = '1fr 1fr 1fr 1fr';
    })

    guessEls.forEach(function(el){
        el.style.width = '24vmin';
    })
    clueEls.forEach(function(el){
        el.style.width = '6vmin';
    })
    clueEls.forEach(function(el){
        //reorient the clue empty slots
    })
    init(4);
}
//<---render functions