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

//Levels onclick function
function chooseLevel(elLevel) {
  if (elLevel.classList.contains("Easy")) {
    gBoard = createBoard(gLevel.easy.size);
    getRandomBombs(gBoard, elLevel);
    renderBoard(gBoard);
    gLives = 2;
    renderLivesCount();
  } else if (elLevel.classList.contains("Medium")) {
    gBoard = createBoard(gLevel.medium.size);
    getRandomBombs(gBoard, elLevel);
    renderBoard(gBoard);
    gLives = 3;
    renderLivesCount();
  } else {
    gBoard = createBoard(gLevel.hard.size);
    getRandomBombs(gBoard, elLevel);
    renderBoard(gBoard);
    gLives = 3;
    renderLivesCount();
  }
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
  gBoard = createBoard(4);
  getRandomBombs(gBoard);
  renderBoard(gBoard);
  gLives = 2;
  renderLivesCount();
  var elTimer = document.querySelector(".timer");
  elTimer.innerHTML = "00";
  gGame.secsPassed = 0;
  gGame.shownCount = 0;
  gGame.markedCount = 0;
  gGame.isOn = true;
  var elGameOver = document.querySelector(".game-over");
  elGameOver.style.display = "none";
  isFirstCellClicked = false;
  var elSmiley = document.querySelector(".smiley");
  elSmiley.innerHTML = PLAY;
}

//Get bombs in random location
function getRandomBombs(board, elLevel) {
  var amount = 0;
  if (!elLevel || elLevel.classList.contains("Easy")) {
    amount = gLevel.easy.bombs;
    renderBoard(board);
  } else if (elLevel.classList.contains("Medium")) {
    amount = gLevel.medium.bombs;
    renderBoard(board);
  } else {
    amount = gLevel.medium.bombs;
    renderBoard(board);
  }
  for (var i = 0; i < amount; i++) {
    var randomI = getRandomIntInclusive(0, board.length - 1);
    var randomJ = getRandomIntInclusive(0, board.length - 1);
    gBoard[randomI][randomJ].isMine = true;
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
      if (board[i][j].isMine) {
        strHTML += `<td id="${i}+${j}" data-i="${i}" data-j="${j}" class="cell Mine"  onclick="cellClicked(this, ${i}, ${j})" oncontextmenu="cellMarked(this)"></td>`;
      } else {
        strHTML += `<td id="${i}+${j}" data-i="${i}" data-j="${j}" class="cell empty" onclick="cellClicked(this, ${i}, ${j})" oncontextmenu="cellMarked(this)"></td>`;
      }
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
  console.log(tempMineCount);
  return tempMineCount;
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
    //Check if the clicked cell is the first cell
    if (!isFirstCellClicked) {
      timerInterval = setInterval(() => {
        timer();
      }, 1000);
      isFirstCellClicked = true;
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
  if (!gBoard[idxI][idxJ].isMarked) {
    gBoard[idxI][idxJ].isMarked = true;
    elCell.innerHTML = FLAG;
  } else {
    gBoard[idxI][idxJ].isMarked = false;
    elCell.innerHTML = "";
  }
  //Check if marked cell contains a bomb
  if (gBoard[idxI][idxJ].isMine) {
    gGame.markedCount++;
    console.log(gGame.markedCount);
  }
  //Check for victory
  isVictorious();
}

//Check if victory
function isVictorious() {
  var gameOver = document.querySelector(".game-over");
  if (
    gGame.markedCount === gLevel.easy.bombs &&
    gGame.shownCount === gLevel.easy.size ** 2 - gLevel.easy.bombs
  ) {
    gameOver.style.display = "block";
    gameOver.innerHTML =
      "Congratulations! Victory is yours.\n Press smiley to restat";
    clearInterval(timerInterval);
    var elSmiley = document.querySelector(".smiley");
    elSmiley.innerHTML = WIN;
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
    elTimer.innerHTML = "0" + gGame.secsPassed;
  } else {
    elTimer.innerHTML = gGame.secsPassed;
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
