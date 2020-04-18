require("dotenv-flow").config();

module.exports = {
    POPULATION_SIZE: process.env.POPULATION_SIZE,
    SPREAD_RADIUS: process.env.SPREAD_RADIUS,
    MAX_STEPS: process.env.MAX_STEPS,
    MATRIX_SIDE: Math.sqrt(process.env.POPULATION_SIZE),
};
