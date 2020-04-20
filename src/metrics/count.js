const countCarriers = (setData) => ({ carriers }) => {
    setData((data) => ([...data, carriers.length]));
};

const countDead = (setData) => ({ dead }) => {
    setData((data) => ([...data, dead.length]));
};

const countCured = (setData) => ({ cured }) => {
    setData((data) => ([...data, cured.length]));
};

module.exports = {
    countCarriers,
    countDead,
    countCured,
};
