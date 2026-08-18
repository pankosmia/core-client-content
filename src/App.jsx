import { useState, useEffect, useContext } from "react";
import {
  Grid,
  Box,
  IconButton,
  Button,
  DialogActions,
  DialogContent,
  Menu,
  MenuItem,
} from "@mui/material";
import { doI18n } from "pankosmia-lib/i18n";
import { getJson } from "pankosmia-lib/http";

import {
  i18nContext,
  PanDialog,
  PanDialogActions,
  ScrollableBody,
  productContext,
} from "pankosmia-rcl";
import FabPlusMenu from "./components/FabPlusMenu";
import HandymanOutlinedIcon from "@mui/icons-material/HandymanOutlined";
import DataGridComponent from "./components/DataGridComponent";

function App() {
  const { i18nRef } = useContext(i18nContext);
  const { productRef } = useContext(productContext);
  const [newIsOpen, setNewIsOpen] = useState(false);
  const [reposModCount, setReposModCount] = useState(0);
  const [contentFilter, setContentFilter] = useState("");
  const [experimentMenuAnchorEl, setExperimentMenuAnchorEl] = useState(null);
  const experimentMenuOpen = Boolean(experimentMenuAnchorEl);

  const [experimentDialogOpen, setExperimentDialogOpen] = useState(false);

  const [clientConfig, setClientConfig] = useState({});
  const [clientInterfaces, setClientInterfaces] = useState({});
  let isAndroid =
    productRef && productRef.current && productRef.current.os === "android";
  const isArchiveMenuEnabled =
    clientConfig?.["core-client-content"]
      ?.find((section) => section.id === "config")
      ?.fields?.find((field) => field.id === "archiveMenu")?.value !== false;

  useEffect(() => {
    getJson("/api/client-config")
      .then((res) => res.json)
      .then((data) => setClientConfig(data))
      .catch((err) => console.error("Error :", err));
  }, []);

  useEffect(() => {
    getJson("/api/client-interfaces")
      .then((res) => res.json)
      .then((data) => setClientInterfaces(data))
      .catch((err) => console.error("Error :", err));
  }, []);

  const handleExperimentMenuClick = (event) => {
    setExperimentMenuAnchorEl(event.currentTarget);
  };
  const handleExperimentMenuClose = () => {
    setExperimentMenuAnchorEl(null);
  };

  const handleExperimentDialogClickOpen = () => {
    setExperimentDialogOpen(true);
  };

  const handleExperimentDialogClose = () => {
    setExperimentDialogOpen(false);
  };

  /**
   * header 48px + margin of 16px = fixed top position of 64px
   * scrolling takes place in DataGridComponent to allow for a sticky datagrid header
   */

  return (
    <ScrollableBody isAndroid={isAndroid}>
      <Grid container sx={{ mx: 2 }}>
        <Grid size={12} sx={{ m: 0 }}>
          <Grid
            container
            spacing={2}
            direction="row"
            sx={{ justifyContent: "flex-start", alignItems: "flex-start" }}
          >
            <Grid item>
              <FabPlusMenu
                newIsOpen={newIsOpen}
                setNewIsOpen={setNewIsOpen}
                reposModCount={reposModCount}
                setReposModCount={setReposModCount}
                clientInterfaces={clientInterfaces}
              />
            </Grid>
            {isArchiveMenuEnabled && (
              <Grid item>
                <Box sx={{ boxShadow: 3, borderRadius: 50 }}>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={handleExperimentMenuClick}
                  >
                    <HandymanOutlinedIcon />
                  </IconButton>
                </Box>
                <Menu
                  id="basic-menu"
                  anchorEl={experimentMenuAnchorEl}
                  open={experimentMenuOpen}
                  onClose={handleExperimentMenuClose}
                  slotProps={{
                    list: {
                      "aria-labelledby": "basic-button",
                    },
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      setContentFilter("?org=_local_/_archive_");
                      handleExperimentMenuClose();
                      handleExperimentDialogClickOpen();
                    }}
                  >
                    {doI18n("pages:content:archived_content", i18nRef.current)}
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setContentFilter("?org=_local_/_quarantine_");
                      handleExperimentMenuClose();
                      handleExperimentDialogClickOpen();
                    }}
                  >
                    {doI18n(
                      "pages:content:quarantined_content",
                      i18nRef.current,
                    )}
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setContentFilter("?org=_local_/_updates_");
                      handleExperimentMenuClose();
                      handleExperimentDialogClickOpen();
                    }}
                  >
                    {doI18n("pages:content:content_updates", i18nRef.current)}
                  </MenuItem>
                </Menu>
                <PanDialog
                  titleLabel={[
                    contentFilter.includes("archive") &&
                      doI18n("pages:content:archived_content", i18nRef.current),

                    contentFilter.includes("quarantine") &&
                      doI18n(
                        "pages:content:quarantined_content",
                        i18nRef.current,
                      ),

                    contentFilter.includes("updates") &&
                      doI18n("pages:content:content_updates", i18nRef.current),
                  ]}
                  fullWidth={true}
                  size={"lg"}
                  isOpen={experimentDialogOpen}
                  closeFn={() => handleExperimentDialogClose()}
                >
                  <DialogContent>
                    <DataGridComponent
                      reposModCount={reposModCount}
                      setReposModCount={setReposModCount}
                      isNormal={false}
                      contentFilter={contentFilter}
                    />
                  </DialogContent>
                  <PanDialogActions
                    onlyCloseButton
                    closeFn={() => handleExperimentDialogClose()}
                    closeLabel={doI18n("pages:content:close", i18nRef.current)}
                  >
                    <Button
                      onClick={() => {
                        handleExperimentDialogClose();
                      }}
                      color="primary"
                    >
                      {doI18n("pages:content:close", i18nRef.current)}
                    </Button>
                  </PanDialogActions>
                </PanDialog>
              </Grid>
            )}
          </Grid>
        </Grid>
        <Grid size={12}>
          <DataGridComponent
            reposModCount={reposModCount}
            setReposModCount={setReposModCount}
            isNormal={true}
            contentFilter={""}
            experimentDialogOpen={experimentDialogOpen}
            clientInterfaces={clientInterfaces}
            clientConfig={clientConfig}
          />
        </Grid>
      </Grid>
    </ScrollableBody>
  );
}

export default App;
