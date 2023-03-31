const { Gateway, Wallets } = require('fabric-network');

const { ccpOrg1, ccpOrg2, ccpOrg3, walletPathOrg1, walletPathOrg2, walletPathOrg3 } = require('./config');

const InvokePatient = async (funcName, args, patientId, req, res) => {
    try {
        const wallet = await Wallets.newFileSystemWallet(walletPathOrg1);
        const gateway = new Gateway();
        await gateway.connect(ccpOrg1, { wallet, identity: patientId, discovery: { enabled: true, asLocalhost: true } });
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

const InvokeHospital = async (funcName, args, hospitalId, req, res) => {
    try {
        const wallet = await Wallets.newFileSystemWallet(walletPathOrg2);
        const gateway = new Gateway();
        await gateway.connect(ccpOrg2, { wallet, identity: hospitalId, discovery: { enabled: true, asLocalhost: true } });
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

const InvokePharmacy = async (funcName, args, pharmacyId, req, res) => {
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

module.exports = { InvokePatient, InvokeHospital, InvokePharmacy }