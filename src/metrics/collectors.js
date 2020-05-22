const {
    countCarriers,
    countDead,
    countCured,
    countHospitalized,
    countHealthy,
} = require("./count");
const { updateValue } = require("./update");

const MetricsService = require("./index");

module.exports = () => {
    MetricsService.register("carrier-count", countCarriers, []);
    MetricsService.register("dead-count", countDead, []);
    MetricsService.register("cured-count", countCured, []);
    MetricsService.register("hospitalized-count", countHospitalized, []);
    MetricsService.register("healthy-count", countHealthy, []);
    MetricsService.register("r0", updateValue("averageInteractions"), []);
    MetricsService.register("r", updateValue("averageContaminations"), []);
};
