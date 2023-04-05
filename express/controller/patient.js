const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const { StatusCodes } = require('http-status-codes');
const { mspOrg1, ccpOrg1, walletPathOrg1 } = require('../config')
const { buildCAClient, registerAndEnrollUser } = require('../CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('../AppUtil.js');
const { Invoke } = require('../invoke');
const { Query } = require('../query');
const { validatePatient, validateAppointment } = require('../validation')

const addPatientDetails = async (req, res) => {
    try {
        let patientDetails = req.body;
        let parsePatientDetails = JSON.stringify(patientDetails)
        await validatePatient(patientDetails);
        const wallet = await Wallets.newFileSystemWallet(walletPathOrg1);
        let getPatientWallet = await wallet.get(patientDetails.patientId);
        if (getPatientWallet) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: `Patient ${patientDetails.patientId} already exists` })
        }
        else {
            const buildCcpForOrg1 = buildCCPOrg1();
            const caOrg1Client = buildCAClient(FabricCAServices, buildCcpForOrg1, 'ca.org1');
            const walletOrg1 = await buildWallet(Wallets, walletPathOrg1);
            await registerAndEnrollUser(caOrg1Client, walletOrg1, mspOrg1, patientDetails.patientId, 'org1.department1');;

            let args = [parsePatientDetails];
            let result = await Invoke("addPatientDetails", args, patientDetails.patientId, ccpOrg1, walletPathOrg1);

            if (result) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ result: result.responses[0].response.message })
            }
            else {
                res.status(StatusCodes.OK).send({ message: `Patient ${patientDetails.patientId} created successfully` });
            }
        }
    }
    catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: error.message });
    }
}

const getPatientDetails = async (req, res) => {
    try {
        const wallet = await Wallets.newFileSystemWallet(walletPathOrg1);
        let getPatientWallet = await wallet.get(req.params.patientId);
        if (getPatientWallet) {
            let args = [req.params.patientId];
            let result = await Query("getPatientlByIdNew", args, req.params.patientId, ccpOrg1, walletPathOrg1);
            res.status(StatusCodes.OK).send({ message: `${JSON.parse(result)}` });
        }
        else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: `Patient ${req.params.patientId} is not available` });
        }
    }
    catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: error.message });
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
        await validateAppointment(createAppointmentDetails);
        const wallet = await Wallets.newFileSystemWallet(walletPathOrg1);
        let getPatientWallet = await wallet.get(createAppointmentDetails.patientId);
        if (getPatientWallet) {
            let args = [parseCreateAppointmentDetails];
            let result = await Invoke("createAppointment", args, createAppointmentDetails.patientId, ccpOrg1, walletPathOrg1);

            if (result) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ result: result.responses[0].response.message, })
            }
            else {
                let args = [createAppointmentDetails.appointmentId];
                let getUpdatedAppointment = await Query("getAppointmentDetailsById", args, req.body.patientId, ccpOrg1, walletPathOrg1);
                getUpdatedAppointment = JSON.parse(getUpdatedAppointment);
                res.status(StatusCodes.OK).send({ Appointment: getUpdatedAppointment });
            }
        }
        else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: `Patient ${createAppointmentDetails.patientId} does not exists` })
        }
    }
    catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: error.message });
    }
}

module.exports = { addPatientDetails, getPatientDetails, createAppointment };