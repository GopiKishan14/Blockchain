const SHA256 = require('crypto-js/sha256');

const { PerformanceObserver, performance } = require('perf_hooks'); // for evaluating time duration of fuct

class Transaction{
    constructor(fromAddrs , toAddrs , amount){
        this.fromAddrs = fromAddrs;
        this.toAddrs = toAddrs;
        this.amount = amount;

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

    mineBlock(difficulty){

        var t0 = performance.now();

        while(this.hash.substring(0 , difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block Mined: "+ this.hash);

        var t1 = performance.now();
        console.log("Mining block transaction took " + (t1 - t0)/1000 + " seconds.")


        
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
        return new Block("05/12/2018" , "Genesis Block" , "0");
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
    minePendingTransactions(miningRewardAddrs){
        let block = new Block(Date.now() , this.pendingTransactions);

        block.mineBlock(this.difficulty);  //Adjusting initial hash to 0's a/c difficulty 

        console.log("Block successfully mined!");
        this.chain.push(block); // Adding block to blockchain


        // adding transaction to pendingTransc to give reward in next transc after one successful transaction
        this.pendingTransactions = [
            new Transaction(null , miningRewardAddrs , this.miningReward)
        ];

    }


    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddrs(address){
        let balance =0;
        for(const block of this.chain){
            for (const trans of block.transaction) {
                if(trans.fromAddrs === address){
                    balance -= trans.amount;
                }

                if(trans.toAddrs === address){
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }



    isChainValid(){
        for(let i=1 ; i < this.chain.length ; i++){
            const currentBlock = this.chain[i];
            const prevBlock = this.chain[i-1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.prevHash !== prevBlock.hash){
                return false;
            }
        }
        return true;
    }

}


let gkCoin = new Blockchain();

gkCoin.createTransaction(new Transaction('address1' , 'address2' , 100));

// gkCoin.createTransaction(new Transaction('address2' , 'address1' , 50));


console.log("\nBalance of address1 is" , gkCoin.getBalanceOfAddrs("address1"));
console.log("\nBalance of address2 is" , gkCoin.getBalanceOfAddrs("address2"));


console.log("\nStarting the miner...");
gkCoin.minePendingTransactions("miner_address");
console.log("\nBalance of miner is" , gkCoin.getBalanceOfAddrs("miner_address"));


console.log("\nBalance of address1 is" , gkCoin.getBalanceOfAddrs("address1"));
console.log("\nBalance of address2 is" , gkCoin.getBalanceOfAddrs("address2"));

gkCoin.createTransaction(new Transaction('address2' , 'address1' , 50));


console.log("\nStarting the miner...");
gkCoin.minePendingTransactions("miner_address");
console.log("\nBalance of miner is" , gkCoin.getBalanceOfAddrs("miner_address"));

console.log("\nStarting the miner again...");
gkCoin.minePendingTransactions("miner_address");
console.log("\nBalance of miner is" , gkCoin.getBalanceOfAddrs("miner_address"));



console.log("\nBalance of address1 is" , gkCoin.getBalanceOfAddrs("address1"));
console.log("\nBalance of address2 is" , gkCoin.getBalanceOfAddrs("address2"));



console.log("\nStarting the miner again...");
gkCoin.minePendingTransactions("miner_address");
console.log("\nBalance of miner is" , gkCoin.getBalanceOfAddrs("miner_address"));


console.log("\nStarting the miner again...");
gkCoin.minePendingTransactions("miner_address");
console.log("\nBalance of miner is" , gkCoin.getBalanceOfAddrs("miner_address"));

console.log("\nStarting the miner again...");
gkCoin.minePendingTransactions("miner_address");
console.log("\nBalance of miner is" , gkCoin.getBalanceOfAddrs("miner_address"));

// console.log("Mining Block 1...");
// gk.addBlock(new Block("06/12/2018" , "{amount = 10}"));
// console.log("Mining block 2...")
// gk.addBlock(new Block("12/12/2018" , "{amount = 20}"));






// console.log("Is chain valid? " + gk.isChainValid());

// gk.chain[1].transaction = "{amount = 100}";

// gk.chain[1].hash = gk.chain[1].calculateHash();

// console.log("Is chain valid? " + gk.isChainValid());


// console.log(JSON.stringify(gk , null , 4));