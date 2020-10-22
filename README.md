# launchdarkly-node

[LaunchDarkly server-side SDK](https://docs.launchdarkly.com/sdk/server-side/node-js) wrapper for Node intended to provide
a modern API and enforce best practices.

## Use

TODO: Add usage docs.

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
