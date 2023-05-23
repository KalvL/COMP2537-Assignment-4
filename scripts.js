const cards = document.querySelectorAll('.memory-card');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let numOfClicks = 0;
let numOfPairs = 0;
let numOfMatches = 0;
let duration = 21;
let startGame = false;

// Number of cards for each difficulty setting.
const normal = 12;
const hard = 18;
let difficulty = normal;

// Sets up the board based on the difficulty level chosen. 
async function setBoard(numCards) {
  startGame = true;
  
  document.getElementsByClassName('memory-game')[0].innerHTML = "";
  numOfPairs = numCards/2;
  if (numCards == hard) {
    $('.memory-game').css('width', '960px');
    difficulty = hard;
    duration = 61;
  } else {
    $('.memory-game').css('width', '640px');
    difficulty = normal;
    duration = 21;
  }

  for (let i = 0; i < numCards/2; i++) {
    let res = await axios.get(`https://pokeapi.co/api/v2/pokemon/` + Math.floor(Math.random() * 151));
    for (let j = 0; j < 2; j++) {
      let randomPos = Math.floor(Math.random() * 12);
      document.getElementsByClassName('memory-game')[0].insertAdjacentHTML('beforeend', 
        `<div class="memory-card" data-framework="${res.data.name}" style="order:${randomPos}"> 
          <img class="front-face" src="${res.data.sprites.other['official-artwork'].front_default}" alt="Aurelia" />
          <img class="back-face" src="back.webp" alt="Pokeball" />
        </div>`); 
    }
  }
  for (let i = 0; i < numCards; i++) {
    document.getElementsByClassName('memory-card')[i].addEventListener('click', flipCard);
  }
  updateScore();
}

// Resets the game. 
function resetGame() {
  numOfClicks = 0;
  numOfMatches = 0;
  updateScore();
  if (difficulty == normal) {
    setBoard(normal);
  } else {
    setBoard(hard);
  }
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flip');

  numOfClicks++;
  updateScore();
  if (!hasFlippedCard) {
    // first click
    hasFlippedCard = true;
    firstCard = this;
    return;
  }

  // second click
  secondCard = this;
  checkForMatch();
}

// Check if the two flipped cards match.
function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

  isMatch ? disableCards() : unflipCards();
}

// Removes matched cards from the game.
function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  numOfMatches++;
  updateScore();
  resetBoard();
  setTimeout(() => {
  if (numOfMatches == numOfPairs) {
    alert("You win!")
    clearInterval(countdown);
  }}), 750;
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    resetBoard();
  }, 750);
}

// Resets remaining active cards on the board. 
function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

// Updates the score header.
function updateScore() {
  document.getElementById('score').innerHTML 
    = "Number of Pairs: " + numOfPairs + "<br>" 
    + "Number of Clicks: " + numOfClicks + "<br>" 
    + "Number of Matches: " + numOfMatches + "<br>"
    + "Number of Pairs Left: " + (numOfPairs - numOfMatches);
}

// Set timer.
const countdown = setInterval(() => {
  if (startGame == true) {
    duration--;
    document.getElementById('timer').innerHTML = "Time left: " + duration + "s"
    if (duration < 0) {
      clearInterval(countdown);
      alert("You lose!");
    }
  }
}, 1000);

// Power up to flip all cards.
function powerUp() {
  for (let i = 0; i < difficulty; i++) {
    document.getElementsByClassName('memory-card')[i].classList.add('flip');
    setTimeout(() => {
      document.getElementsByClassName('memory-card')[i].classList.remove('flip');
    },1000);
  }
}

// Dark Mode.
function dark() {
  $('body').css('background-color', 'black');
}

// Light Mode. 
function light() {
  $('body').css('background-color', 'darkgrey');
}
