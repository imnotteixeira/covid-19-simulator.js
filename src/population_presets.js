/**
 * population preset structure
 * {
 *  size: *number*,
 *  susceptibilityDistibution: {percentage*number*:susceptibility*number*},
 *  label: *string*,
 * }
 *
 */

const GERMANY_PRESET = Object.freeze({
    size: 8300161,
    susceptibilityDistibution: {
        0.7355: 0.0016,
        0.212: 0.0401,
        0.0525: 0.1531,
    },
    label: "Germany",
});

const SPAIN_PRESET = Object.freeze({
    size: 4700224,
    susceptibilityDistibution: {
        0.0928: 0.003,
        0.1037: 0.001,
        0.1029: 0.003,
        0.1309: 0.003,
        0.1659: 0.006,
        0.1481: 0.012,
        0.1121: 0.044,
        0.0828: 0.138,
        0.049: 0.237,
        0.0117: 0.256,
    },
    label: "Spain",
});

const ITALY_PRESET = Object.freeze({
    size: 6002500,
    susceptibilityDistibution: {
        0.0843: 0.001,
        0.0956: 0,
        0.1027: 0.001,
        0.1172: 0.003,
        0.1531: 0.009,
        0.1549: 0.025,
        0.1216: 0.095,
        0.0988: 0.24,
        0.0589: 0.305,
        0.0128: 0.252,
    },
    label: "Italy",
});

module.exports = [
    GERMANY_PRESET,
    SPAIN_PRESET,
    ITALY_PRESET,
];
