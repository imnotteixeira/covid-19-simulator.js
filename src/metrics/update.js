const updateValue = (dataField) => (setData) => (input) => {
    setData((data) => ([...data, input[dataField]]));
};


module.exports = {
    updateValue,
};
