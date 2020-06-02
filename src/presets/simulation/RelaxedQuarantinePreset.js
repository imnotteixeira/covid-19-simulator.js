const CONTROL_PRESET = require("./ControlPreset");

module.exports = {
    ...CONTROL_PRESET,
    quarantineType: "FIXED_PERCENTAGE",
    quarantinePercentage: 0.1,
    label: "Relaxed Quarantine Measures",
};
