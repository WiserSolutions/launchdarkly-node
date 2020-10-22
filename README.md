# launchdarkly-node

[LaunchDarkly server-side SDK](https://docs.launchdarkly.com/sdk/server-side/node-js) wrapper for Node intended to provide
a modern API and enforce best practices.

## Use

Init connection to LaunchDarkly when launching your app with

```javascript
const { init } = require('@wisersolutions/launchdarkly-node')

async function startApp() {
  await init('YOUR_LAUNCH_DARKLY_APP_KEY', options)
  // … launch the rest of your app
}
```

Then request a feature variation anywhere in your app with

```javascript
const { variation } = require('@wisersolutions/launchdarkly-node')

async function handleSomeRequest(context) {
  const user = getUserFrom(context)
  const isFeature1Enabled = await variation('some-boolean-flag-key', user)
  const feature2Variation = await variation('some-multi-variant-flag-key', user, 'default-variant')
  
  if (!isFeature1Enabled) return /* … */

  switch (feature2Variation) {
    case 'variant-one': return /* … */
    case 'variant-two': return /* … */
    case 'default-variant':
    default: return /* … */
  }
}
```

See [SDK docs](https://docs.launchdarkly.com/sdk/server-side/node-js) for argument details.

## Development

### Install

Install dependencies using:

```sh
npm install
```

### Develop

After you modify sources, run the following (or set up your IDE to do it for you):

- format the code using `npm run format`
- lint it using `npm run lint`
- test it using `npm test`

and fix the errors, if there are any.

### Publish

Publishing is done in two steps:

1. Create a new version tag and push it to the repository:
    ```sh
    npm version <patch|minor|major>
    git push --follow-tags
    ```
1. Build and publish the new version as a npm package:
    ```sh
    npm publish --access public
    ``` 
