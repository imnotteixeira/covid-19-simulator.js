const handleZoneIsolation = (population, confirmedCarriers, isolatedZones, threshold) => {
    const carriersPerZone = Array(isolatedZones.length).fill(0);
    confirmedCarriers.forEach((carrierIndex) => carriersPerZone[population[carrierIndex].zone]++);
    carriersPerZone.forEach((numberOfCarriers, index) => {
        isolatedZones[index] = (numberOfCarriers / (population.length / isolatedZones.length)) > threshold;
    });
};
module.exports = { handleZoneIsolation };
