const crypto = require('crypto');
const bip39 = require('bip39');

const privateKey = 'be812c66046dcf6cc172b29953326026fad2e3b4b191363e17e0d5a450a19127';
const privateKeyBuffer = Buffer.from(privateKey, 'hex');
const hash = crypto.createHash('sha256').update(privateKeyBuffer).digest();
const hashBits = [...hash].map(byte => ('00000000' + byte.toString(2)).slice(-8)).join('');
const checksumLength = 4;
const checksum = hashBits.substring(0, checksumLength);
const binaryPrivateKey = privateKey + checksum;

const mnemonic = bip39.entropyToMnemonic(binaryPrivateKey);
console.log('Mnemonic:', mnemonic);
