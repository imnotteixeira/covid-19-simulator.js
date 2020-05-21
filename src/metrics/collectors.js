const {
    countCarriers,
    countDead,
    countCured,
    countHospitalized,
    countHealthy,
} = require("./count");

const MetricsService = require("./index");

module.exports = () => {
    MetricsService.register("carrier-count", countCarriers, []);
    MetricsService.register("dead-count", countDead, []);
    MetricsService.register("cured-count", countCured, []);
    MetricsService.register("hospitalized-count", countHospitalized, []);
    MetricsService.register("healthy-count", countHealthy, []);
};
