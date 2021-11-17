/**
 * @file
 * Contains puppeteer customizations for lighthouse.
 *
 * TODO no way to run actions per page before the tests ?
 * @see puppeteerBeforeHook() in src/puppeteer/hooks.js
 *
 * See https://dzone.com/articles/lighthouse-ci-with-puppeteer
 * See https://www.puppeteersharp.com/api/PuppeteerSharp.LaunchOptions.html
 * See https://github.com/buildkite/docker-puppeteer/blob/master/example/integration-tests/index.test.js
 */

const { setting } = require('./settings.js');
const { ensureLogin } = require('./puppeteer/login.js');

/**
 * Like a "preprocess" step before running LightHouse tests.
 *
 * Deals with login using cookies.
 *
 * See https://stackoverflow.com/a/56515357/2592338
 * See https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md#puppeteerscript
 *
 * @param {puppeteer.Browser} browser
 * @param {{url: string, options: LHCI.CollectCommand.Options}} context
 */
async function setup(browser, context) {
  const page = await browser.newPage();

  // TODO common puppeteer setup steps ?
  // @see analyseURL() in src/greenit/cli-core/analysis.js
  await page.setCacheEnabled(true);
  if (setting('login')) {
    await ensureLogin(page);
  }

  await page.close();
}

module.exports = setup;
