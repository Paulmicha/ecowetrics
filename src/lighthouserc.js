/**
 * @file
 * Contains LightHouse's Puppeteer settings.
 *
 * See https://dzone.com/articles/lighthouse-ci-with-puppeteer
 * See https://www.puppeteersharp.com/api/PuppeteerSharp.LaunchOptions.html
 * See https://github.com/buildkite/docker-puppeteer/blob/master/example/integration-tests/index.test.js
 */

const { setting } = require('./settings.js');

module.exports = {
  ci: {
    collect: {
      // REQUIRED for puppeteerLaunchOptions to be taken into account.
      // See https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md#puppeteerlaunchoptions
      puppeteerScript: './src/lighthousePuppeteerScript.js',
      puppeteerLaunchOptions: {
        args: setting('puppeteerLaunchOptionsArgs')
      },
      numberOfRuns: 1,
      disableStorageReset: true,
      settings: {
        // Don't clear localStorage/IndexedDB/etc before loading the page.
        "disableStorageReset": true,
        // Wait up to 40s for the page to load.
        "maxWaitForLoad": 40000,
        // Use applied throttling instead of simulated throttling.
        "throttlingMethod": "devtools"
      },
      url: setting('urls')
    },
    // HTML + Json output.
    upload: {
      target: 'filesystem',
      outputDir: setting('outputPath'),
      reportFilenamePattern: setting('outputFilenamesPrefix') +
        '-lhci-%%PATHNAME%%-report.%%EXTENSION%%'
    }
  }
};
