const { expose } = require("threads/worker");

expose(function getContaminatedIndexes([line, col]) {
    const MATRIX_SIDE = process.env.SIZE || 10;
    const getAffectedCoords = (line, col) => {

        const UP = [line - 1, col];
        const DOWN = [line + 1, col];
        const LEFT = [line, col - 1];
        const RIGHT = [line, col + 1];
        const UP_LEFT = [line - 1, col - 1];
        const UP_RIGHT = [line - 1, col + 1];
        const DOWN_LEFT = [line + 1, col - 1];
        const DOWN_RIGHT = [line + 1, col + 1];

        return [
            UP,
            DOWN,
            LEFT,
            RIGHT,
            UP_LEFT,
            UP_RIGHT,
            DOWN_LEFT,
            DOWN_RIGHT,
        ].filter(([x, y]) => x >= 0 && x < MATRIX_SIDE && y >= 0 && y < MATRIX_SIDE);
    };
    // This can be memoized
    const convertToLinearCoord = ([line, col]) => (line * MATRIX_SIDE) + col;

    const area = getAffectedCoords(line, col);

    // contaminating everyone in the area - to change, must add a randomness condition before calling contaminate
    return area.map(convertToLinearCoord);

});
