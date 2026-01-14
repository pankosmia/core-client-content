import { Box, Fab, Menu, MenuItem, Typography } from "@mui/material";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import { useState, useContext } from "react";
import { i18nContext, netContext, doI18n } from "pithekos-lib";
import { getJson } from "pithekos-lib";
import ImportBurrito from "./ImportBurrito";

function FabPlusMenu({clientInterfaces, reposModCount, setReposModCount}) {
  const { i18nRef } = useContext(i18nContext);
  const { enabledRef } = useContext(netContext);
  const [importAnchorEl, setImportAnchorEl] = useState(null);
  const [createAnchorEl, setCreateAnchorEl] = useState(null);
  const [importBurritoAnchorEl, setImportBurritoAnchorEl] = useState(null);
  const importBurritoOpen = Boolean(importBurritoAnchorEl);

  const handleImportClose = () => {
    setImportAnchorEl(null);
  };

  const handleCreateClose = () => {
    setCreateAnchorEl(null);
  };


  const createItems = Object.entries(clientInterfaces).flatMap(
    ([category, categoryValue]) => {
      const endpoints = categoryValue?.endpoints ?? {};

      return Object.entries(endpoints).flatMap(([, endpointValue]) => {
        const docs = endpointValue?.create_document;

        if (!Array.isArray(docs)) return [];

        return docs.map((doc) => ({
          category,
          label: doI18n(doc.label, i18nRef.current),
          url: "/clients/" + category + "#" + doc.url,
        }));
      });
    }
  );

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Fab
          variant="extended"
          color="primary"
          size="small"
          aria-label={doI18n("pages:content:fab_import", i18nRef.current)}
          onClick={(event) => setImportAnchorEl(event.currentTarget)}
        >
          <DriveFolderUploadIcon sx={{ mr: 1 }} />
          <Typography variant="body2">
            {doI18n("pages:content:fab_import", i18nRef.current)}
          </Typography>
        </Fab>
        <Menu
          id="grouped-menu"
          anchorEl={importAnchorEl}
          open={!!importAnchorEl}
          onClose={handleImportClose}
        >
          <MenuItem
            onClick={() => (window.location.href = "/clients/download")}
            disabled={!enabledRef.current}
          >
            {doI18n("pages:content:download_content", i18nRef.current)}
          </MenuItem>
          <MenuItem
            onClick={(event) => {
              setImportBurritoAnchorEl(event.currentTarget);
              setImportAnchorEl(null)
            }}
          >
            {doI18n("pages:content:import_content", i18nRef.current)}
          </MenuItem>
        </Menu>
        <Fab
          variant="extended"
          color="primary"
          size="small"
          aria-label={doI18n("pages:content:fab_create", i18nRef.current)}
          onClick={(event) => setCreateAnchorEl(event.currentTarget)}
          sx={{ ml: 2 }}
        >
          <CreateNewFolderIcon sx={{ mr: 1 }} />
          <Typography variant="body2">
            {doI18n("pages:content:fab_create", i18nRef.current)}
          </Typography>
        </Fab>
        <Menu
          id="grouped-menu"
          anchorEl={createAnchorEl}
          open={!!createAnchorEl}
          onClose={handleCreateClose}
        >
          {createItems.map((item) => (
            <MenuItem onClick={() => (window.location.href = item.url)}>
              {item.label}
            </MenuItem>
          ))}
        </Menu>
        <ImportBurrito
          open={importBurritoOpen}
          closeFn={() => setImportBurritoAnchorEl(null)}
          reposModCount={reposModCount}
          setReposModCount={setReposModCount}
        />
      </Box>
    </>
  );
}

export default FabPlusMenu;
