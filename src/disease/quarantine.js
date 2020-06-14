const { removeQuarantined, pickNRandomIndices, IndividualStates } = require("../utils");

const QuarantineTypes = Object.freeze({
    NONE: "NONE",
    FIXED_PERCENTAGE: "FIXED_PERCENTAGE",
    CONFIRMED_CARRIERS_ONLY: "CONFIRMED_CARRIERS_ONLY",
});

const handleQuarantine = (
    quarantineHandlerInput,
) => {

    const { quarantineType } = quarantineHandlerInput;

    switch (quarantineType) {
        case QuarantineTypes.FIXED_PERCENTAGE:
            handleFixedQuarantine(quarantineHandlerInput);
            break;
        case QuarantineTypes.CONFIRMED_CARRIERS_ONLY:
            handleConfirmedCarriersQuarantine(quarantineHandlerInput);
            break;
        default:
            // No Quarantine
            break;
    }

};

const canEnterQuarantine = (person) =>
    !person.isDummy
    && person.state !== IndividualStates.DEAD
    && person.state !== IndividualStates.CURED
    && !person.isQuarantined
    && !person.isHospitalized;

const handleFixedQuarantine = ({
    step,
    population,
    quarantined,
    quarantinePeriod,
    quarantineDelay,
    quarantinePercentage,
}) => {
    if (step < quarantineDelay) return;

    if (step === quarantineDelay) {
        pickNRandomIndices(population, Math.ceil(population.length * quarantinePercentage), canEnterQuarantine)
            .forEach((idx) => startQuarantine(population, quarantined, idx, step));
    } else if (quarantineDelay + quarantinePeriod === step) {
        while (quarantined.length !== 0) {
            stopQuarantine(population, quarantined, quarantined[0]);
        }
    }
};

const handleConfirmedCarriersQuarantine = ({
    population,
    quarantined,
    confirmedCarriers,
}) => {
    // They will stay quarantined as long as they are confirmed carriers,
    // therefore the arrays will always have the same elements

    // Clear quarantined
    quarantined.splice(0);

    confirmedCarriers.slice().forEach((i) => quarantined.push(i));

    for (const quarantinedIdx of quarantined) {
        population[quarantinedIdx].isQuarantined = true;
    }
};


const startQuarantine = (population, quarantined, individual, startStep) => {
    quarantined.push(individual);
    population[individual].isQuarantined = true;
    population[individual].quarantineStart = startStep;
};

const stopQuarantine = (population, quarantined, individual) => {
    removeQuarantined(quarantined, individual);
    population[individual].isQuarantined = false;
    population[individual].quarantineStart = -1;
};


module.exports = {
    QuarantineTypes,
    handleQuarantine,
};
