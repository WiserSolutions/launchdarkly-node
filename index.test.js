const mockLaunchDarkly = jest.createMockFromModule('launchdarkly-node-server-sdk')
jest.mock('launchdarkly-node-server-sdk', () => mockLaunchDarkly)

const { init, variation, close } = require('./index')

const appKey = '123456-7890-abcd'
const featureKey = 'some-feature-key'
const user = { key: 'dummy-user-key', name: 'Dummy User', email: 'user@dummy.url' }
const defaultValue = 'default-variant'

const mockClient = () => ({ once: jest.fn(), variation: jest.fn(), close: jest.fn() })
const mockInitReturn = (client = mockClient()) => mockLaunchDarkly.init.mockReturnValueOnce(client)
const mockReady = (client, result) => {
  const [, onReady] = client.once.mock.calls[0]
  onReady(result)
}
const performInit = async () => {
  const client = mockClient()
  mockInitReturn(client)
  const ready = init(appKey)
  mockReady(client)
  await ready
  return client
}

afterEach(() => close())

describe('init', () => {
  it('connects to LaunchDarkly', async () => {
    const client = mockClient()
    mockInitReturn(client)
    const ready = init(appKey)
    expect(mockLaunchDarkly.init).toHaveBeenCalledWith(appKey)
    expect(client.once).toHaveBeenCalledWith('ready', expect.any(Function))

    const readyEvent = {}
    mockReady(client, readyEvent)
    expect(await ready).toBe(readyEvent)
  })
})

describe('variation', () => {
  it('throws if used without initialization', () => expect(variation(featureKey, user)).rejects.toBeDefined())

  it('returns the default value if used without a user', async () => {
    await performInit()
    expect(await variation(featureKey, undefined, defaultValue)).toBe(defaultValue)
  })

  it('retrieves feature flag', async () => {
    const client = await performInit()
    const variationLoad = variation(featureKey, user, defaultValue)
    await new Promise(setImmediate)
    expect(client.variation).toHaveBeenCalledWith(featureKey, user, defaultValue, expect.any(Function))
    const [, , , callback] = client.variation.mock.calls[0]
    const flagVariation = 'dummy-variation'
    callback(undefined, flagVariation)
    expect(await variationLoad).toBe(flagVariation)
  })
})

describe('close', () => {
  it('closes connection', async () => {
    const client = await performInit()
    close()
    expect(client.close).toHaveBeenCalledWith()

    return expect(variation(featureKey, user)).rejects.toBeDefined()
  })

  it("doesn't throw when run without init", () => {
    expect(close).not.toThrow()
  })
})
