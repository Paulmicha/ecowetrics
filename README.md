# Ecowetrics

This is currently just a NodeJS (14-lts) CLI to get in a single run several front-end indicators from the following tools :

- [GreenIT-Analysis](https://github.com/cnumr/GreenIT-Analysis-cli) (License : AGPL-3.0)
- [LightHouse CI](https://github.com/GoogleChrome/lighthouse-ci) (License : Apache-2.0)
- [YellowLabTools](https://github.com/YellowLabTools/YellowLabTools) (License : GPL-2.0)

## Usage

### Using Docker

Create the image & build the container & install NPM depedencies :

```sh
docker build -t paulmicha/ecowetrics:0.1 .
docker run -v $(pwd):/app paulmicha/ecowetrics:0.1 npm i
```

Run all tests :

```sh
docker run -v $(pwd):/app paulmicha/ecowetrics:0.1 npm run all
```

Run individual tests :

```sh
docker run -v $(pwd):/app paulmicha/ecowetrics:0.1 npm run greenit
docker run -v $(pwd):/app paulmicha/ecowetrics:0.1 npm run lhci
docker run -v $(pwd):/app paulmicha/ecowetrics:0.1 npm run ylt
```

### Using local Node installation

Run all tests :

```sh
npm run all
```

Run individual tests :

```sh
npm run greenit
npm run lhci
npm run ylt
```
### Output (results)

Results are static files generated in a folder like `./output/www.test.com/2021/11/19` (configurable, see `./src/settings.js`).

## Settings

Create `settings.yml` (or rename given `settings.sample.yml` in this repo). Some settings are derived from [Puppeteer API function names](https://github.com/puppeteer/puppeteer/blob/main/docs/api.md).

```yaml
# Optional : will write cookies as JSON file once successfully logged in, then
# reuse it on subsequent runs. If specified, this URL will be visited before
# any other page to be tested on first run.
# TODO switch based on a per-page opt-in or opt-out basis (logged in and logged
# out) in the same run ?
login:
  user: hello # Optional. Fallback to process.env.LOGIN_USER
  pass: helloPassword # Optional. Fallback to process.env.LOGIN_PASS
  url: https://example.com/login
  userInputSelector: '#email'
  passInputSelector: '#password'
  rememberMeInputSelector: 'input[name="rememberMe"]'
  submitSelector: 'button[type="submit"]'
  # This allows to interact with the page at different moments (like events).
  hooks:
    # The "before" event is called before entering the values in the login form
    # input fields. By default, all selectors defined above are already "waited
    # for".
    # before:
    # The "after" event is called after submitting the login form. It allows to
    # deal with asynchronous form submissions (without page navigation),
    # ensuring we don't attempt to write cookies too early.
    after:
      waitForSelector: 'header.MuiAppBar-root .MuiIconButton-label > .MuiBadge-root'

input:
  homepage:
    url: https://example.com
  list:
    url: https://example.com/list
  entry:
    url: https://example.com/entry

# Keep screenshots along with measures.
output:
  screenshot: true
```

## Known issues

Cookies are not working for YellowLabTools due to an issue with Phantomas, see https://github.com/macbre/phantomas/issues/1026

## Roadmap

- Dockerfile
- Implement basic HTML templates for YellowLabTools JSON output (instead of running the whole server for quick previews)
- Cleanup the GreenIT code roughly adapted from the `cnumr/GreenIT-Analysis-cli` repo
- Implement minimal, "static" UI to track changes over time (json ? sqlite ?)
- Integration example with [Scaphandre](https://github.com/hubblo-org/scaphandre) (License : Apache-2.0) for server-side indicators - i.e. working docker-compose proof of concept
