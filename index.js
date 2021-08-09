/**
 * @format
 */
window.PIK_BUNDLE_VERSION = '1.2.4'
import './src/utils/js-extend'
import {AppRegistry} from 'react-native';
import './src/utils/applyDefaultFont'
import './src/utils/i18n'
import App from './src/App';
import {name as appName} from './app.json';
import ReactNativeForegroundService from "@supersami/rn-foreground-service";

ReactNativeForegroundService.register();

AppRegistry.registerComponent(appName, () => App);
