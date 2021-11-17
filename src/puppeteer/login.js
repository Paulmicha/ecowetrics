/**
 * @file
 * Contains Puppeteer user login functions.
 */

const fs = require('fs');
const { setting } = require('../settings.js');

/**
 * Performs new login when no cookies from previous attempt are found.
 *
 * @param {puppeteer.Page} page
 */
async function doLogin(page) {
  await page.goto(setting('loginUrl'));

  // Ensure login fields are present. TODO error handling.
  // TODO wip refactor in progress (get selectors from YAML settings).
  const loginElement = await page.waitForSelector(setting('login').userInputSelector);
  const passwordElement = await page.waitForSelector(setting('login').passInputSelector);
  const submitElement = await page.waitForSelector(setting('login').submitSelector);
  const rememberMeInputSelector = setting('login')?.rememberMeInputSelector;

  let rememberMeElement = null;
  if (rememberMeInputSelector) {
    rememberMeElement = await page.waitForSelector(setting('login').rememberMeInputSelector);
  }

  if (
    !loginElement || !passwordElement || !submitElement ||
    (rememberMeInputSelector && !rememberMeElement)
  ) {
    throw 'Specified login fields are not found in given login page.';
  }

  await page.type(setting('login').userInputSelector, setting('loginUser'));
  await page.type(setting('login').passInputSelector, setting('loginPass'));

  if (rememberMeInputSelector) {
    await page.click(setting('login').rememberMeInputSelector);
  }

  await page.click(setting('login').submitSelector);

  // After login is complete, we should have a menu bar with empty (or not)
  // notifications button. TODO fail handling ?
  const afterSubmit = setting('login')?.hooks?.after;
  if (afterSubmit) {
    if (afterSubmit?.waitForSelector) {
      await page.waitForSelector(afterSubmit.waitForSelector);
    }
    if (afterSubmit?.waitForNavigation) {
      await page.waitForNavigation();
    }
  }

  // Debug : screenshot to see result of login.
  // await page.screenshot({
  //   path: setting('outputBasePath') + '/debug-login.png',
  //   fullPage: true
  // });

  const cookies = await page.cookies();
  if (cookies) {
    fs.writeFileSync(setting('cookiesPath'), JSON.stringify(cookies, null, 2));
  } else {
    throw "No cookies were obtained after login ?";
  }
}

/**
 * Determines if a previous login attempt was successfully made.
 *
 * @returns {Boolean}
 */
function hasLoggedIn() {
  return fs.existsSync(setting('cookiesPath'));
}

/**
 * Either triggers the login process or loads previously created cookies.
 *
 * The browser is kept open across all URLs, so if you're keeping auth in
 * cookies then everything should be remembered between runs. If you store your
 * credentials in localStorage or anything other than a cookie you might want to
 * pair this option with --settings.disableStorageReset to force Lighthouse to
 * keep the cache state.
 *
 * See https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md#puppeteerscript
 *
 * @see setup() in src/lighthousePuppeteerScript.js
 *
 * @param {puppeteer.Page} page
 */
async function ensureLogin(page) {
  if (setting('login')) {
    if (!hasLoggedIn()) {
      console.log("do login");
      await doLogin(page);
    } else {
      console.log("load cookies");
      const cookiesString = fs.readFileSync(setting('cookiesPath'));
      const cookies = JSON.parse(cookiesString);
      await page.setCookie(...cookies);
    }
  }
}

module.exports = { ensureLogin };
