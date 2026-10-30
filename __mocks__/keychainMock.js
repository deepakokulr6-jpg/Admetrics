const store = new Map();

const Keychain = {
  setGenericPassword: jest.fn(async (username, password, options = {}) => {
    store.set(options.service ?? 'default', { username, password });
    return true;
  }),
  getGenericPassword: jest.fn(async (options = {}) => {
    const credentials = store.get(options.service ?? 'default');

    if (!credentials) {
      return false;
    }

    return {
      username: credentials.username,
      password: credentials.password,
      service: options.service ?? 'default',
      storage: 'mock',
    };
  }),
  resetGenericPassword: jest.fn(async (options = {}) => {
    store.delete(options.service ?? 'default');
    return true;
  }),
  __reset: () => store.clear(),
};

module.exports = Keychain;
