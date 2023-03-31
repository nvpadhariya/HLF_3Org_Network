const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');

const { mspOrg1, mspOrg3, ccpOrg1, ccpOrg2, ccpOrg3, walletPathOrg1, walletPathOrg2, walletPathOrg3, channelName, chaincodeName } = require('../config')
const { buildCAClient, registerAndEnrollUser } = require('../CAUtil.js');
const { buildCCPOrg3, buildWallet } = require('../AppUtil.js');

const { Invoke } = require('../invoke');
const { Query } = require('../query')

const addPharmacyDetails = async (req, res) => {
    try {
        let pharmacyDetails = req.body;
        let parsePharmacyDetails = JSON.stringify(pharmacyDetails);

        const buildCcpForOrg3 = buildCCPOrg3();
        const caOrg3Client = buildCAClient(FabricCAServices, buildCcpForOrg3, 'ca.org3');
        const walletOrg3 = await buildWallet(Wallets, walletPathOrg3);
        await registerAndEnrollUser(caOrg3Client, walletOrg3, mspOrg3, pharmacyDetails.pharmacyId, 'org3.department1');

        let args = [parsePharmacyDetails];
        let result = await Invoke("addPharmacyDetails", args, pharmacyDetails.pharmacyId, ccpOrg3, walletPathOrg3);

        if (result) {
            res.send({ result: result.responses[0].response.message })
        }
        else {
            res.send(`Pharmacy ${pharmacyDetails.pharmacyId} created successfully`);
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
}

const getPharmacyDetails = async (req, res) => {
    try {
        const wallet = await Wallets.newFileSystemWallet(walletPathOrg3);
        let getPharmacyWallet = await wallet.get(req.params.pharmacyId);
        if (getPharmacyWallet) {
            let args = [req.params.pharmacyId];
            let result = await Query("getPharmacyDetailsById", args, req.params.pharmacyId, ccpOrg3, walletPathOrg3);
            res.send(JSON.parse(result));
        }
        else {
            res.send(`Pharmacy ${req.params.pharmacyId} is not available`)
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
}

module.exports = { addPharmacyDetails, getPharmacyDetails }