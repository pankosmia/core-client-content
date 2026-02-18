import { Box, Fab, Menu, MenuItem, Typography } from "@mui/material";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import { useState, useContext } from "react";
import {doI18n } from "pithekos-lib";
import {i18nContext,netContext} from "pankosmia-rcl";
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

  // Use this to set "Biblical Text" as the first item.
  const matchPart = '/createDocument/textTranslation';

  const createItems = (() => {
    if (!clientInterfaces) return [];

    const all = Object.entries(clientInterfaces).flatMap(([category, cv]) =>
      Object.values(cv?.endpoints || {}).flatMap(ev =>
        (ev?.create_document || []).map(doc => ({
          category,
          label: doI18n(doc.label, i18nRef.current),
          url: '/clients/' + category + '#' + doc.url,
        }))
      )
    );

    // move "Biblical Text" to the front if present
    const idx = all.findIndex(i => i.url === matchPart || i.url.includes(matchPart));
    if (idx > -1) all.unshift(all.splice(idx, 1)[0]);

    return all;
  })();

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Fab
          variant="extended"
          color="primary"
          size="small"
          aria-label={doI18n('pages:content:fab_import', i18nRef.current)}
          onClick={(event) => setImportAnchorEl(event.currentTarget)}
        >
          <DriveFolderUploadIcon sx={{ mr: 1 }} />
          <Typography variant="body2">
            {doI18n('pages:content:fab_import', i18nRef.current)}
          </Typography>
        </Fab>
        <Menu
          id="grouped-menu"
          anchorEl={importAnchorEl}
          open={!!importAnchorEl}
          onClose={handleImportClose}
        >
          <MenuItem
            onClick={() => (window.location.href = '/clients/download')}
            disabled={!enabledRef.current}
          >
            {doI18n('pages:content:download_content', i18nRef.current)}
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
          aria-label={doI18n('pages:content:fab_create', i18nRef.current)}
          onClick={(event) => setCreateAnchorEl(event.currentTarget)}
          sx={{ ml: 2 }}
        >
          <CreateNewFolderIcon sx={{ mr: 1 }} />
          <Typography variant="body2">
            {doI18n('pages:content:fab_create', i18nRef.current)}
          </Typography>
        </Fab>
        <Menu
          id="grouped-menu"
          anchorEl={createAnchorEl}
          open={!!createAnchorEl}
          onClose={handleCreateClose}
        >
          {createItems.map((item) => (
            <MenuItem onClick={() => (window.location.href = item.url)}>{item.label}</MenuItem>
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
