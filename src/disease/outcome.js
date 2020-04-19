const {
    IndividualStates,
    isContaminated,
} = require("../utils");

const kill = (population, i, dead) => {
    population[i].state = IndividualStates.DEAD;
    dead.push(i);
    return population;
};

const calculateOutcomes = (population, carriers, dead) => {
    population.forEach((individual, i) => {
        if (isContaminated(population, i)) {
            const dieRandom = Math.random();
            if (dieRandom < individual.deathProbabilityFn(individual.daysSinceTransmission)) {
                kill(population, i, dead);
                for (let c = 0; c < carriers.length; c++) {
                    if (carriers[c] === i) {
                        carriers.splice(c, 1);
                    }
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
