/**
 * @format
 */

import { AppRegistry } from 'react-native';
// Must run before App (and every screen's StyleSheet) is imported.
import { applyAppFont } from './src/utils/applyAppFont';
applyAppFont();

const App = require('./App').default;
const { name: appName } = require('./app.json');

AppRegistry.registerComponent(appName, () => App);
