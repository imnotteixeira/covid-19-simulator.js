/* eslint-disable no-template-curly-in-string */
const yup = require("yup");
const { PopulationPresets } = require("./presets");
const { QuarantineTypes } = require("./disease/quarantine");
const { ZoneIsolationBehaviors } = require("./disease/zoning");

const InputSchema = yup.object().shape({
    populationSize: yup.number()
        .min(9)
        .test({
            name: "perfect-square",
            message: "${path} must be a perfect square",
            test: (value) => Math.sqrt(value) % 1 === 0,
        }),
    hygieneDisregard: yup.number()
        .min(0)
        .max(1),
    spreadRadius: yup.number()
        .min(1),
    initialCarriers: yup.array()
        .of(
            yup.number()
                .min(0)
                .max(yup.ref("populationSize") - 1),
        )
        .min(1),
    hospitalCapacity: yup.number()
        .min(0),
    hospitalEffectiveness: yup.number()
        .min(0)
        .max(1),
    incubationPeriod: yup.number()
        .min(1),
    infectionPeriod: yup.number()
        .moreThan(yup.ref("incubationPeriod"), "${path} must be greater than incubationPeriod (${more} days)"),
    populationPreset: yup.string()
        .oneOf(Object.keys(PopulationPresets)),
    // QUARANTINE
    quarantineEffectiveness: yup.number()
        .min(0)
        .max(1),
    quarantinePeriod: yup.number().when("quarantineType", {
        is: QuarantineTypes.FIXED_PERCENTAGE,
        then: yup.number().min(1),
        otherwise: yup.number().notRequired(),
    }),
    quarantineDelay: yup.number().when("quarantineType", {
        is: QuarantineTypes.NONE,
        then: yup.number().notRequired(),
        otherwise: yup.number().min(1),
    }),
    quarantineType: yup.string()
        .oneOf(Object.keys(QuarantineTypes)),
    quarantinePercentage: yup.number()
        .min(0)
        .max(1)
        .when("$quarantineType", (quarantineType, schema) =>
            (quarantineType === QuarantineTypes.FIXED_PERCENTAGE ? schema.required() : schema)),

    // TEST
    testRate: yup.number()
        .min(0)
        .lessThan(yup.ref("populationSize"), "${path} must be less than populationSize (${less})"),
    testCooldown: yup.number()
        .min(0),

    // ZONING
    numberOfZones: yup.number()
        .min(1)
        .test({
            name: "perfect-square",
            message: "${path} must be a perfect square",
            test: (value) => Math.sqrt(value) % 1 === 0,
        })
        .test({
            name: "fits-population",
            message: "sqrt(populationSize) must be divisible by sqrt(${path})",
            test: function(value) {
                return Math.sqrt(this.resolve(yup.ref("populationSize"))) % Math.sqrt(value) === 0;
            },
        }),
    zoneIsolationThreshold: yup.number()
        .min(0)
        .max(1),
    zoneIsolationTimeout: yup.number()
        .integer()
        .min(0),
    zoneIsolationBehavior: yup.string()
        .oneOf(Object.keys(ZoneIsolationBehaviors)),

    // POPULATION_DENSITY
    populationDensity: yup.number()
        .min(0)
        .max(1),
    disabledIndividualsMatrix: yup.array(yup.boolean())
        .test({
            name: "disabled-individuals-size",
            message: "${path}'s length must be populationSize",
            test: function(value) {
                return !value
                    || value.length === this.resolve(yup.ref("populationSize").length);
            },
        }),
});


const validateInput = (input) => InputSchema.validateSync(input);


module.exports = {
    validateInput,
    InputSchema,
};
