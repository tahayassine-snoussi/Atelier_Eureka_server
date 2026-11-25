const { Eureka } = require('eureka-js-client');
const app = require('./app');

const PORT = Number(process.env.PORT) || 8083;
const EUREKA_HOST = process.env.EUREKA_HOST || 'localhost';
const EUREKA_PORT = Number(process.env.EUREKA_PORT) || 8761;

const eurekaClient = new Eureka({
    instance: {
        app: 'MEETING',
        instanceId: `meeting:${PORT}`, // unique par instance (indispensable pour en voir plusieurs)
        hostName: 'localhost',
        ipAddr: '127.0.0.1',
        port: { $: PORT, '@enabled': true },
        vipAddress: 'meeting',
        statusPageUrl: `http://localhost:${PORT}/api/meetings/hello`,
        dataCenterInfo: {
            '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
            name: 'MyOwn',
        },
    },
    eureka: {
        host: EUREKA_HOST,
        port: EUREKA_PORT,
        servicePath: '/eureka/apps/',
    },
});

app.listen(PORT, () => {
    console.log(`meeting microservice running on http://localhost:${PORT}`);
    console.log(`Swagger UI: http://localhost:${PORT}/swagger-ui`);

    eurekaClient.start((error) => {
        console.log(error ? `Eureka: échec de l'enregistrement (${error})` : 'Eureka: MEETING enregistré');
    });
});

// Désenregistrement propre à l'arrêt (Ctrl+C)
const shutdown = () => eurekaClient.stop(() => process.exit(0));
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);