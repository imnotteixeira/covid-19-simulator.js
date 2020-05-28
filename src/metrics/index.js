class MetricsService {
    constructor() {
        this.collectors = new Map();
        this.subscribedCollectors = new Set();
        this.metricsData = new Map();
        this.initialMetricsData = new Map();
    }

    register(id, collector, initialData = null) {
        if (this.collectors.has(id)) throw new Error("There is already a collector defined for that metric type");

        const dataSetter = (id) => (fn) => this.metricsData.set(id, fn(this.metricsData.get(id)));

        this.collectors.set(id, collector(dataSetter(id)));
        this.metricsData.set(id, initialData);
        this.initialMetricsData.set(id, initialData);
    }

    collect(payload) {
        for (const collectorId of this.subscribedCollectors) {
            this.collectors.get(collectorId)(payload);
        }
    }

    subscribe(id) {
        if (this.subscribedCollectors.has(id)) throw new Error(`The ${id} metric was already subscribed to.`);
        else if (!this.collectors.has(id)) throw new Error(`Invalid ID. There is no collector registered for metric ${id}`);
        else this.subscribedCollectors.add(id);
    }

    unsubscribe(id) {
        if (!this.collectors.has(id)) throw new Error(`Invalid ID. There is no collector registered for metric ${id}`);

        if (!this.subscribedCollectors.has(id)) {
            console.warn(`The ${id} metric was not subscribed to. Did nothing.`);
            return;
        } else this.subscribedCollectors.delete(id);
    }

    export() {
        const metrics = [];
        this.metricsData.forEach((data, id) => {
            metrics.push({ id, data });
        });
        return metrics;
    }

    clear() {
        this.initialMetricsData.forEach((data, id) => this.metricsData.set(id, data));
    }
}

module.exports = new MetricsService();
