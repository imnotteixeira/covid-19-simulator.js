const { isHospitalized, IndividualStates } = require("../utils");

// One way of optimizing this is inserting the carriers already sorted by deathProbability,
// so that we can choose the first n = hospitalCapacity
const hospitalize = (population, carriers, hospitalized, hospitalCapacity, incubationPeriod) => {
    const availableSpots = hospitalCapacity - hospitalized.length;

    carriers
        .filter((carrier) =>
            carrier.state === IndividualStates.CONFIRMED_CARRIER ||
            population[carrier].daysSinceTransmission >= incubationPeriod,
        )
        .sort((carrierA, carrierB) => {
            if (population[carrierA].state === IndividualStates.CONFIRMED_CARRIER
                && population[carrierB].state === IndividualStates.CARRIER) return 1;
            else if (population[carrierA].state === IndividualStates.CARRIER
                && population[carrierB].state === IndividualStates.CONFIRMED_CARRIER) return -1;
            else if (population[carrierA].deathProbability < population[carrierB].deathProbability) return -1;
            else if (population[carrierA].deathProbability === population[carrierB].deathProbability) return 0;
            else return 1;
        })
        .slice(0, availableSpots)
        .forEach((carrier) => {
            if (!isHospitalized(population, carrier)) {
                population[carrier].isHospitalized = true;
                hospitalized.push(carrier);
            }
        });
};

module.exports = { hospitalize };
