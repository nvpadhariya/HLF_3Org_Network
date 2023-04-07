const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const { StatusCodes } = require('http-status-codes');
const { mspOrg3, ccpOrg3, walletPathOrg3 } = require('../config/config')
const { buildCAClient, registerAndEnrollUser } = require('../CAUtil.js');
const { buildCCPOrg3, buildWallet } = require('../AppUtil.js');
const { Invoke } = require('../invoke');
const { Query } = require('../query');
const { validatePharmacy } = require('../middleware/validation');
const { logger } = require('../middleware/logger');

const addPharmacyDetails = async (req, res) => {
    try {
        let pharmacyDetails = req.body;
        let parsePharmacyDetails = JSON.stringify(pharmacyDetails);
        await validatePharmacy(pharmacyDetails);
        const wallet = await Wallets.newFileSystemWallet(walletPathOrg3);
        let getPharmacyWallet = await wallet.get(pharmacyDetails.pharmacyId);
        if (getPharmacyWallet) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: `Pharmacy ${pharmacyDetails.pharmacyId} already exists` });
            logger.error(`Pharmacy ${pharmacyDetails.pharmacyId} already exists`);
        }
        else {
            const buildCcpForOrg3 = buildCCPOrg3();
            const caOrg3Client = buildCAClient(FabricCAServices, buildCcpForOrg3, 'ca.org3');
            const walletOrg3 = await buildWallet(Wallets, walletPathOrg3);
            await registerAndEnrollUser(caOrg3Client, walletOrg3, mspOrg3, pharmacyDetails.pharmacyId, 'org3.department1');

            let args = [parsePharmacyDetails];
            let result = await Invoke("addPharmacyDetails", args, pharmacyDetails.pharmacyId, ccpOrg3, walletPathOrg3);

            if (result) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).end({ result: result.responses[0].response.message });
                logger.error(`Error adding pharmacy details: ${result.responses[0].response.message}`);
            }
            else {
                res.status(StatusCodes.OK).send({ message: `Pharmacy ${pharmacyDetails.pharmacyId} created successfully` });
                logger.info(`Pharmacy ${pharmacyDetails.pharmacyId} created successfully`)
            }
        }
    }
    catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: error.message });
        logger.error(`Error occured while adding pharmacy ${error.message}`);
    }
}

const getPharmacyDetails = async (req, res) => {
    try {
        const wallet = await Wallets.newFileSystemWallet(walletPathOrg3);
        let getPharmacyWallet = await wallet.get(req.params.pharmacyId);
        if (getPharmacyWallet) {
            let args = [req.params.pharmacyId];
            let result = await Query("getPharmacyDetailsById", args, req.params.pharmacyId, ccpOrg3, walletPathOrg3);
            let parseResult = JSON.parse(result);
            res.status(StatusCodes.OK).send({ message: parseResult });
            logger.info(`Successfully fetched pharmacy ${req.params.pharmacyId} details`);
        }
        else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: `Pharmacy ${req.params.pharmacyId} is not available` })
        }
    }
    catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: error.message });
        logger.error(`Pharmacy details ${req.params.pharmacyId} is not available`);
    }
}

module.exports = { addPharmacyDetails, getPharmacyDetails }