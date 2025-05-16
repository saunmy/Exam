
import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';

// Make sure the component name matches what's in native code
AppRegistry.registerComponent('Examination', () => App);
