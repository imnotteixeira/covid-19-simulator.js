const { isHospitalized } = require("../utils");
const config = require("../config");

// One way of optimizing this is inserting the carriers already sorted by deathProbability,
// so that we can choose the first n = hospitalCapacity
const hospitalize = (population, carriers, hospitalized, hospitalCapacity) => {
    const availableSpots = hospitalCapacity - hospitalized.length;

    carriers
        .filter((carrier) => population[carrier].daysSinceTransmission >= config.INCUBATION_PERIOD)
        .sort((carrierA, carrierB) => {
            if (population[carrierA].deathProbability < population[carrierB].deathProbability) return -1;
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
