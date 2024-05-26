// backend/index.js
require('dotenv').config();
const {Web3} = require('web3')

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.RPC_URL));
const { abi, networks } = require('./build/contracts/Tornado.json');

const privateKey = process.env.PRIVATE_KEY;
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
web3.eth.accounts.wallet.add(account);

const contractAddress = networks[process.env.NETWORK_ID].address;
const tornado = new web3.eth.Contract(abi, contractAddress);

const createDeposit = ({ nullifier, secret }) => {
  // Implementation as before
};

const deposit = async (currency, amount) => {
  const deposit = createDeposit({ nullifier: rbigint(31), secret: rbigint(31) });
  const note = toHex(deposit.preimage, 62);
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
