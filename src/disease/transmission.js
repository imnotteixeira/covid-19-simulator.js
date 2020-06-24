const {
    IndividualStates,
    convertToLinearCoord,
    convertToXYCoord,
    isWithinBounds,
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
const getAffectedCoords = (line, col, spreadRadius, matrixSide, isolatedZones, population) => {
    const affected = [];
    for (let x = col - spreadRadius; x <= col + spreadRadius; x++) {
        for (let y = line - spreadRadius; y <= line + spreadRadius; y++) {
            if (
                !isWithinBounds(y, x, matrixSide)
                || population[convertToLinearCoord([y, x], matrixSide)].isDummy
            ) continue; // Ignore out of bounds coordinates and dummy elements (population density)

            const distance = Math.sqrt(Math.pow(x - col, 2) + Math.pow(y - line, 2));
            const sourceZone = population[convertToLinearCoord([line, col], matrixSide)].zone;
            const targetZone = population[convertToLinearCoord([y, x], matrixSide)].zone;
            if (!(x === col && y === line)
                && ((sourceZone === targetZone) || (!isolatedZones[sourceZone].isIsolated && !isolatedZones[targetZone].isIsolated))
                && ((1 - (distance / (spreadRadius + 1))) < Math.random())
            )
                affected.push([y, x]);
        }
    }

    return affected;
};

const isViableTarget = (population, i) =>
    !isContaminated(population, i)
    && !isDead(population, i)
    && !isCured(population, i);

const getContaminatedIndexes = (population, spreadRadius, line, col, isolatedZones) => {

    const matrixSide = Math.sqrt(population.length);
    return getAffectedCoords(line, col, spreadRadius, matrixSide, isolatedZones, population)
        .map((c) => convertToLinearCoord(c, matrixSide))
        .filter((i) => isViableTarget(population, i));
};


const propagateDisease = (population, carriers, quarantined, spreadRadius, hygieneDisregard, quarantineEffectiveness, isolatedZones) => {

    /**
     * Format: {
     *      target: [...carrier_sources]
     * }
     */
    const interactions = {};

    carriers.forEach((carrier) => {
        if (isHospitalized(population, carrier)) return;

        const targets = getContaminatedIndexes(
            population,
            spreadRadius,
            ...convertToXYCoord(carrier, Math.sqrt(population.length)),
            isolatedZones,
        );

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
