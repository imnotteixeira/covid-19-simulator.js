const {
    IndividualStates,
    isContaminated,
    isHospitalized,
    removeCarrier,
    removeHospitalized,
} = require("../utils");


const kill = (population, i, dead, hospitalized) => {
    population[i].state = IndividualStates.DEAD;
    dead.push(i);
    if (isHospitalized(population, i))
        leaveHospital(population, i, hospitalized);
    return population;
};
const cure = (population, i, cured, hospitalized) => {
    population[i].state = IndividualStates.CURED;
    cured.push(i);
    if (isHospitalized(population, i))
        leaveHospital(population, i, hospitalized);
    return population;
};

const leaveHospital = (population, i, hospitalized) => {
    removeHospitalized(hospitalized, i);
    population[i].isHospitalized = false;
};

const calculateOutcomes = (population, carriers, dead, cured, hospitalized, hospitalEffectiveness) => {
    population.forEach((individual, i) => {
        if (isContaminated(population, i)) {

            let deathProbability = individual.deathProbabilityFn(individual.daysSinceTransmission);
            if (isHospitalized(population, i)) deathProbability *= hospitalEffectiveness;

            const dieRandom = Math.random();
            if (dieRandom < deathProbability) {
                kill(population, i, dead, hospitalized);
                removeCarrier(carriers, i);
            } else {
                const cureRandom = Math.random();
                if (cureRandom < individual.cureProbabilityFn(individual.daysSinceTransmission)) {
                    cure(population, i, cured, hospitalized);
                    removeCarrier(carriers, i);
                }
            }
        }
    });
};

const updateCarriersDetails = (population, carriers) => {
    carriers.forEach((c) => {
        const individual = population[c];
        individual.deathProbability = individual.deathProbabilityFn(individual.daysSinceTransmission);
        individual.daysSinceTransmission++;
    });
};

module.exports = {
    calculateOutcomes,
    updateCarriersDetails,
    kill,
};
