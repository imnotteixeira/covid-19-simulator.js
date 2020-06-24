const MetricsService = require("./index");

const { isContaminated } = require("../utils/index");

const countCarriers = (setData) => ({ carriers, dead, populationSize }) => {
    const susceptibleCount = populationSize - dead.length;
    setData((data) => ([...data,
        susceptibleCount === 0 ? 0 : (carriers.length / susceptibleCount),
    ]));
};

const countDead = (setData) => ({ carriers, dead, cured }) => {
    setData((data) => ([...data, dead.length / (carriers.length + dead.length + cured.length)]));
};

const countDeadAbsolute = (setData) => ({ dead }) => {
    setData((data) => ([...data, dead.length]));
};
const countCured = (setData) => ({ carriers, dead, cured }) => {
    setData((data) => ([...data, cured.length / (carriers.length + dead.length + cured.length)]));
};

const countCuredAbsolute = (setData) => ({ cured }) => {
    setData((data) => ([...data, cured.length]));
};

const countHospitalized = (setData) => ({ hospitalized }) => {
    setData((data) => ([...data, hospitalized.length]));
};

const countHealthy = (setData) => ({ populationSize, carriers, dead, cured }) => {
    setData((data) => ([...data, populationSize - (carriers.length + dead.length + cured.length)]));
};

const countQuarantined = (setData) => ({ quarantined, populationSize, dead }) => {
    setData((data) => ([...data, quarantined.length / (populationSize - dead.length)]));
};

const countConfirmedCarriers = (setData) => ({ confirmedCarriers, dead, populationSize }) => {
    setData((data) => ([...data, confirmedCarriers.length / (populationSize - dead.length)]));
};

const countConfirmedCarriersOverInfected = (setData) => ({ confirmedCarriers, carriers }) => {
    setData((data) => ([...data, confirmedCarriers.length / (carriers.length)]));
};

const countTotalTests = (setData) => ({ newTests }) => {
    setData((data) => ([...data, newTests]));
};

const countPositiveTests = (setData) => ({ newPositiveTests }) => {
    setData((data) => ([...data, newPositiveTests]));
};

const updateCarriersHistory = (setData) => ({ population }) => {
    setData((data) => ([...data, population.map((_, i) => isContaminated(population, i) ? 1 : 0)]));
};

const updateValue = (dataField) => (setData) => (input) => {
    setData((data) => ([...data, input[dataField]]));
};

module.exports = () => {
    MetricsService.register("carrier-count", countCarriers, []);
    MetricsService.register("dead-count", countDead, []);
    MetricsService.register("dead-absolute-count", countDeadAbsolute, []);
    MetricsService.register("cured-count", countCured, []);
    MetricsService.register("cured-absolute-count", countCuredAbsolute, []);
    MetricsService.register("hospitalized-count", countHospitalized, []);
    MetricsService.register("healthy-count", countHealthy, []);
    MetricsService.register("r0", updateValue("averageInteractions"), []);
    MetricsService.register("r", updateValue("averageContaminations"), []);
    MetricsService.register("quarantined-count", countQuarantined, []);
    MetricsService.register("positive-test-count", countPositiveTests, []);
    MetricsService.register("total-test-count", countTotalTests, []);
    MetricsService.register("confirmed-carrier-count", countConfirmedCarriers, []);
    MetricsService.register("confirmed-carrier-percentage", countConfirmedCarriersOverInfected, []);
    MetricsService.register("carriers-history", updateCarriersHistory, []);
};
