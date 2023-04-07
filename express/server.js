const express = require('express');
const bodyParser = require('body-parser');
const { logger } = require('./middleware/logger');

const app = express();
app.use(bodyParser.json());

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
    openapi: '3.0.1',
    info: {
        title: 'Health Network',
        version: '1.0.0',
        description: 'Health-network APIs',
    },
    servers: [
        {
            url: "http://localhost:3000",
            description: 'Localhost',
        }
    ],
};

const options = {
    swaggerDefinition,
    apis: ['./router/patient.js', './router/hospital.js', './router/pharmacy.js'],
};

const swaggerSpec = swaggerJSDoc(options);
app.use('/healthnetwork', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/", require("./router/patient"), require("./router/hospital"), require("./router/pharmacy"));

app.listen(3000, () => {
    logger.info(`Server started on port 3000`);
});