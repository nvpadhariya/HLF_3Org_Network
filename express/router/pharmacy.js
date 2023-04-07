const express = require('express');
const router = express();

const { addPharmacyDetails, getPharmacyDetails } = require('../controller/pharmacy');

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
 * /addPharmacyDetails:
 *   post:
 *     summary: Accepts Pharmacy details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               addPharmacyDetails:
 *                 type: json
 *                 description: JSON object of pharmacy details
 *                 example: JSON
 *     responses:
 *       200:    
 *        description: Success
*/

router.post('/addPharmacyDetails', addPharmacyDetails);

/**
 * @swagger
 * /pharmacy/{pharmacyId}:
 *   get:
 *     summary: Shows the details of a Pharmacy
 *     parameters:
 *       - in: path
 *         name: hospitalId
 *         description: Enter valid Pharmacy ID
 *     responses:
 *        200:    
 *          description: Success
*/

router.get('/pharmacy/:pharmacyId', getPharmacyDetails);

module.exports = router;