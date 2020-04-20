const config = require("../config");

const StateRepresentation = Object.freeze({
    HEALTHY: "☺",
    CARRIER: "C",
    CONFIRMED_CARRIER: "C*",
    DEAD: "D",
    CURED: "*",
    QUARANTINED: "Q",
    HOSPITALIZED: "H",
});

// Does not render states like quarantined and stuff, because they are not a .state of the individual
const getRepresentation = (individual) => {
    if (individual.isHospitalized) return StateRepresentation.HOSPITALIZED;
    if (individual.isQuarantined) return StateRepresentation.QUARANTINED;
    return StateRepresentation[individual.state];
};

const displayMatrix = (m) => {
    console.info("-".repeat(config.MATRIX_SIDE));
    for (let i = 0; i < config.MATRIX_SIDE; i++) {
        let str = "";
        for (let j = 0; j < config.MATRIX_SIDE; j++) {
            str += `${getRepresentation(m[convertToLinearCoord([i, j])])}, `;

        }
        console.info(str);
    }
    console.info("-".repeat(config.MATRIX_SIDE));
};

// This can be memoized
const convertToLinearCoord = ([line, col]) => (line * config.MATRIX_SIDE) + col;
const convertToXYCoord = (index) => ([Math.floor(index / config.MATRIX_SIDE), index % config.MATRIX_SIDE]);

const IndividualStates = Object.freeze({
    HEALTHY: "HEALTHY",
    CARRIER: "CARRIER",
    CONFIRMED_CARRIER: "CONFIRMED_CARRIER",
    CURED: "CURED",
    DEAD: "DEAD",
});

const isDead = (population, i) => population[i].state === IndividualStates.DEAD;
const isCured = (population, i) => population[i].state === IndividualStates.CURED;
const isHospitalized = (population, i) => population[i].isHospitalized;

const isContaminated = (population, coord) =>
    population[coord].state === IndividualStates.CARRIER
    || population[coord].state === IndividualStates.CONFIRMED_CARRIER;

const removeElemByValue = (arr, el) => {
    for (let c = 0; c < arr.length; c++) {
        if (arr[c] === el) {
            arr.splice(c, 1);
        }
    }
};

const removeCarrier = (carriers, i) => removeElemByValue(carriers, i);
const removeHospitalized = (hospitalized, i) => removeElemByValue(hospitalized, i);

module.exports = {
    IndividualStates,
    displayMatrix,
    convertToLinearCoord,
    convertToXYCoord,
    isDead,
    isCured,
    isContaminated,
    isHospitalized,
    removeCarrier,
    removeHospitalized,
};
