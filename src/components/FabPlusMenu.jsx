import { Box, Fab, Menu, MenuItem, Typography } from "@mui/material";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import { useState, useContext, useEffect } from "react";
import { i18nContext, netContext, doI18n } from "pithekos-lib";
import { getJson } from "pithekos-lib";
import ImportBurrito from "./ImportBurrito";

function FabPlusMenu({clientInterfaces}) {
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

  const createItems = Object.entries(clientInterfaces)
    .filter(([, value]) => value.create_document)
    .flatMap(([key, value]) => {
      const docs = value.create_document;
      if (Array.isArray(docs)) {
        return docs.map((doc) => ({
          category: key,
          label: doI18n(`${doc.label}`, i18nRef.current),
          url: doc.url,
        }));

        // .filter(doc => {
        //   return urls.includes(doc.url.split('#')[0])}).map((doc) => ({
        //     category: key,
        //     label: doI18n(`${doc.label}`, i18nRef.current),
        //     url: doc.url,
        // }));
      }
      return [];
    });

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
              setContentRowAnchorEl(null);
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
      </Box>
      <ImportBurrito
        open={importBurritoOpen}
        closeFn={() => setImportBurritoAnchorEl(null)}
      />
    </>
  );
}

export default FabPlusMenu;
