const SHA256 = require('crypto-js/sha256');

class Block{
    constructor(index , timestamp , data , prevHash= ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.prevHash = prevHash;
        this.hash = this.calculateHash();
    }

    calculateHash(){
        return SHA256(this.index + this.timestamp + JSON.stringify(this.data)).toString();
    }
}


class Blockchain{

    constructor(){
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock(){
        return new Block(0 , "05/12/2018" , "Genesis Block" , "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock){
        newBlock.prevHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
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
gk.addBlock(new Block(1 , "06/12/2018" , "{amount = 10}"));
gk.addBlock(new Block(2 , "12/12/2018" , "{amount = 20}"));

console.log("Is chain valid? " + gk.isChainValid());

gk.chain[1].data = "{amount = 100}";

gk.chain[1].hash = gk.chain[1].calculateHash();

console.log("Is chain valid? " + gk.isChainValid());


// console.log(JSON.stringify(gk , null , 4));