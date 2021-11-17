/**
 * @file
 * Contains YAML settings parsing and fallback values.
 */

const fs = require('fs');
const path = require('path');
const YAML = require('yaml');
const filenamify = require('filenamify');
const { dateString, timeString } = require('./utils/date.js');

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
      return process.env?.OUTPUT_PATH || yamlSettings?.output?.path ||
        './output/' + setting('domain');

    // TODO [evol] allow override with or without date-based folder structure ?
    case 'outputPath':
      return `${setting('outputBasePath')}/${dateString(currentDate)}`;

    case 'outputFilenamesPrefix':
      return timeString(currentDate);

    case 'outputPathPrefixed':
      return path.resolve(setting('outputPath'), setting('outputFilenamesPrefix'));

    case 'cookiesPath':
      return process.env?.COOKIES_PATH || yamlSettings?.cookiesPath ||
        setting('outputBasePath') + '/cookies.json';

    case 'device':
      return process.env?.DEVICE || yamlSettings?.device || 'desktop';

    case 'timeout':
      return process.env?.TIMEOUT || yamlSettings?.timeout || 120000;

    case 'puppeteerLaunchOptionsArgs':
      const args = process.env?.P_LAUNCH_OPTIONS ||
        yamlSettings?.puppeteer?.launchOptions?.args ||
        '--no-sandbox --disable-setuid-sandbox --disable-dev-shm-usage --display';
      return args.split(' ').map(s => s.trim());

    case 'input':
      if (!yamlSettings?.input) {
        throw "Missing required setting : 'input' (no URLS to test).";
      }
      return yamlSettings.input;

    case 'urls':
    case 'urlsConf':
    case 'urlsConfArr':
    case 'urlsConfByUrl':
      const inputSettings = setting('input');

      // The 'hooks' entry is reserved to declare operations that must run on
      // all pages to test. Here, we only want individual pages details, so we
      // must exclude it.
      const onlyUrlsSettings = { ...inputSettings };
      if (onlyUrlsSettings?.hooks) {
        delete onlyUrlsSettings.hooks;
      }

      const urls = [];
      const urlsConfArr = [];
      const urlsConfByUrl = {};

      Object.keys(onlyUrlsSettings).forEach(name => {
        urls.push(onlyUrlsSettings[name].url);
        onlyUrlsSettings[name].name = name;
        urlsConfArr.push(onlyUrlsSettings[name]);
        urlsConfByUrl[onlyUrlsSettings[name].url] = onlyUrlsSettings[name];
      });

      if (key === 'urls') {
        return urls;
      } else if (key === 'urlsConf') {
        return onlyUrlsSettings;
      } else if (key === 'urlsConfArr') {
        return urlsConfArr;
      }
      return urlsConfByUrl;

    case 'login':
      return yamlSettings?.login;

    case 'loginUrl':
      return process.env?.LOGIN_URL || yamlSettings?.login?.url;

    case 'loginUser':
      return process.env?.LOGIN_USER || yamlSettings?.login?.user;

    case 'loginPass':
      return process.env?.LOGIN_PASS || yamlSettings?.login?.pass;

    case 'screenshot':
      return yamlSettings?.output?.screenshot;
  }
}

module.exports = { setting };
