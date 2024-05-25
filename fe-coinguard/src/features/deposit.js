require('dotenv').config()
const fs = require('fs')
const axios = require('axios')
const assert = require('assert')
const snarkjs = require('snarkjs')
const crypto = require('crypto')
const circomlib = require('circomlib')
const bigInt = snarkjs.bigInt
const merkleTree = require('fixed-merkle-tree')
const Web3 = require('web3')
const buildGroth16 = require('websnark/src/groth16')
const websnarkUtils = require('websnark/src/utils')
const { toWei, fromWei, toBN, BN } = require('web3-utils')
const config = require('./config')
const program = require('commander')

let web3, tornado, circuit, proving_key, groth16, erc20, senderAccount, netId
let MERKLE_TREE_HEIGHT, ETH_AMOUNT, TOKEN_AMOUNT, PRIVATE_KEY

/** Whether we are in a browser or node.js */
const inBrowser = (typeof window !== 'undefined')
let isLocalRPC = false

/** Generate random number of specified byte length */
const rbigint = nbytes => snarkjs.bigInt.leBuff2int(crypto.randomBytes(nbytes))

/** Compute pedersen hash */
const pedersenHash = data => circomlib.babyJub.unpackPoint(circomlib.pedersenHash.hash(data))[0]
function toHex(number, length = 32) {
    const str = number instanceof Buffer ? number.toString('hex') : bigInt(number).toString(16)
    return '0x' + str.padStart(length * 2, '0')
  }

function createDeposit({ nullifier, secret }) {
    const deposit = { nullifier, secret }
    deposit.preimage = Buffer.concat([deposit.nullifier.leInt2Buff(31), deposit.secret.leInt2Buff(31)])
    deposit.commitment = pedersenHash(deposit.preimage)
    deposit.commitmentHex = toHex(deposit.commitment)
    deposit.nullifierHash = pedersenHash(deposit.nullifier.leInt2Buff(31))
    deposit.nullifierHex = toHex(deposit.nullifierHash)
    return deposit
  }


export async function deposit({ currency, amount }) {
    const deposit = createDeposit({ nullifier: rbigint(31), secret: rbigint(31) })
    const note = toHex(deposit.preimage, 62)
    const noteString = `tornado-${currency}-${amount}-${netId}-${note}`
    console.log(`Your note: ${noteString}`)
    if (currency === 'eth') {
      await printETHBalance({ address: tornado._address, name: 'Tornado' })
      await printETHBalance({ address: senderAccount, name: 'Sender account' })
      const value = isLocalRPC ? ETH_AMOUNT : fromDecimals({ amount, decimals: 18 })
      console.log('Submitting deposit transaction')
      await tornado.methods.deposit(toHex(deposit.commitment)).send({ value, from: senderAccount, gas: 2e6 })
      await printETHBalance({ address: tornado._address, name: 'Tornado' })
      await printETHBalance({ address: senderAccount, name: 'Sender account' })
    } else { // a token
      await printERC20Balance({ address: tornado._address, name: 'Tornado' })
      await printERC20Balance({ address: senderAccount, name: 'Sender account' })
      const decimals = isLocalRPC ? 18 : config.deployments[`netId${netId}`][currency].decimals
      const tokenAmount = isLocalRPC ? TOKEN_AMOUNT : fromDecimals({ amount, decimals })
      if (isLocalRPC) {
        console.log('Minting some test tokens to deposit')
        await erc20.methods.mint(senderAccount, tokenAmount).send({ from: senderAccount, gas: 2e6 })
      }
  
      const allowance = await erc20.methods.allowance(senderAccount, tornado._address).call({ from: senderAccount })
      console.log('Current allowance is', fromWei(allowance))
      if (toBN(allowance).lt(toBN(tokenAmount))) {
        console.log('Approving tokens for deposit')
        await erc20.methods.approve(tornado._address, tokenAmount).send({ from: senderAccount, gas: 1e6 })
      }
  
      console.log('Submitting deposit transaction')
      await tornado.methods.deposit(toHex(deposit.commitment)).send({ from: senderAccount, gas: 2e6 })
      await printERC20Balance({ address: tornado._address, name: 'Tornado' })
      await printERC20Balance({ address: senderAccount, name: 'Sender account' })
    }
  
    return noteString
  }

  async function init({ rpc, noteNetId, currency = 'dai', amount = '100' }) {
    let contractJson, erc20ContractJson, erc20tornadoJson, tornadoAddress, tokenAddress
    // TODO do we need this? should it work in browser really?
    if (inBrowser) {
      // Initialize using injected web3 (Metamask)
      // To assemble web version run `npm run browserify`
      web3 = new Web3(window.web3.currentProvider, null, { transactionConfirmationBlocks: 1 })
      contractJson = await (await fetch('build/contracts/ETHTornado.json')).json()
      circuit = await (await fetch('build/circuits/withdraw.json')).json()
      proving_key = await (await fetch('build/circuits/withdraw_proving_key.bin')).arrayBuffer()
      MERKLE_TREE_HEIGHT = 20
      ETH_AMOUNT = 1e18
      TOKEN_AMOUNT = 1e19
      senderAccount = (await web3.eth.getAccounts())[0]
    } else {
      // Initialize from local node
      web3 = new Web3(rpc, null, { transactionConfirmationBlocks: 1 })
      contractJson = require(__dirname + '/../build/contracts/ETHTornado.json')
      circuit = require(__dirname + '/../build/circuits/withdraw.json')
      proving_key = fs.readFileSync(__dirname + '/../build/circuits/withdraw_proving_key.bin').buffer
      MERKLE_TREE_HEIGHT = process.env.MERKLE_TREE_HEIGHT || 20
      ETH_AMOUNT = process.env.ETH_AMOUNT
      TOKEN_AMOUNT = process.env.TOKEN_AMOUNT
      PRIVATE_KEY = process.env.PRIVATE_KEY
      if (PRIVATE_KEY) {
        const account = web3.eth.accounts.privateKeyToAccount('0x' + PRIVATE_KEY)
        web3.eth.accounts.wallet.add('0x' + PRIVATE_KEY)
        web3.eth.defaultAccount = account.address
        senderAccount = account.address
      } else {
        console.log('Warning! PRIVATE_KEY not found. Please provide PRIVATE_KEY in .env file if you deposit')
      }
      erc20ContractJson = require(__dirname + '/../build/contracts/ERC20Mock.json')
      erc20tornadoJson = require(__dirname + '/../build/contracts/ERC20Tornado.json')
    }
    // groth16 initialises a lot of Promises that will never be resolved, that's why we need to use process.exit to terminate the CLI
    groth16 = await buildGroth16()
    netId = await web3.eth.net.getId()
    if (noteNetId && Number(noteNetId) !== netId) {
      throw new Error('This note is for a different network. Specify the --rpc option explicitly')
    }
    isLocalRPC = netId > 42
  
    if (isLocalRPC) {
      tornadoAddress = currency === 'eth' ? contractJson.networks[netId].address : erc20tornadoJson.networks[netId].address
      tokenAddress = currency !== 'eth' ? erc20ContractJson.networks[netId].address : null
      senderAccount = (await web3.eth.getAccounts())[0]
    } else {
      try {
        tornadoAddress = config.deployments[`netId${netId}`][currency].instanceAddress[amount]
        if (!tornadoAddress) {
          throw new Error()
        }
        tokenAddress = config.deployments[`netId${netId}`][currency].tokenAddress
      } catch (e) {
        console.error('There is no such tornado instance, check the currency and amount you provide')
        process.exit(1)
      }
    }
    tornado = new web3.eth.Contract(contractJson.abi, tornadoAddress)
    erc20 = currency !== 'eth' ? new web3.eth.Contract(erc20ContractJson.abi, tokenAddress) : {}
  }


async (currency, amount) => {
    currency = currency.toLowerCase()
    await init({ rpc: program.rpc, currency, amount })
    await deposit({ currency, amount })
}