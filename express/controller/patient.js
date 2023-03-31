const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');

const { mspOrg1, ccpOrg1, walletPathOrg1 } = require('../config')
const { buildCAClient, registerAndEnrollUser } = require('../CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('../AppUtil.js');

const addPatientDetails = async (req, res) => {
    try {
        let patientDetails = req.body;
        let parsePatientDetails = JSON.stringify(patientDetails)

        const ccpOrg1 = buildCCPOrg1();
        const caOrg1Client = buildCAClient(FabricCAServices, ccpOrg1, 'ca.org1');
        const walletOrg1 = await buildWallet(Wallets, walletPathOrg1);
        await registerAndEnrollUser(caOrg1Client, walletOrg1, mspOrg1, patientDetails.patientId, 'org1.department1');;

        let args = [parsePatientDetails];
        let result = await Invoke("addPatientDetails", args, patientDetails.patientId, res);

        if (result) {
            res.send({ result: result.responses[0].response.message })
        }
        else {
            res.send(`Patient ${patientDetails.patientId} created successfully`);
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
}

const getPatientDetails = async (req, res) => {
    try {
        const wallet = await Wallets.newFileSystemWallet(walletPathOrg1);
        let getPatientWallet = await wallet.get(req.params.patientId);
        if (getPatientWallet) {
            let args = [req.params.patientId];
            let result = await Query("getPatientlByIdNew", args, req.params.patientId);
            res.send(JSON.parse(result));
        }
        else {
            res.send(`Patient ${req.params.patientId} is not available`);
        }
    }
    catch (error) {
        console.log(`Failed to get patient: ${error}`);
        res.status(500).send(`${error} from catch`);
    }
}

const createAppointment = async (req, res) => {
    try {
        let createAppointmentDetails = req.body;
        createAppointmentDetails.status = ["APT-CREATED"]
        createAppointmentDetails.appointmentId = (Math.floor(Math.random() * 10000000)).toString();
        createAppointmentDetails.patientId = createAppointmentDetails.patientId;
        createAppointmentDetails.createDate = new Date()
        createAppointmentDetails.updateDate = createAppointmentDetails.createDate

        let parseCreateAppointmentDetails = JSON.stringify(createAppointmentDetails);

        let args = [parseCreateAppointmentDetails];
        let result = await Invoke("createAppointment", args, createAppointmentDetails.patientId, res);

        if (result) {
            res.status(200).send({ result: result.responses[0].response.message })
        }
        else {
            let args = [createAppointmentDetails.appointmentId];
            let getUpdatedAppointment = await Query("getAppointmentDetailsById", args, req.body.patientId);
            getUpdatedAppointment = JSON.parse(getUpdatedAppointment);
            res.send(getUpdatedAppointment);
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
}

const Invoke = async (funcName, args, patientId, req, res) => {
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

const Query = async (funcName, args, patientId, req, res) => {
    try {
        const wallet = await Wallets.newFileSystemWallet(walletPathOrg1);
        const gateway = new Gateway();
        await gateway.connect(ccpOrg1, { wallet, identity: patientId, discovery: { enabled: true, asLocalhost: true } });
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

module.exports = { addPatientDetails, getPatientDetails, createAppointment };