/*
 *  Copyright (C) 2016  The EcoMeter authors (https://gitlab.com/ecoconceptionweb/ecometer)
 *  Copyright (C) 2019  didierfred@gmail.com 
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as published
 *  by the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

function start_analyse_core() {
  const analyseStartingTime = Date.now();
  const dom_size = document.getElementsByTagName("*").length;
  let pageAnalysis;

  if (analyseBestPractices) {
    // test with http://www.wickham43.net/flashvideo.php
    const pluginsNumber = getPluginsNumber();
    const printStyleSheetsNumber = getPrintStyleSheetsNumber();
    const inlineStyleSheetsNumber = getInlineStyleSheetsNumber();
    const emptySrcTagNumber = getEmptySrcTagNumber();
    const inlineJsScript = getInlineJsScript();
    const inlineJsScriptsNumber = getInlineJsScriptsNumber();
    const imagesResizedInBrowser = getImagesResizedInBrowser();


    pageAnalysis = {
      "analyseStartingTime": analyseStartingTime,
      "url": document.URL,
      "domSize": dom_size,
      "pluginsNumber": pluginsNumber,
      "printStyleSheetsNumber": printStyleSheetsNumber,
      "inlineStyleSheetsNumber": inlineStyleSheetsNumber,
      "emptySrcTagNumber": emptySrcTagNumber,
      "inlineJsScript": inlineJsScript,
      "inlineJsScriptsNumber": inlineJsScriptsNumber,
      "imagesResizedInBrowser": imagesResizedInBrowser,
    }
  }
  else pageAnalysis = {
    "analyseStartingTime": analyseStartingTime,
    "url": document.URL,
    "domSize": dom_size
  }

  return pageAnalysis;

}

function getPluginsNumber() {
  const plugins = document.querySelectorAll('object,embed');
  return (plugins === undefined) ? 0 : plugins.length;
}



function getEmptySrcTagNumber() {
  return document.querySelectorAll('img[src=""]').length
    + document.querySelectorAll('script[src=""]').length
    + document.querySelectorAll('link[rel=stylesheet][href=""]').length;
}


function getPrintStyleSheetsNumber() {
  return document.querySelectorAll('link[rel=stylesheet][media~=print]').length
    + document.querySelectorAll('style[media~=print]').length;
}

function getInlineStyleSheetsNumber() {
  let styleSheetsArray = Array.from(document.styleSheets);
  let inlineStyleSheetsNumber = 0;
  styleSheetsArray.forEach(styleSheet => {
    try {
      if (!styleSheet.href) inlineStyleSheetsNumber++;
    }
    catch (err) {
      console.log("GREENIT-ANALYSIS ERROR ," + err.name + " = " + err.message);
      console.log("GREENIT-ANALYSIS ERROR " + err.stack);
    }  
  });
return inlineStyleSheetsNumber;
}


function getInlineJsScript() {
  let scriptArray = Array.from(document.scripts);
  let scriptText = "";
  scriptArray.forEach(script => {
    let isJSON = (String(script.type) === "application/ld+json"); // Exclude type="application/ld+json" from parsing js analyse
    if ((script.text.length > 0) && (!isJSON)) scriptText += "\n" + script.text;
  });
  return scriptText;
}

function getInlineJsScriptsNumber() {
  let scriptArray = Array.from(document.scripts);
  let inlineScriptNumber = 0;
  scriptArray.forEach(script => {
    let isJSON = (String(script.type) === "application/ld+json"); // Exclude type="application/ld+json" from count
    if ((script.text.length > 0) && (!isJSON)) inlineScriptNumber++;
  });
  return inlineScriptNumber;
}


function getImagesResizedInBrowser() {
  const imgArray = Array.from(document.querySelectorAll('img'));
  let imagesResized = [];
  imgArray.forEach(img => {
    if (img.clientWidth < img.naturalWidth || img.clientHeight < img.naturalHeight) {
      // Images of one pixel are some times used ... , we exclude them
      if (img.naturalWidth > 1) 
      {
        const imageMeasures = {
          "src":img.src,
          "clientWidth":img.clientWidth,
          "clientHeight":img.clientHeight,
          "naturalWidth":img.naturalWidth,
          "naturalHeight":img.naturalHeight
        }
        imagesResized.push(imageMeasures);
      }
    }
  });
  return imagesResized;
}
/*
 *  Copyright (C) 2016  The EcoMeter authors (https://gitlab.com/ecoconceptionweb/ecometer)
 *  Copyright (C) 2019  didierfred@gmail.com 
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as published
 *  by the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


const DEBUG = true;
/*
requirejs.config({
  //By default load any module IDs from script
  baseUrl: 'script/externalLibs',
});

// Load module require.js
requirejs(['esprima'],
  (esprima) => console.log("Load esprima module"));
*/

const compressibleImage = [
  /^image\/bmp(;|$)/i,
  /^image\/svg\+xml(;|$)/i,
  /^image\/vnd\.microsoft\.icon(;|$)/i,
  /^image\/x-icon(;|$)/i,
];

const image = [
  /^image\/gif(;|$)/i,
  /^image\/jpeg(;|$)/i,
  /^image\/png(;|$)/i,
  /^image\/tiff(;|$)/i,
].concat(compressibleImage);

const css = [
  /^text\/css(;|$)/i,
];

const javascript = [
  /^text\/javascript(;|$)/i,
  /^application\/javascript(;|$)/i,
  /^application\/x-javascript(;|$)/i,
];

const compressibleFont = [
  /^font\/eot(;|$)/i,
  /^font\/opentype(;|$)/i,
];

const font = [
  /^application\/x-font-ttf(;|$)/i,
  /^application\/x-font-opentype(;|$)/i,
  /^application\/font-woff(;|$)/i,
  /^application\/x-font-woff(;|$)/i,
  /^application\/font-woff2(;|$)/i,
  /^application\/vnd.ms-fontobject(;|$)/i,
  /^application\/font-sfnt(;|$)/i,
  /^font\/woff2(;|$)/i,
].concat(compressibleFont);

const manifest = [
  /^text\/cache-manifest(;|$)/i,
  /^application\/x-web-app-manifest\+json(;|$)/i,
  /^application\/manifest\+json(;|$)/i,
];

// Mime types from H5B project recommendations
// See https://github.com/h5bp/server-configs-apache/blob/master/dist/.htaccess#L741
const compressible = [
  /^text\/html(;|$)/i,
  /^text\/plain(;|$)/i,
  /^text\/xml(;|$)/i,
  /^application\/json(;|$)/i,
  /^application\/atom\+xml(;|$)/i,
  /^application\/ld\+json(;|$)/i,
  /^application\/rdf\+xml(;|$)/i,
  /^application\/rss\+xml(;|$)/i,
  /^application\/schema\+json(;|$)/i,
  /^application\/vnd\.geo\+json(;|$)/i,
  /^application\/vnd\.ms-fontobject(;|$)/i,
  /^application\/xhtml\+xml(;|$)/i,
  /^application\/xml(;|$)/i,
  /^text\/vcard(;|$)/i,
  /^text\/vnd\.rim\.location\.xloc(;|$)/i,
  /^text\/vtt(;|$)/i,
  /^text\/x-component(;|$)/i,
  /^text\/x-cross-domain-policy(;|$)/i,
].concat(javascript, css, compressibleImage, compressibleFont, manifest);

const audio = [
  /^audio\/mpeg(;|$)/i,
  /^audio\/x-ms-wma(;|$)/i,
  /^audio\/vnd.rn-realaudio(;|$)/i,
  /^audio\/x-wav(;|$)/i,
  /^application\/ogg(;|$)/i,
];

const video = [
  /^video\/mpeg(;|$)/i,
  /^video\/mp4(;|$)/i,
  /^video\/quicktime(;|$)/i,
  /^video\/x-ms-wmv(;|$)/i,
  /^video\/x-msvideo(;|$)/i,
  /^video\/x-flv(;|$)/i,
  /^video\/webm(;|$)/i,
];

const others = [
  /^application\/x-shockwave-flash(;|$)/i,
  /^application\/octet-stream(;|$)/i,
  /^application\/pdf(;|$)/i,
  /^application\/zip(;|$)/i,
];

const staticResources = [].concat(image, javascript, font, css, audio, video, manifest, others);


const httpCompressionTokens = [
  'br',
  'compress',
  'deflate',
  'gzip',
  'pack200-gzip',
];

const httpRedirectCodes = [301, 302, 303, 307];

// utils for cache rule 
function isStaticRessource(resource) {
  const contentType = getResponseHeaderFromResource(resource, "content-type");
  return staticResources.some(value => value.test(contentType));
}

function isFontResource(resource) {
  const contentType = getResponseHeaderFromResource(resource, "content-type");
  if (font.some(value => value.test(contentType))) return true;
  // if not check url , because sometimes content-type is set to text/plain 
  if (contentType === "text/plain" || contentType==="" || contentType =="application/octet-stream") {
    const url = resource.request.url;
    if (url.endsWith(".woff")) return true;
    if (url.endsWith(".woff2")) return true;
    if (url.includes(".woff?")) return true;
    if (url.includes(".woff2?")) return true;
    if (url.includes(".woff2.json")) return true;
  }
  return false;
}

function getHeaderWithName(headers, headerName) {
  let headerValue = "";
  headers.forEach(header => {
    if (header.name.toLowerCase() === headerName.toLowerCase()) headerValue = header.value;
  });
  return headerValue;
}

function getResponseHeaderFromResource(resource, headerName) {
  return getHeaderWithName(resource.response.headers, headerName);
}

function getCookiesLength(resource) {
  let cookies = getHeaderWithName(resource.request.headers, "cookie");
  if (cookies) return cookies.length;
  else return 0;
}


function hasValidCacheHeaders(resource) {

  const headers = resource.response.headers;
  let cache = {};
  let isValid = false;

  headers.forEach(header => {
    if (header.name.toLowerCase() === 'cache-control') cache.CacheControl = header.value;
    if (header.name.toLowerCase() === 'expires') cache.Expires = header.value;
    if (header.name.toLowerCase() === 'date') cache.Date = header.value;
  });

  // debug(() => `Cache headers gathered: ${JSON.stringify(cache)}`);

  if (cache.CacheControl) {
    if (!(/(no-cache)|(no-store)|(max-age\s*=\s*0)/i).test(cache.CacheControl)) isValid = true;
  }

  if (cache.Expires) {
    let now = cache.Date ? new Date(cache.Date) : new Date();
    let expires = new Date(cache.Expires);
    // Expires is in the past
    if (expires < now) {
      //debug(() => `Expires header is in the past ! ${now.toString()} < ${expires.toString()}`);
      isValid = false;
    }
  }

  return isValid;
}


// utils for compress rule 
function isCompressibleResource(resource) {
  if (resource.response.content.size <= 150) return false;
  const contentType = getResponseHeaderFromResource(resource, "content-type");
  return compressible.some(value => value.test(contentType));
}

function isResourceCompressed(resource) {
  const contentEncoding = getResponseHeaderFromResource(resource, "content-encoding");
  return ((contentEncoding.length > 0) && (httpCompressionTokens.indexOf(contentEncoding.toLocaleLowerCase()) !== -1));
}

// utils for ETags rule 
function isRessourceUsingETag(resource) {
  const eTag = getResponseHeaderFromResource(resource, "ETag");
  if (eTag === "") return false;
  return true;
}

function getDomainFromUrl(url) {
  var elements = url.split("//");
  if (elements[1] === undefined) return "";
  else {
    elements = elements[1].split('/'); // get domain with port
    elements = elements[0].split(':'); // get domain without port 
  }
  return elements[0];
}

/**
* Count character occurences in the given string
*/
function countChar(char, str) {
  let total = 0;
  str.split("").forEach(curr => {
    if (curr === char) total++;
  });
  return total;
}

/**
 * Detect minification for Javascript and CSS files
 */
function isMinified(scriptContent) {

  if (!scriptContent) return true;
  if (scriptContent.length === 0) return true;
  const total = scriptContent.length - 1;
  const semicolons = countChar(';', scriptContent);
  const linebreaks = countChar('\n', scriptContent);
  if (linebreaks < 2) return true;
  // Empiric method to detect minified files
  //
  // javascript code is minified if, on average:
  //  - there is more than one semicolon by line
  //  - and there are more than 100 characters by line
  return semicolons / linebreaks > 1 && linebreaks / total < 0.01;

}

/**
 * Detect network resources (data urls embedded in page is not network resource)
 *  Test with request.url as  request.httpVersion === "data"  does not work with old chrome version (example v55)
 */
function isNetworkResource(harEntry) {
  return !(harEntry.request.url.startsWith("data"));
}

/**
 * Detect non-network resources (data urls embedded in page)
 *  Test with request.url as  request.httpVersion === "data"  does not work with old chrome version (example v55)
 */
function isDataResource(harEntry) {
  return (harEntry.request.url.startsWith("data"));
}

function computeNumberOfErrorsInJSCode(code, url) {
  let errorNumber = 0;
  try {
    const syntax = require("esprima").parse(code, { tolerant: true, sourceType: 'script', loc: true });
    if (syntax.errors) {
      if (syntax.errors.length > 0) {
        errorNumber += syntax.errors.length;
        debug(() => `url ${url} : ${Syntax.errors.length} errors`);
      }
    }
  } catch (err) {
    errorNumber++;
    debug(() => `url ${url} : ${err} `);
  }
  return errorNumber;
}

function isHttpRedirectCode(code) {
  return httpRedirectCodes.some(value => value === code);
}


function getImageTypeFromResource(resource) {
  const contentType = getResponseHeaderFromResource(resource, "content-type");
  if (contentType === "image/png") return "png";
  if (contentType === "image/jpeg") return "jpeg";
  if (contentType === "image/gif") return "gif";
  if (contentType === "image/bmp") return "bmp";
  if (contentType === "image/tiff") return "tiff";
  return "";
}


function getMinOptimisationGainsForImage(pixelsNumber, imageSize, imageType) {

  // difficult to get good compression when image is small , images less than 10Kb are considered optimized
  if (imageSize < 10000) return 0;

  // image png or gif < 50Kb  are considered optimized (used for transparency not supported in jpeg format)
  if ((imageSize < 50000) && ((imageType === 'png') || (imageType === 'gif'))) return 0;

  let imgMaxSize = Math.max(pixelsNumber / 5, 10000); //  difficult to get under 10Kb 

  // image > 500Kb are too big for web site , there are considered never optimized 
  if (imageSize > 500000) return Math.max(imageSize - 500000, imageSize - imgMaxSize);

  return Math.max(0, imageSize - imgMaxSize);
}

function isSvgUrl(url) {
  if (url.endsWith(".svg")) return true;
  if (url.includes(".svg?")) return true;
  return false;
}

function isSvgOptimized(svgImage) {
  if (svgImage.length < 1000) return true; // do not consider image < 1KB 
  if (svgImage.search(" <") === -1) return true;
  return false;
}



function getOfficialSocialButtonFormUrl(url)
{
  if (url.includes("platform.twitter.com/widgets.js")) return "tweeter";
  if (url.includes("platform.linkedin.com/in.js")) return "linkedin"; 
  if (url.includes("assets.pinterest.com/js/pinit.js")) return "pinterest";
  if (url.includes("connect.facebook.net") && url.includes("sdk.js")) return "facebook"; 
  if (url.includes("platform-api.sharethis.com/js/sharethis.js")) return "sharethis.com (mutliple social network) ";
  if (url.includes("s7.addthis.com/js/300/addthis_widget.js")) return "addthis.com (mutliple social network) ";
  if (url.includes("static.addtoany.com/menu/page.js")) return "addtoany.com (mutliple social network) ";
  return "";
}

function debug(lazyString) {
  if (!DEBUG) return;
  const message = typeof lazyString === 'function' ? lazyString() : lazyString;
  console.log(`GreenIT-Analysis [DEBUG] ${message}\n`);
}
/*
 *  Copyright (C) 2019  didierfred@gmail.com 
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as published
 *  by the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

rulesManager = new RulesManager();

function RulesManager() {

  let rulesId = [];
  let rulesChecker = new Map();
  let eventListeners = new Map();
  let notCompatibleRules = [];
  eventListeners.set("harReceived", []);
  eventListeners.set("frameMeasuresReceived", []);
  eventListeners.set("resourceContentReceived", []);

  this.registerRule = function (ruleChecker, eventListener) {
    rulesId.push(ruleChecker.id);
    rulesChecker.set(ruleChecker.id, ruleChecker);
    let event = eventListeners.get(eventListener);
    if (event) event.push(ruleChecker.id);
  }

  this.getRulesId = function () {
    return rulesId;
  }

  this.getRulesNotCompatibleWithCurrentBrowser = function () {
    return notCompatibleRules;

  }

  this.getNewRulesChecker = function () {
    return new RulesChecker();
  }

  function RulesChecker() {
    let rules = new Map();
    rulesChecker.forEach((ruleChecker, ruleId) => {
      let ruleCheckerInstance = Object.create(ruleChecker)
      // for certains rules need an initalization , method not implemented in all rules
      if (ruleCheckerInstance.initialize) ruleCheckerInstance.initialize();
      rules.set(ruleId, ruleCheckerInstance);
    });

    this.sendEvent = function (event, measures, resource) {

      eventListener = eventListeners.get(event);
      if (eventListener) {
        eventListener.forEach(ruleID => {
          this.checkRule(ruleID, measures, resource);
        });
      }
    }

    this.checkRule = function (rule, measures, resource) {
      rules.get(rule).check(measures, resource);
    }

    this.getRule = function (rule) {
      return rules.get(rule);
    }

    this.getAllRules = function () {
      return rules;
    }
  }
}
/*
 *  Copyright (C) 2019  didierfred@gmail.com 
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as published
 *  by the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

let quantiles_dom = [0, 47, 75, 159, 233, 298, 358, 417, 476, 537, 603, 674, 753, 843, 949, 1076, 1237, 1459, 1801, 2479, 594601];
let quantiles_req = [0, 2, 15, 25, 34, 42, 49, 56, 63, 70, 78, 86, 95, 105, 117, 130, 147, 170, 205, 281, 3920];
let quantiles_size = [0, 1.37, 144.7, 319.53, 479.46, 631.97, 783.38, 937.91, 1098.62, 1265.47, 1448.32, 1648.27, 1876.08, 2142.06, 2465.37, 2866.31, 3401.59, 4155.73, 5400.08, 8037.54, 223212.26];


/**
Calcul ecoIndex based on formula from web site www.ecoindex.fr
**/
function computeEcoIndex(dom,req,size)
{

const q_dom= computeQuantile(quantiles_dom,dom);
const q_req= computeQuantile(quantiles_req,req);
const q_size= computeQuantile(quantiles_size,size);


return Math.round(100 - 5 * (3*q_dom + 2*q_req + q_size)/6);
}

function computeQuantile(quantiles,value)
{
for (let i=1;i<quantiles.length;i++)
	{
	if (value<quantiles[i]) return (i + (value-quantiles[i-1])/(quantiles[i] -quantiles[i-1]));
	}
return quantiles.length;
}


function getEcoIndexGrade(ecoIndex)
{
if (ecoIndex > 75) return "A";
if (ecoIndex > 65) return "B";
if (ecoIndex > 50) return "C";
if (ecoIndex > 35) return "D";
if (ecoIndex > 20) return "E";
if (ecoIndex > 5) return "F";
return "G";
}

function computeGreenhouseGasesEmissionfromEcoIndex(ecoIndex)
{
	return (Math.round(100 * (2 + 2 * (50 - ecoIndex) / 100)) / 100);
}

function computeWaterConsumptionfromEcoIndex(ecoIndex)
{
	return (Math.round(100 * (3 + 3 * (50 - ecoIndex) / 100)) / 100);
}

rulesManager.registerRule({
    complianceLevel: 'A',
    id: "AddExpiresOrCacheControlHeaders",
    comment: "",
    detailComment: "",

    check: function (measures) {
        let staticResourcesSize = 0;
        let staticResourcesWithCache = 0;

        if (measures.entries.length) measures.entries.forEach(entry => {
            if (isStaticRessource(entry)) {
                staticResourcesSize += entry.response.content.size;
                if (hasValidCacheHeaders(entry)) {
                    staticResourcesWithCache += entry.response.content.size;
                }
                else this.detailComment += chrome.i18n.getMessage("rule_AddExpiresOrCacheControlHeaders_DetailComment",`${entry.request.url} ${Math.round(entry.response.content.size / 100) / 10}`) + '<br>';
            }
        });

        if (staticResourcesSize > 0) {
            const cacheHeaderRatio = staticResourcesWithCache / staticResourcesSize * 100;
            if (cacheHeaderRatio < 95) {
                if (cacheHeaderRatio < 90) this.complianceLevel = 'C'
                else this.complianceLevel = 'B';
            }
            else this.complianceLevel = 'A';
            this.comment = chrome.i18n.getMessage("rule_AddExpiresOrCacheControlHeaders_Comment", String(Math.round(cacheHeaderRatio * 10) / 10) + "%");
        }
    }
}, "harReceived");  rulesManager.registerRule({
    complianceLevel: 'A',
    id: "CompressHttp",
    comment: "",
    detailComment: "",

    check: function (measures) {
        let compressibleResourcesSize = 0;
        let compressibleResourcesCompressedSize = 0;
        if (measures.entries.length) measures.entries.forEach(entry => {
            if (isCompressibleResource(entry)) {
                compressibleResourcesSize += entry.response.content.size;
                if (isResourceCompressed(entry)) {
                    compressibleResourcesCompressedSize += entry.response.content.size;
                }
                else this.detailComment += chrome.i18n.getMessage("rule_CompressHttp_DetailComment",`${entry.request.url} ${Math.round(entry.response.content.size / 100) / 10}`) + '<br>';
            }
        });
        if (compressibleResourcesSize > 0) {
            const compressRatio = compressibleResourcesCompressedSize / compressibleResourcesSize * 100;
            if (compressRatio < 95) {
                if (compressRatio < 90) this.complianceLevel = 'C'
                else this.complianceLevel = 'B';
            }
            else this.complianceLevel = 'A';
            this.comment = chrome.i18n.getMessage("rule_CompressHttp_Comment", String(Math.round(compressRatio * 10) / 10) + "%");
        }
    }
}, "harReceived");rulesManager.registerRule({
    complianceLevel: 'A',
    id: "DomainsNumber",
    comment: "",
    detailComment: "",

    check: function (measures) {
        let domains = [];
        if (measures.entries.length) measures.entries.forEach(entry => {
            let domain = getDomainFromUrl(entry.request.url);
            if (domains.indexOf(domain) === -1) {
                domains.push(domain);
            }
        });
        if (domains.length > 2) {
            if (domains.length === 3) this.complianceLevel = 'B';
            else this.complianceLevel = 'C';
        }
        domains.forEach(domain => {
            this.detailComment += domain + "<br>";
        });

        this.comment = chrome.i18n.getMessage("rule_DomainsNumber_Comment", String(domains.length));
    }
}, "harReceived");rulesManager.registerRule({
    complianceLevel: 'A',
    id: "DontResizeImageInBrowser",
    comment: "",
    detailComment: "",
    imagesResizedInBrowserNumber: 0,
    imgAnalysed: new Map(),

    // need to get a new map , otherwise it's share between instance 
    initialize: function () {
        this.imgAnalysed = new Map();
    },

    isRevelant: function (entry) {
        // exclude svg
        if (isSvgUrl(entry.src)) return false;

        // difference of 1 pixel is not relevant 
        if (entry.naturalWidth - entry.clientWidth < 2) return false;
        if (entry.naturalHeight - entry.clientHeight < 2) return false;

        // If picture is 0x0 it meens it's not visible on the ui , see imageDownloadedNotDisplayed
        if (entry.clientWidth === 0) return false;

        return true;
    },

    check: function (measures) {
        measures.imagesResizedInBrowser.forEach(entry => {
            if (!this.imgAnalysed.has(entry.src) && this.isRevelant(entry)) { // Do not count two times the same picture
                this.detailComment += chrome.i18n.getMessage("rule_DontResizeImageInBrowser_DetailComment",[entry.src,`${entry.naturalWidth}x${entry.naturalHeight}`,`${entry.clientWidth}x${entry.clientHeight}`]) + '<br>';
                this.imgAnalysed.set(entry.src);
                this.imagesResizedInBrowserNumber += 1;
            }
        });
        if (this.imagesResizedInBrowserNumber > 0) this.complianceLevel = 'C';
        this.comment = chrome.i18n.getMessage("rule_DontResizeImageInBrowser_Comment", String(this.imagesResizedInBrowserNumber));
    }
}, "frameMeasuresReceived");rulesManager.registerRule({
    complianceLevel: 'A',
    id: "EmptySrcTag",
    comment: "",
    detailComment: "",

    check: function (measures) {
        if (measures.emptySrcTagNumber > 0) {
            this.complianceLevel = 'C';
            this.comment = chrome.i18n.getMessage("rule_EmptySrcTag_Comment", String(measures.emptySrcTagNumber));
        }
    }
}, "frameMeasuresReceived");rulesManager.registerRule({
    complianceLevel: 'A',
    id: "ExternalizeCss",
    comment: "",
    detailComment: "",

    check: function (measures) {
        if (measures.inlineStyleSheetsNumber > 0) {
            this.complianceLevel = 'C';
            this.comment = chrome.i18n.getMessage("rule_ExternalizeCss_Comment", String(measures.inlineStyleSheetsNumber));
        }
    }
}, "frameMeasuresReceived");rulesManager.registerRule({
    complianceLevel: 'A',
    id: "ExternalizeJs",
    comment: "",
    detailComment: "",

    check: function (measures) {
        if (measures.inlineJsScriptsNumber > 0) {
            if (measures.inlineJsScriptsNumber > 1) this.complianceLevel = 'C';
            this.comment = chrome.i18n.getMessage("rule_ExternalizeJs_Comment", String(measures.inlineJsScriptsNumber));

        }
    }
}, "frameMeasuresReceived");rulesManager.registerRule({
    complianceLevel: 'A',
    id: "HttpError",
    comment: "",
    detailComment: "",
  
    check: function (measures) {
      let errorNumber = 0;
      if (measures.entries.length) measures.entries.forEach(entry => {
        if (entry.response) {
          if (entry.response.status >=400  ) {
            this.detailComment += entry.response.status + " " + entry.request.url + "<br>";
            errorNumber++;
          }
        }
      });
      if (errorNumber > 0) this.complianceLevel = 'C';
      this.comment = chrome.i18n.getMessage("rule_HttpError_Comment", String(errorNumber));
    }
  }, "harReceived");rulesManager.registerRule({
    complianceLevel: 'A',
    id: "HttpRequests",
    comment: "",
    detailComment: "",

    check: function (measures) {
        if (measures.entries.length) measures.entries.forEach(entry => {
            this.detailComment += entry.request.url + "<br>";
        });
        if (measures.nbRequest > 40) this.complianceLevel = 'C';
        else if (measures.nbRequest > 26) this.complianceLevel = 'B';
        this.comment = chrome.i18n.getMessage("rule_HttpRequests_Comment", String(measures.nbRequest));
    }
}, "harReceived");rulesManager.registerRule({
    complianceLevel: 'A',
    id: "ImageDownloadedNotDisplayed",
    comment: "",
    detailComment: "",
    imageDownloadedNotDisplayedNumber: 0,
    imgAnalysed: new Map(),

    // need to get a new map , otherwise it's share between instance
    initialize: function () {
        this.imgAnalysed = new Map();
    },

    isRevelant: function (entry) {
        // Very small images could be download even if not display  as it may be icons 
        if (entry.naturalWidth * entry.naturalHeight < 10000) return false;
        if (entry.clientWidth === 0 && entry.clientHeight === 0) return true;
        return false;
    },

    check: function (measures) {
        measures.imagesResizedInBrowser.forEach(entry => {
            if (!this.imgAnalysed.has(entry.src) && this.isRevelant(entry)) { // Do not count two times the same picture
                this.detailComment += chrome.i18n.getMessage("rule_ImageDownloadedNotDisplayed_DetailComment",[entry.src,`${entry.naturalWidth}x${entry.naturalHeight}`]) + '<br>';
                this.imgAnalysed.set(entry.src);
                this.imageDownloadedNotDisplayedNumber += 1;
            }
        });
        if (this.imageDownloadedNotDisplayedNumber > 0) this.complianceLevel = 'C';
        this.comment = chrome.i18n.getMessage("rule_ImageDownloadedNotDisplayed_Comment", String(this.imageDownloadedNotDisplayedNumber));
    }
}, "frameMeasuresReceived");rulesManager.registerRule({
    complianceLevel: 'A',
    id: "JsValidate",
    comment: "",
    detailComment: "",
    errors: 0,
    totalJsSize: 0,

    check: function (measures, resourceContent) {
        if (resourceContent.type === "script") {
            this.totalJsSize += resourceContent.content.length;
            let errorNumber = computeNumberOfErrorsInJSCode(resourceContent.content, resourceContent.url);
            if (errorNumber > 0) {
                this.detailComment += (`URL ${resourceContent.url} has ${errorNumber} error(s) <br>`);
                this.errors += errorNumber;
                this.complianceLevel = 'C';
                this.comment = chrome.i18n.getMessage("rule_JsValidate_Comment", String(this.errors));
            }
        }
    }
}, "resourceContentReceived");rulesManager.registerRule({
    complianceLevel: 'A',
    id: "MaxCookiesLength",
    comment: "",
    detailComment: "",

    check: function (measures) {
        let maxCookiesLength = 0;
        let domains = new Map();
        if (measures.entries.length) measures.entries.forEach(entry => {
            const cookiesLength = getCookiesLength(entry);
            if (cookiesLength !== 0) {
                let domain = getDomainFromUrl(entry.request.url);
                if (domains.has(domain)) {
                    if (domains.get(domain) < cookiesLength) domains.set(domain, cookiesLength);
                }
                else domains.set(domain, cookiesLength);
                if (cookiesLength > maxCookiesLength) maxCookiesLength = cookiesLength;
            }
        });
        domains.forEach((value, key) => {
            this.detailComment += chrome.i18n.getMessage("rule_MaxCookiesLength_DetailComment",[value,key]) + '<br>' ;
        });
        if (maxCookiesLength !== 0) {
            this.comment = chrome.i18n.getMessage("rule_MaxCookiesLength_Comment", String(maxCookiesLength));
            if (maxCookiesLength > 512) this.complianceLevel = 'B';
            if (maxCookiesLength > 1024) this.complianceLevel = 'C';
        }
    }
}, "harReceived");rulesManager.registerRule({
    complianceLevel: 'A',
    id: "MinifiedCss",
    comment: "",
    detailComment: "",
    totalCssSize: 0,
    minifiedCssSize: 0,

    check: function (measures, resourceContent) {
        if (resourceContent.type === "stylesheet") {
            this.totalCssSize += resourceContent.content.length;
            if (!isMinified(resourceContent.content)) this.detailComment += chrome.i18n.getMessage("rule_MinifiedCss_DetailComment",resourceContent.url) + '<br>';
            else this.minifiedCssSize += resourceContent.content.length;
            const percentMinifiedCss = this.minifiedCssSize / this.totalCssSize * 100;
            this.complianceLevel = 'A';
            if (percentMinifiedCss < 90) this.complianceLevel = 'C';
            else if (percentMinifiedCss < 95) this.complianceLevel = 'B';
            this.comment = chrome.i18n.getMessage("rule_MinifiedCss_Comment", String(Math.round(percentMinifiedCss * 10) / 10));
        }
    }
}, "resourceContentReceived");
rulesManager.registerRule({
    complianceLevel: 'A',
    id: "MinifiedJs",
    comment: "",
    detailComment: "",
    totalJsSize: 0,
    minifiedJsSize: 0,

    check: function (measures, resourceContent) {
        if (resourceContent.type === "script") {
            this.totalJsSize += resourceContent.content.length;
            if (!isMinified(resourceContent.content)) this.detailComment += chrome.i18n.getMessage("rule_MinifiedJs_DetailComment",resourceContent.url) + '<br>';
            else this.minifiedJsSize += resourceContent.content.length;
            const percentMinifiedJs = this.minifiedJsSize / this.totalJsSize * 100;
            this.complianceLevel = 'A';
            if (percentMinifiedJs < 90) this.complianceLevel = 'C';
            else if (percentMinifiedJs < 95) this.complianceLevel = 'B';
            this.comment = chrome.i18n.getMessage("rule_MinifiedJs_Comment", String(Math.round(percentMinifiedJs * 10) / 10));
        }
    }
}, "resourceContentReceived");
rulesManager.registerRule({
    complianceLevel: 'A',
    id: "NoCookieForStaticRessources",
    comment: "",
    detailComment: "",
  
    check: function (measures) {
      let nbRessourcesStaticWithCookie = 0;
      let totalCookiesSize = 0;
      if (measures.entries.length) measures.entries.forEach(entry => {
        const cookiesLength = getCookiesLength(entry);
        if (isStaticRessource(entry) && (cookiesLength > 0)) {
          nbRessourcesStaticWithCookie++;
          totalCookiesSize += cookiesLength + 7; // 7 is size for the header name "cookie:"
          this.detailComment += chrome.i18n.getMessage("rule_NoCookieForStaticRessources_DetailComment",entry.request.url) + "<br> ";
        }
      });
      if (nbRessourcesStaticWithCookie > 0) {
        if (totalCookiesSize > 2000) this.complianceLevel = 'C';
        else this.complianceLevel = 'B';
        this.comment = chrome.i18n.getMessage("rule_NoCookieForStaticRessources_Comment", [String(nbRessourcesStaticWithCookie), String(Math.round(totalCookiesSize / 100) / 10)]);
      }
    }
  }, "harReceived");rulesManager.registerRule({
    complianceLevel: 'A',
    id: "NoRedirect",
    comment: "",
    detailComment: "",
  
    check: function (measures) {
      let redirectNumber = 0;
      if (measures.entries.length) measures.entries.forEach(entry => {
        if (entry.response) {
          if (isHttpRedirectCode(entry.response.status)) {
            this.detailComment += entry.response.status + " " + entry.request.url + "<br>";
            redirectNumber++;
          }
        }
      });
      if (redirectNumber > 0) this.complianceLevel = 'C';
      this.comment = chrome.i18n.getMessage("rule_NoRedirect_Comment", String(redirectNumber));
    }
  }, "harReceived");rulesManager.registerRule({
    complianceLevel: 'A',
    id: "OptimizeBitmapImages",
    comment: "",
    detailComment: "",
  
    check: function (measures) {
      let nbImagesToOptimize = 0;
      let totalMinGains = 0;
      if (measures.entries) measures.entries.forEach(entry => {
        if (entry.response) {
          const imageType = getImageTypeFromResource(entry);
          if (imageType !== "") {
            var myImage = new Image();
            myImage.src = entry.request.url;
            // needed to access object in the function after
            myImage.rule = this;
  
            myImage.size = entry.response.content.size;
            myImage.onload = function () {
  
              const minGains = getMinOptimisationGainsForImage(this.width * this.height, this.size, imageType);
              if (minGains > 500) { // exclude small gain 
                nbImagesToOptimize++;
                totalMinGains += minGains;
                this.rule.detailComment += chrome.i18n.getMessage("rule_OptimizeBitmapImages_DetailComment", [this.src + " , " + Math.round(this.size / 1000),this.width + "x" + this.height,String(Math.round(minGains / 1000))]) + "<br>";
              }
              if (nbImagesToOptimize > 0) {
                if (totalMinGains < 50000) this.rule.complianceLevel = 'B';
                else this.rule.complianceLevel = 'C';
                this.rule.comment = chrome.i18n.getMessage("rule_OptimizeBitmapImages_Comment", [String(nbImagesToOptimize), String(Math.round(totalMinGains / 1000))]);
                showEcoRuleOnUI(this.rule);
              }
            }
          }
        }
      });
    }
  }, "harReceived");rulesManager.registerRule({
    complianceLevel: 'A',
    id: "OptimizeSvg",
    comment: "",
    detailComment: "",
    totalSizeToOptimize: 0,
    totalResourcesToOptimize: 0,
  
    check: function (measures, resourceContent) {
      if ((resourceContent.type === 'image') && isSvgUrl(resourceContent.url)) {
        if (!isSvgOptimized(window.atob(resourceContent.content)))  // code is in base64 , decode base64 data with atob
        {
          this.detailComment += chrome.i18n.getMessage("rule_OptimizeSvg_detailComment",[resourceContent.url,String(Math.round(resourceContent.content.length / 100) / 10)]) + '<br>';
          this.totalSizeToOptimize += resourceContent.content.length;
          this.totalResourcesToOptimize++;
        }
        if (this.totalSizeToOptimize > 0) {
          if (this.totalSizeToOptimize < 20000) this.complianceLevel = 'B';
          else this.complianceLevel = 'C';
          this.comment = chrome.i18n.getMessage("rule_OptimizeSvg_Comment", String(this.totalResourcesToOptimize));
        }
      }
    }
  }, "resourceContentReceived");rulesManager.registerRule({
    complianceLevel: 'A',
    id: "Plugins",
    comment: "",
    detailComment: "",
  
    check: function (measures) {
      if (measures.pluginsNumber > 0) {
        this.complianceLevel = 'C';
        this.comment = chrome.i18n.getMessage("rule_Plugins_Comment", String(measures.pluginsNumber));
      }
    }
  }, "frameMeasuresReceived");rulesManager.registerRule({
    complianceLevel: 'C',
    id: "PrintStyleSheet",
    comment: "",
    detailComment: "",
  
    check: function (measures) {
      if (measures.printStyleSheetsNumber > 0) {
        this.complianceLevel = 'A';
        this.comment = chrome.i18n.getMessage("rule_PrintStyleSheet_Comment", String(measures.printStyleSheetsNumber));
      }
    }
  }, "frameMeasuresReceived");rulesManager.registerRule({
    complianceLevel: 'A',
    id: "SocialNetworkButton",
    comment: "",
    detailComment: "",

    check: function (measures) {
        let nbSocialNetworkButton = 0;
        let socialNetworks = [];
        if (measures.entries.length) measures.entries.forEach(entry => {
            const officalSocialButton = getOfficialSocialButtonFormUrl(entry.request.url);
            if (officalSocialButton.length > 0) {
                if (socialNetworks.indexOf(officalSocialButton) === -1) {
                    socialNetworks.push(officalSocialButton);
                    this.detailComment += chrome.i18n.getMessage("rule_SocialNetworkButton_detailComment", officalSocialButton) + "<br>";
                    nbSocialNetworkButton++;
                }
            }
        });
        if (nbSocialNetworkButton > 0) {
            this.complianceLevel = 'C';
            this.comment = chrome.i18n.getMessage("rule_SocialNetworkButton_Comment", String(nbSocialNetworkButton));
        }
    }
}, "harReceived");rulesManager.registerRule({
    complianceLevel: 'A',
    id: "StyleSheets",
    comment: "",
    detailComment: "",
  
    check: function (measures) {
      let styleSheets = [];
      if (measures.entries.length) measures.entries.forEach(entry => {
        if (getResponseHeaderFromResource(entry, "content-type").toLowerCase().includes('text/css')) {
          if (styleSheets.indexOf(entry.request.url) === -1) {
            styleSheets.push(entry.request.url);
            this.detailComment += entry.request.url + "<br>";
          }
        }
      });
      if (styleSheets.length > 2) {
        if (styleSheets.length === 3) this.complianceLevel = 'B';
        else this.complianceLevel = 'C';
        this.comment = chrome.i18n.getMessage("rule_StyleSheets_Comment", String(styleSheets.length));
      }
    }
  }, "harReceived");rulesManager.registerRule({
    complianceLevel: 'A',
    id: "UseETags",
    comment: "",
    detailComment: "",
  
    check: function (measures) {
  
      let staticResourcesSize = 0;
      let staticResourcesWithETagsSize = 0;
  
      if (measures.entries.length) measures.entries.forEach(entry => {
        if (isStaticRessource(entry)) {
          staticResourcesSize += entry.response.content.size;
          if (isRessourceUsingETag(entry)) {
            staticResourcesWithETagsSize += entry.response.content.size;
          }
          else this.detailComment +=chrome.i18n.getMessage("rule_UseETags_DetailComment",`${entry.request.url} ${Math.round(entry.response.content.size / 100) / 10}`) + '<br>';
        }
      });
      if (staticResourcesSize > 0) {
        const eTagsRatio = staticResourcesWithETagsSize / staticResourcesSize * 100;
        if (eTagsRatio < 95) {
          if (eTagsRatio < 90) this.complianceLevel = 'C'
          else this.complianceLevel = 'B';
        }
        else this.complianceLevel = 'A';
        this.comment = chrome.i18n.getMessage("rule_UseETags_Comment",
          Math.round(eTagsRatio * 10) / 10 + "%");
      }
    }
  }, "harReceived");rulesManager.registerRule({
    complianceLevel: 'A',
    id: "UseStandardTypefaces",
    comment: "",
    detailComment: "",
  
    check: function (measures) {
      let totalFontsSize = 0;
      if (measures.entries.length) measures.entries.forEach(entry => {
        if (isFontResource(entry) && (entry.response.content.size > 0)) {
          totalFontsSize += entry.response.content.size;
          this.detailComment += entry.request.url + " " + Math.round(entry.response.content.size / 1000) + "KB <br>";
        }
      });
      if (measures.dataEntries.length) measures.dataEntries.forEach(entry => {
        if (isFontResource(entry) && (entry.response.content.size > 0)) {
          totalFontsSize += entry.response.content.size;
          url_toshow = entry.request.url;
          if (url_toshow.length > 80) url_toshow = url_toshow.substring(0, 80) + "...";
          this.detailComment += url_toshow + " " + Math.round(entry.response.content.size / 1000) + "KB <br>";
        }
      });
      if (totalFontsSize > 10000) this.complianceLevel = 'C';
      else if (totalFontsSize > 0) this.complianceLevel = 'B';
      if (totalFontsSize > 0) this.comment = chrome.i18n.getMessage("rule_UseStandardTypefaces_Comment", String(Math.round(totalFontsSize / 1000)));
    }
  }, "harReceived");
/*
 *  Copyright (C) 2019  didierfred@gmail.com 
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as published
 *  by the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

let backgroundPageConnection;
let currentRulesChecker;
let lastAnalyseStartingTime = 0;
let measuresAcquisition;
let analyseBestPractices = true;
let har;
let resources;

function handleResponseFromBackground(frameMeasures) {
  if (isOldAnalyse(frameMeasures.analyseStartingTime)) {
    debug(() => `Analyse is too old for url ${frameMeasures.url} , time = ${frameMeasures.analyseStartingTime}`);
    return;
  }
  measuresAcquisition.aggregateFrameMeasures(frameMeasures);
}



function computeEcoIndexMeasures(measures) {
  measures.ecoIndex = computeEcoIndex(measures.domSize, measures.nbRequest, Math.round(measures.responsesSize / 1000));
  measures.waterConsumption = computeWaterConsumptionfromEcoIndex(measures.ecoIndex);
  measures.greenhouseGasesEmission = computeGreenhouseGasesEmissionfromEcoIndex(measures.ecoIndex);
  measures.grade = getEcoIndexGrade(measures.ecoIndex);
}


function launchAnalyse() {
  let now = Date.now();

  // To avoid parallel analyse , force 1 secondes between analysis 
  if (now - lastAnalyseStartingTime < 1000) {
    debug(() => "Ignore click");
    return;
  }
  lastAnalyseStartingTime = now;
  currentRulesChecker = rulesManager.getNewRulesChecker();
  measuresAcquisition = new MeasuresAcquisition(currentRulesChecker);
  measuresAcquisition.initializeMeasures();
  measuresAcquisition.aggregateFrameMeasures(start_analyse_core())
  measuresAcquisition.startMeasuring();
  let returnObj = measuresAcquisition.getMeasures();
  returnObj.bestPractices = measuresAcquisition.getBestPractices()
  return returnObj;
}


function MeasuresAcquisition(rules) {

  let measures;
  let localRulesChecker = rules;
  let nbGetHarTry = 0;

  this.initializeMeasures = () => {
    measures = {
      "url": "",
      "domSize": 0,
      "nbRequest": 0,
      "responsesSize": 0,
      "responsesSizeUncompress": 0,
      "ecoIndex": 100,
      "grade": 'A',
      "waterConsumption": 0,
      "greenhouseGasesEmission": 0,
      "pluginsNumber": 0,
      "printStyleSheetsNumber": 0,
      "inlineStyleSheetsNumber": 0,
      "emptySrcTagNumber": 0,
      "inlineJsScriptsNumber": 0,
      "imagesResizedInBrowser": []
    };
  }

  this.startMeasuring = function () {
    getNetworkMeasure();
    if (analyseBestPractices) getResourcesMeasure();
  }

  this.getMeasures = () => measures;

  this.getBestPractices = () => Object.fromEntries(localRulesChecker.getAllRules())

  this.aggregateFrameMeasures = function (frameMeasures) {
    measures.domSize += frameMeasures.domSize;
    computeEcoIndexMeasures(measures);

    if (analyseBestPractices) {
      measures.pluginsNumber += frameMeasures.pluginsNumber;

      measures.printStyleSheetsNumber += frameMeasures.printStyleSheetsNumber;
      if (measures.inlineStyleSheetsNumber < frameMeasures.inlineStyleSheetsNumber) measures.inlineStyleSheetsNumber = frameMeasures.inlineStyleSheetsNumber;
      measures.emptySrcTagNumber += frameMeasures.emptySrcTagNumber;
      if (frameMeasures.inlineJsScript.length > 0) {
        const resourceContent = { 
          url:"inline js",
          type:"script",
          content:frameMeasures.inlineJsScript
        }
        localRulesChecker.sendEvent('resourceContentReceived',measures,resourceContent);
      }
      if (measures.inlineJsScriptsNumber < frameMeasures.inlineJsScriptsNumber) measures.inlineJsScriptsNumber = frameMeasures.inlineJsScriptsNumber;

      measures.imagesResizedInBrowser = frameMeasures.imagesResizedInBrowser;

      localRulesChecker.sendEvent('frameMeasuresReceived',measures);

    }
  }



  const getNetworkMeasure = () => {
    
    console.log("Start network measure...");
    // only account for network traffic, filtering resources embedded through data urls
    let entries = har.entries.filter(entry => isNetworkResource(entry));

    // Get the "mother" url 
    if (entries.length > 0) measures.url = entries[0].request.url;
    else {
      // Bug with firefox  when we first get har.entries when starting the plugin , we need to ask again to have it 
      if (nbGetHarTry < 1) {
        debug(() => 'No entries, try again to get HAR in 1s');
        nbGetHarTry++;
        setTimeout(getNetworkMeasure, 1000);
      }
    }

    measures.entries = entries;
    measures.dataEntries = har.entries.filter(entry => isDataResource(entry)); // embeded data urls

    if (entries.length) {
      measures.nbRequest = entries.length;
      entries.forEach(entry => {

        
        // If chromium : 
        // _transferSize represent the real data volume transfert 
        // while content.size represent the size of the page which is uncompress
        if (entry.response._transferSize) {
          measures.responsesSize += entry.response._transferSize;
          measures.responsesSizeUncompress += entry.response.content.size;
        }
        else {
          // In firefox , entry.response.content.size can sometimes be undefined 
          if (entry.response.content.size) measures.responsesSize += entry.response.content.size;
          //debug(() => `entry size = ${entry.response.content.size} , responseSize = ${measures.responsesSize}`);
        }
      });
      if (analyseBestPractices) localRulesChecker.sendEvent('harReceived',measures);

      computeEcoIndexMeasures(measures);
    }
  }

  function getResourcesMeasure() {
    resources.forEach(resource => {
      if (resource.url.startsWith("file") || resource.url.startsWith("http")) {
        if ((resource.type === 'script') || (resource.type === 'stylesheet') || (resource.type === 'image')) {
          let resourceAnalyser = new ResourceAnalyser(resource);
          resourceAnalyser.analyse();
        }
      }
    });
  }

  function ResourceAnalyser(resource) {
    let resourceToAnalyse = resource;

    this.analyse = () => resourceToAnalyse.getContent(this.analyseContent);

    this.analyseContent = (code) => {
      // exclude from analyse the injected script 
      if ((resourceToAnalyse.type === 'script') && (resourceToAnalyse.url.includes("script/analyseFrame.js"))) return;

      let resourceContent = {
        url: resourceToAnalyse.url,
        type : resourceToAnalyse.type,
        content: code
      };
      localRulesChecker.sendEvent('resourceContentReceived',measures,resourceContent);
      
    }
  }

}

/**
Add to the history the result of an analyse
**/
function storeAnalysisInHistory() {
  let measures = measuresAcquisition.getMeasures();
  if (!measures) return;

  var analyse_history = [];
  var string_analyse_history = localStorage.getItem("analyse_history");
  var analyse_to_store = {
    resultDate: new Date(),
    url: measures.url,
    nbRequest: measures.nbRequest,
    responsesSize: Math.round(measures.responsesSize / 1000),
    domSize: measures.domSize,
    greenhouseGasesEmission: measures.greenhouseGasesEmission,
    waterConsumption: measures.waterConsumption,
    ecoIndex: measures.ecoIndex,
    grade: measures.grade
  };

  if (string_analyse_history) {
    analyse_history = JSON.parse(string_analyse_history);
    analyse_history.reverse();
    analyse_history.push(analyse_to_store);
    analyse_history.reverse();
  }
  else analyse_history.push(analyse_to_store);


  localStorage.setItem("analyse_history", JSON.stringify(analyse_history));
}
