const { simulate } = require("./simulation");
const init = require("./init");
const config = require("./config");
const MetricsService = require("./metrics");
const {
    countCarriers,
    countDead,
    countCured,
    countHospitalized,
} = require("./metrics/count");

MetricsService.register("carrier-count", countCarriers, []);
MetricsService.register("dead-count", countDead, []);
MetricsService.register("cured-count", countCured, []);
MetricsService.register("hospitalized-count", countHospitalized, []);

const simulationData = init({
    populationSize: config.POPULATION_SIZE,
    spreadRadius: config.SPREAD_RADIUS,
    hygieneDisregard: config.HYGIENE_DISREGARD,
    hospitalEffectiveness: config.HOSPITAL_EFFECTIVENESS,
    hospitalCapacity: config.HOSPITAL_CAPACITY,
});

simulate(simulationData, config.MAX_STEPS);
MetricsService.print();
console.log("done");
