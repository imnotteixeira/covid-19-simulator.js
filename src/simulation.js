const { propagateDisease, isContaminated } = require("./disease/transmission");
const { displayMatrix } = require("./utils");
const MetricsService = require("./metrics");

const simulate = (simulation, maxSteps) => {
    const {
        population,
        carriers,
        spreadRadius,
    } = simulation;

    let step = 0;
    if (population.length <= 100) {
        displayMatrix(population);
    } else {
        console.info("Population too big to render");
    }
    MetricsService.collect("carrier-count", { carriers });
    while ((maxSteps && step < maxSteps) || (!maxSteps && !population.every((_, i) => isContaminated(population, i)))) {


        step++;
        propagateDisease(population, carriers, spreadRadius);
        if (population.length <= 100) {
            displayMatrix(population);
        } else {
            console.info("Population too big to render");
        }

        MetricsService.collect("carrier-count", { carriers });

    }
};

module.exports = {
    simulate,
};
