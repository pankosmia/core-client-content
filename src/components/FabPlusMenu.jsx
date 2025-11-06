import { Box, Fab, Menu, MenuItem, Typography } from "@mui/material";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import { useState, useContext, useEffect, useMemo } from "react";
import { i18nContext, netContext, doI18n } from "pithekos-lib";

function FabPlusMenu() {
  const { i18nRef } = useContext(i18nContext);
  const { enabledRef } = useContext(netContext);

  const [importAnchorEl, setImportAnchorEl] = useState(null);
  const [createAnchorEl, setCreateAnchorEl] = useState(null);
  const [menu, setMenu] = useState({});
  const [validUrls, setValidUrls] = useState(new Set());

  const handleImportClose = () => setImportAnchorEl(null);
  const handleCreateClose = () => setCreateAnchorEl(null);

  // 🧩 1️⃣ Fetch content metadata
  useEffect(() => {
    fetch("/clients/content/contentmetadata.json")
      .then((res) => res.json())
      .then((data) => setMenu(data))
      .catch((err) => console.error("Error fetching menu:", err));
  }, []);

  // 🧩 2️⃣ Validate URLs when menu changes
  useEffect(() => {
    const checkUrls = async () => {
      const urls = Object.entries(menu)
        .filter(([, value]) => value.create_document)
        .flatMap(([, value]) =>
          value.create_document.map((doc) => doc.url)
        );

      const valid = new Set();
      await Promise.all(
        urls.map(async (url) => {
          try {
            const res = await fetch(url, { method: "HEAD" });
            if (res.ok) valid.add(url);
          } catch {
            console.warn(`Invalid or missing page: ${url}`);
          }
        })
      );
      setValidUrls(valid);
    };

    if (Object.keys(menu).length > 0) checkUrls();
  }, [menu]);

  // 🧩 3️⃣ Compute filtered menu items (filter logic *moved here*)
  const createItems = useMemo(() => {
    return Object.entries(menu)
      .filter(([, value]) => value.create_document)
      .flatMap(([key, value]) => {
        const docs = value.create_document;
        if (!Array.isArray(docs)) return [];

        // ✅ Filter and map in one go — only keep valid URLs
        return docs
          .filter((doc) => validUrls.has(doc.url))
          .map((doc) => ({
            category: key,
            label: doI18n(`${doc.label}`, i18nRef.current),
            url: doc.url,
          }));
      });
  }, [menu, validUrls, i18nRef]);

  return (
    <Box sx={{ mb: 2 }}>
      {/* --- Import FAB --- */}
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
        id="import-menu"
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
        <MenuItem onClick={handleImportClose} disabled>
          {doI18n("pages:content:import_content", i18nRef.current)}
        </MenuItem>
      </Menu>

      {/* --- Create FAB --- */}
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
        id="create-menu"
        anchorEl={createAnchorEl}
        open={!!createAnchorEl}
        onClose={handleCreateClose}
      >
        {createItems.length > 0 ? (
          createItems.map((item) => (
            <MenuItem
              key={item.url}
              onClick={() => (window.location.href = item.url)}
            >
              {item.label}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>
            {doI18n("pages:content:no_available_pages", i18nRef.current)}
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
}

export default FabPlusMenu;
