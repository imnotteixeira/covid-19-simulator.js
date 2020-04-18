const {
    IndividualStates,
    convertToLinearCoord,
    convertToXYCoord,
} = require("../utils");
const config = require("../config");

const isContaminated = (population, coord) =>
    population[coord].state === IndividualStates.CARRIER
    || population[coord].state === IndividualStates.CONFIRMED_CARRIER;

const contaminate = (population, i) => {
    population[i].state = IndividualStates.CARRIER;
    population[i].daysSinceTrasmission = 0;
    return population;
};

// This can be memoized
const getAffectedCoords = (line, col, spreadRadius) => {
    const affected = [];
    for (let i = 1; i <= spreadRadius; i++) {
        for (let j = 1; j <= spreadRadius; j++) {
            // vertical
            affected.push([line + i, col]);
            affected.push([line - i, col]);
            // horizontal
            affected.push([line, col - j]);
            affected.push([line, col + j]);
            // diagonals
            affected.push([line - i, col - j]);
            affected.push([line - i, col + j]);
            affected.push([line + i, col - j]);
            affected.push([line + i, col + j]);
        }
        // const UP = [line - i, col];
        // const DOWN = [line + i, col];
        // const LEFT = [line, col - i];
        // const RIGHT = [line, col + i];
        // const UP_LEFT = [line - i, col - i];
        // const UP_RIGHT = [line - i, col + i];
        // const DOWN_LEFT = [line + i, col - i];
        // const DOWN_RIGHT = [line + i, col + i];

        // affected.push(
        //     ...[
        //         UP,
        //         DOWN,
        //         LEFT,
        //         RIGHT,
        //         UP_LEFT,
        //         UP_RIGHT,
        //         DOWN_LEFT,
        //         DOWN_RIGHT,
        //     ].filter(([x, y]) =>
        //         x >= 0
        //         && x < config.MATRIX_SIDE
        //         && y >= 0
        //         && y < config.MATRIX_SIDE,
        //     ),
        // );
    }
    return affected.filter(([x, y]) =>
        x >= 0
        && x < config.MATRIX_SIDE
        && y >= 0
        && y < config.MATRIX_SIDE,
    );
};

const getContaminatedIndexes = (population, spreadRadius, line, col) =>
    getAffectedCoords(line, col, spreadRadius)
        .map(convertToLinearCoord)
        .filter((i) => !isContaminated(population, i));


const propagateDisease = (population, carriers, spreadRadius) => {
    const newCarriers = new Set();

    const contaminated = carriers.map((c) => getContaminatedIndexes(population, spreadRadius, ...convertToXYCoord(c)));
    contaminated.forEach((contaminatedArea) => contaminatedArea.forEach((i) => newCarriers.add(i)));

    newCarriers.forEach((i) => {
        // contaminating everyone in the area - to change, must add a randomness condition before calling contaminate
        contaminate(population, i);
        carriers.push(i);
    });
};

module.exports = {
    propagateDisease,
    isContaminated,
    contaminate,
};
