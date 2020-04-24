const {
    countCarriers,
    countDead,
    countCured,
    countHospitalized,
} = require("./count");

const MetricsService = require("./index");

MetricsService.register("carrier-count", countCarriers, []);
MetricsService.register("dead-count", countDead, []);
MetricsService.register("cured-count", countCured, []);
MetricsService.register("hospitalized-count", countHospitalized, []);
