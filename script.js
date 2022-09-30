"use strict";
const colors = ["red", "green", "yellow", "cyan", "orange", "purple"];

const grid = document.querySelector(".game-grid");

// every square is a jwwel of 40x40
// Grid is 600x400 10 cols x 15 rows
const MAX_JEWELS = 150;
const COLS = 10;
const blankCol = "";
let isStarted = false;
const jeweledSound = new Audio("./assets/pling.mp3");

function createJewelEl(id) {
  const element = document.createElement("div");
  element.classList.add("jewel");
  element.id = id;
  element.style.backgroundColor = randomColor(colors);
  element.draggable = "true;";

  return element;
}

// Create board
const jewelsAr = [];

// populate
for (let i = MAX_JEWELS - 1; i >= 0; i--) {
  const jewelEl = createJewelEl(i);
  jewelsAr.unshift(jewelEl);
  grid.insertAdjacentElement("afterbegin", jewelEl);
}

const firstIdRows = jewelsAr
  .filter((jewel, index) => {
    if (index === 0 || index % COLS === 0) return jewel;
  })
  .map((jewel) => jewel.id);

const lastIdRows = jewelsAr
  .filter((jewel, index) => {
    if (index === COLS - 1 || index % COLS === COLS - 1) return jewel;
  })
  .map((jewel) => jewel.id);

const rowsLimits = jewelsAr.map(function (_, index) {
  if (index === 0) {
  }
});

// jewels drag events
let originColorDragged;
let destinationColorDragged;
let originId;
let destinationId;

document.querySelector(".btn-start").addEventListener("click", () => {
  grid.classList.remove("disabled");
  isStarted = true;
});

jewelsAr.forEach((jewel) => {
  jewel.addEventListener("dragstart", dragStart);
  jewel.addEventListener("dragenter", dragEnter);
  jewel.addEventListener("dragover", dragOver);
  jewel.addEventListener("dragleave", dragLeave);
  jewel.addEventListener("dragend", dragEnd);
  jewel.addEventListener("drop", dragDrop);
});

function dragStart(e) {
  originColorDragged = e.target.style.backgroundColor;
  originId = parseInt(e.target.id);
}
function dragEnter(e) {
  e.preventDefault();
}
function dragOver(e) {
  e.preventDefault();
}
function dragLeave(e) {
  e.preventDefault();
}

function dragEnd(e) {
  // Check if is not a valid move and undo de changes.
  console.log(originId, destinationId);
  if (
    Math.abs(originId - destinationId) > 1 &&
    Math.abs(originId - destinationId) !== COLS
  ) {
    console.log("No valid move");
    try {
      jewelsAr[originId].style.backgroundColor = originColorDragged;
      jewelsAr[destinationId].style.backgroundColor = destinationColorDragged;
    } catch (err) {
      console.log(`${err} Movement out of limits`);
    }
  } else if (
    !isValidColorRows(jewelsAr, destinationId) &&
    !isValidColorRows(jewelsAr, originId) &&
    !isValidColorCols(jewelsAr, destinationId) &&
    !isValidColorCols(jewelsAr, originId)
  ) {
    console.log("no valid colors");
    jewelsAr[originId].style.backgroundColor = originColorDragged;
    if (jewelsAr[destinationId]) {
      jewelsAr[destinationId].style.backgroundColor = destinationColorDragged;
    }
  }
  // reset to null global variables
  originColorDragged = destinationColorDragged = null;
  originId = destinationId = null;
}

function dragDrop(e) {
  destinationId = parseInt(this.id);
  destinationColorDragged = this.style.backgroundColor;

  jewelsAr[originId].style.backgroundColor = destinationColorDragged;
  jewelsAr[destinationId].style.backgroundColor = originColorDragged;
}

// Checking three matches and return coincidences
function checkRowThree() {
  let coincidences = 0;

  for (let index = 0; index < jewelsAr.length - 2; index++) {
    if (
      isSameColorMulti(
        jewelsAr[index],
        jewelsAr[index + 1],
        jewelsAr[index + 2]
      )
    ) {
      setColorBlank(jewelsAr[index], jewelsAr[index + 1], jewelsAr[index + 2]);
      coincidences += 1;
      jeweledSound.play();
    }
  }
  return coincidences;
}

function checkColumnThree() {
  let coincidences = 0;
  for (let index = 0; index < jewelsAr.length - COLS * 2; index++) {
    if (
      isSameColorMulti(
        jewelsAr[index],
        jewelsAr[index + COLS],
        jewelsAr[index + 2 * COLS]
      )
    ) {
      setColorBlank(
        jewelsAr[index],
        jewelsAr[index + COLS],
        jewelsAr[index + 2 * COLS]
      );
      coincidences += 1;
      jeweledSound.play();
    }
  }
  return coincidences;
}

// Checking four matches

function checkRowFour() {
  let coincidences = 0;
  for (let index = 0; index < jewelsAr.length - 3; index++) {
    if (
      isSameColorMulti(
        jewelsAr[index],
        jewelsAr[index + 1],
        jewelsAr[index + 2],
        jewelsAr[index + 3]
      )
    ) {
      console.log("row 4!");
      setColorBlank(
        jewelsAr[index],
        jewelsAr[index + 1],
        jewelsAr[index + 2],
        jewelsAr[index + 3]
      );
      coincidences += 2;
      jeweledSound.play();
    }
  }
  return coincidences;
}

function checkColumnFour() {
  let coincidences = 0;
  for (let index = 0; index < jewelsAr.length - COLS * 3; index++) {
    if (
      isSameColorMulti(
        jewelsAr[index],
        jewelsAr[index + COLS],
        jewelsAr[index + 2 * COLS],
        jewelsAr[index + 3 * COLS]
      )
    ) {
      setColorBlank(
        jewelsAr[index],
        jewelsAr[index + COLS],
        jewelsAr[index + 2 * COLS],
        jewelsAr[index + 3 * COLS]
      );
      coincidences += 2;
      jeweledSound.play();
    }
  }
  return coincidences;
}

function dropJewels() {
  for (let i = MAX_JEWELS - 1; i >= 0; i--) {
    let jewelColor = jewelsAr[i].style.backgroundColor;
    setTimeout(() => {}, 500);
    if (jewelColor === blankCol) {
      if (i - COLS >= 0) {
        jewelsAr[i].style.backgroundColor =
          jewelsAr[i - COLS].style.backgroundColor;
        jewelsAr[i - COLS].style.backgroundColor = blankCol;
      } else {
        jewelsAr[i].style.backgroundColor = randomColor(colors);
      }
    }
  }
}

// helpers
function updateScore(score) {
  document.querySelector(".score").textContent = `score: ${score}`;
}

function randomColor(colorsAr) {
  const color = colorsAr[Math.floor(Math.random() * colorsAr.length)];
  return color;
}

// Check colors of the 3 correlative jewels in the three row positions possible
function isValidColorRows(jewels, jewelId) {
  const id = parseInt(jewelId);
  const startRowId = Math.floor(id / COLS) * COLS;
  const finishRowId = startRowId + COLS - 1;

  console.log(startRowId, finishRowId, id);

  if (
    startRowId <= id &&
    id + 2 <= finishRowId &&
    isSameColorMulti(jewels[id], jewels[id + 1], jewels[id + 2])
  ) {
    return true;
  }
  if (
    startRowId <= id - 2 &&
    id <= finishRowId &&
    isSameColorMulti(jewels[id - 2], jewels[id - 1], jewels[id])
  ) {
    return true;
  }
  if (
    startRowId <= id - 1 &&
    id + 1 <= finishRowId &&
    isSameColorMulti(jewels[id - 1], jewels[id], jewels[id + 1])
  ) {
    return true;
  }
  return false;
}

// Check colors of the 3 correlative jewels in the three cols positions possible

function isValidColorCols(jewels, jewelId) {
  const id = parseInt(jewelId);
  const startColId = id % COLS;
  const finishColId = MAX_JEWELS - (COLS - startColId);

  console.log(
    `isValidfn id: ${id} startCol ${startColId}  enfCol ${finishColId}`
  );

  if (
    startColId <= id &&
    id + 2 * COLS <= finishColId &&
    isSameColorMulti(jewels[id], jewels[id + COLS], jewels[id + 2 * COLS])
  ) {
    return true;
  }
  if (
    startColId <= id - 2 * COLS &&
    id <= finishColId &&
    isSameColorMulti(jewels[id - 2 * COLS], jewels[id - COLS], jewels[id])
  ) {
    return true;
  }
  if (
    startColId <= id - COLS &&
    id + COLS <= finishColId &&
    isSameColorMulti(jewels[id - COLS], jewels[id], jewels[id + COLS])
  ) {
    return true;
  }
  return false;
}

function isSameColorMulti(...args) {
  const selectedColor = args[0].style.backgroundColor;
  const isSameColor = args.every((arg) => {
    return arg.style.backgroundColor === selectedColor;
  });
  return isSameColor;
}

function setColorBlank(...jewels) {
  jewels.forEach((jewel) => (jewel.style.backgroundColor = blankCol));
}

// Init game, and loop

function initGame() {
  let score;

  // Check rows, Cols, blanks and  drop jewels
  setInterval(() => {
    dropJewels();
    score += checkRowFour();
    score += checkColumnFour();
    score += checkRowThree();
    score += checkColumnThree();
    if (isStarted) {
      updateScore(score);
    } else score = 0;
  }, 500);
}

initGame();
