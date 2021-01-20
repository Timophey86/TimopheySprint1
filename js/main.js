"use strict";
const MINE = "💣";
const FLAG = "🚩";
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
//INIT NOT WORKING PROPERLY**
init();


//Get bombs in random location
getRandomBombs(gBoard);
function getRandomBombs(board) {
  var amount = gLevel.easy.bombs;
  for (var i = 0; i < amount; i++) {
    var randomI = getRandomIntInclusive(0, board.length - 1);
    var randomJ = getRandomIntInclusive(0, board.length - 1);
    gBoard[randomI][randomJ].isMine = true;
    console.log(gBoard[randomI][randomJ]);
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

//Initializing function ****NOT WORKING PROPERLY ONLOAD**
function init() {
  gBoard = createBoard(4);
  //Render the board
  renderBoard(gBoard);
}

renderBoard(gBoard);

//Render Board
function renderBoard(board) {
  var strHTML = "";
  for (var i = 0; i < board.length; i++) {
    strHTML += "<tr>";
    for (var j = 0; j < board[0].length; j++) {
      if (board[i][j].isMine) {
        strHTML += `<td data-i="${i}" data-j="${j}" class="cell Mine" onclick="cellClicked(this, ${i}, ${j})" oncontextmenu="cellMarked(this)"></td>`;
      } else {
        strHTML += `<td data-i="${i}" data-j="${j}" class="cell empty" onclick="cellClicked(this, ${i}, ${j})" oncontextmenu="cellMarked(this)"></td>`;
      }
    }
  }
  strHTML += "</tr>";
  var elContainer = document.querySelector(".table");
  elContainer.innerHTML = strHTML;
}

//Console log the board
console.log(gBoard);

//Count mines around each cell and set the cell's minesAroundCount.
function setMinesNegsCount(elCell, board) {
  var tempMineCount = 0;
  var idxI = +elCell.dataset.i;
  var idxJ = +elCell.dataset.j;
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
}

//Left mouse cell click
function cellClicked(elCell, i, j) {
  if (!gGame.isOn) {
    return;
  }
  if (!gBoard[i][j].isShown) {
    gBoard[i][j].isShown = true;
    elCell.classList.add("isShown");
    if (gBoard[i][j].isShown && !gBoard[i][j].isMine) {
        setMinesNegsCount(elCell, gBoard);
        gGame.shownCount++
    } else if (gBoard[i][j].isShown && gBoard[i][j].isMine) {
      elCell.innerHTML = MINE;
      gameOver();
    }
  }
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
}

function gameOver() {
  var gameOver = document.querySelector(".game-over");
  gameOver.style.display = "block";
  gameOver.innerHTML = "Game over! Press to try again.";
  gGame.isOn = false;
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
