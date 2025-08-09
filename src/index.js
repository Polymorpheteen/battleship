import { Human, Computer } from "./battleship";
import "./styles.css";

let human, computer;
let currentTurn = "human";
const shipLengthsToPlace = [5, 4, 3, 3, 2];
let currentShipIndex = 0;
let isHorizontal = true;
let placementPhase = true;

function setupRotateButton() {
  const rotateBtn = document.getElementById("rotate");
  rotateBtn.addEventListener("click", () => {
    isHorizontal = !isHorizontal;
    rotateBtn.textContent = `Rotate Ship (${
      isHorizontal ? "Horizontal" : "Vertical"
    })`;
  });
}

function renderBoard(gameboard, container, isEnemy) {
  container.innerHTML = "";

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.x = x;
      cell.dataset.y = y;

      const value = gameboard.board[y][x];
      if (value && value.ship && value.hit) {
        cell.classList.add("hit");
      } else if (value === "miss") {
        cell.classList.add("miss");
      } else if (value && value.ship && !isEnemy) {
        cell.classList.add("ship");
      }

      container.appendChild(cell);
    }
  }
}

function renderBoards() {
  renderBoard(human.gameboard, document.getElementById("player-board"), false);
  renderBoard(
    computer.gameboard,
    document.getElementById("computer-board"),
    true
  );
}

function placeComputerShipsRandomly() {
  const lengths = [5, 4, 3, 3, 2];
  lengths.forEach((length) => {
    let placed = false;
    while (!placed) {
      const x = Math.floor(Math.random() * 10);
      const y = Math.floor(Math.random() * 10);
      const horizontal = Math.random() < 0.5;
      try {
        computer.gameboard.placeShip(x, y, length, horizontal);
        placed = true;
      } catch (e) {
        // Invalid placement, try again
      }
    }
  });
}

function setupPlayerPlacement() {
  const playerBoard = document.getElementById("player-board");

  playerBoard.addEventListener("click", (e) => {
    if (!placementPhase) return;

    const cell = e.target;
    if (!cell.classList.contains("cell")) return;

    const x = parseInt(cell.dataset.x);
    const y = parseInt(cell.dataset.y);
    const length = shipLengthsToPlace[currentShipIndex];

    try {
      human.gameboard.placeShip(x, y, length, isHorizontal);
      currentShipIndex++;
      renderBoards();

      if (currentShipIndex === shipLengthsToPlace.length) {
        placementPhase = false;
        setupAttackListeners();
      }
    } catch (err) {
      // Optionally alert or console.log("Invalid placement");
    }
  });
}

function setupAttackListeners() {
  const enemyBoard = document.getElementById("computer-board");

  enemyBoard.addEventListener("click", (e) => {
    if (currentTurn !== "human" || placementPhase) return;

    const cell = e.target;
    if (!cell.classList.contains("cell")) return;

    const x = parseInt(cell.dataset.x);
    const y = parseInt(cell.dataset.y);

    const result = human.attack(computer.gameboard, x, y);
    if (result === "Already Attack") return;

    renderBoards();

    if (computer.gameboard.allShipsSunk()) {
      endGame("You");
      return;
    }

    currentTurn = "computer";

    setTimeout(() => {
      computer.attack(human.gameboard);
      renderBoards();

      if (human.gameboard.allShipsSunk()) {
        endGame("Computer");
        return;
      }

      currentTurn = "human";
    }, 500);
  });
}

function endGame(winner) {
  alert(`${winner} win!`);
  document.getElementById("computer-board").style.pointerEvents = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  human = new Human("Player");
  computer = new Computer();

  placeComputerShipsRandomly();

  renderBoards();
  setupPlayerPlacement();
  setupRotateButton();
});
