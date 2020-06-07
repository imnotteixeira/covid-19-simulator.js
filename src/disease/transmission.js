const {
    IndividualStates,
    convertToLinearCoord,
    convertToXYCoord,
    isContaminated,
    isDead,
    isCured,
    isHospitalized,
    isQuarantined,
} = require("../utils");

const contaminate = (population, carriers, i) => {
    carriers.push(i);
    population[i].state = IndividualStates.CARRIER;
    population[i].daysSinceTransmission = 0;
    return population;
};

// This can be memoized
const getAffectedCoords = (line, col, spreadRadius, matrixSide) => {
    const affected = [];
    for (let x = col - spreadRadius; x <= col + spreadRadius; x++) {
        for (let y = line - spreadRadius; y <= line + spreadRadius; y++) {
            if (x >= 0
                && x < matrixSide
                && y >= 0
                && y < matrixSide
                && !(x === line && y === col))
                affected.push([y, x]);
        }
    }
    return affected;
};

const isViableTarget = (population, i) =>
    !isContaminated(population, i)
    && !isDead(population, i)
    && !isCured(population, i);

const getContaminatedIndexes = (population, spreadRadius, line, col) => {

    const matrixSide = Math.sqrt(population.length);
    return getAffectedCoords(line, col, spreadRadius, matrixSide)
        .map((c) => convertToLinearCoord(c, matrixSide))
        .filter((i) => isViableTarget(population, i));
};


const propagateDisease = (population, carriers, quarantined, spreadRadius, hygieneDisregard, quarantineEffectiveness) => {

    /**
     * Format: {
     *      target: [...carrier_sources]
     * }
     */
    const interactions = {};

    carriers.forEach((carrier) => {
        if (isHospitalized(population, carrier)) return;

        const targets = getContaminatedIndexes(population, spreadRadius, ...convertToXYCoord(carrier, Math.sqrt(population.length)));

        targets.forEach((target) => {
            // eslint-disable-next-line no-prototype-builtins
            if (!interactions.hasOwnProperty(target)) {
                interactions[target] = [];
            }
            interactions[target].push(carrier);
        });
    });

    const averageInteractions = Object.keys(interactions).length / carriers.length;
    const oldCarrierCount = carriers.length;

    for (const target in interactions) {
        const sources = interactions[target];

        const probabilityNotContaminated = sources.reduce((acc, source) =>
            // Takes into account source quarantine
            acc * (1 - calculateQuarantineContaminationProbability(population, source, quarantineEffectiveness)),
        1);

        // Takes into account target quarantine
        const contaminationProbability = hygieneDisregard *
            (1 - probabilityNotContaminated) *
            calculateQuarantineContaminationProbability(population, target, quarantineEffectiveness);

        const contaminationRand = Math.random();

        if (contaminationRand < contaminationProbability) {
            contaminate(population, carriers, parseInt(target, 10));
        }
    }

    return {
        averageInteractions,
        averageContaminations: (carriers.length - oldCarrierCount) / oldCarrierCount,
    };
};

const calculateQuarantineContaminationProbability = (population, source, quarantineEffectiveness) =>
    (isQuarantined(population, source) ? (1 - quarantineEffectiveness) : 1);

module.exports = {
    propagateDisease,
    isContaminated,
    contaminate,
};
