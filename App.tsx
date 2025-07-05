/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {StaticWebView} from './src/components/StaticWebView.tsx';
import Config from 'react-native-config';
import BootSplash from 'react-native-bootsplash';
import setGlobal from './src/common/global.js'

function App(): React.JSX.Element {
  setGlobal()
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    BootSplash.hide();
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View
        style={{
          width: '100%',
          height: '100%',
        }}>
        <StaticWebView url="dist/index.html" />
      </View>
    </SafeAreaView>
  );
}

export default App;
