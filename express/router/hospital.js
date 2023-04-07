const express = require('express');
const router = express();

const { addHospitalDetails, getHospitalDetails, updateAppointment } = require('../controller/hospital');

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
 * /addHospitalDetails:
 *   post:
 *     summary: Accepts Hospital details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               addHospitalDetails:
 *                 type: json
 *                 description: JSON object of hospital details
 *                 example: JSON
 *     responses:
 *       200:    
 *        description: Success
*/

router.post('/addHospitalDetails', addHospitalDetails);

/**
 * @swagger
 * /hospital/{hospitalId}:
 *   get:
 *     summary: Shows the details of a hospital
 *     parameters:
 *       - in: path
 *         name: hospitalId
 *         description: Enter valid Hospital ID
 *     responses:
 *        200:    
 *          description: Success
*/

router.get('/hospital/:hospitalId', getHospitalDetails);

/**
 * @swagger
 * /updateAppointment:
 *   post:
 *     summary: Accepts Details to update a patient appointment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               updateAppointment:
 *                 type: json
 *                 description: JSON object of appointment details
 *                 example: JSON
 *     responses:
 *       200:    
 *        description: Success
*/

router.post('/updateAppointment', updateAppointment);

module.exports = router;