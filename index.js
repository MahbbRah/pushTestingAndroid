/**
 * @format
 */

import {AppRegistry} from 'react-native';
import BgMessaging from './BgMessaging';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => BgMessaging);
