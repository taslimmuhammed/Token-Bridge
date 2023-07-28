import { ConnectWallet, useAddress, useContract, useContractRead, useContractWrite} from '@thirdweb-dev/react';
import React, { useContext, useEffect, useState } from 'react';
import swap from '../Assets/Swap.svg'
import Image from 'next/image';
import ChainContext from '../Context/chainContext';
import { TokenABI } from '../Utils/TokenABI';
import { GorelliBridgeAddress, GorelliTokenAddres, MumbaiBridgeAddress, MumbaiTokenAddress, backendURL, stringToHex } from '../Utils/utils';
import Loader from './Loader';
import { Goerli, Mumbai } from "@thirdweb-dev/chains";
import { useSwitchChain } from "@thirdweb-dev/react";
import axios from 'axios';

const Box = () => {
    const [Input, setInput] = useState<string>("0")
    const address = useAddress()
    const [isLoading, setisLoading] = useState<boolean>(false)
    const { selectedChain, setSelectedChain } = useContext(ChainContext)
    const { contract: MumbaiContract, isLoading: L1} = useContract(MumbaiTokenAddress, TokenABI);
    const { contract: GoreliContract, isLoading: L2 } = useContract(GorelliTokenAddres, TokenABI);
    const { mutateAsync: increaseMumbaiAllowance } = useContractWrite(MumbaiContract, "increaseAllowance")
    const { mutateAsync: increaseGoreliAllowance } = useContractWrite(GoreliContract, "increaseAllowance")
    const {data:allowance}=useContractRead(MumbaiContract, "allowance", [address, MumbaiBridgeAddress])
    const { data: allowance2 } = useContractRead(GoreliContract, "allowance", [address, GorelliBridgeAddress])
  const switchChain = useSwitchChain();
    useEffect(() => {
        console.log(allowance, allowance2);
    }, [allowance, allowance2])
    
    const handleSwitch = async() => {
        setisLoading(true)
        if (selectedChain === 'mumbai') {
            setSelectedChain('goerli')
            await switchChain(Goerli.chainId)
        } else {
            setSelectedChain('mumbai')
            await switchChain(Mumbai.chainId)
        }
        setisLoading(false)
    }

    const handleSubmit = async () => {
        if(Input==="0") return alert("Please enter a value")
        if(address === null || address ===undefined) return alert("Please connect your wallet")
        setisLoading(true)
        try {
            const hex = stringToHex(Input)
            if(!hex) return alert("Please enter a valid value")
            const headers = {
                'Content-Type': 'application/json'
            }
            if (selectedChain === 'mumbai') {
            //await increaseMumbaiAllowance({args: [MumbaiBridgeAddress,hex]})
                const response = await axios.post(backendURL +"bsttoeth", 
                     {
                        "address": address,
                        "amount": hex._hex,
                    }, { headers }
                );
                console.log(response);
            } else {
             await increaseGoreliAllowance({ args: [GorelliBridgeAddress, hex] })
                const response = await axios.post(backendURL + "ethtobsc", {
                        "address": address,
                        "amount": hex._hex,
                },{headers});
                console.log(response);
                
            }
        } catch (error) {
            console.log(error);
        }
        setisLoading(false)
    }
   const getData = async() => {
    try {
        const data = await axios.get(backendURL)
        console.log(data);
    } catch (error) {
        console.log(error);
    }
       
   }
    useEffect(() => {
        getData()
    }, [])
    
    return (
        <div className="bg-gray-900 h-screen flex items-center justify-center">
            {
                isLoading ? <Loader /> : <div className="box bg-gray-800 text-white rounded-lg shadow-lg p-6 mx-auto my-auto w-96 relative">
                    <div className='flex justify-between mb-5'>
                        <h2 className="text-2xl font-bold mt-2">Bridge</h2>
                        <ConnectWallet />
                    </div>
                    <div className='flex justify-between mb-3'>
                        <div>
                            <label className='text-sky-600'>From:</label>
                            <div className='bg-emerald-500 p-2 mb-3'>{selectedChain}</div>
                        </div>
                        <Image src={swap} alt='ld' width={50} height={50} onClick={handleSwitch} />
                        <div>
                            <label className='text-sky-600'>To:</label>
                            <div className='bg-emerald-400 p-2 mb-3'>{selectedChain == "mumbai" ? "goreli" : "mumbai"}</div>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <label className='text-sky-600'>Enter the amount:</label>
                        <input
                            id="inputField"
                            placeholder="Enter the amount here"
                            className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-500 mb-6 text-white"
                            type="number"
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
                            onClick={handleSubmit}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            }
            
        </div>
    );
};

export default Box;
