const path = require('path');
const fs = require('fs');

const channelName = 'health-channel';
const chaincodeName = 'Hospital';
const memberAssetCollectionName = 'assetPrivateCollection';
const org1PrivateCollectionName = 'PatientOrgMSPPrivateCollection';
const org2PrivateCollectionName = 'HospitalOrgMSPPrivateCollection';
const org3PrivateCollectionName = 'PharmacyOrgMSPPrivateCollection';
const mspOrg1 = 'PatientOrgMSP';
const mspOrg2 = 'HospitalOrgMSP';
const mspOrg3 = 'PharmacyOrgMSP';

const ccpPathOrg1 = path.resolve(__dirname, '..', '..', 'test-network-3org-new', 'organizations', 'peerOrganizations', 'patientorg', 'connection-org1.json');
const ccpOrg1 = JSON.parse(fs.readFileSync(ccpPathOrg1, 'utf8'));
const walletPathOrg1 = path.join(process.cwd(), 'wallet/org1');

const ccpPathOrg2 = path.resolve(__dirname, '..', '..', 'test-network-3org-new', 'organizations', 'peerOrganizations', 'hospitalorg', 'connection-org2.json');
const ccpOrg2 = JSON.parse(fs.readFileSync(ccpPathOrg2, 'utf8'));
const walletPathOrg2 = path.join(process.cwd(), 'wallet/org2');

const ccpPathOrg3 = path.resolve(__dirname, '..', '..', 'test-network-3org-new', 'organizations', 'peerOrganizations', 'pharmacyorg', 'connection-org3.json');
const ccpOrg3 = JSON.parse(fs.readFileSync(ccpPathOrg3, 'utf8'));
const walletPathOrg3 = path.join(process.cwd(), 'wallet/org3');

module.exports = {
    channelName,
    chaincodeName,
    memberAssetCollectionName,
    org1PrivateCollectionName,
    org2PrivateCollectionName,
    org3PrivateCollectionName,
    mspOrg1,
    mspOrg2,
    mspOrg3,
    ccpPathOrg1,
    ccpOrg1,
    walletPathOrg1,
    ccpPathOrg2,
    ccpOrg2,
    walletPathOrg2,
    ccpPathOrg3,
    ccpOrg3,
    walletPathOrg3
}