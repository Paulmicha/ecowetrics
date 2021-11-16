/**
 * @file
 * Contains YAML settings parsing.
 */

const fs = require('fs');
const YAML = require('yaml');

/**
 * Reads given YAML settings file, converting it to an object.
 */
const settingsParse = settingsFile => {
  try {
    return YAML.parse(fs.readFileSync(settingsFile).toString());
  } catch (error) {
    throw `Settings are invalid`;
  }
};

module.exports = { settingsParse };
