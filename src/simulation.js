const { propagateDisease } = require("./disease/transmission");
const { calculateOutcomes, updateCarriersDetails } = require("./disease/outcome");
const { hospitalize } = require("./disease/hospitalize");
const MetricsService = require("./metrics");

const simulate = (simulationState, maxSteps, hooks) => {
    const {
        stepEnd = () => {},
    } = hooks;

    console.info(`Simulating${maxSteps ? ` with max steps = ${maxSteps}` : ""}...`);

    while (!simulationState.ended) {
        simulateStep(simulationState, maxSteps);
        stepEnd(simulationState);
    }
};

const simulateStep = (simulationState, maxSteps) => {
    const {
        population,
        carriers,
        dead,
        cured,
        hospitalized,
        spreadRadius,
        hygieneDisregard,
        hospitalCapacity,
        hospitalEffectiveness,
        incubationPeriod,
        step,
    } = simulationState;

    // UPDATE THIS ONCE THERE ARE CONFIRMED CARRIERS AS WELL
    if (carriers.length === 0) {
        console.warn("No carriers left, Stopping simulation...");
        simulationState.ended = true;
        return simulationState;
    }

    updateCarriersDetails(population, carriers);

    simulationState.step++;
    propagateDisease(population, carriers, spreadRadius, hygieneDisregard);

    calculateOutcomes(population, carriers, dead, cured, hospitalized, hospitalEffectiveness);

    hospitalize(population, carriers, hospitalized, hospitalCapacity, incubationPeriod);

    MetricsService.collect("carrier-count", { carriers });
    MetricsService.collect("dead-count", { dead });
    MetricsService.collect("cured-count", { cured });
    MetricsService.collect("hospitalized-count", { hospitalized });
    MetricsService.collect("healthy-count", { population, cured, dead, carriers });


    if (maxSteps && step === maxSteps) {
        console.warn(`Maximum steps reached (${maxSteps}), Stopping simulation...`);
        simulationState.ended = true;
    }

    return simulationState;

};

module.exports = {
    simulate,
    simulateStep,
};
