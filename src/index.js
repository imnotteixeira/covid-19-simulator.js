const MATRIX_SIDE = process.env.SIZE || 10;

// This can be memoized
const getAffectedCoords = (line, col) => {

    const UP = [line - 1, col];
    const DOWN = [line + 1, col];
    const LEFT = [line, col - 1];
    const RIGHT = [line, col + 1];
    const UP_LEFT = [line - 1, col - 1];
    const UP_RIGHT = [line - 1, col + 1];
    const DOWN_LEFT = [line + 1, col - 1];
    const DOWN_RIGHT = [line + 1, col + 1];

    return [
        UP,
        DOWN,
        LEFT,
        RIGHT,
        UP_LEFT,
        UP_RIGHT,
        DOWN_LEFT,
        DOWN_RIGHT,
    ].filter(([x, y]) => x >= 0 && x < MATRIX_SIDE && y >= 0 && y < MATRIX_SIDE);
};
// This can be memoized
const convertToLinearCoord = ([line, col]) => (line * MATRIX_SIDE) + col;
const convertToXYCoord = (index) => ([Math.floor(index / MATRIX_SIDE), index % MATRIX_SIDE]);

// eslint-disable-next-line no-unused-vars
const isContaminated = (matrix, coord) => matrix[coord] === "X";

const getContaminatedIndexes = (matrix, line, col) => {
    const area = getAffectedCoords(line, col);

    // contaminating everyone in the area - to change, must add a randomness condition before calling contaminate
    return area.map(convertToLinearCoord).filter((i) => !isContaminated(matrix, i));

};

const propagateDisease = (matrix, carriers) => {
    const newCarriers = new Set();
    const contaminated = carriers.map(([line, col]) => getContaminatedIndexes(matrix, line, col));
    contaminated.forEach((contaminatedArea) => contaminatedArea.forEach((i) => newCarriers.add(i)));

    newCarriers.forEach((i) => {
        contaminate(matrix, i);
    });

    return matrix;
};

const contaminate = (matrix, i) => {
    matrix[i] = "X";
    return matrix;
};

const displayMatrix = (m) => {
    console.log("-".repeat(MATRIX_SIDE));
    for (let i = 0; i < MATRIX_SIDE; i++) {
        let str = "";
        for (let j = 0; j < MATRIX_SIDE; j++) {
            str += `${m[convertToLinearCoord([i, j])]}, `;

        }
        console.log(str);
    }
    console.log("-".repeat(MATRIX_SIDE));
};

const getCarrierCoords = (matrix) => {
    const res = [];
    matrix.forEach((_, i) => {
        if (isContaminated(matrix, i)) res.push(convertToXYCoord(i));
    });
    return res;
};
let population = Array(MATRIX_SIDE * MATRIX_SIDE).fill(0);
let carriers = [
    [MATRIX_SIDE / 2, MATRIX_SIDE / 2],
];
carriers.forEach(([l, c]) => contaminate(population, convertToLinearCoord([l, c])));
// displayMatrix(population);

const init = () => {

    while (carriers.length < 1000000) {
    // while (!population.every((_, i) => isContaminated(population, i))) {
        console.log(carriers.length);
        population = propagateDisease(population, carriers);
        carriers = getCarrierCoords(population);
        // displayMatrix(population);
    }
};
// displayMatrix(population);
init();
console.log("done");
