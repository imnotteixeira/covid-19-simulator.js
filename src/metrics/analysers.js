const MetricsService = require("./index");

const analyseCarrierPeakPercentage = (setData) => (payload, metricData) => {
    setData(() => Math.max(...metricData.get("carrier-count")));
};

const analyseCarrierPeakTime = (setData) => (payload, metricData) => {
    setData(() => metricData.get("carrier-count").indexOf(
        Math.max(...metricData.get("carrier-count"))),
    );
};

const analyseTotalInfectedCount = (setData) => ({ carriers, dead, cured }) => {
    setData(() => carriers.length + dead.length + cured.length);
};

const analyseTotalInfectedPercentage = (setData) => ({ carriers, dead, cured, populationSize }) => {
    setData(() => (carriers.length + dead.length + cured.length) / populationSize);
};

const analysePopulationSusceptibility = (setData) => ({ population, populationSize }) => {
    setData(() => population.reduce(
        (acc, individual) =>
            acc + (individual.isDummy ? 0 : individual.susceptibility)
        , 0)
        / populationSize,
    );
};

module.exports = () => {
    MetricsService.registerMetricAnalyser("carrier-peak-percentage", analyseCarrierPeakPercentage, []);
    MetricsService.registerMetricAnalyser("carrier-peak-time", analyseCarrierPeakTime, []);
    MetricsService.registerMetricAnalyser("total-infected-count", analyseTotalInfectedCount, []);
    MetricsService.registerMetricAnalyser("total-infected-percentage", analyseTotalInfectedPercentage, []);
    MetricsService.registerMetricAnalyser("average-population-susceptibility", analysePopulationSusceptibility, []);

};
