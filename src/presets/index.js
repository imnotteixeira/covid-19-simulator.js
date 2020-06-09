const SPAIN = require("./population/SpainPreset");
const ITALY = require("./population/ItalyPreset");
const GERMANY = require("./population/GermanyPreset");

const CONTROL = require("./simulation/ControlPreset");
const GOOD_HYGIENE = require("./simulation/GoodHygienePreset");
const RELAXED_QUARANTINE = require("./simulation/RelaxedQuarantinePreset");
const STRICT_QUARANTINE = require("./simulation/RelaxedQuarantinePreset");
const CARRIERS_QUARANTINE = require("./simulation/RelaxedQuarantinePreset");


/**
 * simulation preset structure
 * {
 *  populationSize: *number*, in N and > 9, such that sqrt(populationSize) in N,
 *  hospitalEffectiveness: *number*, in [0, 1]
 *  hygieneDisregard: *number*, in [0, 1] | default 1
 *  hospitalCapacity: *number* , in [0, 1]
 *  incubationPeriod: *number*, in [0, 50] and in N | default 6
 *  infectionPeriod: *number*, in [2, 100] and in N | default 41
 *  spreadRadius: *number*, in [2, sqrt(populationSize)] | default 1
 *  testRate: *number*, in [0, 1] | default 0
 *  testCooldown: *number* in [1, 100] and in N | default 7
 *  quarantineType: *number* in [NONE, FIXED_PERCENTAGE, CONFIRMED_CARRIERS_ONLY],
 *  quarantineEffectiveness: *number*, in [0, 1]
 *  quarantinePercentage: (optional) *number*, in [0, 1]
 *  quarantineDelay: *number*, in [0, 50] and in N,
 *  quarantinePeriod: *number*, in [0, 50] and in N,
 *  populationPreset, *number*, in [0, 1, 2]
 * }
 *
 */
const SimulationPresets = Object.freeze({
    CONTROL,
    GOOD_HYGIENE,
    RELAXED_QUARANTINE,
    STRICT_QUARANTINE,
    CARRIERS_QUARANTINE,
});

/**
 * population preset structure
 * {
 *  size: *number*,
 *  susceptibilityDistibution: {percentage*number*:susceptibility*number*},
 *  label: *string*,
 * }
 *
 */
const PopulationPresets = Object.freeze({ SPAIN, ITALY, GERMANY });

module.exports = {
    SimulationPresets,
    PopulationPresets,
};
