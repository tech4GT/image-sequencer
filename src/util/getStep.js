module.exports = {
    getPreviousStep : function () {
        return this.getStep(-1);
    },
    
    // getNextStep won't exactly be useful since module would have already been run
    
    getIndex : function(){
        return this.getStep(0).options.number;
    },
    
    getInput : function(offset){
        if(offset + this.getIndex() === 0) offset++;
        return this.getStep(offset - 1).output;
    },
    
    getOuput : function(offset){
        return this.getStep(offset).output;
    }
}