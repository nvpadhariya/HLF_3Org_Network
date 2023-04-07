const express = require('express');
const router = express();

const { addPatientDetails, getPatientDetails, createAppointment } = require('../controller/patient');

router.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin,X-Requested-With,Content-Type,Accept,Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
    next();
})

/**
 * @swagger
 * /addPatientDetails:
 *   post:
 *     summary: Accepts Patient details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               addPatientDetails:
 *                 type: json
 *                 description: JSON object of patient details
 *                 example: JSON
 *     responses:
 *       200:    
 *        description: Success
*/

router.post('/addPatientDetails', addPatientDetails);

/**
 * @swagger
 * /patients/{patientId}:
 *   get:
 *     summary: Shows the details of a Patient
 *     parameters:
 *       - in: path
 *         name: patientId
 *         description: Enter valid Patient ID
 *     responses:
 *        200:    
 *          description: Success
*/

router.get('/patients/:patientId', getPatientDetails);

/**
 * @swagger
 * /createAppointment:
 *   post:
 *     summary: Creates an appointment for a valid patient.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patientId:
 *                 type: string
 *                 description: Enter valid Patient ID
 *                 example: P-123
 *     responses:
 *       200:    
 *        description: Success
*/

router.post('/createAppointment', createAppointment);

module.exports = router;