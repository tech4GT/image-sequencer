module.exports = function NdviColormapfunction() {

    this.expandSteps([
        { 'name': 'gradient', 'options': {} },
        { 'name': 'colormap', 'options': {} },
        { 'name': 'crop', 'options': { 'y': 0, 'h': 10 } },
        { 'name': 'overlay', 'options': { 'x': 0, 'y': 0, 'offset': -4 } }
    ]);
    return {
        isMeta: true
    }
}