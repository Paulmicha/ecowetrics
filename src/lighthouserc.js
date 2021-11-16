/**
 * @file
 * Contains LightHouse's Puppeteer settings.
 *
 * See https://dzone.com/articles/lighthouse-ci-with-puppeteer
 * See https://www.puppeteersharp.com/api/PuppeteerSharp.LaunchOptions.html
 * See https://github.com/buildkite/docker-puppeteer/blob/master/example/integration-tests/index.test.js
 */

const currentDate = new Date();

module.exports = {
  ci: {
    collect: {
      // REQUIRED for puppeteerLaunchOptions to be taken into account.
      // See https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md#puppeteerlaunchoptions
      puppeteerScript: './src/lighthousePuppeteerScript.js',
      puppeteerLaunchOptions: {
        // args: [
        //   '--no-sandbox',
        //   '--disable-setuid-sandbox',
        //   '--disable-dev-shm-usage'
        // ]
        args: [
          '--allow-no-sandbox-job',
          '--allow-sandbox-debugging',
          '--no-sandbox',
          '--disable-gpu',
          '--disable-gpu-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--display'
        ]
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

      // TODO wip refactor in progress
      url: [
        // 'http://node:3000/'
      ]
    },
    // HTML + Json output.
    upload: {
      target: 'filesystem',
      outputDir: `/output/${currentDate.getFullYear()}/${currentDate.getMonth() + 1}/${currentDate.getDate()}`,
      reportFilenamePattern: '%%PATHNAME%%-%%DATETIME%%-report.%%EXTENSION%%'
    },
    // Switch to server store. It allows for diffs, unlike Html + Json outputs.
    // TODO cannot have distinct runs with the same Git commit hash ?
    // upload: {
    //   target: 'lhci',
    //   token: process.env.BUILD_TOKEN,
    //   ignoreDuplicateBuildFailure: true,
    //   serverBaseUrl: process.env.SERVER_URL || 'http://lighthouse:9001/'
    // },
    // TODO read from YAML settings.
    assert: {
      "assertions": {
        "categories:performance": ["error", { "minScore": .1 }],
        "categories:accessibility": ["error", { "minScore": .3 }],
        "categories:best-practices": ["error", { "minScore": .3 }],
        "categories:seo": ["error", { "minScore": .1 }]
      }
    },
  },
};
