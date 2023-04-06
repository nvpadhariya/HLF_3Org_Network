const { Gateway, Wallets } = require('fabric-network');

const { ccpOrg1, ccpOrg2, ccpOrg3, walletPathOrg1, walletPathOrg2, walletPathOrg3, channelName, chaincodeName } = require('./config');
const { logger } = require('./logger');

const Invoke = async (funcName, args, walletId, ccpOrg, walletPath) => {
    try {
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        const gateway = new Gateway();
        await gateway.connect(ccpOrg, { wallet, identity: walletId, discovery: { enabled: true, asLocalhost: true } });
        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);

        if (args.length == 1) {
            let result = await contract.submitTransaction(funcName, args[0]);
            return result.toString();
        }
    }
    catch (error) {
        logger.error(`Error occured ${error}`);
        return (error);
    }
}

module.exports = { Invoke }