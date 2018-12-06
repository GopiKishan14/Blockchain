const EC = require('elliptic').ec;

const ec = new EC('secp256k1');

//Generate a new key pair and convert them to hex-strings

const key  = ec.genKeyPair();
const publicKey = key.getPublic('hex');
const privateKey = key.getPrivate('hex');

//Printing the keys to console
console.log();
console.log('Your public key (also your wallet address)\n' , publicKey);

console.log();
console.log("Your private key (keep this secret! Used to sign transactions)\n" , privateKey);
