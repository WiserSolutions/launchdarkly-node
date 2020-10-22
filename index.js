const LaunchDarkly = require('launchdarkly-node-server-sdk')
const { white, red, cyan, green } = require('chalk')

let verbose = false

const log = (...args) => verbose && console.log(white.dim('[LaunchDarkly]'), ...args)

let client
let featuresReady

async function init(appKey, options = {}) {
  verbose = Boolean(options.verbose)

  if (featuresReady) return

  log('Connecting…')
  client = LaunchDarkly.init(appKey)
  featuresReady = new Promise(resolve =>
    client.once('ready', event => {
      log(green('Ready.'))
      resolve(event)
    })
  )
  return await featuresReady
}

async function variation(featureKey, user, defaultValue) {
  if (!featuresReady) throw new Error(`Can't determine feature variant. Initialize feature flags first!`)

  if (!user) {
    log(
      red("Can't determine feature variant without a user!"),
      defaultValue === undefined ? '' : `Using the default (${white.bold(defaultValue)}).`
    )
    return defaultValue
  }

  await featuresReady
  log(`Getting variant of feature ${cyan(featureKey)}…`)
  return await new Promise((resolve, reject) =>
    client.variation(featureKey, user, defaultValue, (err, value) => {
      if (err) {
        log(`${red('Failed to get variant of feature')} ${cyan(featureKey)}${red('!')}`, err)
        reject(err)
      }

      log(`Got variant of feature ${cyan(featureKey)}: ${white.bold(value)}`)
      resolve(value)
    })
  )
}

function close() {
  client.close()
}

module.exports = {
  init,
  variation,
  close
}
