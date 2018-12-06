# Blockchain

A very simple blockchain implementation in Javascript.

This is by no means a complete implementation and it is by no means secure!

## Features

* Simple proof-of-work algorithm
* Verify blockchain (to prevent tampering)
* Generate wallet (private/public key)
* Sign transactions

## Installations and Set-up

#### Pre-requisites
```
Install Node.js
npm is distributed with Node.js- which means that when you download Node.js,
you automatically get npm installed on your computer.
```
https://www.npmjs.com/get-npm

#### Set-up

Clone the repo to your local machine :-

```
git clone https://github.com/GopiKishan14/Blockchain
cd Blockchain
```

Install dependencies :-

Run in terminal 

```
npm install 
```

(in package directory, no arguments):

This installs the dependencies in the local node_modules folder.

*Then* , 
`npm start`
 You can see certain transactions are already made.

### Testing 

#### Generating your own wallet-Address:
```
node src/keygenerator.js
```

```
This creates a new private and public key pair.
Save your private key. Certain Keys are already given in *src/keys.txt* for exporarion.
The public key is your wallet Address and the private key is used to sign the transaction.
```

#### Making a transaction :-

Add the following lines of code at end 

```
const yourKey = ec.keyFromPrivate('<your-private-key>');

const yourWalletAddress = yourKey.getPublic('hex');
```

Now you are registered and ready to make transaction to others wallets :-

```
const tx3 = new Transaction(yourWalletAddress, gKishanWalletAddress, 500);
tx3.signTransaction(yourKey);
electroBucks.addTransaction(tx3);
```

You may add several transactions in similar way.
Then , mine the block :-

```
electroBucks.minePendingTransactions(gKishanWalletAddress);
```
This will add extra 100 as mining reward to my wallet. You can pass your own walletAdd to get reward.

You can change the difficulty of mining. Go ahead and explore [**src/Blockchain**](https://github.com/GopiKishan14/Blockchain/blob/master/src/Blockchain.js)  
You can find it under Blockchain class.

Check the receiver's and your balance :-

```
console.log(`Balance of gKishan is ${electroBucks.getBalanceOfAddress(gKishanWalletAddress)}`);

console.log(`My Balance is ${electroBucks.getBalanceOfAddress(yourWalletAddress)}`);
```

Run the script :-

```
node src/main.js
```
*OR*
```
npm start
```
## Feedback

All kinds of feedback (code style, bugs, comments etc.) is welcome. Please open an [*Issue*](https://github.com/GopiKishan14/Blockchain/issues) on this Repository.

## Contribution Guidelines

If you are familiar with basics of contributing to github repositories, feel free to skip this section. For total beginners who landed up here, before contributing, take a look at the [blog-post](https://channelcs.github.io/best-practices-in-a-collaborative-environment.html) to get started. Peace out!



