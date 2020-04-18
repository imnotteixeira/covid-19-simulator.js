const { propagateDisease, isContaminated } = require("./disease/transmission");
const { displayMatrix } = require("./utils");
const MetricsService = require("./metrics");

const simulate = (simulation, maxSteps) => {
    const {
        population,
        carriers,
        spreadRadius,
        hygieneDisregard,
    } = simulation;

    console.info(`Simulating${maxSteps ? ` with max steps = ${maxSteps}` : ""}...`);

    let step = 0;
    if (population.length > 100) {
        console.info("Population too big. Will not render population.");
    }
    MetricsService.collect("carrier-count", { carriers });
    while (!population.every((_, i) => isContaminated(population, i))) {

        // console.debug("Step: ", step);

        step++;
        propagateDisease(population, carriers, spreadRadius, hygieneDisregard);
        if (population.length <= 100) {
            displayMatrix(population);
        }

        MetricsService.collect("carrier-count", { carriers });

        if (maxSteps && step === maxSteps) break;

    }
};

module.exports = {
    simulate,
};
