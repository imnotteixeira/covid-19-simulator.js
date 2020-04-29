const { propagateDisease, isContaminated } = require("./disease/transmission");
const { calculateOutcomes, updateCarriersDetails } = require("./disease/outcome");
const { hospitalize } = require("./disease/hospitalize");
const { displayMatrix } = require("./utils");
const MetricsService = require("./metrics");

const simulate = (simulation, maxSteps, hooks) => {
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
    } = simulation;

    const {
        stepEnd = () => {},
    } = hooks;

    console.info(`Simulating${maxSteps ? ` with max steps = ${maxSteps}` : ""}...`);

    let step = 0;

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

        hospitalize(population, carriers, hospitalized, hospitalCapacity, incubationPeriod);


        MetricsService.collect("carrier-count", { carriers });
        MetricsService.collect("dead-count", { dead });
        MetricsService.collect("cured-count", { cured });
        MetricsService.collect("hospitalized-count", { hospitalized });

        stepEnd({
            ...simulation,
            step,
        });


        if (maxSteps && step === maxSteps) {
            console.warn(`Maximum steps reached (${maxSteps}), Stopping simulation...`);
            break;
        }

    }
};

module.exports = {
    simulate,
};
