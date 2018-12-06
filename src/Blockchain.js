const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;

const ec = new EC('secp256k1');



const { PerformanceObserver, performance } = require('perf_hooks'); // for evaluating time duration of fuct

class Transaction{
    constructor(fromAddress , toAddress , amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
        this.timestamp = Date.now();
    }

    calculateHash(){
        return SHA256(this.fromAddress + this.toAddress + this.amount+this.timestamp)
            .toString();
    }


    signTransaction(signingKey){
         // You can only send a transaction from the wallet that is linked to your
        // key. So here we check if the fromAddress matches your publicKey
        if(signingKey.getPublic('hex') !== this.fromAddress){
            throw new Error('You can not sign transactions for other wallets!');
        }

        // Calculate the hash of this transaction, sign it with the key
        // and store it inside the transaction obect
        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx , 'base64');

        this.signature = sig.toDER('hex');
    
    }


    isValid(){
        // If the transaction doesn't have a fromAddress , assumed it's a
        // mining reward and that it's valid.

        if(!this.fromAddress === null) return true;

        if(!this.signature || this.signature.length === 0){
            throw new Error('No signature in this transaction');
        }

        const publicKey = ec.keyFromPublic(this.fromAddress , 'hex');
        return publicKey.verify(this.calculateHash() , this.signature);
    }

}

class Block{
    constructor(timestamp , transaction , prevHash= ''){
        this.timestamp = timestamp;
        this.transaction = transaction;
        this.prevHash = prevHash;
        this.hash = this.calculateHash();
        this.nonce =0;
    }

    calculateHash(){
        return SHA256( this.timestamp + JSON.stringify(this.transaction)+ this.nonce).toString();
    }

    //Starts the mining process on the block. It changes the 'nonce' until the hash
    //of the block starts with enough zeros (= difficulty)
    mineBlock(difficulty){

        var t0 = performance.now();

        while(this.hash.substring(0 , difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block Mined: "+ this.hash);

        var t1 = performance.now();
        console.log("Mining block transaction took " + (t1 - t0)/1000 + " seconds.");        
    }

    hasValidTransactions(){
        for(const tx of this.transaction){
            if(!tx.isValid()) return false;
        }
        return true;
    }

}


class Blockchain{

    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2; // increase the difficulty level to see effect on mining block
        this.pendingTransactions = [];
        this.miningReward = 100;
    
    }

    createGenesisBlock(){
        return new Block(Date.parse("05-12-2018") , [] , "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }


    //Old mining method :

    // addBlock(newBlock){
    //     newBlock.prevHash = this.getLatestBlock().hash;
    //     // newBlock.hash = newBlock.calculateHash(); // Prev way of calculating hash
    //     newBlock.mineBlock(this.difficulty); // Mining block or Proof of work 
    //     this.chain.push(newBlock);
    // }

    // method to add new transaction(block)

    //Takes all the pending transactions, puts them in a Block and starts the
    // mining process. It also adds a transaction to send the mining reward to
    // the given address.
    minePendingTransactions(miningRewardAddrs){
        // adding transaction to pendingTransc to give reward 
        const rewardTx = new Transaction(null ,miningRewardAddrs ,this.miningReward );
        this.pendingTransactions.push(rewardTx);


        let block = new Block(Date.now() , this.pendingTransactions , this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);  //Adjusting initial hash to 0's a/c difficulty 

        console.log("Block successfully mined!");
        this.chain.push(block); // Adding block to blockchain


        this.pendingTransactions = [];

    }

    /*
   * Add a new transaction to the list of pending transactions (to be added
   * next time the mining process starts). This verifies that the given
   * transaction is properly signed.
   */
    addTransaction(transaction){
        if (!transaction.fromAddress || !transaction.toAddress) {
            throw new Error('Transaction must include from and to address');
          }
        // Verify the transactiion
        if (!transaction.isValid()) {
            throw new Error('Cannot add invalid transaction to chain');
        }

        this.pendingTransactions.push(transaction);
    }

    /**
   * Returns the balance of a given wallet address.
   *
   * @param {string} address
   * @returns {number} The balance of the wallet
   */

    getBalanceOfAddress(address){
        let balance =0;


        for(const block of this.chain){
            for (const trans of block.transaction) {

                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }

                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }

    /**
   * Returns a list of all transactions that happened
   * to and from the given wallet address.
   *
   * @param  {string} address
   * @return {Transaction[]}
   */
    getAllTransactionsForWallet(address) {
        const txs = [];

        for (const block of this.chain) {
            for (const tx of block.transactions) {
                if (tx.fromAddress === address || tx.toAddress === address) {
                txs.push(tx);
                }
            }
        }

        return txs;
    }


    /**
   * Loops over all the blocks in the chain and verify if they are properly
   * linked together and nobody has tampered with the hashes. By checking
   * the blocks it also verifies the (signed) transactions inside of them.
   *
   * @returns {boolean}
   */
    isChainValid(){
        // Check if the Genesis block hasn't been tampered with by comparing
        // the output of createGenesisBlock with the first block on our chain
        const realGenesis = JSON.stringify(this.createGenesisBlock());

        if (realGenesis !== JSON.stringify(this.chain[0])) {
            console.log("Genesis block is tempered");
            return false;
        }
        // Check the remaining blocks on the chain to see if there hashes and
        // signatures are correct
        for(let i=1 ; i < this.chain.length ; i++){
            const currentBlock = this.chain[i];
            const prevBlock = this.chain[i-1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
                console.log("current block hash is tempered at : " + i);
                return false;
            }

            if(currentBlock.prevHash !== prevBlock.hash){
                console.log("Hash link is broken at : " + i);
                console.log(prevBlock.hash + "\n");
                console.log(currentBlock.prevHash + "\n");
                return false;
            }
        }
        console.log("Chain is valid");
        return true;
    }

}

module.exports.Blockchain = Blockchain;
module.exports.Block = Block;
module.exports.Transaction = Transaction;



// let gkCoin = new Blockchain();

// gkCoin.createTransaction(new Transaction('address1' , 'address2' , 100));

// // gkCoin.createTransaction(new Transaction('address2' , 'address1' , 50));


// console.log("\nBalance of address1 is" , gkCoin.getBalanceOfAddrs("address1"));
// console.log("\nBalance of address2 is" , gkCoin.getBalanceOfAddrs("address2"));


// console.log("\nStarting the miner...");
// gkCoin.minePendingTransactions("miner_address");
// console.log("\nBalance of miner is" , gkCoin.getBalanceOfAddrs("miner_address"));


// console.log("\nBalance of address1 is" , gkCoin.getBalanceOfAddrs("address1"));
// console.log("\nBalance of address2 is" , gkCoin.getBalanceOfAddrs("address2"));

// gkCoin.createTransaction(new Transaction('address2' , 'address1' , 50));


// console.log("\nStarting the miner...");
// gkCoin.minePendingTransactions("miner_address");
// console.log("\nBalance of miner is" , gkCoin.getBalanceOfAddrs("miner_address"));

// console.log("\nStarting the miner again...");
// gkCoin.minePendingTransactions("miner_address");
// console.log("\nBalance of miner is" , gkCoin.getBalanceOfAddrs("miner_address"));



// console.log("\nBalance of address1 is" , gkCoin.getBalanceOfAddrs("address1"));
// console.log("\nBalance of address2 is" , gkCoin.getBalanceOfAddrs("address2"));



// console.log("\nStarting the miner again...");
// gkCoin.minePendingTransactions("miner_address");
// console.log("\nBalance of miner is" , gkCoin.getBalanceOfAddrs("miner_address"));


// console.log("\nStarting the miner again...");
// gkCoin.minePendingTransactions("miner_address");
// console.log("\nBalance of miner is" , gkCoin.getBalanceOfAddrs("miner_address"));

// console.log("\nStarting the miner again...");
// gkCoin.minePendingTransactions("miner_address");
// console.log("\nBalance of miner is" , gkCoin.getBalanceOfAddrs("miner_address"));

// console.log("Mining Block 1...");
// gk.addBlock(new Block("06/12/2018" , "{amount = 10}"));
// console.log("Mining block 2...")
// gk.addBlock(new Block("12/12/2018" , "{amount = 20}"));






// console.log("Is chain valid? " + gk.isChainValid());

// gk.chain[1].transaction = "{amount = 100}";

// gk.chain[1].hash = gk.chain[1].calculateHash();

// console.log("Is chain valid? " + gk.isChainValid());


// console.log(JSON.stringify(gk , null , 4));