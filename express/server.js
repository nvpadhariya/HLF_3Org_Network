const express = require('express');
const bodyParser = require('body-parser');
const { logger } = require('./logger');

const app = express();
app.use(bodyParser.json());

app.use("/", require("./router/hospital"));
app.use("/", require("./router/patient"));
app.use("/", require("./router/pharmacy"));

app.listen(3000, () => {
    logger.info(`Server started on port 3000`);
});