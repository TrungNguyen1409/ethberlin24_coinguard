// src/utils.js
import crypto from 'crypto';
import { babyJub, pedersenHash as circomPedersenHash, bigInt } from 'circomlib';
import snarkjs from 'snarkjs';

// Utility functions from your CLI script
export const rbigint = (nbytes) => snarkjs.bigInt.leBuff2int(crypto.randomBytes(nbytes));

export const pedersenHash = (data) => babyJub.unpackPoint(circomPedersenHash.hash(data))[0];

export const toHex = (number, length = 32) => {
  const str = number instanceof Buffer ? number.toString('hex') : bigInt(number).toString(16);
  return '0x' + str.padStart(length * 2, '0');
};

export const createDeposit = ({ nullifier, secret }) => {
  const deposit = { nullifier, secret };
  deposit.preimage = Buffer.concat([deposit.nullifier.leInt2Buff(31), deposit.secret.leInt2Buff(31)]);
  deposit.commitment = pedersenHash(deposit.preimage);
  deposit.commitmentHex = toHex(deposit.commitment);
  deposit.nullifierHash = pedersenHash(deposit.nullifier.leInt2Buff(31));
  deposit.nullifierHex = toHex(deposit.nullifierHash);
  return deposit;
};
