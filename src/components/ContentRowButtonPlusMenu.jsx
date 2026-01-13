import {
  IconButton,
  Menu,
  MenuItem,
  Divider,
  ListItemText,
  Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { i18nContext, doI18n, getJson, debugContext } from "pithekos-lib";
import CopyContent from "./CopyContent";
import ExportBurrito from "./ExportBurrito";
import ArchiveContent from "./ArchiveContent";
import QuarantineContent from "./QuarantineContent";
import RestoreContent from "./RestoreContent";
import DeleteContent from "./DeleteContent";
import { useState, useContext, useEffect } from "react";
import { enqueueSnackbar } from "notistack";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import AboutRepo from "./AboutRepo";
function ContentRowButtonPlusMenu({
  repoInfo,
  reposModCount,
  setReposModCount,
  isNormal,
  clientInterfaces,
}) {
  const { i18nRef } = useContext(i18nContext);
  const { debugRef } = useContext(debugContext);

  const [contentRowAnchorEl, setContentRowAnchorEl] = useState(null);
  const contentRowOpen = Boolean(contentRowAnchorEl);

  const [copyContentAnchorEl, setCopyContentAnchorEl] = useState(null);
  const copyContentOpen = Boolean(copyContentAnchorEl);

  const [archiveContentAnchorEl, setArchiveContentAnchorEl] = useState(null);
  const archiveContentOpen = Boolean(archiveContentAnchorEl);

  const [quarantineContentAnchorEl, setQuarantineContentAnchorEl] =
    useState(null);
  const quarantineContentOpen = Boolean(quarantineContentAnchorEl);

  const [restoreContentAnchorEl, setRestoreContentAnchorEl] = useState(null);
  const restoreContentOpen = Boolean(restoreContentAnchorEl);

  const [deleteContentAnchorEl, setDeleteContentAnchorEl] = useState(null);
  const deleteContentOpen = Boolean(deleteContentAnchorEl);

  const [exportBurritoAnchorEl, setExportBurritoAnchorEl] = useState(null);
  const exportBurritoOpen = Boolean(exportBurritoAnchorEl);

  const [aboutRepoContentAnchorEl, setAboutRepoContentAnchorEl] =
    useState(null);
  const aboutRepoContentOpen = Boolean(aboutRepoContentAnchorEl);

  const [subMenuAnchorEl, setSubMenuAnchorEl] = useState(null);

  const [status, setStatus] = useState([]);

  const createItemNewBook = Object.entries(clientInterfaces).flatMap(
    ([category, categoryValue]) => {
      const endpoints = categoryValue?.endpoints ?? {};

      return Object.entries(endpoints).flatMap(([, endpointValue]) => {
        const docs = endpointValue?.new_book;

        if (!Array.isArray(docs)) return [];

        return docs.map((doc) => ({
          category,
          label: doI18n(doc.label, i18nRef.current),
          url:
            "/clients/" +
            category +
            "#" +
            doc.url.replace("%%REPO_PATH%%", repoInfo.path),
        }));
      });
    }
  );
  const createItemImportBook = Object.entries(clientInterfaces).flatMap(
    ([category, categoryValue]) => {
      const endpoints = categoryValue?.endpoints ?? {};

      return Object.entries(endpoints).flatMap(([, endpointValue]) => {
        const docs = endpointValue?.import_book;

        if (!Array.isArray(docs)) return [];

        return docs.map((doc) => ({
          category,
          label: doI18n(doc.label, i18nRef.current),
          url:
            "/clients/" +
            category +
            "#" +
            doc.url.replace("%%REPO_PATH%%", repoInfo.path),
        }));
      });
    }
  );
  const createItemExport = Object.entries(clientInterfaces).flatMap(
    ([category, categoryValue]) => {
      const endpoints = categoryValue?.endpoints ?? {};

      return Object.entries(endpoints).flatMap(
        ([endpointKey, endpointValue]) => {
          const exportsArray = endpointValue?.export;
          if (!Array.isArray(exportsArray)) return [];

          return exportsArray.flatMap((doc) => {
            const flavorItems = doc?.subMenu?.[0];
            if (!flavorItems) return [];

            return Object.entries(flavorItems).flatMap(([key, items]) =>
              items.map((item) => ({
                category, // top-level category
                endpoint: endpointKey, // endpoint name
                key, // flavor type (pdf/usfm/zip)
                label: doI18n(item.label, i18nRef.current),
                url:
                  "/clients/" +
                  category +
                  "#" +
                  item.url.replace("%%REPO_PATH%%", repoInfo.path),
              }))
            );
          });
        }
      );
    }
  );
  const createVersionManager = Object.entries(clientInterfaces).flatMap(
    ([category, categoryValue]) => {
      const endpoints = categoryValue?.endpoints ?? {};

      return Object.values(endpoints).flatMap((endpointValue) => {
        const managerArray = endpointValue?.manager;

        if (!Array.isArray(managerArray)) return [];

        return managerArray.map((item) => ({
          category,
          label: doI18n(item.label, i18nRef.current),
          url: "/clients/" + category + "#" + item.url,
        }));
      });
    }
  );


  const handleSubMenuClick = (event) => {
    setSubMenuAnchorEl(event.currentTarget);
  };

  const repoStatus = async (repo_path) => {
    const statusUrl = `/git/status/${repo_path}`;
    const statusResponse = await getJson(statusUrl, debugRef.current);
    if (statusResponse.ok) {
      setStatus(statusResponse.json);
    } else {
      enqueueSnackbar(
        doI18n("pages:content:could_not_fetch_commits", i18nRef.current),
        { variant: "error" }
      );
    }
  };

  useEffect(() => {
    if (contentRowOpen) {
      repoStatus(repoInfo.path).then();
    }
  }, [contentRowOpen]);

  return (
    <>
      <IconButton
        onClick={(event) => {
          setContentRowAnchorEl(event.currentTarget);
        }}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={contentRowAnchorEl}
        open={contentRowOpen}
        onClose={() => {
          setContentRowAnchorEl(null);
        }}
        slotProps={{ list: { "aria-labelledby": "basic-button" } }}
      >
        <MenuItem
          onClick={(event) => {
            setAboutRepoContentAnchorEl(event.currentTarget);
            setContentRowAnchorEl(null);
          }}
        >
          {doI18n("pages:content:about_repo", i18nRef.current)}
        </MenuItem>
        <Divider />

        {isNormal ? (
          <>
            {repoInfo.path.includes("_local_/_local_") && (
              <>
                {createItemNewBook.filter(
                  (item) => item.category === repoInfo.flavor
                ).length > 0 && (
                  <>
                    {createItemNewBook
                      .filter((item) => item.category === repoInfo.flavor)
                      .map((item) => (
                        <MenuItem
                          key={`new-${item.label}`}
                          onClick={() => (window.location.href = item.url)}
                        >
                          {item.label}
                        </MenuItem>
                      ))}
                    <Divider />
                  </>
                )}
                {createItemImportBook.filter(
                  (item) => item.category === repoInfo.flavor
                ).length > 0 && (
                  <>
                    {createItemImportBook
                      .filter((item) => item.category === repoInfo.flavor)
                      .map((item) => (
                        <MenuItem
                          key={`import-${item.label}`}
                          onClick={() => (window.location.href = item.url)}
                        >
                          {item.label}
                        </MenuItem>
                      ))}
                    <Divider />
                  </>
                )}
              </>
            )}
            <MenuItem
              onClick={(event) => {
                setCopyContentAnchorEl(event.currentTarget);
                setContentRowAnchorEl(null);
              }}
              disabled={
                repoInfo.path.split("/")[0] === "_local_" ||
                repoInfo.path.split("/")[1] === "_local_"
              }
            >
              {doI18n("pages:content:copy_content", i18nRef.current)}
            </MenuItem>
            <MenuItem
              onClick={(event) => {
                setArchiveContentAnchorEl(event.currentTarget);
              }}
              disabled={repoInfo.path.split("/")[1] === "_archived_"}
            >
              {doI18n("pages:content:archive_content", i18nRef.current)}
            </MenuItem>
            <MenuItem
              onClick={(event) => {
                setQuarantineContentAnchorEl(event.currentTarget);
                setContentRowAnchorEl(null);
              }}
              disabled={repoInfo.path.split("/")[1] === "_quarantine_"}
            >
              {doI18n("pages:content:quarantine_content", i18nRef.current)}
            </MenuItem>

            <Divider />
            <MenuItem onClick={handleSubMenuClick}>
              <ListItemText>
                {doI18n("pages:content:export", i18nRef.current)}
              </ListItemText>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                <ArrowRightIcon />
              </Typography>
            </MenuItem>
            {/* <Divider />
            <MenuItem
              onClick={(event) => {
                setExportBurritoAnchorEl(event.currentTarget);
                setContentRowAnchorEl(null);
              }}
            >
              {doI18n("pages:content:export_burrito", i18nRef.current)}
            </MenuItem>
             */}
            <Divider />
            {repoInfo.path.includes("_local_/_local_") &&
              createVersionManager.length > 0 && (
                <>
                  {createVersionManager.map((vm, index) => (
                    <MenuItem
                      key={index}
                      onClick={() => {
                        window.location.href = `${vm.url}?repoPath=${repoInfo.path}`;
                      }}
                      disabled={
                        repoInfo.path.split("/")[0] !== "_local_" ||
                        repoInfo.path.split("/")[1] === "_updates_"
                      }
                    >
                      {doI18n("pages:content:version_manager", i18nRef.current)}
                    </MenuItem>
                  ))}

                  <Divider />
                </>
              )}
            <MenuItem
              onClick={(event) => {
                setDeleteContentAnchorEl(event.currentTarget);
                setContentRowAnchorEl(null);
              }}
            >
              {doI18n("pages:content:delete_content", i18nRef.current)}
            </MenuItem>
          </>
        ) : (
          <>
            {!repoInfo.path.includes("_updates_") && (
              <MenuItem
                onClick={(event) => {
                  setRestoreContentAnchorEl(event.currentTarget);
                  setContentRowAnchorEl(null);
                }}
                disabled={["_local_", "BurritoTruck", "uW"].every(
                  (str) => repoInfo.path.split("/")[1] === str
                )}
              >
                {doI18n("pages:content:restore_content", i18nRef.current)}
              </MenuItem>
            )}
            <MenuItem
              onClick={(event) => {
                setDeleteContentAnchorEl(event.currentTarget);
                setContentRowAnchorEl(null);
              }}
            >
              {doI18n("pages:content:delete_content", i18nRef.current)}
            </MenuItem>
          </>
        )}
      </Menu>
      <Menu
        id="basic-sub-menu"
        anchorEl={subMenuAnchorEl}
        open={Boolean(subMenuAnchorEl)}
        onClose={() => {
          setContentRowAnchorEl(null);
          setSubMenuAnchorEl(null);
        }}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ list: { "aria-labelledby": "basic-button" } }}
      >
        {createItemExport
          .filter((item) => item.endpoint === repoInfo.flavor)
          .map((item) => (
            <MenuItem
              key={item.label}
              onClick={() => (window.location.href = item.url)}
            >
              {item.label}
            </MenuItem>
          ))}
        <MenuItem
          onClick={(event) => {
            setExportBurritoAnchorEl(event.currentTarget);
            setContentRowAnchorEl(null);
            setSubMenuAnchorEl(null);
          }}
        >
          {doI18n("pages:content:export_burrito", i18nRef.current)}
        </MenuItem>
      </Menu>
      <ExportBurrito
        repoInfo={repoInfo}
        open={exportBurritoOpen}
        closeFn={() => setExportBurritoAnchorEl(null)}
        reposModCount={reposModCount}
        setReposModCount={setReposModCount}
      />
      <CopyContent
        repoInfo={repoInfo}
        open={copyContentOpen}
        closeFn={() => setCopyContentAnchorEl(null)}
        reposModCount={reposModCount}
        setReposModCount={setReposModCount}
      />
      <ArchiveContent
        repoInfo={repoInfo}
        open={archiveContentOpen}
        closeFn={() => setArchiveContentAnchorEl(null)}
        reposModCount={reposModCount}
        setReposModCount={setReposModCount}
      />
      <QuarantineContent
        repoInfo={repoInfo}
        open={quarantineContentOpen}
        closeFn={() => setQuarantineContentAnchorEl(null)}
        reposModCount={reposModCount}
        setReposModCount={setReposModCount}
      />
      <RestoreContent
        repoInfo={repoInfo}
        open={restoreContentOpen}
        closeFn={() => setRestoreContentAnchorEl(null)}
        reposModCount={reposModCount}
        setReposModCount={setReposModCount}
      />
      <DeleteContent
        repoInfo={repoInfo}
        open={deleteContentOpen}
        closeFn={() => setDeleteContentAnchorEl(null)}
        reposModCount={reposModCount}
        setReposModCount={setReposModCount}
      />
      <AboutRepo
        repoInfo={repoInfo}
        open={aboutRepoContentOpen}
        closeFn={() => setAboutRepoContentAnchorEl(null)}
      />
    </>
  );
}

export default ContentRowButtonPlusMenu;
