
/**
 * @file
 * Contains puppeteer customizations for lighthouse.
 *
 * See https://dzone.com/articles/lighthouse-ci-with-puppeteer
 * See https://www.puppeteersharp.com/api/PuppeteerSharp.LaunchOptions.html
 * See https://github.com/buildkite/docker-puppeteer/blob/master/example/integration-tests/index.test.js
 */

const fs = require('fs').promises;

// TODO wip refactor using separate action for login.
let counter = 1;

/**
 * Performs login.
 *
 * @param {puppeteer.Page} page
 */
async function doLogin(page) {
  const loginUrl = 'https://dev-luma-weever.mnemotix.com/';
  await page.goto(loginUrl);

  // Ensure login fields are present. TODO error handling.
  // TODO wip refactor in progress (get selectors from YAML settings).
  const loginElement = await page.waitForSelector('#email');
  const passwordElement = await page.waitForSelector('#password');
  const rememberMeElement = await page.waitForSelector('input[name="rememberMe"]');
  const submitElement = await page.waitForSelector('button[type="submit"]');
  if (!loginElement || !passwordElement || !rememberMeElement || !submitElement) {
    throw 'Specified login fields are not found in given login page.';
  }

  // TODO wip refactor in progress.
  await page.type('#email', process.env.LOGIN_USER);
  await page.type('#password', process.env.LOGIN_PASS);
  await page.click('input[name="rememberMe"]');
  await page.click('button[type="submit"]');

  // After login is complete, we should have a menu bar with empty (or not)
  // notifications button. TODO fail handling ?
  await page.waitForSelector('header.MuiAppBar-root .MuiIconButton-label > .MuiBadge-root');

  // Debug : screenshot to see result of login.
  // await page.screenshot({
  //   path: '/output/debug-login.png',
  //   fullPage: true
  // });

  // Backup cookies TODO evol : reuse for other tests - make it a dedicated
  // preliminary step ? Mutualiser puppeteer entre tous les outils ?
  const cookies = await page.cookies();
  await fs.writeFile('/output/cookies.json', JSON.stringify(cookies, null, 2));
}

/**
 * Like a "preprocess" step before running the test.
 *
 * @param {puppeteer.Browser} browser
 * @param {{url: string, options: LHCI.CollectCommand.Options}} context
 */
async function setup(browser, context) {
  const page = await browser.newPage();
  await page.setCacheEnabled(true);
  if (counter === 1) {
    console.log("do login");
    await doLogin(page);
  }
  else {
    console.log("already logged in");
    await page.goto(context.url);
  }
  await page.close();
  counter++;
}

module.exports = setup;
