const { IndividualStates } = require("./utils");
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

const generateDeathProbabilityFunction = (susceptibility, config) => (day) => {
    if (day < 0)
        throw new Error("Trying to calculate death probabilty for day < 0, you probably forgot to increment it in the simulation loop");

    const peak = config.incubationPeriod + (0.23 * (config.infectionPeriod - config.incubationPeriod));
    if (day <= 14) return susceptibility * Math.exp(-Math.pow((day - peak), 2) / config.incubationPeriod);
    else return susceptibility * Math.exp(-Math.pow((day - peak), 2) / config.infectionPeriod);
};

const generateCureProbabilityFunction = (susceptibility) => (day) => {
    if (day < 0)
        throw new Error("Trying to calculate cure probabilty for day < 0, you probably forgot to increment it in the simulation loop");

    return 1 / (1 + Math.exp(-(day / ((0.5 * susceptibility) + 1)) + 11));
};

const createIndividual = (susceptibility, config) => {
    const deathProbabilityFn = generateDeathProbabilityFunction(susceptibility, config);
    const cureProbabilityFn = generateCureProbabilityFunction(susceptibility);

    return {
        susceptibility,
        deathProbabilityFn,
        cureProbabilityFn,
        deathProbability: 0,
        daysSinceTransmission: -1,
        state: IndividualStates.HEALTHY,
        isHospitalized: false,
        isQuarantined: false,
    };
};

const initPopulation = (size, config) => {
    if (size > 0 && Math.sqrt(size) % 1 === 0) {
        const population = [];

        const susceptibilities = generateSusceptibilityDistribution(size);

        for (let i = 0; i < size; i++) {
            population[i] = createIndividual(susceptibilities[i], config);
        }

        return population;

    } else {
        throw new Error("Population Size must be a perfect square");
    }
};

module.exports = ({
    populationSize = 100,
    hygieneDisregard = 1,
    spreadRadius = 1,
    initialCarriers = [0],
    // deathProbablityFn,
    // cureProbabilityFn,
    hospitalCapacity,
    hospitalEffectiveness,
    incubationPeriod,
    infectionPeriod,
    // quarantinePeriod,
    // quarantineDelay,
}) => {

    const config = {
        incubationPeriod,
        infectionPeriod,
    };

    const population = initPopulation(populationSize, config); // TODO pass S distribution to attribute S to each individual on setup

    initialCarriers.forEach((carrier) => contaminate(population, carrier));

    return {
        population,
        carriers: initialCarriers,
        dead: [],
        cured: [],
        hospitalized: [],
        hygieneDisregard,
        spreadRadius,
        hospitalCapacity,
        hospitalEffectiveness,
        incubationPeriod,
        infectionPeriod,
        // confirmedCarriers: [],
        // dead: [],
        // quarantined: [],
    };
};
