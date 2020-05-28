const {
    countCarriers,
    countDead,
    countCured,
    countHospitalized,
    countHealthy,
    countQuarantined,
    countConfirmedCarriers,
    countTotalTests,
    countPositiveTests,
} = require("./count");
const { updateValue } = require("./update");

const MetricsService = require("./index");

console.log("lfdakfsldfddf", updateValue("averageInteractions"));

module.exports = () => {
    MetricsService.register("carrier-count", countCarriers, []);
    MetricsService.register("dead-count", countDead, []);
    MetricsService.register("cured-count", countCured, []);
    MetricsService.register("hospitalized-count", countHospitalized, []);
    MetricsService.register("healthy-count", countHealthy, []);
    MetricsService.register("r0", updateValue("averageInteractions"), []);
    MetricsService.register("r", updateValue("averageContaminations"), []);
    MetricsService.register("quarantined-count", countQuarantined, []);
    MetricsService.register("positive-test-count", countPositiveTests, []);
    MetricsService.register("total-test-count", countTotalTests, []);
    MetricsService.register("confirmed-carrier-count", countConfirmedCarriers, []);
};
