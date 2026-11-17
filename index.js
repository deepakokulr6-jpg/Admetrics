/**
 * @format
 */

import React, { useEffect, useState } from 'react';
import { AppRegistry } from 'react-native';
// Must run before App (and every screen's StyleSheet) is imported.
import { applyAppFont } from './src/utils/applyAppFont';
import { initAppearance } from './src/theme/appearance';
applyAppFont();

const { name: appName } = require('./app.json');

/**
 * Loads the saved light / dark choice first, then imports App, so every
 * StyleSheet is created with the right palette.
 */
const Boot = () => {
  const [App, setApp] = useState(null);

  useEffect(() => {
    initAppearance().finally(() => setApp(() => require('./App').default));
  }, []);

  return App ? React.createElement(App) : null;
};

AppRegistry.registerComponent(appName, () => Boot);
