class MetricsService {
    constructor() {
        this.collectors = new Map();
        this.metricsAnalysers = new Map();
        this.subscribed = new Set();
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

    registerMetricAnalyser(id, analyser, initialData = null) {
        if (this.metricsAnalysers.has(id)) throw new Error("There is already an analyser defined for that metric type");

        const dataSetter = (id) => (fn) => this.metricsData.set(id, fn(this.metricsData.get(id)));

        this.metricsAnalysers.set(id, analyser(dataSetter(id)));
        this.metricsData.set(id, initialData);
        this.initialMetricsData.set(id, initialData);
    }

    collect(payload) {
        this.collectors.forEach((callback, metricId) => {
            if (this.subscribed.has(metricId))
                callback(payload);
        });
    }

    afterExecutionCollect(payload) {
        this.metricsAnalysers.forEach((callback, metricId) => {
            if (this.subscribed.has(metricId))
                callback(payload, this.metricsData);
        });
    }

    subscribe(id) {
        if (this.subscribed.has(id)) throw new Error(`The ${id} metric was already subscribed to.`);
        else if (!this.collectors.has(id) && !this.metricsAnalysers.has(id)) throw new Error(`Invalid ID. There is no collector/metric analyser registered for metric ${id}`);
        else this.subscribed.add(id);
    }

    unsubscribe(id) {
        if (!this.collectors.has(id)) throw new Error(`Invalid ID. There is no collector registered for metric ${id}`);

        if (!this.subscribed.has(id)) {
            console.warn(`The ${id} metric was not subscribed to. Did nothing.`);
            return;
        } else this.subscribed.delete(id);
    }

    export() {
        const metrics = {};
        this.metricsData.forEach((data, id) => {
            if (this.subscribed.has(id))
                metrics[id] = data;
        });
        return metrics;
    }

    clear() {
        this.initialMetricsData.forEach((data, id) => this.metricsData.set(id, data));
    }
}

module.exports = new MetricsService();
