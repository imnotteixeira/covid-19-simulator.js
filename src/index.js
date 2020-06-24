const { simulate, simulateStep } = require("./simulation");
const init = require("./init");
const MetricsService = require("./metrics");
const initMetricCollectors = require("./metrics/collectors");
const initMetricAnalysers = require("./metrics/analysers");
const { IndividualStates } = require("./utils");
const { SimulationPresets } = require("./presets");
const { QuarantineTypes } = require("./disease/quarantine");
const { ZoneIsolationBehaviors } = require("./disease/zoning");
const { InputSchema } = require("./input");

// Registers the default metric collectors
initMetricCollectors();
initMetricAnalysers();

module.exports = {
    init,
    simulate,
    simulateStep,
    MetricsService,
    IndividualStates,
    QuarantineTypes,
    SimulationPresets,
    ZoneIsolationBehaviors,
    InputSchema,
};
