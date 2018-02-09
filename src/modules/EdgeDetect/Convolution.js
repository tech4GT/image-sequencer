//define kernels for the sobel filter
const kernelx = [[-1,0,1],[-2,0,2],[-1,0,1]],
kernely = [[-1,-2,-1],[0,0,0],[1,2,1]]

module.exports = exports =  function(pixels){

    for(var x = 0; x < pixels.shape[0]; x++) {
        for(var y = 0; y < pixels.shape[1]; y++) {
            
            var pixel = changePixel(
                pixels,
                pixels.get(x,y,0),
                pixels.get(x, y, 3),
                x,
                y
            );
            
            pixels.set(x, y, 0, pixel[0]);
            pixels.set(x, y, 1, pixel[1]);
            pixels.set(x, y, 2, pixel[2]);
            pixels.set(x, y, 3, pixel[3]);
            
        }
    }
    return pixels
}

//changepixel function that convolutes every pixel
function changePixel(pixels,val,a,x,y){
    let magX = 0.0
    for(let a = 0; a < 3; a++){
        for(let b = 0; b < 3; b++){ 
            
            let xn = x + a - 1;
            let yn = y + b - 1;
            
            magX += pixels.get(xn,yn,0) * kernelx[a][b];
        }
    }
    let magY = 0.0
    for(let a = 0; a < 3; a++){
        for(let b = 0; b < 3; b++){ 
            
            let xn = x + a - 1;
            let yn = y + b - 1;
            
            magY += pixels.get(xn,yn,0) * kernely[a][b];
        }
    }
    let mag = Math.sqrt(Math.pow(magX,2) + Math.pow(magY,2))
    return [val,val,val,mag]
}