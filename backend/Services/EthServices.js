
import "../Utils/BridgeAbi.js";
import { BridgeABI } from "../Utils/BridgeAbi.js";
import { GorelliBridgeAddress } from "../Utils/utils.js";
import { ethers } from "ethers";

const privateKey = '';
const httpProvider = new ethers.providers.JsonRpcProvider('https://eth-goerli.g.alchemy.com/v2/QEgC4Vsyb3fgPm90ENKlwx5X1-edSRT8');
const wallet = new ethers.Wallet(privateKey, httpProvider);
const contract = new ethers.Contract(GorelliBridgeAddress, BridgeABI, wallet);

const getETHTokens = async (amount, wallet) => {
    const gasLimit = await contract.estimateGas.deposit(amount, wallet)
    const tx = await contract.deposit(amount, wallet, { gasLimit: gasLimit.toNumber() })
    const receipt = await tx.wait()
    console.log("getBSCTokens succeful");
    return receipt
}

const sendETHTokens = async (amount, wallet) => {
    const gasLimit = await contract.estimateGas.withdraw(amount, wallet)
    const tx = await contract.withdraw(amount, wallet, { gasLimit: gasLimit.toNumber() })
    const receipt = await tx.wait()
    console.log("sendBSCTokens succeful");
    return receipt
}

export { getETHTokens, sendETHTokens }