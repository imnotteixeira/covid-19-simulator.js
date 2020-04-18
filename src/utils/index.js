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
const getRepresentation = (individual) => StateRepresentation[individual.state];

const displayMatrix = (m) => {
    console.log("-".repeat(config.MATRIX_SIDE));
    for (let i = 0; i < config.MATRIX_SIDE; i++) {
        let str = "";
        for (let j = 0; j < config.MATRIX_SIDE; j++) {
            str += `${getRepresentation(m[convertToLinearCoord([i, j])])}, `;

        }
        console.log(str);
    }
    console.log("-".repeat(config.MATRIX_SIDE));
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

module.exports = {
    IndividualStates,
    displayMatrix,
    convertToLinearCoord,
    convertToXYCoord,
};
