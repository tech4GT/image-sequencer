module.exports = function runInBrowserContext(input, callback, step, options) {

    // to ignore this from getting browserified
    const puppeteer = eval('require')('puppeteer');
    var obj = { input: input, modOptions: options }

    puppeteer.launch().then(function(browser) {
        browser.newPage().then(page => {
            /* Maybe there is a better way to this, loading the page coz localstorage API
            is not available otherwise */
            page.goto("https://google.com").then(() => {
                page.addScriptTag({ path: require('path').join(__dirname, '../../../dist/image-sequencer.js') }).then(() => {
                    page.evaluate((options) => {
                        return new Promise((resolve, reject) => {
                            var sequencer = ImageSequencer();
                            sequencer.loadImage(options.input.src);
                            sequencer.addSteps('fisheye-gl', options.modOptions);
                            sequencer.run(function cb(out) {
                                resolve(sequencer.steps[1].output.src)
                            });
                        })
                    }, obj).then(el => {
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