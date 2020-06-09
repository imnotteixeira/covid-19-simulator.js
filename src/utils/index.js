

// This can be memoized
const convertToLinearCoord = ([line, col], matrixSide) => (line * matrixSide) + col;
const convertToXYCoord = (index, matrixSide) => ([Math.floor(index / matrixSide), index % matrixSide]);
const isWithinBounds = (y, x, matrixSide) => ((x >= 0) && (x < matrixSide) && (y >= 0) && (y < matrixSide));

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

const isQuarantined = (population, i) => population[i].isQuarantined;

const removeElemByValue = (arr, el) => {
    for (let c = 0; c < arr.length; c++) {
        if (arr[c] === el) {
            arr.splice(c, 1);
        }
    }
};

const pickNRandomIndices = (arr, n, filter) => {
    let candidates = [];
    if (typeof filter === "function") {
        for (const personIdx in arr) {
            if (filter(arr[personIdx])) candidates.push(personIdx);
        }
    } else {
        candidates = Array.from(Array(arr.length).keys());
    }

    const result = [];
    for (let i = 0; i < n && candidates.length > 0; i++) {
        const randIndex = Math.floor(Math.random() * candidates.length);
        result.push(parseInt(candidates.splice(randIndex, 1)[0], 10));
    }
    return result;
};

const removeCarrier = (carriers, confirmedCarriers, i) => {
    removeElemByValue(carriers, i);
    removeElemByValue(confirmedCarriers, i);
};
const removeHospitalized = (hospitalized, i) => removeElemByValue(hospitalized, i);
const removeQuarantined = (quarantined, i) => removeElemByValue(quarantined, i);


module.exports = {
    IndividualStates,
    convertToLinearCoord,
    convertToXYCoord,
    isWithinBounds,
    isDead,
    isCured,
    isContaminated,
    isHospitalized,
    isQuarantined,
    removeCarrier,
    removeHospitalized,
    removeQuarantined,
    pickNRandomIndices,
};
