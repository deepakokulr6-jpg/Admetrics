const launchImageLibrary = jest.fn(async () => ({
  didCancel: true,
  assets: [],
}));

const launchCamera = jest.fn(async () => ({
  didCancel: true,
  assets: [],
}));

module.exports = {
  launchImageLibrary,
  launchCamera,
};
