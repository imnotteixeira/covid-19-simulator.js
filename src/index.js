const { simulate } = require("./simulation");
const init = require("./init");
const config = require("./config");
const MetricsService = require("./metrics");
const countCarriers = require("./metrics/countCarriers");

MetricsService.register("carrier-count", countCarriers, []);

const simulationData = init({
    populationSize: config.POPULATION_SIZE,
    spreadRadius: config.SPREAD_RADIUS,
    hygieneDisregard: config.HYGIENE_DISREGARD,
});

simulate(simulationData, config.MAX_STEPS);
MetricsService.print();
console.log("done");
