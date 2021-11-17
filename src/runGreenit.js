/**
 * @file
 * GreenIT custom CLI.
 *
 * TODO refactor in progress.
 */

const fs = require('fs');
const puppeteer = require('puppeteer');
const { createJsonReports } = require('./greenit/cli-core/analysis.js');
const { create_global_report } = require('./greenit/cli-core/reportGlobal.js');
const { create_html_report } = require('./greenit/cli-core/reportHtml.js');
const { setting } = require('./settings.js');

/**
 * Command entry point.
 */
const main = async () => {
  const options = {
    timeout: setting('timeout'),
    max_tab: 10,
    retry: 2,
    domain: setting('domain'),
    device: setting('device'),
    worst_pages: 10,
    worst_rules: 10,
    format: 'html'
  };

  const browser = await puppeteer.launch({
    headless: true,
    args: setting('puppeteerLaunchOptionsArgs')
  });

  let reports;
  try {
    reports = await createJsonReports(browser, setting('urlsConfArr'), options);
  } finally {
    let pages = await browser.pages();
    await Promise.all(pages.map(page =>page.close()));
    await browser.close();
  }

  let reportObj = await create_global_report(reports, options);

  // Debug.
  // fs.writeFileSync(
  //   setting('outputBasePath') + '/greenit-debug-report.json',
  //   JSON.stringify(reportObj, null, 2)
  // );

  await create_html_report(reportObj, options);
}

main().catch(e => console.error("ERROR : \n", e));
