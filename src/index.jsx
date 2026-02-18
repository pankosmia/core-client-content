import { createRoot } from 'react-dom/client';
import { SpSpa } from 'pankosmia-rcl';
import App from './App';
import './index.css';
import { getAndSetJson, SpaContainer } from 'pithekos-lib';
import { MaterialDesignContent, SnackbarProvider } from 'notistack';
import { ThemeProvider } from '@emotion/react';
import { useEffect, useState } from 'react';
import { createTheme } from '@mui/material';
import styled from '@emotion/styled';
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
  const CustomSnackbarContent = styled(MaterialDesignContent)(() => ({
    "&.notistack-MuiContent-error": {
      backgroundColor: "#FDEDED",
      color: "#D32F2F",
    },
    "&.notistack-MuiContent-info": {
      backgroundColor: "#E5F6FD",
      color: "#0288D1",
    },
    "&.notistack-MuiContent-warning": {
      backgroundColor: "#FFF4E5",
      color: "#EF6C00",
    },
    "&.notistack-MuiContent-success": {
      backgroundColor: "#EDF7ED",
      color: "#2E7D32",
    },
  }));
  return <ThemeProvider theme={theme}>
    <SnackbarProvider
      Components={{
        error: CustomSnackbarContent,
        info: CustomSnackbarContent,
        warning: CustomSnackbarContent,
        success: CustomSnackbarContent,
      }}
      maxSnack={6}
    >
      <SpaContainer>
        <App />
      </SpaContainer>
    </SnackbarProvider>
  </ThemeProvider>
}
createRoot(document.getElementById('root'))
  .render(
    <SpSpa requireNet={false} titleKey="pages:content:title" currentId="content">
      <AppLayout/>
    </SpSpa>
  );
