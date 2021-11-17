/**
 * @file
 * Contains common operations that need to run before any test.
 */

const fs = require('fs');
const mkdirp = require('mkdirp');
const { setting } = require('./settings.js');

if (!fs.existsSync(setting('outputBasePath'))) {
  mkdirp.sync(setting('outputBasePath'));
}
