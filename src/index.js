const { simulate, simulateStep } = require("./simulation");
const init = require("./init");
const MetricsService = require("./metrics");
const initMetricCollectors = require("./metrics/collectors");
const { IndividualStates } = require("./utils");
const { QuarantineTypes } = require("./disease/quarantine");
const { SimulationPresets } = require("./presets");

// Registers the default metric collectors
initMetricCollectors();

module.exports = {
    init,
    simulate,
    simulateStep,
    MetricsService,
    IndividualStates,
    QuarantineTypes,
    SimulationPresets,
};
