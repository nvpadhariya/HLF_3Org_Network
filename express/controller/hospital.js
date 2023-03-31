const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');

const { mspOrg2, ccpOrg1, ccpOrg2, ccpOrg3, walletPathOrg1, walletPathOrg2, walletPathOrg3, channelName, chaincodeName } = require('../config');
const { buildCAClient, registerAndEnrollUser } = require('../CAUtil.js');
const { buildCcpOrg2, buildWallet } = require('../AppUtil.js');

const { Invoke } = require('../invoke');
const { Query } = require('../query');

const addHospitalDetails = async (req, res) => {
    try {
        let addHospitalDetails = req.body;
        let parseaddHospitalDetails = JSON.stringify(addHospitalDetails);

        const buildCcpForOrg2 = buildCcpOrg2();
        const caOrg2Client = buildCAClient(FabricCAServices, buildCcpForOrg2, 'ca.org2');
        const walletOrg2 = await buildWallet(Wallets, walletPathOrg2);
        await registerAndEnrollUser(caOrg2Client, walletOrg2, mspOrg2, addHospitalDetails.hospitalId, 'org2.department1');

        let args = [parseaddHospitalDetails];
        let result = await Invoke("addHospitalDetails", args, addHospitalDetails.hospitalId, ccpOrg2, walletPathOrg2);

        if (result) {
            res.status(200).send({ result: result.responses[0].response.message })
        } else {
            res.send(`Hospital ${addHospitalDetails.hospitalId} created successfully`);
        }
    }
    catch (error) {
        console.log(error);
        res.send(`${error.message}`);
    }
}

const getHospitalDetails = async (req, res) => {
    try {
        const wallet = await Wallets.newFileSystemWallet(walletPathOrg2);
        let getHospitalWallet = await wallet.get(req.params.hospitalId);
        console.log(getHospitalWallet, "getHospitalWallet");
        if (getHospitalWallet) {
            let args = [req.params.hospitalId];
            let result = await Query("getHospitalDetailsById", args, req.params.hospitalId, ccpOrg2, walletPathOrg2);
            res.send(JSON.parse(result))
        }
        else {
            res.send(`Hospital ${req.params.hospitalId} is not available`)
        }
    }
    catch (error) {
        res.status(500).send(`${error}`);
    }
}

const updateAppointment = async (req, res) => {
    try {
        let appointmentData = req.body;
        appointmentData.updateDate = new Date();

        appointmentData.removeFields = ["status", "appointmentId", "removeFields"]
        let stringifyData = JSON.stringify(appointmentData);

        let args = [stringifyData];

        const wallet = await Wallets.newFileSystemWallet(walletPathOrg2);
        let getHospitalWallet = await wallet.get(appointmentData.details.hospitalID);
        if (getHospitalWallet) {
            let result = await Invoke("updateAppointment", args, appointmentData.details.hospitalID, ccpOrg2, walletPathOrg2);
            if (!result) {
                res.status(200).send({ result: result.responses[0].response })
            }
            else {
                let args = [appointmentData.appointmentId];
                let getAppointment = await Query("getAppointmentDetailsById", args, appointmentData.details.hospitalID, ccpOrg2, walletPathOrg2);
                getAppointment = JSON.parse(getAppointment);
                res.send(getAppointment);
            }
        }
        else {
            res.send(`Hospital ${appointmentData.details.hospitalId} does not exists`)
        }

    }
    catch (error) {
        res.status(500).send(error.message)
    }
}

module.exports = { addHospitalDetails, getHospitalDetails, updateAppointment }