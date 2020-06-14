const { pickNRandomIndices, IndividualStates } = require("../utils");

const canBeTested = (cooldown) => (person) =>
    !person.isDummy
    && person.state !== IndividualStates.CONFIRMED_CARRIER
    && person.state !== IndividualStates.DEAD
    && person.state !== IndividualStates.CURED
    && !person.isHospitalized
    && (person.lastTestedOnDay === -1 || person.lastTestedOnDay > cooldown);

const test = (population, confirmedCarriers, testRate, testCooldown, step) => {
    const tests = pickNRandomIndices(
        population,
        testRate,
        canBeTested(testCooldown),
    ).map(
        (pickedIndex) => testPerson(population, pickedIndex, confirmedCarriers, step),
    );
    return {
        newTests: tests.length,
        newPositiveTests: tests.filter((isPositive) => isPositive).length,
    };
};

const testPerson = (population, personIndex, confirmedCarriers, step) => {
    const person = population[personIndex];
    person.lastTestedOnDay = step;
    if (person.state === IndividualStates.CARRIER) {
        person.state = IndividualStates.CONFIRMED_CARRIER;
        confirmedCarriers.push(personIndex);
        return true;
    }
    return false;
};

module.exports = { test };
