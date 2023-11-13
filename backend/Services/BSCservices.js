import { BridgeABI } from "../Utils/BridgeAbi.js";
import { MumbaiBridgeAddress } from "../Utils/utils.js";
import { ethers } from "ethers";

const privateKey = '';
const httpProvider = new ethers.providers.JsonRpcProvider('https://polygon-mumbai.infura.io/v3/4f44d4709d674f4d93abf891629e18d6');
const wallet = new ethers.Wallet(privateKey, httpProvider);
const contract = new ethers.Contract(MumbaiBridgeAddress, BridgeABI, wallet);

const getBSCTokens = async (amount, wallet) => {
    const gasLimit = await contract.estimateGas.deposit(amount, wallet)
    const tx = await contract.deposit(amount, wallet, { gasLimit: gasLimit.toNumber() })
    const receipt = await tx.wait()
    console.log("getBSCTokens succeful");
    return receipt
}

const sendBSCTokens = async (amount, wallet) => {
    const gasLimit = await contract.estimateGas.withdraw(amount, wallet)
    const tx = await contract.withdraw(amount, wallet,{gasLimit: gasLimit.toNumber()})
    const receipt = await tx.wait()
    console.log("sendBSCTokens succeful");
    return receipt
}

export { getBSCTokens, sendBSCTokens }



