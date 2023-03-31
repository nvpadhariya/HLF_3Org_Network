const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');

const { mspOrg1, ccpOrg1, ccpOrg2, ccpOrg3, walletPathOrg1, walletPathOrg2, walletPathOrg3, channelName, chaincodeName } = require('../config')
const { buildCAClient, registerAndEnrollUser } = require('../CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('../AppUtil.js');

const { Invoke } = require('../invoke');
const { Query } = require('../query');

const addPatientDetails = async (req, res) => {
    try {
        let patientDetails = req.body;
        let parsePatientDetails = JSON.stringify(patientDetails)

        const buildCcpForOrg1 = buildCCPOrg1();
        const caOrg1Client = buildCAClient(FabricCAServices, buildCcpForOrg1, 'ca.org1');
        const walletOrg1 = await buildWallet(Wallets, walletPathOrg1);
        await registerAndEnrollUser(caOrg1Client, walletOrg1, mspOrg1, patientDetails.patientId, 'org1.department1');;

        let args = [parsePatientDetails];
        let result = await Invoke("addPatientDetails", args, patientDetails.patientId, ccpOrg1, walletPathOrg1);

        if (result) {
            res.status(500).send({ result: result.responses[0].response.message })
        }
        else {
            res.status(200).send(`Patient ${patientDetails.patientId} created successfully`);
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
            let result = await Query("getPatientlByIdNew", args, req.params.patientId, ccpOrg1, walletPathOrg1);
            res.status(200).send(JSON.parse(result));
        }
        else {
            res.status(500).send(`Patient ${req.params.patientId} is not available`);
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

        const wallet = await Wallets.newFileSystemWallet(walletPathOrg1);
        let getPatientWallet = await wallet.get(createAppointmentDetails.patientId);
        console.log(getPatientWallet);
        if (getPatientWallet) {
            let args = [parseCreateAppointmentDetails];
            let result = await Invoke("createAppointment", args, createAppointmentDetails.patientId, ccpOrg1, walletPathOrg1);

            if (result) {
                res.status(500).send({ result: result.responses[0].response.message, })
            }
            else {
                let args = [createAppointmentDetails.appointmentId];
                let getUpdatedAppointment = await Query("getAppointmentDetailsById", args, req.body.patientId, ccpOrg1, walletPathOrg1);
                getUpdatedAppointment = JSON.parse(getUpdatedAppointment);
                res.status(200).send(getUpdatedAppointment);
            }
        }
        else {
            res.status(500).send(`Patient ${createAppointmentDetails.patientId} does not exists`)
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
}

module.exports = { addPatientDetails, getPatientDetails, createAppointment };