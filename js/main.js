"use strict";
const MINE = "💣";
const FLAG = "🚩";
const ONMINE = "😬";
const DEAD = "🤯";
const WIN = "😎";
const PLAY = "🙂";
var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
};
const gLevel = {
  easy: {
    size: 4,
    bombs: 2,
  },
  medium: {
    size: 8,
    bombs: 12,
  },
  hard: {
    size: 12,
    bombs: 30,
  },
};
var cell = {
  minesAroundCount: 0,
  isShown: false,
  isMine: false,
  isMarked: false,
};

var gGame = {
  isOn: true,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
};
var gBoard;
var timerInterval;
var isFirstCellClicked = false;
//Lives going to be determined by the level
var gLives;
var selectedLevel = gLevel.easy;
var timeoutVar;
var bombHints = [];
var bombLoc;
//Clear local storage on restart
localStorage.clear();

//Levels onclick function
function chooseLevel(elLevel) {
  if (elLevel.classList.contains("Easy")) {
    selectedLevel = gLevel.easy;
    gBoard = createBoard(gLevel.easy.size);
    renderBoard(gBoard);
    gLives = 2;
    hideHintBtns();
    resetTimer();
    var elSmiley = document.querySelector(".smiley");
    elSmiley.innerHTML = PLAY;
    //Display best score per level
    var elBestScore = document.querySelector(".best-score")
    if (!localStorage.getItem("Best Score: Easy Mode")) {
      elBestScore.innerHTML = "No best score at this level yet.."
    } else {elBestScore.innerHTML = `Your best score at the <span>Easy</span> level \n so far is ${localStorage.getItem(
      "Best Score: Easy Mode"
    )} secs`;}
  } else if (elLevel.classList.contains("Medium")) {
    selectedLevel = gLevel.medium;
    gBoard = createBoard(gLevel.medium.size);
    renderBoard(gBoard);
    hideHintBtns();
    resetTimer();
    gLives = 3;
    var elSmiley = document.querySelector(".smiley");
    elSmiley.innerHTML = PLAY;
    //Display best score per level
    var elBestScore = document.querySelector(".best-score")
    if (!localStorage.getItem("Best Score: Medium Mode")) {
      elBestScore.innerHTML = "No best score at this level yet.."
    } else {elBestScore.innerHTML = `Your best score at the <span>Medium</span> level \n so far is ${localStorage.getItem(
      "Best Score: Medium Mode"
    )} secs`;}
  } else {
    selectedLevel = gLevel.hard;
    gBoard = createBoard(gLevel.hard.size);
    renderBoard(gBoard);
    hideHintBtns();
    resetTimer();
    gLives = 3;
    var elSmiley = document.querySelector(".smiley");
    elSmiley.innerHTML = PLAY;
    //Display best score per level
    var elBestScore = document.querySelector(".best-score")
    if (!localStorage.getItem("Best Score: Hard Mode")) {
      elBestScore.innerHTML = "No best score at this level yet.."
    }else {elBestScore.innerHTML = `Your best score at the <span>Hard</span> level \n so far is ${localStorage.getItem(
      "Best Score: Hard Mode"
    )} secs`;}
  }
  renderLivesCount();
  isFirstCellClicked = false;
}


//Render levels
function renderLevels() {
  var elLevels = document.querySelector(".levels");
  elLevels.innerHTML =
    `<button class="Easy" onclick="chooseLevel(this)">Easy</button>` +
    `<button class="Medium" onclick="chooseLevel(this)">Medium</button>` +
    `<button class="Hard" onclick="chooseLevel(this)">Hard</button>`;
}

//Initializing function
function init() {
  renderLevels();
  var defaultLevel = document.querySelector(".Easy");
  chooseLevel(defaultLevel);
  resetTimer();
  gGame.isOn = true;
  var elGameOver = document.querySelector(".game-over");
  elGameOver.style.display = "none";
  //isFirstCellClicked = false;
  var elSmiley = document.querySelector(".smiley");
  elSmiley.innerHTML = PLAY;
  hideHintBtns();
}

//Get bombs in random location
function getRandomBombs(board) {
  var amount = 0;
  if (selectedLevel === gLevel.easy) {
    amount = gLevel.easy.bombs;
  } else if (selectedLevel === gLevel.medium) {
    amount = gLevel.medium.bombs;
  } else {
    amount = gLevel.hard.bombs;
  }
  for (var i = 0; i < amount; i++) {
    var randomI = getRandomIntInclusive(0, board.length - 1);
    var randomJ = getRandomIntInclusive(0, board.length - 1);
    if (gBoard[randomI][randomJ].isMine || gBoard[randomI][randomJ].isShown) {
      i--;
      continue;
    }
    gBoard[randomI][randomJ].isMine = true;
    //Get hints to hint array
    bombLoc = {};
    bombHints.push((bombLoc = { i: randomI, j: randomJ }));
    var elContainer = document.getElementById(`${randomI}+${randomJ}`);
    elContainer.classList.add("Mine");
  }
}

//Create board function
function createBoard(size) {
  var board = [];
  for (var i = 0; i < size; i++) {
    board.push([]);
    for (var j = 0; j < size; j++) {
      //Clone cell objects without referencing them
      var cloneCell = {};
      for (let key in cell) {
        cloneCell[key] = cell[key];
      }
      board[i].push(cloneCell);
    }
  }
  return board;
}

//Render Board
function renderBoard(board) {
  var strHTML = "";
  for (var i = 0; i < board.length; i++) {
    strHTML += "<tr>";
    for (var j = 0; j < board[0].length; j++) {
      strHTML += `<td id="${i}+${j}" data-i="${i}" data-j="${j}" class="cell" onclick="cellClicked(this, ${i}, ${j})" oncontextmenu="cellMarked(this)"></td>`;
    }
  }
  strHTML += "</tr>";
  var elContainer = document.querySelector(".table");
  elContainer.innerHTML = strHTML;
}

//Count mines around each cell and set the cell's minesAroundCount.
function setMinesNegsCount(elCell, board) {
  var tempMineCount = 0;
  var idxI = +elCell.dataset.i;
  var idxJ = +elCell.dataset.j;
  if (board[idxI][idxJ].isMine) {
    return;
  }
  for (var i = idxI - 1; i <= idxI + 1; i++) {
    if (i < 0 || i >= board.length) continue;
    for (var j = idxJ - 1; j <= idxJ + 1; j++) {
      if (i === idxI && j === idxJ) continue;
      if (j < 0 || j >= board[i].length) continue;
      if (board[i][j].isMine) tempMineCount++;
    }
  }
  //Display the mines around the clicked cell
  board[idxI][idxJ].minesAroundCount = tempMineCount;
  elCell.innerHTML = board[idxI][idxJ].minesAroundCount;
  return tempMineCount;
}

//Get hints for bomb loacations
function showBombLocation(elHint) {
  var randomNum = getRandomIntInclusive(0, bombHints.length - 1);
  var singleHint = bombHints[randomNum];
  bombHints.splice(randomNum, 1);
  //Get element by co-ords
  var elBombLoc = document.getElementById(`${singleHint.i}+${singleHint.j}`);
  elBombLoc.classList.add("hint");
  setTimeout(function () {
    removeClass(elBombLoc, "hint");
  }, 1000);
  elHint.style.display = "none";
}

//Render hint buttons
function renderHints() {
  var elButtons = document.querySelector(".bomb-hints");
  elButtons.style.display = "block";
  var strHTML = "";
  for (var i = 0; i < bombHints.length / 2; i++) {
    console.log("hi");
    strHTML += `<button class="${i}" onclick="showBombLocation(this)">Hint</button>`;
  }
  var elHints = document.querySelector(".bomb-hints");
  elHints.innerHTML = strHTML;
}
//Rerender the hint buttons on game start
function hideHintBtns() {
  var elButtons = document.querySelector(".bomb-hints");
  if (elButtons.innerHTML) {
    elButtons.innerHTML = "";
  }
  bombHints = [];
}

//Left mouse cell click
function cellClicked(elCell, i, j) {
  if (!gGame.isOn) {
    return;
  }
  if (elCell.classList.contains("Marked")) {
    return;
  }
  if (!gBoard[i][j].isShown) {
    gBoard[i][j].isShown = true;
    elCell.classList.add("isShown");
    //Check if the clicked cell is the first cell place bombs on first click
    if (!isFirstCellClicked) {
      timerInterval = setInterval(() => {
        timer();
      }, 1000);
      isFirstCellClicked = true;
      //Random bombs and hints appear on first click
      getRandomBombs(gBoard);
      renderHints();
    }
    if (gBoard[i][j].isShown && !gBoard[i][j].isMine) {
      setMinesNegsCount(elCell, gBoard);
      gGame.shownCount++;
      var elSmiley = document.querySelector(".smiley");
      elSmiley.innerHTML = PLAY;
    } else if (gBoard[i][j].isShown && gBoard[i][j].isMine) {
      elCell.innerHTML = MINE;
      gLives--;
      if (gLives > 0) {
        timeoutVar = setTimeout(function () {
          removeClass(elCell, "isShown", true);
        }, 600);
        var elSmiley = document.querySelector(".smiley");
        elSmiley.innerHTML = ONMINE;
        renderLivesCount();
      } else {
        renderLivesCount();
        gameOver();
        var elSmiley = document.querySelector(".smiley");
        elSmiley.innerHTML = DEAD;
      }
    }
  }
  expandShown(gBoard, elCell, i, j);
  //Check for victory
  isVictorious();
}

//Right mouse click to mark the cell
function cellMarked(elCell) {
  elCell.classList.toggle("Marked");
  var idxI = +elCell.dataset.i;
  var idxJ = +elCell.dataset.j;

  if (gBoard[idxI][idxJ].isShown) return;

  if (!gBoard[idxI][idxJ].isMarked) {
    gBoard[idxI][idxJ].isMarked = true;
    elCell.innerHTML = FLAG;
    //Check if marked cell contains a bomb
    if (gBoard[idxI][idxJ].isMine) {
      gGame.markedCount++;
      console.log(gGame.markedCount);
    }
  } else {
    gBoard[idxI][idxJ].isMarked = false;
    elCell.innerHTML = "";
    //Check if marked cell contains a bomb
    if (gBoard[idxI][idxJ].isMine) {
      gGame.markedCount--;
      console.log(gGame.markedCount);
    }
  }
  //Check for victory
  isVictorious();
}

//Check if victory
function isVictorious() {
  var gameOver = document.querySelector(".game-over");
  if (
    gGame.markedCount === selectedLevel.bombs &&
    gGame.shownCount === selectedLevel.size ** 2 - selectedLevel.bombs
  ) {
    gameOver.style.display = "block";
    gameOver.innerHTML =
      "Congratulations!\n Victory is yours. Press smiley to restat";
    clearInterval(timerInterval);
    var elSmiley = document.querySelector(".smiley");
    elSmiley.innerHTML = WIN;
    console.log(gGame.secsPassed);
    setBestScore();
  }
}

//Game over function
function gameOver() {
  var gameOver = document.querySelector(".game-over");
  gameOver.style.display = "block";
  gameOver.innerHTML = "Game over! Press smiley to try again.";
  gGame.isOn = false;
  gGame.shownCount = 0;
  gGame.markedCount = 0;
  clearInterval(timerInterval);
}

//Get random num inclusive
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

//Prevent context menu from poping up on right click
document.addEventListener("contextmenu", function (element) {
  element.preventDefault();
});

//Timer function
function timer() {
  gGame.secsPassed++;
  var elTimer = document.querySelector(".timer");
  if (gGame.secsPassed < 10) {
    elTimer.innerHTML = "Timer: 0" + gGame.secsPassed + " secs";
  } else {
    elTimer.innerHTML = "Timer " + gGame.secsPassed + " secs";
  }
}

//Basic way to expand neighbour cells if clicked cell minesAroundCount equals zero
function expandShown(board, elCell, i, j) {
  var cellMineNum = 0;
  var idxI = i;
  var idxJ = j;
  cellMineNum = setMinesNegsCount(elCell, board);
  if (cellMineNum === 0) {
    for (var i = idxI - 1; i <= idxI + 1; i++) {
      if (i < 0 || i >= board.length) continue;
      for (var j = idxJ - 1; j <= idxJ + 1; j++) {
        if (i === idxI && j === idxJ) continue;
        if (j < 0 || j >= board[i].length) continue;
        var elNeighbour = document.getElementById(`${i}+${j}`);
        setMinesNegsCount(elNeighbour, board);
        if (!elNeighbour.classList.contains("isShown")) {
          elNeighbour.classList.add("isShown");
          gGame.shownCount++;
        }
      }
    }
  }
}

//Render the lives user got left
function renderLivesCount() {
  var elLives = document.querySelector(".lives-count");
  elLives.innerHTML = `You've got ${gLives} lives left`;
}

//Assist function to remove a class from an element and check if mine in case we have to reset
function removeClass(elElement, className, isBomb) {
  elElement.classList.remove(className);
  var idxI = +elElement.dataset.i;
  var idxJ = +elElement.dataset.j;
  elElement.innerHTML = "";
  //If the removed class is a bomb change the isShown so it can be clicked again
  if (isBomb) {
    gBoard[idxI][idxJ].isShown = false;
  }
}

//Reset Timer
function resetTimer() {
  clearInterval(timerInterval);
  var elTimer = document.querySelector(".timer");
  elTimer.innerHTML = "Let's start sweeping!";
  gGame.secsPassed = 0;
  gGame.shownCount = 0;
  gGame.markedCount = 0;
}

//Log best score
function setBestScore() {
  var elBestScore = document.querySelector(".best-score");
  if (selectedLevel === gLevel.easy) {
    if (
      localStorage.getItem("Best Score: Easy Mode") > gGame.secsPassed ||
      !localStorage.getItem("Best Score: Easy Mode")
    ) {
      localStorage.setItem("Best Score: Easy Mode", gGame.secsPassed);
    }
    elBestScore.innerHTML = `Your best score at the <span>Easy</span> level \n so far is ${localStorage.getItem(
      "Best Score: Easy Mode"
    )} secs`;
  } else if (selectedLevel === gLevel.medium) {
    if (
      localStorage.getItem("Best Score: Medium Mode") > gGame.secsPassed ||
      !localStorage.getItem("Best Score: Medium Mode")
    ) {
      localStorage.setItem("Best Score: Medium Mode", gGame.secsPassed);
    }
    elBestScore.innerHTML = `Your best score at the <span>Medium</span> level \n so far is ${localStorage.getItem(
      "Best Score: Medium Mode"
    )} secs`;
  } else {
    if (
      localStorage.getItem("Best Score: Hard Mode") > gGame.secsPassed ||
      !localStorage.getItem("Best Score: Hard Mode")
    ) {
      localStorage.setItem("Best Score: Hard Mode", gGame.secsPassed);
    }
    elBestScore.innerHTML = `Your best score at the <span>Hard</span> level \n so far is ${localStorage.getItem(
      "Best Score: Hard Mode"
    )} secs`;
  }
}
