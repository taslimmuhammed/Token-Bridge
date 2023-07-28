const Web3 = require('web3');
const { bridgeABI } = require('./Utils/bridgeABI');
const  {  tokenABI } =require ('./Utils/TokenABI');
const web3Eth = new Web3('https://rpc-mumbai.maticvigil.com');
//const web3Bsc = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545/'); 
const web3Bsc = new Web3('https://polygon-mumbai.infura.io/v3/4f44d4709d674f4d93abf891629e18d6');
const adminPrivKey = '719a7252f1968da232963a591bf58877ba0f869a9387c952ac9cc7eb4295c1e0';
// const ethBridgeAddress = '';
// const bscBridgeAddress = '';
const { address: admin } = web3Bsc.eth.accounts.wallet.add(adminPrivKey);

// const bridgeEth = new web3Eth.eth.Contract(
//   bridgeABI,
//   ethBridgeAddress
// );

// const bridgeBsc = new web3Bsc.eth.Contract(
//   bridgeABI,
//   bscBridgeAddress
// );

const tokenContract = new web3Eth.eth.Contract(
  tokenABI,
  "0x863aa21721D42B59CCA2a49213780DEc5837D7f1" 
);
const test = async () => {
  try {
    const gasPrice = await tokenContract.methods.mint(admin, "0x21E19E0C9BAB2400000").estimateGas({from: admin});
    const tx = await tokenContract.methods.mint(admin, "0x21E19E0C9BAB2400000").send({from: admin, gas: '300000'});
    console.log(gasPrice,tx);
    // const balance = await tokenContract.methods.balanceOf(admin).call();
    // console.log(balance);
  } catch (error) {
    console.log("error",error);
  }
  
};

test();

bridgeEth.events.Transfer(
  {fromBlock: 0, step: 0}
)
.on('data', async event => {
  const { from, to, amount, date, nonce, signature } = event.returnValues;
  const tx = bridgeBsc.methods.mint(from, to, amount, nonce, signature);
  const [gasPrice, gasCost] = await Promise.all([
    web3Bsc.eth.getGasPrice(),
    tx.estimateGas({from: admin}),
  ]);
  const data = tx.encodeABI();
  const txData = {
    from: admin,
    to: bridgeBsc.options.address,
    data,
    gas: gasCost,
    gasPrice
  };
  const receipt = await web3Bsc.eth.sendTransaction(txData);
  console.log(`Transaction hash: ${receipt.transactionHash}`);
  console.log(`
    Processed transfer:
    - from ${from} 
    - to ${to} 
    - amount ${amount} tokens
    - date ${date}
    - nonce ${nonce}
  `);
});