
/**
 * @file
 * GreenIT custom CLI.
 *
 * TODO refactor in progress.
 */

const puppeteer = require('puppeteer');
const createJsonReports = require('./greenit/cli-core/analysis.js.js').createJsonReports;
const create_global_report = require('./greenit/cli-core/reportGlobal.js.js').create_global_report;
const create_html_report = require('./greenit/cli-core/reportHtml.js.js').create_html_report;

/**
 * Command entry point.
 */
const main = async () => {
  // TODO single source of truth for these, for all tests using Puppeteer ?
  const browser = await puppeteer.launch({
    headless: true,
    args: browserArgs,
    ignoreDefaultArgs: [
      '--disable-gpu'
    ]
  });

  let reports;
  try {
    reports = await createJsonReports(browser, pagesInformations, options, proxy, headers);
  } finally {
    let pages = await browser.pages();
    await Promise.all(pages.map(page =>page.close()));
    await browser.close()
  }

  // TODO wip refactor in progress.
  let reportObj = await create_global_report(reports, options);
  await create_html_report(reportObj, options);
}

main().catch(e => console.error("ERROR : \n", e));
