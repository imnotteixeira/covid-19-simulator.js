const countCarriers = (setData) => ({ carriers }) => {
    setData((data) => ([...data, carriers.length]));
};

const countDead = (setData) => ({ dead }) => {
    setData((data) => ([...data, dead.length]));
};

const countCured = (setData) => ({ cured }) => {
    setData((data) => ([...data, cured.length]));
};

const countHospitalized = (setData) => ({ hospitalized }) => {
    setData((data) => ([...data, hospitalized.length]));
};

const countHealthy = (setData) => ({ population, carriers, dead, cured }) => {
    setData((data) => ([...data, population.length - (carriers.length + dead.length + cured.length)]));
};

const countQuarantined = (setData) => ({ quarantined }) => {
    setData((data) => ([...data, quarantined.length]));
};

const countConfirmedCarriers = (setData) => ({ confirmedCarriers }) => {
    setData((data) => ([...data, confirmedCarriers.length]));
};

const countTotalTests = (setData) => ({ newTests }) => {
    setData((data) => ([...data, newTests]));
};

const countPositiveTests = (setData) => ({ newPositiveTests }) => {
    setData((data) => ([...data, newPositiveTests]));
};

module.exports = {
    countCarriers,
    countDead,
    countCured,
    countHospitalized,
    countHealthy,
    countQuarantined,
    countConfirmedCarriers,
    countTotalTests,
    countPositiveTests,
};
