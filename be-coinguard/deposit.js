// backend/index.js
require('dotenv').config();
const {Web3} = require('web3')
const bip39 = require('bip39');
const hdkey = require('ethereumjs-wallet').hdkey;
const {rbigint,pedersenHash2,toHex,createDeposit} = require('./utils')
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.RPC_URL));
const { abi } = require('./build/contracts/Tornado.json');


const mnemonic = process.env.MNEMONIC_PHRASE;

// Derive the private key from the mnemonic
const seed = bip39.mnemonicToSeedSync(mnemonic);
const root = hdkey.fromMasterSeed(seed);
const addrNode = root.derivePath("m/44'/60'/0'/0/0"); // Standard derivation path for Ethereum
const privateKey = addrNode.getWallet().getPrivateKeyString();
const account = web3.eth.accounts.privateKeyToAccount(privateKey);

web3.eth.accounts.wallet.add(account);

const contractAddress = "0xfFa94C7012FD0ee32ea108082b959181880BEa81";
const tornado = new web3.eth.Contract(abi, contractAddress);

const deposit = async (currency, amount) => {
  console.log("1")
  const deposit = createDeposit({ nullifier: rbigint(31), secret: rbigint(31) }); //
  console.log("2")
  console.log(deposit)

  const note = toHex(deposit.preimage, 62);
  console.log("3")

  const noteString = `tornado-${currency}-${amount}-${process.env.NETWORK_ID}-${note}`;

  console.log(`Your note: ${noteString}`);

  const value = web3.utils.toWei(amount.toString(), 'ether');
  const receipt = await tornado.methods.deposit(toHex(deposit.commitment)).send({
    value,
    from: account.address,
    gas: 2000000,
  });

  console.log(receipt);
  return noteString;
};

module.exports = { deposit };
