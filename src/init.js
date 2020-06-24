const { IndividualStates, convertToXYCoord, convertToLinearCoord, pickNRandomIndices } = require("./utils");
const { QuarantineTypes } = require("./disease/quarantine");
const { validateInput } = require("./input");
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

const createIndividual = (susceptibility, config, zoneNumber, isDummy) => {
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
        isDummy,
    };
};

const initPopulation = (size, config) => {
    if (size > 0 && Math.sqrt(size) % 1 === 0) {
        const population = Array(size);

        const populationPreset = PopulationPresets[config.populationPreset];


        const susceptibilities = generatePopulationSusceptibility(
            { ...populationPreset, size },
        );

        const zoneSide = Math.sqrt(size) / Math.sqrt(config.numberOfZones);

        let dummyIndividuals = Array(size).fill(false);
        if (config.disabledIndividualsMatrix) dummyIndividuals = config.disabledIndividualsMatrix;
        else {
            pickNRandomIndices(population, Math.floor((1 - config.populationDensity) * size))
                .forEach((i) => {
                    dummyIndividuals[i] = true;
                });
        }

        const realPopulationPerZone = Array(config.numberOfZones).fill(0);


        for (let i = 0; i < size; i++) {
            const zoneCoords = convertToXYCoord(i, Math.sqrt(size)).map((elem) => Math.floor(elem / zoneSide));
            const zoneNumber = convertToLinearCoord(zoneCoords, Math.sqrt(config.numberOfZones));

            realPopulationPerZone[zoneNumber] += dummyIndividuals[i] ? 0 : 1;

            population[i] = createIndividual(susceptibilities[i], config, zoneNumber, dummyIndividuals[i]);
        }

        return {
            population,
            realPopulationPerZone,
        };

    } else {
        throw new Error("Population Size must be a perfect square");
    }

};

module.exports = (inputData) => {

    let {
        populationSize = 100,
        hygieneDisregard = 1,
        spreadRadius = 1,
        initialCarriers = [0],
        // deathProbablityFn,
        // cureProbabilityFn,
        hospitalCapacity = 0,
        hospitalEffectiveness = 0,
        incubationPeriod = 6,
        infectionPeriod = 41,
        populationPreset = 0,
        // QUARANTINE
        quarantineEffectiveness = 1,
        quarantinePeriod = 1,
        quarantineDelay = 1,
        quarantineType = QuarantineTypes.NONE,
        quarantinePercentage = 0,
        // TEST
        testRate = 0,
        testCooldown = 7,
        // ZONING
        numberOfZones = 1,
        zoneIsolationThreshold = 0.5,
        zoneIsolationTimeout = 0,
        zoneIsolationBehavior = "BASIC",

        // POPULATION_DENSITY
        populationDensity,
        disabledIndividualsMatrix,
    } = inputData;

    const config = {
        incubationPeriod,
        infectionPeriod,
        populationPreset,
        numberOfZones,

        disabledIndividualsMatrix,
        populationDensity,
    };

    validateInput(inputData);

    // eslint-disable-next-line no-param-reassign
    if (!populationSize) populationSize = PopulationPresets[populationPreset].size;

    const matrixSide = Math.sqrt(populationSize);
    // eslint-disable-next-line no-param-reassign
    initialCarriers = [((Math.floor(matrixSide / 2)) * matrixSide) + Math.floor(matrixSide / 2)];

    const { population, realPopulationPerZone } = initPopulation(populationSize, config);

    const carriers = [];
    initialCarriers.forEach((carrier) => {
        population[carrier].isDummy = false; // ensure that this is a valid individual
        contaminate(population, carriers, carrier);

    });

    const isolatedZones = [];
    for (let zone = 0; zone < numberOfZones; zone++) {
        isolatedZones[zone] = {
            isIsolated: false,
            isolationUnnecessarySinceStep: -1,
        };

    }

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
        quarantineEffectiveness,
        quarantinePeriod,
        quarantineDelay,
        quarantineType,
        quarantinePercentage,
        quarantined: [],
        testRate,
        testCooldown,
        numberOfZones,
        isolatedZones,
        zoneIsolationThreshold,
        zoneIsolationBehavior,
        zoneIsolationTimeout,
        realPopulationPerZone,
        realPopulationSize: realPopulationPerZone.reduce((a, b) => a + b, 0),
    };
};
