const { propagateDisease } = require("./disease/transmission");
const { calculateOutcomes, updateCarriersDetails } = require("./disease/outcome");
const { hospitalize } = require("./disease/hospitalize");
const { test } = require("./disease/test");
const { handleQuarantine } = require("./disease/quarantine");
const { handleZoneIsolation } = require("./disease/zoning");
const MetricsService = require("./metrics");

const simulate = (simulationState, maxSteps, hooks) => {

    console.info(`Simulating${maxSteps ? ` with max steps = ${maxSteps}` : ""}...`);

    while (!simulationState.ended) {
        simulateStep(simulationState, maxSteps, hooks);
    }
};

const simulateStep = (simulationState, maxSteps, hooks) => {
    const {
        population,
        carriers,
        confirmedCarriers,
        dead,
        cured,
        hospitalized,
        spreadRadius,
        hygieneDisregard,
        hospitalCapacity,
        hospitalEffectiveness,
        incubationPeriod,
        quarantined,
        quarantineEffectiveness,
        quarantinePeriod,
        quarantineDelay,
        quarantineType,
        quarantinePercentage,
        testRate,
        testCooldown,
        step,
        isolatedZones,
        zoneIsolationThreshold,
        zoneIsolationBehavior,
        zoneIsolationTimeout,
        realPopulationPerZone,
    } = simulationState;

    const {
        onSimulationStart = () => {},
        stepEnd = () => {},
    } = (hooks ? hooks : {});

    if (step === 0) {
        onSimulationStart(simulationState);
        MetricsService.collect({
            ...simulationState,
            averageInteractions: 0,
            averageContaminations: 0,
            newTests: 0,
            newPositiveTests: 0,
        });
    }

    // UPDATE THIS ONCE THERE ARE CONFIRMED CARRIERS AS WELL
    if (carriers.length === 0) {
        console.warn("No carriers left, Stopping simulation...");
        simulationState.ended = true;
        return simulationState;
    }

    updateCarriersDetails(population, carriers);

    simulationState.step++;
    const {
        averageInteractions,
        averageContaminations,
    } = propagateDisease(population, carriers, quarantined, spreadRadius, hygieneDisregard, quarantineEffectiveness, isolatedZones);

    calculateOutcomes(population, carriers, dead, cured, hospitalized, hospitalEffectiveness, confirmedCarriers);

    const { newTests, newPositiveTests } = test(population, confirmedCarriers, testRate, testCooldown, step);

    handleZoneIsolation(zoneIsolationBehavior, {
        population,
        confirmedCarriers,
        isolatedZones,
        zoneIsolationThreshold,
        step,
        zoneIsolationTimeout,
        realPopulationPerZone,
    });

    hospitalize(population, carriers, hospitalized, hospitalCapacity, incubationPeriod);

    handleQuarantine({
        step,
        population,
        quarantined,
        quarantinePeriod,
        quarantineDelay,
        quarantineType,
        quarantinePercentage,
        confirmedCarriers,
    });

    MetricsService.collect({
        ...simulationState,
        averageInteractions,
        averageContaminations,
        newTests,
        newPositiveTests,
    });

    stepEnd(simulationState);

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
