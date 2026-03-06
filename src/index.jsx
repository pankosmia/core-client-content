import { createRoot } from 'react-dom/client';
import { SpSpa } from 'pankosmia-rcl';
import App from './App';
import './index.css';
import { getAndSetJson } from 'pithekos-lib';
import { ThemeProvider } from '@emotion/react';
import { useEffect, useState } from 'react';
import { createTheme } from '@mui/material';
function AppLayout() {

  const [themeSpec, setThemeSpec] = useState({
    palette: {
      primary: {
        main: "#666",
      },
      secondary: {
        main: "#888",
      },
    },
  });

  useEffect(() => {
    if (
      themeSpec.palette &&
      themeSpec.palette.primary &&
      themeSpec.palette.primary.main &&
      themeSpec.palette.primary.main === "#666"
    ) {
      getAndSetJson({
        url: "/app-resources/themes/default.json",
        setter: setThemeSpec,
      }).then();
    }
  }, []);

  const theme = createTheme(themeSpec);
  return <ThemeProvider theme={theme}>
    <SpSpa requireNet={false} titleKey="pages:content:title" currentId="content">
      <App />
    </SpSpa>
  </ThemeProvider>
}
createRoot(document.getElementById('root'))
  .render(
    <AppLayout />
  );
