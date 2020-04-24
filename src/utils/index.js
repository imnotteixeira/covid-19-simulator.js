

// This can be memoized
const convertToLinearCoord = ([line, col], matrixSide) => (line * matrixSide) + col;
const convertToXYCoord = (index, matrixSide) => ([Math.floor(index / matrixSide), index % matrixSide]);

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
    convertToLinearCoord,
    convertToXYCoord,
    isDead,
    isCured,
    isContaminated,
    isHospitalized,
    removeCarrier,
    removeHospitalized,
};
