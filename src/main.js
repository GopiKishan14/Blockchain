const { Blockchain, Transaction } = require('./Blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

// My private key goes here and you can generate your own private keys from keygenerator.js and copy from console.
const gKishanKey = ec.keyFromPrivate('c94d5f099f5159f5bc7ac85f0a0ea6fb6753db138b05adc452924b39f59dfa08');

//Other keys 
const NatanshKey = ec.keyFromPrivate('f847352c8ef5bf99e859bd093fd98d6ceeec61d1c8f85ff19a13cdee27cf2ec4');
const HarshKey = ec.keyFromPrivate('6e146c51a11896652054c826804079b70e4722a5c533178964d80232f9ede87a');
const VishalKey = ec.keyFromPrivate('049abce5449df4a683807616d5d61417359a8866539a52048b9db97023db5e79');

// console.log(JSON.stringify(gKishanKey));

// From that we can calculate public key (which is also my wallet address)
const gKishanWalletAddress = gKishanKey.getPublic('hex');

// calculate others public key (which is also their wallet address)
const NatanshWalletAddress = NatanshKey.getPublic('hex');
const HarshWalletAddress = HarshKey.getPublic('hex');
const VishalWalletAddress = VishalKey.getPublic('hex');



// Create new instance of Blockchain class
// Name your own crypto-currency

const electroBucks = new Blockchain(); //my crypto-currency

// Create a transaction & sign it with your key
const tx1 = new Transaction(gKishanWalletAddress, VishalWalletAddress, 350);
tx1.signTransaction(gKishanKey);
electroBucks.addTransaction(tx1);

// Mine block
electroBucks.minePendingTransactions(gKishanWalletAddress); // Pass miner's walletAddress to give reward

// Create second transaction
const tx2 = new Transaction(NatanshWalletAddress, gKishanWalletAddress, 2200);
tx2.signTransaction(NatanshKey);
electroBucks.addTransaction(tx2);

// Mine block
electroBucks.minePendingTransactions(gKishanWalletAddress);

console.log();
console.log(`Balance of gKishan is ${electroBucks.getBalanceOfAddress(gKishanWalletAddress)}`);

// // Uncomment this line if you want to test tampering with the chain
// electroBucks.chain[1].amount = 10;

// Check if the chain is valid
console.log();
console.log('Blockchain valid?', electroBucks.isChainValid() ? 'Yes' : 'No');
