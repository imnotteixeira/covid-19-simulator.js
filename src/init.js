const { IndividualStates } = require("./utils");
const config = require("./config");
const { contaminate } = require("./disease/transmission");

/**
 * Generates size values of S, according to distribution
 * @param {*} size Number of people
 */
const generateSusceptibilityDistribution = (size) => {

    // Hardcoding distribution, change later
    const distribution = (x) => Math.exp(-Math.pow((x - (size / 2)), 2) / size);

    return Array(size).fill(0).map((_, i) => distribution(i));

};

const createIndividual = (susceptibility) => ({
    susceptibility,
    daysSinceTransmission: -1,
    state: IndividualStates.HEALTHY,
});

const initPopulation = (size) => {
    if (size > 0 && Math.sqrt(size) % 1 === 0) {
        const population = [];

        const susceptibilities = generateSusceptibilityDistribution(size);

        for (let i = 0; i < size; i++) {
            population[i] = createIndividual(susceptibilities[i]);
        }

        console.log(population);
        return population;

    } else {
        throw new Error("Population Size must be a perfect square");
    }
};

module.exports = ({
    populationSize = 100,
    hygieneDisregard = 1,
    spreadRadius = 1,
    initialCarriers = [(populationSize / 2) + (config.MATRIX_SIDE / 2)],
    // deathProbablityFn,
    // cureProbabilityFn,
    // hospitalCapacity,
    // quarantinePeriod,
    // quarantineDelay,
}) => {
    const population = initPopulation(populationSize); // TODO pass S distribution to attribute S to each individual on setup

    initialCarriers.forEach((carrier) => contaminate(population, carrier));

    return {
        population,
        carriers: initialCarriers,
        hygieneDisregard,
        spreadRadius,
        // confirmedCarriers: [],
        // hospitalized: [],
        // dead: [],
        // cured: [],
        // quarantined: [],
    };
};
