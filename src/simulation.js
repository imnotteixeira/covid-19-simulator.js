const { propagateDisease, isContaminated } = require("./disease/transmission");
const { calculateOutcomes, updateCarriersDetails } = require("./disease/outcome");
const { hospitalize } = require("./disease/hospitalize");
const { displayMatrix } = require("./utils");
const MetricsService = require("./metrics");

const simulate = (simulation, maxSteps) => {
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
    } = simulation;

    console.info(`Simulating${maxSteps ? ` with max steps = ${maxSteps}` : ""}...`);

    let step = 0;
    if (population.length > 100) {
        console.info("Population too big. Will not render population.");
    }
    MetricsService.collect("carrier-count", { carriers });
    while (!population.every((_, i) => isContaminated(population, i))) {

        if (carriers.length === 0) {
            console.warn("No carriers left, Stopping simulation...");
            break;
        }

        // console.debug("Step: ", step);
        updateCarriersDetails(population, carriers);

        step++;
        propagateDisease(population, carriers, spreadRadius, hygieneDisregard);

        calculateOutcomes(population, carriers, dead, cured, hospitalized, hospitalEffectiveness);

        hospitalize(population, carriers, hospitalized, hospitalCapacity);

        if (population.length <= 100) {
            displayMatrix(population);
        }

        MetricsService.collect("carrier-count", { carriers });
        MetricsService.collect("dead-count", { dead });
        MetricsService.collect("cured-count", { cured });
        MetricsService.collect("hospitalized-count", { hospitalized });

        if (maxSteps && step === maxSteps) {
            console.warn(`Maximum steps reached (${maxSteps}), Stopping simulation...`);
            break;
        }

    }
};

module.exports = {
    simulate,
};
