const { simulate } = require("./simulation");
const init = require("./init");
const config = require("./config");
const MetricsService = require("./metrics");
const { countCarriers, countDead, countCured } = require("./metrics/count");

MetricsService.register("carrier-count", countCarriers, []);
MetricsService.register("dead-count", countDead, []);
MetricsService.register("cured-count", countCured, []);

const simulationData = init({
    populationSize: config.POPULATION_SIZE,
    spreadRadius: config.SPREAD_RADIUS,
    hygieneDisregard: config.HYGIENE_DISREGARD,
});

simulate(simulationData, config.MAX_STEPS);
MetricsService.print();
console.log("done");
