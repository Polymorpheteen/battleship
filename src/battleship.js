export class Ship {
  constructor(length) {
    this.length = length;
    this.hits = 0;
  }

  hit() {
    this.hits++;
  }

  isSunk() {
    return this.hits >= this.length;
  }
}

export class Gameboard {
  constructor(size = 10) {
    this.size = size;
    this.board = this.createBoard(size);
    this.ships = [];
    this.missedAttacks = [];
  }

  createBoard(size) {
    return Array.from({ length: size }, () => Array(size).fill(null));
  }

  placeShip(startX, startY, length, direction = "horizontal") {
    const positions = [];

    for (let i = 0; i < length; i++) {
      const x = direction === "horizontal" ? startX + i : startX;
      const y = direction === "vertical" ? startY + i : startY;

      if (x >= this.size || y >= this.size || this.board[x][y] !== null) {
        throw new Error("Invalid ship placement");
      }

      positions.push([x, y]);
    }

    for (let [x, y] of positions) {
      this.board[y][x] = { ship, hit: false };
    }

    this.ships.push(ship);
  }

  receiveAttack(x, y) {
    const cell = this.board[y][x];

    if (cell === "miss" || (cell && cell.hit)) {
      return "Already Attack";
    }

    if (cell === null) {
      this.board[y][x] = "miss";
      this.missedAttacks.push([x, y]);
      return "Miss";
    } else {
      cell.hit = true;
      cell.ship.hit();
      return cell.ship.isSunk() ? "Hit and sunk" : "Sunk";
    }
  }

  allShipsSunk() {
    return this.ships.every((ship) => ship.isSunk());
  }

  printBoard() {
    console.log(
      this.board
        .map((row) =>
          row
            .map((cell) => {
              if (cell === null) return ".";
              if (cell === "miss") return "O";
              if (cell.hit) return "X";
              return "S";
            })
            .join(" ")
        )
        .join("\n")
    );
  }
}

export class Player {
  constructor(name) {
    this.name = name;
    this.Gameboard = new Gameboard();
  }

  takeTurn(opponentBoard) {
    throw new Error("takeTurn() must be implemented by subclass");
  }
}

export class Human extends Player {
  constructor(name) {
    super(name);
  }

  takeTurn(opponentBoard, x, y) {
    return opponentBoard.receiveAttack(x, y);
  }
}

export class Computer extends Player {
  constructor(name = "Computer") {
    super(name);
    this.possibleMoves = [];

    for (let x = 0; x < this.gameBoard.size; x++) {
      for (let y = 0; y < this.gameBoard.size; y++) {
        this.possibleMoves.push([x, y]);
      }
    }
  }

  takeTurn(opponentBoard) {
    const randomIndex = Math.floor(Math.random() * this.possibleMoves.length);
    const [x, y] = this.possibleMoves.splice(randomIndex, 1)[0];

    return opponentBoard.receiveAttack(x, y);
  }
}
