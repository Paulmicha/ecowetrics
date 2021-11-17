/**
 * @file
 * Contains Puppeteer "hooks" implementations (common actions like events).
 */

const { setting } = require('../settings.js');

/**
 * Executes operations that must run before the tests.
 *
 * @param {puppeteer.Page} page
 * @param {{ url: '', name: '', hooks?: { before?: {...} } }} settings : current
 *   page input settings.
 */
async function puppeteerBeforeHook(page, settings) {
  // If defined, global hooks run first. TODO [evol] allow opt-out on a per-page
  // basis ?
  const globalHooksBefore = setting('input')?.hooks?.before;
  if (globalHooksBefore) {
    if (globalHooksBefore?.waitForSelector) {
      await page.waitForSelector(globalHooksBefore.waitForSelector);
    }
    if (globalHooksBefore?.waitUntil) {
      await page.waitForNavigation({ waitUntil: globalHooksBefore.waitUntil });
    }
  }

  // Specific page hooks.
  const hooksBefore = settings?.hooks?.before;
  if (hooksBefore) {
    if (hooksBefore?.waitForSelector) {
      await page.waitForSelector(hooksBefore.waitForSelector);
    }
    if (hooksBefore?.waitUntil) {
      await page.waitForNavigation({ waitUntil: hooksBefore.waitUntil });
    }
  }
}

module.exports = { puppeteerBeforeHook };
