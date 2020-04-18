require("dotenv-flow").config();

module.exports = {
    POPULATION_SIZE: process.env.POPULATION_SIZE,
    MATRIX_SIDE: Math.sqrt(process.env.POPULATION_SIZE),
    SPREAD_RADIUS: process.env.SPREAD_RADIUS,
    MAX_STEPS: process.env.MAX_STEPS,
    HYGIENE_DISREGARD: process.env.HYGIENE_DISREGARD,
};
