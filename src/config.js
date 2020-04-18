require("dotenv-flow").config();

module.exports = {
    POPULATION_SIZE: parseInt(process.env.POPULATION_SIZE, 10),
    MATRIX_SIDE: Math.sqrt(parseInt(process.env.POPULATION_SIZE, 10)),
    SPREAD_RADIUS: parseInt(process.env.SPREAD_RADIUS, 10),
    MAX_STEPS: parseInt(process.env.MAX_STEPS, 10),
    HYGIENE_DISREGARD: parseFloat(process.env.HYGIENE_DISREGARD),
};
