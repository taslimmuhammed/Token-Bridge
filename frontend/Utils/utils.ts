import { ethers } from "ethers"

export const GorelliTokenAddres = "0x23A75e3a63eAe28c7001e24ccb233C2161CbCF1E"
export const GorelliBridgeAddress = "0x7A03F5ef0b356659F19F0dd126F18CCfF40a15f4"

export const MumbaiTokenAddress = "0x5D3F7E169DCB6CE4fA7FEC245081b0475e807d0C"
export const MumbaiBridgeAddress = "0x94fEf206988faB676E2d2180a1f2e089a7Bef9e3"

export const backendURL = "http://localhost:8085/"
export const stringToHex = (_amount:string) => {
    try {
        let hexString = ethers.BigNumber.from(parseInt(_amount))
        hexString = hexString.mul(10 ** 18 + "")
        console.log(hexString)
        return hexString
    } catch (e) {
        console.log(e);
        return 0
    }

}