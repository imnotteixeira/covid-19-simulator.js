const {
    IndividualStates,
    convertToLinearCoord,
    convertToXYCoord,
    isContaminated,
    isDead,
    isCured,
    isHospitalized,
} = require("../utils");
const config = require("../config");

const contaminate = (population, i) => {
    population[i].state = IndividualStates.CARRIER;
    population[i].daysSinceTransmission = 0;
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
    }
    return affected.filter(([x, y]) =>
        x >= 0
        && x < config.MATRIX_SIDE
        && y >= 0
        && y < config.MATRIX_SIDE,
    );
};

const isViableTarget = (population, i) =>
    !isContaminated(population, i)
    && !isDead(population, i)
    && !isCured(population, i);

const getContaminatedIndexes = (population, spreadRadius, line, col) =>
    getAffectedCoords(line, col, spreadRadius)
        .map(convertToLinearCoord)
        .filter((i) => isViableTarget(population, i));


const propagateDisease = (population, carriers, spreadRadius, hygieneDisregard) => {
    const newCarriers = new Set();

    const contaminated = carriers.map((c) => {
        if (isHospitalized(population, c)) return [];
        else return getContaminatedIndexes(population, spreadRadius, ...convertToXYCoord(c));
    });
    contaminated.forEach((contaminatedArea) => contaminatedArea.forEach((i) => newCarriers.add(i)));

    newCarriers.forEach((i) => {
        // contaminating everyone in the area - to change, must add a randomness condition before calling contaminate
        const hygieneRand = Math.random();
        if (hygieneRand < hygieneDisregard) {
            contaminate(population, i);
            carriers.push(i);
        }
    });
};

module.exports = {
    propagateDisease,
    isContaminated,
    contaminate,
};
