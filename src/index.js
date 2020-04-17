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
const isContaminated = (population, coord) => population[coord] === "X";

const getContaminatedIndexes = (population, line, col) => {
    // contaminating everyone in the area - to change, must add a randomness condition before calling contaminate
    const area = getAffectedCoords(line, col).map(convertToLinearCoord).filter((i) => !isContaminated(population, i));

    // Include self
    area.push(convertToLinearCoord([line, col]));

    // console.log(convertToLinearCoord([line, col]), area);

    return area;

};

const propagateDisease = (population, carriers) => {
    const newCarriers = new Set();

    const contaminated = carriers.map((c) => getContaminatedIndexes(population, ...convertToXYCoord(c)));
    contaminated.forEach((contaminatedArea) => contaminatedArea.forEach((i) => newCarriers.add(i)));

    // console.log("newCarriers", newCarriers);

    // console.log("old pop", population);
    newCarriers.forEach((i) => {
        contaminate(population, i);
    });

    // console.log("new pop", population);

    return Array.from(newCarriers);
};

const contaminate = (population, i) => {
    population[i] = "X";
    return population;
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

const getCarrierCoords = (population) => {
    const res = [];
    population.forEach((_, i) => {
        if (isContaminated(population, i)) res.push(convertToXYCoord(i));
    });
    return res;
};
const population = Array(MATRIX_SIDE * MATRIX_SIDE).fill(0);
let carriers = [
    convertToLinearCoord([MATRIX_SIDE / 2, MATRIX_SIDE / 2]),
];
carriers.forEach((c) => contaminate(population, c));
// displayMatrix(population);

const init = () => {

    let step = 0;
    // while (carriers.length < 1000000) {
    while (!population.every((_, i) => isContaminated(population, i))) {
        step++;
        console.log(step, carriers.length);
        carriers = propagateDisease(population, carriers);
        // displayMatrix(population);
    }
};
// displayMatrix(population);
init();
console.log("done");
