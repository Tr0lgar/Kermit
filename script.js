// Constants
const tab = []; // Main game board
const size = 10; // Size of the 2D grid
const kermit = "🐸"; // Kermit emoji representing the player's character
const fly = "🪰"; // Fly emoji representing the collectible items

// Game state variables
let kermitRow = 0; // Kermit's current row position
let kermitCol = 0; // Kermit's current column position
let totalFliesEaten = 0; // Counter for flies eaten by Kermit
let totalMoves = 0; // Counter for total moves made by the player
let startTime = Date.now(); // Timestamp for game start

// Function to initialize and fill the 2D grid with Kermit and flies
function fillArray2D(array, size) {
    for(let i = 0; i < size; i++){
        array[i] = Array(size).fill(" "); // Initialize each row with empty spaces
    }

    array[kermitRow][kermitCol] = kermit; // Place Kermit at the starting position

    let flyCount = 0;
    while (flyCount < 5) { // Randomly place 5 flies on the grid
        const randomRow = Math.floor(Math.random() * size);
        const randomCol = Math.floor(Math.random() * size);

        if (!(randomRow === kermitRow && randomCol === kermitCol) && array[randomRow][randomCol] === " ") {
            array[randomRow][randomCol] = fly;
            flyCount++;
        }
    }
}

// Function to reset the game to its initial state
function resetGame() {
    kermitRow = 0;
    kermitCol = 0;
    totalFliesEaten = 0;
    totalMoves = 0;
    startTime = Date.now();
    tab.length = 0; // Clear the existing game board
    fillArray2D(tab, size);
    displayArray2D(tab);
    updateScoreboard();
    document.getElementById('replay').style.display = 'none';
}

fillArray2D(tab, size); // Initial grid setup

// Function to display the 2D grid on the webpage
function displayArray2D(array) {
    const container = document.getElementById('array-container');
    container.innerHTML = '';
    array.forEach(row => {
        const rowElement = document.createElement('div');
        rowElement.classList.add('row');
        row.forEach(cell => {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            cellElement.textContent = cell;
            rowElement.appendChild(cellElement);
        });
        container.appendChild(rowElement);
    });
}

window.onload = () => displayArray2D(tab); // Display the grid when the page loads
updateScoreboard();

// Event listener to handle arrow key movements
window.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'ArrowRight':
            moveKermitRight(tab);
            break;
        case 'ArrowLeft':
            moveKermitLeft(tab);
            break;
        case 'ArrowUp':
            moveKermitUp(tab);
            break;
        case 'ArrowDown':
            moveKermitDown(tab);
            break;
    }
});

// Movement functions for Kermit
function moveKermitRight(array) { moveKermit(array, 0, 1); }
function moveKermitLeft(array) { moveKermit(array, 0, -1); }
function moveKermitUp(array) { moveKermit(array, -1, 0); }
function moveKermitDown(array) { moveKermit(array, 1, 0); }

// Generalized function to move Kermit based on row and column deltas
function moveKermit(array, rowDelta, colDelta) {
    const newRow = (kermitRow + rowDelta + size) % size;
    const newCol = (kermitCol + colDelta + size) % size;
    eatFlyIfPresent(array, newRow, newCol);
    array[kermitRow][kermitCol] = " "; // Clear previous position
    array[newRow][newCol] = kermit; // Update Kermit's new position
    kermitRow = newRow;
    kermitCol = newCol;
    totalMoves++;
    moveFlies(array);
    displayArray2D(array);
    updateScoreboard();
    checkGameOver(array);
}

// Function to check if Kermit eats a fly at the given position
function eatFlyIfPresent(array, row, col) {
    if (array[row][col] === fly) {
        totalFliesEaten++;
    }
}

// Function to randomly move all flies on the board
function moveFlies(array) {
    const directions = [
        { row: -1, col: 0 },    // up
        { row: 1, col: 0 },     // down
        { row: 0, col: -1 },    // left
        { row: 0, col: 1 },     // right
        { row: -1, col: 1 },    // up-right
        { row: -1, col: -1 },   // up-left
        { row: 1, col: 1 },     // down-right
        { row: 1, col: -1 },    // down-left
    ];

    const newArray = array.map(row => row.slice()); // Create a copy of the current array

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (array[i][j] === fly) {
                const direction = directions[Math.floor(Math.random() * directions.length)];
                const newRow = (i + direction.row + size) % size;
                const newCol = (j + direction.col + size) % size;

                if (newArray[newRow][newCol] === " ") {
                    newArray[newRow][newCol] = fly;
                    newArray[i][j] = " ";
                } else {
                    newArray[i][j] = fly; // Fly stays in place if it can't move
                }
            }
        }
    }

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            array[i][j] = newArray[i][j]; // Update the original array
        }
    }
}

// Function to check if all flies have been eaten
function checkGameOver(array) {
    const allFliesEaten = array.flat().every(cell => cell !== fly);
    if (allFliesEaten) {
        displayRestartButton();
    }
}

// Function to display the restart button when the game is over
function displayRestartButton() {
    const button = document.getElementById('replay');
    button.style.display = 'block';
    button.addEventListener('click', resetGame);
}

// Function to update the scoreboard with current game statistics
function updateScoreboard() {
    document.getElementById('total-move').textContent = `Total Moves: ${totalMoves}`;
    document.getElementById('total-fly-eaten').textContent = `Flies Eaten: ${totalFliesEaten}`;
    const currentTime = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById('time').textContent = `Time: ${currentTime}s`;
}