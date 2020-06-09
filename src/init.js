const { IndividualStates, convertToXYCoord, convertToLinearCoord } = require("./utils");
const { QuarantineTypes } = require("./disease/quarantine");
const { contaminate } = require("./disease/transmission");
const { PopulationPresets } = require("./presets");
/**
 * Generates size values of S, according to distribution
 * @param {*} size Number of people
 * @param {*} susceptibilityDistibution Object where key is a percentage of the population and the value is its susceptibility
 */
const generatePopulationSusceptibility = ({ size, susceptibilityDistibution }) => {

    const averageSusceptibility =
        Object.keys(susceptibilityDistibution).reduce(
            (acc, percentage) => acc + (susceptibilityDistibution[percentage] * parseFloat(percentage)),
            0,
        );

    const susceptibilities = Object.keys(susceptibilityDistibution).reduce((acc, percentage) =>
        [...acc, ...Array(Math.floor(size * parseFloat(percentage))).fill(susceptibilityDistibution[percentage])]
    , []);

    return [
        ...susceptibilities,
        ...Array(size - susceptibilities.length).fill(averageSusceptibility),
    ];
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

const createIndividual = (susceptibility, config, zoneNumber) => {
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
        quarantineStart: -1,
        lastTestedOnDay: -1,
        zone: zoneNumber,
    };
};

const initPopulation = (size, config) => {
    if (size > 0 && Math.sqrt(size) % 1 === 0) {
        const population = [];

        const populationPreset = PopulationPresets[config.populationPreset];


        const susceptibilities = generatePopulationSusceptibility(
            { ...populationPreset, size },
        );

        const zoneSide = Math.sqrt(size) / Math.sqrt(config.numberOfZones);

        for (let i = 0; i < size; i++) {
            const zoneCoords = convertToXYCoord(i, Math.sqrt(size)).map((elem) => Math.floor(elem / zoneSide));
            const zoneNumber = convertToLinearCoord(zoneCoords, Math.sqrt(config.numberOfZones));
            population[i] = createIndividual(susceptibilities[i], config, zoneNumber);
        }

        return population;

    } else {
        throw new Error("Population Size must be a perfect square");
    }

};

const validateInput = ({
    quarantineType,
    quarantinePercentage,
    populationSize,
    testRate,
    incubationPeriod,
    infectionPeriod,
}) => {
    // eslint-disable-next-line no-prototype-builtins
    if (quarantineType !== "" && !QuarantineTypes.hasOwnProperty(quarantineType)) {
        throw new Error(`Trying to use invalid Quarantine Type = ${quarantineType}.`);
    } if (quarantineType === QuarantineTypes.FIXED_PERCENTAGE && !quarantinePercentage) {
        throw new Error("Trying to use Quarantine Type = Fixed Percentage, but no Quarantine Percentage set.");
    } if (quarantinePercentage && quarantineType !== QuarantineTypes.FIXED_PERCENTAGE) {
        console.warn(`Set quarantine percentage, but the quarantine type is ${quarantineType}, you probably forgot to change it.`);
    } if (testRate > populationSize) {
        throw new Error("Test rate can't be higher than population size!");
    } if (incubationPeriod >= infectionPeriod) {
        throw new Error("Incubation period must be less than the infection period");
    }
};

module.exports = (inputData) => {

    let {
        populationSize,
        hygieneDisregard = 1,
        spreadRadius = 1,
        initialCarriers = [0],
        // deathProbablityFn,
        // cureProbabilityFn,
        hospitalCapacity,
        hospitalEffectiveness,
        incubationPeriod = 6,
        infectionPeriod = 41,
        populationPreset = 0,
        // QUARANTINE
        quarantineEffectiveness,
        quarantinePeriod,
        quarantineDelay,
        quarantineType,
        quarantinePercentage,
        // TEST
        testRate = 0,
        testCooldown = 7,
        numberOfZones = 1,
        zoneIsolationThreshold = 0.5,
    } = inputData;

    const config = {
        incubationPeriod,
        infectionPeriod,
        populationPreset,
        numberOfZones,
    };

    validateInput(inputData);

    // eslint-disable-next-line no-param-reassign
    if (!populationSize) populationSize = PopulationPresets[populationPreset].size;

    const matrixSide = Math.sqrt(populationSize);
    // eslint-disable-next-line no-param-reassign
    initialCarriers = [((Math.floor(matrixSide / 2)) * matrixSide) + (matrixSide / 2)];

    const population = initPopulation(populationSize, config); // TODO pass S distribution to attribute S to each individual on setup

    const carriers = [];
    initialCarriers.forEach((carrier) => contaminate(population, carriers, carrier));

    return {
        population,
        carriers,
        confirmedCarriers: [],
        dead: [],
        cured: [],
        hospitalized: [],
        hygieneDisregard,
        spreadRadius,
        hospitalCapacity,
        hospitalEffectiveness,
        incubationPeriod,
        infectionPeriod,
        step: 0,
        ended: false,
        // confirmedCarriers: [],
        quarantineEffectiveness,
        quarantinePeriod,
        quarantineDelay,
        quarantineType,
        quarantinePercentage,
        quarantined: [],
        testRate,
        testCooldown,
        numberOfZones,
        isolatedZones: Array(numberOfZones).fill(false),
        zoneIsolationThreshold,
    };
};
