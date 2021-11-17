/**
 * @file
 * Contains YAML settings parsing and fallback values.
 */

const fs = require('fs');
const YAML = require('yaml');
const filenamify = require('filenamify');

let memoizedParsedYamlSettings;
const currentDate = new Date();

/**
 * Reads given YAML settings file, converting it to a memoized object.
 */
const getYamlSettings = settingsFile => {
  if (memoizedParsedYamlSettings) {
    return memoizedParsedYamlSettings;
  }
  try {
    memoizedParsedYamlSettings = YAML.parse(fs.readFileSync(settingsFile).toString());
  } catch (error) {
    throw `Settings are invalid`;
  }
  return memoizedParsedYamlSettings;
};

/**
 * Returns values by setting (ENV vars take precedence over Yaml settings).
 */
const setting = key => {
  const yamlSettings = getYamlSettings(process.env?.SETTINGS_FILE || './settings.yml');

  switch (key) {
    // Fallback to the domain of the first URL found in 'input'.
    case 'domain':
      let domain = process.env?.DOMAIN || yamlSettings?.domain;
      if (!domain) {
        domain = setting('urls')?.shift();
        if (domain) {
          domain = new URL(domain).hostname;
        }
      }
      if (!domain) {
        throw "Missing required setting : 'domain' (e.g. 'www.example.com').";
      }
      return filenamify(domain);

    case 'outputBasePath':
      return process.env?.OUTPUT_PATH || yamlSettings?.output_path ||
        './output/' + setting('domain');

    // TODO [evol] allow override with or without date-based folder structure ?
    case 'outputPath':
      return `${setting('outputBasePath')}/${currentDate.getFullYear()}/${currentDate.getMonth() + 1}/${currentDate.getDate()}`;

    case 'outputFilenamesPrefix':
      return `${currentDate.getHours()}-${currentDate.getMinutes()}-${currentDate.getSeconds()}`;

    case 'cookiesPath':
      return process.env?.COOKIES_PATH || yamlSettings?.cookiesPath ||
        setting('outputBasePath') + '/cookies.json';

    case 'device':
      return process.env?.DEVICE || yamlSettings?.device || 'desktop';

    case 'puppeteerLaunchOptionsArgs':
      return process.env?.P_LAUNCH_OPTIONS || yamlSettings?.puppeteer?.launchOptions?.args ||
        '--no-sandbox --disable-setuid-sandbox --disable-dev-shm-usage --display';

    case 'urls':
    case 'urlsConf':
      if (!yamlSettings?.input) {
        throw "Missing required setting : 'input' (no URLS to test).";
      }
      const urls = [];
      const inputConfByUrl = {};

      Object.keys(yamlSettings.input).forEach(name => {
        urls.push(yamlSettings.input[name].url);
        inputConfByUrl[yamlSettings.input[name].url] = yamlSettings.input[name];
      });

      return (key === 'urls') ? urls : inputConfByUrl;

    case 'login':
      return yamlSettings?.login;

    case 'loginUrl':
      return yamlSettings?.login?.url || process.env?.LOGIN_URL;

    case 'loginUser':
      return yamlSettings?.login?.user || process.env?.LOGIN_USER;

    case 'loginPass':
      return yamlSettings?.login?.pass || process.env?.LOGIN_PASS;
  }
}

module.exports = { setting };
