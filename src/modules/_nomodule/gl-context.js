module.exports = function runInBrowserContext(input, callback, step) {

    // to ignore this from getting browserified
    const puppeteer = eval('require')('puppeteer');

    puppeteer.launch().then(function(browser) {
        browser.newPage().then(page => {
            /* Maybe there is a better way to this, loading the page coz localstorage API
            is not available otherwise */
            page.goto("https://google.com").then(() => {
                page.addScriptTag({ path: require('path').join(__dirname, '../../../dist/image-sequencer.js') }).then(() => {
                    page.evaluate((ip) => {
                        return new Promise((resolve, reject) => {
                            var sequencer = ImageSequencer();
                            sequencer.loadImage(ip.src);
                            sequencer.addSteps('fisheye-gl');
                            sequencer.run(function cb(out) {
                                resolve(sequencer.steps[1].output.src)
                            });
                        })
                    }, input).then(el => {
                        browser.close().then(() => {
                            step.output = { src: el, format: input.format };
                            callback();
                        });
                    });
                })
            });
        });
    });
}