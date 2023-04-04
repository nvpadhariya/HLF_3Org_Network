const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const { StatusCodes } = require('http-status-codes');
const { mspOrg2, ccpOrg2, walletPathOrg2 } = require('../config');
const { buildCAClient, registerAndEnrollUser } = require('../CAUtil.js');
const { buildCcpOrg2, buildWallet } = require('../AppUtil.js');
const { Invoke } = require('../invoke');
const { Query } = require('../query');
const { validateHospital, validateUpdateAppointment } = require('../validation');

const addHospitalDetails = async (req, res) => {
    try {
        let addHospitalDetails = req.body;
        let parseaddHospitalDetails = JSON.stringify(addHospitalDetails);
        await validateHospital(addHospitalDetails);
        const wallet = await Wallets.newFileSystemWallet(walletPathOrg2);
        let getHospitalWallet = await wallet.get(addHospitalDetails.hospitalId);

        if (getHospitalWallet) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: `Hospital ${addHospitalDetails.hospitalId} already exists` })
        }
        else {
            const buildCcpForOrg2 = buildCcpOrg2();
            const caOrg2Client = buildCAClient(FabricCAServices, buildCcpForOrg2, 'ca.org2');
            const walletOrg2 = await buildWallet(Wallets, walletPathOrg2);
            await registerAndEnrollUser(caOrg2Client, walletOrg2, mspOrg2, addHospitalDetails.hospitalId, 'org2.department1');

            let args = [parseaddHospitalDetails];
            let result = await Invoke("addHospitalDetails", args, addHospitalDetails.hospitalId, ccpOrg2, walletPathOrg2);

            if (result) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: result.responses[0].response.message })
            } else {
                res.status(StatusCodes.OK).send({ message: `Hospital ${addHospitalDetails.hospitalId} created successfully` });
            }
        }
    }
    catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: error.message });
    }
}

const getHospitalDetails = async (req, res) => {
    try {
        const wallet = await Wallets.newFileSystemWallet(walletPathOrg2);
        let getHospitalWallet = await wallet.get(req.params.hospitalId);

        if (getHospitalWallet) {
            let args = [req.params.hospitalId];
            let result = await Query("getHospitalDetailsById", args, req.params.hospitalId, ccpOrg2, walletPathOrg2);
            res.status(StatusCodes.OK).send({ message: `${JSON.parse(result)}` })
        }
        else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: `Hospital ${req.params.hospitalId} is not available` })
        }
    }
    catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: error.message });
    }
}

const updateAppointment = async (req, res) => {
    try {
        let appointmentData = req.body;
        appointmentData.updateDate = new Date();
        appointmentData.removeFields = ["status", "appointmentId", "removeFields"];
        await validateUpdateAppointment(appointmentData);
        let stringifyData = JSON.stringify(appointmentData);
        let args = [stringifyData];

        const wallet = await Wallets.newFileSystemWallet(walletPathOrg2);
        let getHospitalWallet = await wallet.get(appointmentData.details.hospitalID);
        if (getHospitalWallet) {
            let result = await Invoke("updateAppointment", args, appointmentData.details.hospitalID, ccpOrg2, walletPathOrg2);
            if (!result) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ result: result.responses[0].response })
            }
            else {
                let args = [appointmentData.appointmentId];
                let getAppointment = await Query("getAppointmentDetailsById", args, appointmentData.details.hospitalID, ccpOrg2, walletPathOrg2);
                getAppointment = JSON.parse(getAppointment);
                res.status(StatusCodes.OK).send({ Apponintment: getAppointment });
            }
        }
        else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: `Hospital ${appointmentData.details.hospitalId} does not exists` })
        }

    }
    catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: error.message })
    }
}

module.exports = { addHospitalDetails, getHospitalDetails, updateAppointment }