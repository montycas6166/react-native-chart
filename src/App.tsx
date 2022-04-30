import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Screen from '~/Screen';
import {ThemeProvider} from './theme';
import defaultTheme from '~/theme/default';
const App = () => {
  return (
    <SafeAreaProvider>
      <ThemeProvider value={defaultTheme}>
        <Screen />
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;
