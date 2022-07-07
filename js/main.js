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
const masterEls = document.querySelector('.master-cell');
const trackerEls = document.querySelectorAll('.tracker');
const greetingContainer = document.querySelector('rule');
// const greetingEl = document.querySelector('.greeting > div');
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
    clues = clues.filter(function(el){
        return (el != undefined);
    })
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
             if(difficulty ===4 ) clueEls[roundsLeft].children[i].setAttribute('id', '');
             if (difficulty === 5) clueEls[roundsLeft].children[i].setAttribute('id', 'emptyFlex');
        }
           
    }
    if (roundChanged && (!(!!gameStatus))){
        trackerEls[roundsLeft].textContent = '';
        trackerEls[roundsLeft-1].textContent = `<--Turn: ${10-(--roundsLeft)}`;
        roundChanged = false;
        //if (difficulty === 4 && roundsLeft === 7 && isCheater()){gameStatus = 'W'};
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
        for(i = 0; i <difficulty; i++) {            //then create the ammount of pegs needed
            let peg = document.createElement('peg');
            peg.setAttribute('class','empty');
            el.appendChild(peg);
        }
        if (difficulty === 5 && el.classList === 'peg-cell-clue') {   //apply the right type of styling for the difficulty mode
            el.setAttribute('id','flexClue');
            
        } 
            
        if (difficulty === 5 && el.classList !== 'peg-cell-clue') { 
            el.setAttribute('id', 'flayer-new-game');
            
        }
         if (difficulty === 4 && el.classList === 'peg-cell-clue') {   //apply the right type of styling for the difficulty mode
            el.setAttribute('id',''); 
         } 
         if (difficulty === 4 && el.classList !== 'peg-cell-clue') {   //apply the right type of styling for the difficulty mode
            el.setAttribute('id','');
            
        }  
    })
    removeAllChildren(masterEls);
    for(i=0; i<difficulty; i++) {
        let peg = document.createElement('peg');
        peg.setAttribute('class' , 'mystery');
        peg.textContent = '?';
        masterEls.appendChild(peg);
    }
    if (difficulty ===5) flayerBoard();
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
    if (difficulty === 4){
        clues = Array(difficulty).fill('black', 0 , blackPegCount);
        clues.fill('white' , blackPegCount , (blackPegCount + whitePegCount));
    }
    if (difficulty === 5){
        clues = Array(difficulty).fill('black-f', 0 , blackPegCount);
        clues.fill('white-f' , blackPegCount , (blackPegCount + whitePegCount));
    }

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
        greetingContainer.innerText = "MasterMind!";
        greetingContainer.innerText = "Click here for rules";
        
    } else {
        greetingContainer.classList.value = 'greeting-rules';
        if (difficulty===5) {
            document.querySelector('.greeting-rules').setAttribute('id','flayer-rules');
        }
        greetingContainer.innerText = "";
        greetingContainer.innerText = "You must guess the code. The code is 4 unique pegs. You have 10 guesses.Black clue pegs indicate a peg\n is the correct color and in the correct position.A white peg indicates only a correct color.The orientation of the black and white pegs does not indicate which colored peg is correct.";
    }
    // check which class it is and either add rules text or remove rules text   
}
 
function flayerBoard(){
    guessEls.forEach(function(el){
        el.style.gridTemplateColumns = '1fr 1fr 1fr 1fr 1fr';
    })
    guessEls.forEach(function(el){
        el.style.width = '30vmin';
    })
    masterEls.style.width = '30vmin';
    masterEls.style.gridTemplateColumns = '1fr 1fr 1fr 1fr 1fr';
    if(difficulty === 4) init(5);
    clueEls.forEach(function(el){
        el.setAttribute('id', 'flexClue');
        el.childNodes.forEach(function(childEl){
            childEl.setAttribute('id', 'emptyFlex');
        })
    })

}

function handleMindflayer(){
    let bg = 'background:radial-gradient(circle at 50% 50%,  #807b4fb5 2%, #aa9883c3 50%, #562d42f2 100%)';
    if(difficulty === 5) return turnOffMF();
    backEl.style.opacity = '1'; //brings up mindflayer image
    //change background color/styling for everything, body/message boxs/selector boxes/buttons

    //begin pegboard transformation
    guessEls.forEach(function(el){
        el.style.gridTemplateColumns = '1fr 1fr 1fr 1fr 1fr';
    })
    guessEls.forEach(function(el){
        el.style.width = '30vmin';
    })
    masterEls.style.width = '30vmin';
    masterEls.style.gridTemplateColumns = '1fr 1fr 1fr 1fr 1fr';
    if(difficulty === 4) init(5);
    clueEls.forEach(function(el){
        el.setAttribute('id', 'flexClue');
        el.childNodes.forEach(function(childEl){
            childEl.setAttribute('id', 'emptyFlex');
        })
    })



    document.getElementById('empty').style.backgroundImage = 'url("https://cdn.shopify.com/s/files/1/1432/8830/products/mindflayertrophyhead-shopify_1024x1024.jpg?v=1656489737")';
    


    //begin message box transformation
    document.querySelector('.status').setAttribute('id','status-flayer');
    // document.querySelector('.greeting > div').setAttribute('id', 'title');
    // document.querySelector('.greeting').setAttribute('id','greeting-flayer');
    // document.querySelector('.greeting > a').setAttribute('id','flayer-click');
    document.querySelector('.master-cell').setAttribute('id', 'flayer-code-cell');
    document.querySelector('side').setAttribute('id','flayer-side');
    document.querySelector('.new-game').setAttribute('id','flayer-new-game');

    
    document.querySelector('#mindflayer').innerText = 'Run Away!';
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
    document.querySelector('.status').setAttribute('id','');
    document.querySelector('.master-cell').setAttribute('id', '');
    document.querySelector('side').setAttribute('id','');
    document.querySelector('.new-game').setAttribute('id','');
    
    document.querySelector('#mindflayer').innerText = 'Challenge the MINDFLAYER!';
    backEl.style.opacity = '0';
    guessEls.forEach(function(el){
        el.style.gridTemplateColumns = '1fr 1fr 1fr 1fr';
    })
    
    guessEls.forEach(function(el){
        el.style.width = '24vmin';
    })
        masterEls.style.width = '24vmin';
        masterEls.style.gridTemplateColumns = '1fr 1fr 1fr 1fr';
        document.getElementById('empty').style.backgroundImage = 'url("https://w7.pngwing.com/pngs/737/396/png-transparent-mastermind-how-to-think-like-sherlock-holmes-221b-baker-street-his-last-bow-book-book-microphone-monochrome-sticker-thumbnail.png")';
        init(4);
        clueEls.forEach(function(el){
            el.setAttribute('id', '');
            el.childNodes.forEach(function(childEl){
                childEl.setAttribute('id', '');
            })
        })
}
    
    //<---render functions

function isCheater () {
    let browns = 0;
    for( i=9 ; i>7 ; i--) {
        guessEls[i].childNodes.forEach( function(el){
            if(el.id === 'brown'){
                browns++;
        }
    }) 
    }
    if (browns === 8) return true;
}