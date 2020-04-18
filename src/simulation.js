const { propagateDisease, isContaminated } = require("./disease/transmission");
const { displayMatrix } = require("./utils");

const simulate = (simulation, maxSteps) => {
    const {
        population,
        carriers,
        spreadRadius,
    } = simulation;

    let step = 0;
    console.log(step, carriers.length);
    if (population.length <= 100) {
        displayMatrix(population);
    } else {
        console.log("Population too big to render");
    }
    while ((maxSteps && step < maxSteps) || (!maxSteps && !population.every((_, i) => isContaminated(population, i)))) {

        step++;
        propagateDisease(population, carriers, spreadRadius);
        console.log(step, carriers.length);
        if (population.length <= 100) {
            displayMatrix(population);
        } else {
            console.log("Population too big to render");
        }
    }
};

module.exports = {
    simulate,
};
