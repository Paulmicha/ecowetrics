
/**
 * @file
 * YellowLabTools custom CLI.
 *
 * See https://github.com/YellowLabTools/YellowLabTools/wiki/NodeJS-module
 */

const fs = require('fs');
const ylt = require('yellowlabtools');
const puppeteer = require('puppeteer');
const { setting } = require('./settings.js');
const { ensureLogin, hasLoggedIn } = require('./puppeteer/login.js');

/**
 * Command entry point.
 */
const main = async () => {
  const urlsConfArr = setting('urlsConfArr');

  for (let i = 0; i < urlsConfArr.length; i++) {
    const input = urlsConfArr[i];
    const options = { device: setting('device') };

    if (setting('screenshot')) {
      options.screenshot = setting('outputPathPrefixed') +
        `-ylt-${input.name}-screenshot.png`;
    }

    if (setting('login')) {
      if (!hasLoggedIn()) {
        const browser = await puppeteer.launch({
          headless: true,
          args: setting('puppeteerLaunchOptionsArgs')
        });
        const page = await browser.newPage();
        await ensureLogin(page);
        await page.close();
      }
      if (!fs.existsSync(setting('cookiesPath'))) {
        throw "YellowLabsTools : unable to load cookies.";
      }

      // Transform cookies object into the string format expected by YLT.
      // See https://github.com/YellowLabTools/YellowLabTools/wiki/NodeJS-module#cookie-string
      // TODO Phantomas failed: Protocol error (Network.setCookies): Invalid
      // parameters Failed to deserialize params.cookies.expires - BINDINGS:
      // double value expected at position 3048.
      const cookiesRaw = JSON.parse(fs.readFileSync(setting('cookiesPath')).toString());
      options.cookie = cookiesRaw.map(cookie => {
        let outputParts = [];
        Object.keys(cookie).forEach(key => outputParts.push(key + '=' + cookie[key]));
        return outputParts.join(';');
      }).join('|');
    }

    // Debug.
    // console.log("YLT options :");
    // console.log(options);

    // TODO [evol] minimal report HTML template.
    ylt(input.url, options)
      .then(data => {
        fs.writeFileSync(
          setting('outputPathPrefixed') + `-ylt-${input.name}-report.json`,
          JSON.stringify(data, null, 2)
        );
      })
      .fail(err => {
        console.error('YellowLabsTools error : ', err);
      });
  }
};

main().catch(e => console.error("ERROR : \n", e));
