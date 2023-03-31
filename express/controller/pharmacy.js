const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');

const { mspOrg3, ccpOrg3, walletPathOrg3 } = require('../config');
const { buildCAClient, registerAndEnrollUser } = require('../CAUtil.js');
const { buildCCPOrg3, buildWallet } = require('../AppUtil.js');

const addPharmacyDetails = async (req, res) => {
    try {
        let pharmacyDetails = req.body;
        let parsePharmacyDetails = JSON.stringify(pharmacyDetails);

        const ccpOrg3 = buildCCPOrg3();
        const caOrg3Client = buildCAClient(FabricCAServices, ccpOrg3, 'ca.org3');
        const walletOrg3 = await buildWallet(Wallets, walletPathOrg3);
        await registerAndEnrollUser(caOrg3Client, walletOrg3, mspOrg3, pharmacyDetails.pharmacyId, 'org3.department1');

        let args = [parsePharmacyDetails];
        let result = await Invoke("addPharmacyDetails", args, pharmacyDetails.pharmacyId, res);

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
            let result = await Query("getPharmacyDetailsById", args, req.params.pharmacyId, res);
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

const Invoke = async (funcName, args, pharmacyId, req, res) => {
    try {
        const wallet = await Wallets.newFileSystemWallet(walletPathOrg3);
        const gateway = new Gateway();
        await gateway.connect(ccpOrg3, { wallet, identity: pharmacyId, discovery: { enabled: true, asLocalhost: true } });
        const network = await gateway.getNetwork('health-channel');
        const contract = network.getContract('Hospital');

        if (args.length == 1) {
            let result = await contract.submitTransaction(funcName, args[0]);
            return result.toString();
        }
    }
    catch (error) {
        console.log(error);
        return (error)
    }
}

const Query = async (funcName, args, pharmacyId, req, res) => {
    try {
        const wallet = await Wallets.newFileSystemWallet(walletPathOrg3);
        const gateway = new Gateway();
        await gateway.connect(ccpOrg3, { wallet, identity: pharmacyId, discovery: { enabled: true, asLocalhost: true } });
        const network = await gateway.getNetwork('health-channel');
        const contract = network.getContract('Hospital');

        if (args.length == 1) {
            let result = await contract.evaluateTransaction(funcName, args[0]);
            return result
        }
    }
    catch (error) {
        console.log(error);
        return (error)
    }
}

module.exports = { addPharmacyDetails, getPharmacyDetails }