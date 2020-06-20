const isolateZone = (isolatedZones, zone) => {
    isolatedZones[zone].isIsolated = true;
    isolatedZones[zone].isolationUnnecessarySinceStep = -1;
};

const deIsolateZone = (isolatedZones, zone) => {
    isolatedZones[zone].isIsolated = false;
    isolatedZones[zone].isolationUnnecessarySinceStep = -1;
};

const handleSimpleZoneIsolation = (population, confirmedCarriers, isolatedZones, shouldIsolate, onIsolationCriteriaLift) => {
    const carriersPerZone = Array(isolatedZones.length).fill(0);
    confirmedCarriers.forEach((carrierIndex) => carriersPerZone[population[carrierIndex].zone]++);
    carriersPerZone.forEach((numberOfCarriers, index) => {
        if (shouldIsolate(numberOfCarriers, index, carriersPerZone))
            isolateZone(isolatedZones, index);
        else {
            onIsolationCriteriaLift(numberOfCarriers, index);
        }
    });
};

const deIsolateAfterTimeout = (isolatedZones, index, step, zoneIsolationTimeout) => {
    if (isolatedZones[index].isolationUnnecessarySinceStep === -1)
        isolatedZones[index].isolationUnnecessarySinceStep = step;

    if (step - isolatedZones[index].isolationUnnecessarySinceStep >= zoneIsolationTimeout) {
        deIsolateZone(isolatedZones, index);
    }
};

const handleBasicIsolation = ({ population, confirmedCarriers, isolatedZones, zoneIsolationThreshold }) => {
    handleSimpleZoneIsolation(
        population,
        confirmedCarriers,
        isolatedZones,
        (numberOfCarriers) => (numberOfCarriers / (population.length / isolatedZones.length)) > zoneIsolationThreshold,
        (_, index) => {
            deIsolateZone(isolatedZones, index);
        },

    );
};

const handleBasicCautiousIsolation = ({
    population, confirmedCarriers, isolatedZones, zoneIsolationThreshold, step, zoneIsolationTimeout,
}) => {
    handleSimpleZoneIsolation(
        population,
        confirmedCarriers,
        isolatedZones,
        (numberOfCarriers) => (numberOfCarriers / (population.length / isolatedZones.length)) > zoneIsolationThreshold,
        (_, index) => {
            deIsolateAfterTimeout(isolatedZones, index, step, zoneIsolationTimeout);
        },

    );
};

const getAdjacentZones = (zone, nZones) => ([
    zone - matrixSide - 1, // top-left
    zone - matrixSide, // top
    zone - matrixSide + 1, // top-right
    zone + 1, // right
    zone - 1, // left
    zone + matrixSide - 1, // bottom-left
    zone + matrixSide, // bottom
    zone + matrixSide + 1, // bottom-right
]).filter((i) => i >= 0 && i < nZones);

const handleAdvancedCautiousIsolation = ({
    population, confirmedCarriers, isolatedZones, zoneIsolationThreshold, step, zoneIsolationTimeout,
}) => {

    handleSimpleZoneIsolation(
        population,
        confirmedCarriers,
        isolatedZones,
        (numberOfCarriers, index, carriersPerZone) => {
            const adjacentZones = getAdjacentZones(index, isolatedZones.length);

            // If this zone is above threshold or any of the adjacent, isolate
            return (numberOfCarriers / (population.length / isolatedZones.length)) > zoneIsolationThreshold
                || adjacentZones.some((zone) =>
                    carriersPerZone[zone] / (population.length / isolatedZones.length) > zoneIsolationThreshold);
        },
        (_, index) => {
            deIsolateAfterTimeout(isolatedZones, index, step, zoneIsolationTimeout);
        },

    );

};

const handleFullLockdownIsolation = ({
    population, confirmedCarriers, isolatedZones, zoneIsolationThreshold, step, zoneIsolationTimeout,
}) => {
    const carriersPerZone = Array(isolatedZones.length).fill(0);
    confirmedCarriers.forEach((carrierIndex) => carriersPerZone[population[carrierIndex].zone]++);

    if (carriersPerZone.some((numberOfCarriers) => (
        numberOfCarriers / (population.length / isolatedZones.length)) > zoneIsolationThreshold,
    )) {
        // If at least one zone has confirmed carriers above the zoneIsolationThreshold, isolate all
        isolatedZones.forEach((_, i) => {
            isolateZone(isolatedZones, i);
        });
    } else {
        isolatedZones.forEach((_, i) => {
            deIsolateAfterTimeout(isolatedZones, i, step, zoneIsolationTimeout);
        });
    }
};

const ZoneIsolationBehaviors = {
    BASIC: handleBasicIsolation,
    BASIC_CAUTIOUS: handleBasicCautiousIsolation,
    ADVANCED_CAUTIOUS: handleAdvancedCautiousIsolation,
    FULL_LOCKDOWN: handleFullLockdownIsolation,
};

const handleZoneIsolation = (behavior, ...args) => {
    // eslint-disable-next-line no-prototype-builtins
    if (!ZoneIsolationBehaviors.hasOwnProperty(behavior))
        throw new Error(
            `Trying to use unexisting zone isolation behavior - ${behavior}
            Use one of [${Object.keys(ZoneIsolationBehaviors).join(",")}]`,
        );

    return ZoneIsolationBehaviors[behavior](...args);
};
module.exports = {
    handleZoneIsolation,
    ZoneIsolationBehaviors,
};
