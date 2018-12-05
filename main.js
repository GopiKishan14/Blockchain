const SHA256 = require('crypto-js/sha256');

const { PerformanceObserver, performance } = require('perf_hooks'); // for evaluating time duration of fuct

class Block{
    constructor(index , timestamp , data , prevHash= ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.prevHash = prevHash;
        this.hash = this.calculateHash();
        this.nonce =0;
    }

    calculateHash(){
        return SHA256(this.index + this.timestamp + JSON.stringify(this.data)+ this.nonce).toString();
    }

    mineBlock(difficulty){

        var t0 = performance.now();

        while(this.hash.substring(0 , difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block Mined: "+ this.hash);

        var t1 = performance.now();
        console.log("Mining block " + this.index+ " took " + (t1 - t0)/1000 + " seconds.")


        
    }

}


class Blockchain{

    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4; // increase the difficulty level to see effect on mining block
    }

    createGenesisBlock(){
        return new Block(0 , "05/12/2018" , "Genesis Block" , "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock){
        newBlock.prevHash = this.getLatestBlock().hash;
        // newBlock.hash = newBlock.calculateHash(); // Prev way of calculating hash
        newBlock.mineBlock(this.difficulty); // Mining block or Proof of work 
        this.chain.push(newBlock);
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


let gk = new Blockchain();

console.log("Mining Block 1...");
gk.addBlock(new Block(1 , "06/12/2018" , "{amount = 10}"));
console.log("Mining block 2...")
gk.addBlock(new Block(2 , "12/12/2018" , "{amount = 20}"));






// console.log("Is chain valid? " + gk.isChainValid());

// gk.chain[1].data = "{amount = 100}";

// gk.chain[1].hash = gk.chain[1].calculateHash();

// console.log("Is chain valid? " + gk.isChainValid());


// console.log(JSON.stringify(gk , null , 4));