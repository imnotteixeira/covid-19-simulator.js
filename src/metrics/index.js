class MetricsService {
    constructor() {
        this.collectors = new Map();
        this.metricsData = new Map();
    }


    register(id, collector, initialData = null) {
        if (this.collectors.has(id)) throw new Error("There is already a collector defined for that metric type");

        const dataSetter = (id) => (fn) => this.metricsData.set(id, fn(this.metricsData.get(id)));

        this.collectors.set(id, collector(dataSetter(id)));
        this.metricsData.set(id, initialData);
    }

    collect(id, payload) {
        // eslint-disable-next-line no-prototype-builtins
        if (!this.collectors.has(id)) throw new Error(
            `There is no collector registered for ${id} metric type. 
            Please call register() on setup to register a collector for this metric type`,
        );

        this.collectors.get(id)(payload);
    }

    print() {
        this.metricsData.forEach((data, id) => console.info(`[${id}] ${data}`));
    }
}

module.exports = new MetricsService();
