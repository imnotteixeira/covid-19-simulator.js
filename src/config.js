require("dotenv-flow").config();

module.exports = {
    POPULATION_SIZE: parseInt(process.env.POPULATION_SIZE, 10),
    MATRIX_SIDE: Math.sqrt(parseInt(process.env.POPULATION_SIZE, 10)),
    SPREAD_RADIUS: parseInt(process.env.SPREAD_RADIUS, 10),
    MAX_STEPS: parseInt(process.env.MAX_STEPS, 10),
    HYGIENE_DISREGARD: parseFloat(process.env.HYGIENE_DISREGARD),
    HOSPITAL_CAPACITY: parseInt(process.env.HOSPITAL_CAPACITY, 10),
    HOSPITAL_EFFECTIVENESS: parseFloat(process.env.HOSPITAL_EFFECTIVENESS),
    INCUBATION_PERIOD: parseInt(process.env.INCUBATION_PERIOD, 10),
    INFECTION_PERIOD: parseInt(process.env.INFECTION_PERIOD, 10),
};
