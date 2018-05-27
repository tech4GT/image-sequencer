getPreviousStep = function () {
    return getStep(-1);
};

// getNextStep won't exactly be useful since module would have already been run

getIndex = function(){
    return getStep(0).options.number;
};

getInput = function(offset){
    if(offset + getIndex() === 0) offset++;
    return getStep(offset - 1).output;
};

getOuput = function(offset){
    return getStep(offset).output;
};