const { removeQuarantined } = require("../utils");

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
        for (let i = 0; i < Math.ceil(population.length * quarantinePercentage); i++) {
            let rand = Math.floor(Math.random() * population.length);
            while (quarantined.includes(rand)) {
                rand = Math.floor(Math.random() * population.length);
            }
            startQuarantine(population, quarantined, rand, step);
        }

    } else if (quarantineDelay + quarantinePeriod === step) {
        while (quarantined.length !== 0) {
            stopQuarantine(population, quarantined, quarantined[0]);
        }
    }
};

const handleConfirmedCarriersQuarantine = ({
    population,
    quarantined,
    quarantinePeriod,
    quarantineDelay,
}) => {
    // TODO
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
