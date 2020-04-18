const { simulate } = require("./simulation");
const init = require("./init");
const config = require("./config");

const simulationData = init({
    populationSize: config.POPULATION_SIZE,
    spreadRadius: config.SPREAD_RADIUS,
});

simulate(simulationData, config.MAX_STEPS);
console.log("done");
