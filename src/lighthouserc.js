/**
 * @file
 * Contains LightHouse's Puppeteer settings.
 *
 * See https://dzone.com/articles/lighthouse-ci-with-puppeteer
 * See https://www.puppeteersharp.com/api/PuppeteerSharp.LaunchOptions.html
 * See https://github.com/buildkite/docker-puppeteer/blob/master/example/integration-tests/index.test.js
 */

const { setting } = require('./settings.js');

// LigthHouse defaults to "mobile" settings. Attempt to provide desktop here.
// @see node_modules/lighthouse/lighthouse-core/config/lr-desktop-config.js
let lhCollectSettings = {
  // Don't clear localStorage/IndexedDB/etc before loading the page.
  "disableStorageReset": true,
  "maxWaitForFcp": setting('timeout'),
  "maxWaitForLoad": setting('timeout'),
  // Use applied throttling instead of simulated throttling.
  "throttlingMethod": "devtools"
};

if (setting('device') === 'desktop') {
  lhCollectSettings = {
    ...lhCollectSettings,
    // maxWaitForFcp: 15 * 1000,
    // maxWaitForLoad: 35 * 1000,
    formFactor: 'desktop',
    // See ./node_modules/lighthouse/lighthouse-core/config/constants.js
    // throttling: constants.throttling.desktopDense4G,
    throttling: {
      rttMs: 40,
      throughputKbps: 10 * 1024,
      cpuSlowdownMultiplier: 1,
      requestLatencyMs: 0, // 0 means unset
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0,
    },
    // screenEmulation: constants.screenEmulationMetrics.desktop,
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false,
    },
    // emulatedUserAgent: constants.userAgents.desktop,
    emulatedUserAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4420.0 Safari/537.36 Chrome-Lighthouse',
    // Skip the h2 audit so it doesn't lie to us. See https://github.com/GoogleChrome/lighthouse/issues/6539
    skipAudits: ['uses-http2']
  };
}

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
      settings: lhCollectSettings,
      url: setting('urls')
    },
    // HTML + Json output.
    upload: {
      target: 'filesystem',
      outputDir: setting('outputPath'),
      reportFilenamePattern: setting('outputFilenamesPrefix') +
        `-lhci-${setting('device')}-%%PATHNAME%%-report.%%EXTENSION%%`
    }
  }
};
