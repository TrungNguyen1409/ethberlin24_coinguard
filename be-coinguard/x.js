const {rbigint,pedersenHash2,toHex,createDeposit} = require('./utils')

nullifier= rbigint(31)
secret= rbigint(31)

console.log(nullifier, secret)

console.log(toHex('10160940168932820690179687741033766655634970837388373468269845742660786505016n'))