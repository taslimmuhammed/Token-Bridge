import { getETHTokens, sendETHTokens } from "../Services/EthServices.js"
import { getBSCTokens,sendBSCTokens } from "../Services/BSCservices.js"

const ethToBsc = async(req, res) => {
    console.log("ethToBsc");
    try {
        const { address, amount } = req.body
        console.log({ address, amount, pr1: process.env.PR1});
         const tx1 = await getETHTokens(amount, address)
         console.log("transaction 1 done");    
         const tx2 = await sendBSCTokens(amount, address)
         console.log("transaction 2 done");
        sendSuccessMessage("Succefully transfered", "Succefully transfered", res)
    } catch (error) {
        console.log(error);
        sendFailuireMessage(error, "Error while transfering", res)
    }
}

const bscToEth = async (req, res) => {
    console.log("bscToEth");
    try {
        const { address, amount } = req.body
        console.log({address, amount});
        const tx1 = await getBSCTokens(amount, address)    
        const tx2 = await sendETHTokens(amount, address)
        sendSuccessMessage("Succefully transfered", "Succefully transfered", res)
    } catch (error) {
        console.log(error);
        sendFailuireMessage(error, "Error while transfering", res)
    }
}


const sendSuccessMessage = (data, message, res) => {
    return res.status(200).json({
        message: message,
        data: data
    })
}

const sendFailuireMessage = (error, message, res) => {
    return res.status(400).json({
        message: message,
        error
    })
}

export { ethToBsc, bscToEth }