module.exports = (setData) => ({ carriers }) => {
    setData((data) => ([...data, carriers.length]));
};
