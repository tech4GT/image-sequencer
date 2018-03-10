/*
* Core modules and their info files
*/
const modInfo = require('./modules.json')
let obj = {}
for(let index in modInfo){
  let name = modInfo[index].name,modName = modInfo[index].module_name
  obj[name] = [
    require(`./modules/${modName}/Module`),
    require(`./modules/${modName}/info`)
  ]
}
module.exports = obj

// module.exports = {
//   'green-channel': [
//     require('./modules/GreenChannel/Module'),require('./modules/GreenChannel/info')
//   ],
//   'brightness': [
//     require('./modules/Brightness/Module'),require('./modules/Brightness/info')
//   ],
//   'edge-detect':[
//     require('./modules/EdgeDetect/Module'),require('./modules/EdgeDetect/info')
//   ],
//   'ndvi-red': [
//     require('./modules/NdviRed/Module'),require('./modules/NdviRed/info')
//   ],
//   'invert': [
//     require('./modules/Invert/Module'),require('./modules/Invert/info')
//   ],
//   'crop': [
//     require('./modules/Crop/Module'),require('./modules/Crop/info')
//   ],
//   'segmented-colormap': [
//     require('./modules/SegmentedColormap/Module'),require('./modules/SegmentedColormap/info')
//   ],
//   'decode-qr': [
//     require('./modules/DecodeQr/Module'),require('./modules/DecodeQr/info')
//   ],
//   'fisheye-gl': [
//     require('./modules/FisheyeGl/Module'),require('./modules/FisheyeGl/info')
//   ],
//   'dynamic': [
//     require('./modules/Dynamic/Module'),require('./modules/Dynamic/info')
//   ],
//   'blur': [
//     require('./modules/Blur/Module'),require('./modules/Blur/info')
//   ],
//   'saturation': [
//     require('./modules/Saturation/Module'),require('./modules/Saturation/info')
//   ]
// }
