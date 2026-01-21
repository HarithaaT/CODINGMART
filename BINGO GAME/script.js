const playersInput = document.getElementById("playersInput");
const createBoardsBtn = document.getElementById("createBoards");
const boardsContainer = document.getElementById("boardsContainer");
const generateBtn = document.getElementById("generateBtn");
const currentNumberEl = document.getElementById("currentNumber");
const winnerMessage = document.getElementById("winnerMessage");

let players = [];
let availableNumbers = [];
let gameOver = false;

const colors = ["#e74c3c", "#27ae60", "#2980b9", "#8e44ad", "#f39c12"];

createBoardsBtn.addEventListener("click", createBoards);
generateBtn.addEventListener("click", generateNumber);

function createBoards() {
  boardsContainer.innerHTML = "";
  winnerMessage.innerHTML = "";
  players = [];
  gameOver = false;
  generateBtn.disabled = true;
  currentNumberEl.innerText = "--";

  const count = Number(playersInput.value);
  if (count < 2 || count > 5) {
    alert("Players must be between 2 and 5");
    return;
  }

  for (let i = 0; i < count; i++) {
    players.push(createPlayer(i));
    boardsContainer.appendChild(players[i].element);
  }

  availableNumbers = Array.from({ length: 25 }, (_, i) => i + 1);
}

function createPlayer(index) {
  const element = document.createElement("div");
  element.className = "player";

  const title = document.createElement("h3");
  title.innerText = `Player ${index + 1}`;
  element.appendChild(title);

  const grid = document.createElement("div");
  grid.className = "grid";

  let fillNumber = 1;

  for (let i = 0; i < 25; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";

    cell.addEventListener("click", () => {
      if (cell.innerText || fillNumber > 25) return;

      cell.innerText = fillNumber;
      cell.classList.add("filled");
      cell.style.background = colors[index];
      fillNumber++;

      checkAllFilled();
    });

    grid.appendChild(cell);
  }

  const bingo = document.createElement("div");
  bingo.className = "bingo";
  "BINGO".split("").forEach(l => {
    const span = document.createElement("span");
    span.innerText = l;
    bingo.appendChild(span);
  });

  element.appendChild(grid);
  element.appendChild(bingo);

  return { grid, bingo, element };
}

function checkAllFilled() {
  const allFilled = players.every(player =>
    [...player.grid.children].every(cell => cell.innerText)
  );
  generateBtn.disabled = !allFilled;
}

function generateNumber() {
  if (gameOver || availableNumbers.length === 0) return;

  const index = Math.floor(Math.random() * availableNumbers.length);
  const num = availableNumbers.splice(index, 1)[0];
  currentNumberEl.innerText = num;

  players.forEach((player, idx) => {
    [...player.grid.children].forEach(cell => {
      if (Number(cell.innerText) === num) {
        cell.classList.add("marked");
      }
    });
    checkBingo(player, idx);
  });
}

function checkBingo(player, index) {
  const cells = [...player.grid.children];
  const marked = cells.map(c => c.classList.contains("marked"));

  const lines = [
    [0,1,2,3,4],[5,6,7,8,9],[10,11,12,13,14],
    [15,16,17,18,19],[20,21,22,23,24],
    [0,5,10,15,20],[1,6,11,16,21],[2,7,12,17,22],
    [3,8,13,18,23],[4,9,14,19,24],
    [0,6,12,18,24],[4,8,12,16,20]
  ];

  let count = 0;
  lines.forEach(line => {
    if (line.every(i => marked[i])) count++;
  });

  const letters = player.bingo.querySelectorAll("span");
  for (let i = 0; i < count && i < 5; i++) {
    letters[i].classList.add("active");
  }

  if (count >= 5 && !gameOver) {
    gameOver = true;
    generateBtn.disabled = true;
    winnerMessage.innerHTML = `🏆 Player ${index + 1} is the WINNER! 🎉`;
  }
}
