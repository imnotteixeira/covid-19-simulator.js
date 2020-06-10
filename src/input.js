/* eslint-disable no-template-curly-in-string */
const yup = require("yup");
const { PopulationPresets } = require("./presets");
const { QuarantineTypes } = require("./disease/quarantine");

const InputSchema = yup.object().shape({
    populationSize: yup.number()
        .positive()
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
    quarantinePeriod: yup.number()
        .min(1),
    quarantineDelay: yup.number()
        .min(1),
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
});


const validateInput = (input) => InputSchema.validateSync(input);


module.exports = {
    validateInput,
    InputSchema,
};
