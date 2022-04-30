import React, {useContext, useMemo} from 'react';
import defaultTheme from './default';

export type Theme = typeof defaultTheme;

type ThemeResult<S> = {
  theme: Theme;
  s: S | undefined;
};

const ThemeContext = React.createContext(defaultTheme);
const ThemeProvider = ThemeContext.Provider;

function useTheme<S>(createStyleSheet?: (theme: Theme) => S): ThemeResult<S> {
  const currentTheme = useContext(ThemeContext) || defaultTheme;
  return useMemo(() => {
    if (typeof createStyleSheet === 'function') {
      const styles = createStyleSheet(currentTheme);
      return {
        theme: currentTheme,
        s: styles,
      };
    }
    return {
      theme: currentTheme,
      s: undefined,
    };
  }, [currentTheme, createStyleSheet]);
}

export {ThemeProvider, useTheme};
