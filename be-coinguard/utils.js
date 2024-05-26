// src/utils.js
const crypto = require('crypto');
const { babyJub, pedersenHash, bigInt } = require('circomlib');
const snarkjs = require('snarkjs');

// Utility functions from your CLI script
 const rbigint = (nbytes) => snarkjs.bigInt.leBuff2int(crypto.randomBytes(nbytes));

 
 const pedersenHash2 = (data) => {
  console.log('grr', pedersenHash.hash(data))
  console.log('paw', babyJub.unpackPoint(pedersenHash.hash(data)))
  return babyJub.unpackPoint(pedersenHash.hash(data))[0];
}

 const toHex = (number, length = 32) => {
  const str = number instanceof Buffer ? number.toString('hex') : bigInt(number).toString(16);
  return '0x' + str.padStart(length * 2, '0');
};

const createDeposit = ({ nullifier, secret }) => {
      console.log("before dep")
       const deposit = { nullifier, secret };
       console.log("before dep 1")

       deposit.preimage = Buffer.concat([deposit.nullifier.leInt2Buff(31), deposit.secret.leInt2Buff(31)]);
       console.log("before dep 2", deposit)

       deposit.commitment = pedersenHash2(deposit.preimage);
       console.log("before dep 3", deposit.commitment)

       deposit.commitmentHex = toHex(deposit.commitment);
       console.log("before dep 4")

       deposit.nullifierHash = pedersenHash2(deposit.nullifier.leInt2Buff(31));
       deposit.nullifierHex = toHex(deposit.nullifierHash); 
   
   
   return deposit;
};

module.exports = {rbigint,pedersenHash2,toHex,createDeposit}
