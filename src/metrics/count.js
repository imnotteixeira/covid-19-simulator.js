const countCarriers = (setData) => ({ carriers }) => {
    setData((data) => ([...data, carriers.length]));
};

const countDead = (setData) => ({ dead }) => {
    setData((data) => ([...data, dead.length]));
};

module.exports = {
    countCarriers,
    countDead,
};
