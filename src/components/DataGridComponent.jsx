import { useState, useEffect, useContext, useCallback } from "react";
import { IconButton, Grid2, Box } from "@mui/material";
import {
  getJson,
  getAndSetJson,
  debugContext,
  i18nContext,
  doI18n,
  postEmptyJson,
  netContext,
} from "pithekos-lib";
import { DataGrid } from "@mui/x-data-grid";
import ContentRowButtonPlusMenu from "./ContentRowButtonPlusMenu";
import EditIcon from "@mui/icons-material/Edit";
import EditOffIcon from "@mui/icons-material/EditOff";
import Notification from "./Notification";

function DataGridComponent({
  reposModCount,
  setReposModCount,
  isNormal,
  contentFilter,
  experimentDialogOpen,
  clientInterfaces
}) {
  const { debugRef } = useContext(debugContext);
  const { i18nRef } = useContext(i18nContext);
  const { enabledRef } = useContext(netContext);
  const [projectSummaries, setProjectSummaries] = useState({});
  const [isoOneToThreeLookup, setIsoOneToThreeLookup] = useState([]);
  const [isoThreeLookup, setIsoThreeLookup] = useState([]);

  const sourceWhitelist = [
    ["git.door43.org/BurritoTruck", "Xenizo curated content (Door43)"],
    ["git.door43.org/uW", "unfoldingWord curated content (Door43)"],
    ["git.door43.org/shower", "Aquifer exported content (Door43)"],
  ];
  const [catalog, setCatalog] = useState([]);
  const [localRepos, setLocalRepos] = useState([]);
  const [isDownloading, setIsDownloading] = useState(null);
  const [remoteSource, setRemoteSource] = useState(sourceWhitelist[0]);

  /**
   * Top 0 puts the top under the margin under the Import / Create buttons.
   * For calculating height we need to adjust for:
   * - 48px minus header
   * - 16px minus margin
   *        -> (App top)
   * - 34px minus Import / Create buttons height
   * - 16px minus margin
   *        -> (this component's top)
   * - 52px minus DataGrid's pagination bar (because it is separate from this component)
   * + 16px plus App's Grid2 bottom margin (so that bottom margin isn't doubled-up)
   * + 16px plus App's otter Box bottom margin (so that bottom margin isn't doubled-up)
   * ======
   * - 134px This is the amount by which to reduce the innerHeight (const adjustment)
   */
  const adjustment = 134;

  const [maxWindowHeight, setMaxWindowHeight] = useState(window.innerHeight - adjustment);

  const handleWindowResize = useCallback(() => {
      setMaxWindowHeight(window.innerHeight - adjustment);
  }, []);

  useEffect(() => {
      window.addEventListener('resize', handleWindowResize);
      return () => {
          window.removeEventListener('resize', handleWindowResize);
      };
  }, [handleWindowResize]);


  const getProjectSummaries = async () => {
    const summariesResponse = await getJson(
      `/burrito/metadata/summaries${!isNormal ? contentFilter : ""}`,
      debugRef.current
    );
    if (summariesResponse.ok) {
      setProjectSummaries(summariesResponse.json);
    }
  };

  useEffect(() => {
    getProjectSummaries().then();
  }, [reposModCount, experimentDialogOpen]);

  useEffect(() => {
    fetch("/app-resources/lookups/iso639-1-to-3.json") // ISO_639-1 codes mapped to ISO_639-3 codes
      .then((r) => r.json())
      .then((data) => setIsoOneToThreeLookup(data));
  }, []);

  useEffect(() => {
    fetch("/app-resources/lookups/iso639-3.json") // ISO_639-3 2025-02-21 from https://hisregistries.org/rol/ plus zht, zhs, nep
      .then((r) => r.json())
      .then((data) => setIsoThreeLookup(data));
  }, []);

  useEffect(() => {
    const doCatalog = async () => {
      if (catalog.length === 0 && enabledRef.current) {
        let newCatalog = [];
        for (const source of sourceWhitelist) {
          const response = await getJson(
            `/gitea/remote-repos/${source[0]}`,
            debugRef.current
          );
          if (response.ok) {
            const newResponse = response.json.map((r) => {
              return { ...r, source: source[0] };
            });
            newCatalog = [...newCatalog, ...newResponse];
          }
        }
        setCatalog(newCatalog);
      }
    };
    doCatalog().then();
  }, [catalog, remoteSource, enabledRef.current]);

  useEffect(() => {
    if (enabledRef.current && localRepos.length === 0) {
      getAndSetJson({
        url: "/git/list-local-repos",
        setter: setLocalRepos,
      }).then();
    }
  }, [remoteSource, enabledRef.current]);

  useEffect(() => {
    if (
      !isDownloading &&
      catalog.length > 0 &&
      localRepos &&
      enabledRef.current
    ) {
      const downloadStatus = async () => {
        const newIsDownloading = {};
        for (const e of catalog) {
          if (localRepos.includes(`${e.source}/${e.name}`)) {
            const metadataUrl = `/burrito/metadata/summary/${e.source}/${e.name}`;
            let metadataResponse = await getJson(metadataUrl, debugRef.current);
            if (metadataResponse.ok) {
              const metadataTime = metadataResponse.json.timestamp;
              const remoteUpdateTime = Date.parse(e.updated_at) / 1000;
              newIsDownloading[`${e.source}/${e.name}`] =
                remoteUpdateTime - metadataTime > 0
                  ? "updatable"
                  : "downloaded";
            } else {
              newIsDownloading[`${e.source}/${e.name}`] = "downloaded";
            }
          } else {
            newIsDownloading[`${e.source}/${e.name}`] = "notDownloaded";
          }
        }
        setIsDownloading(newIsDownloading);
      };
      downloadStatus().then();
    }
  }, [isDownloading, remoteSource, catalog, localRepos, enabledRef.current]);

  const flavorTypes = {
    texttranslation: "scripture",
    audiotranslation: "scripture",
    "x-bcvnotes": "parascriptural",
    "x-bnotes": "parascriptural",
    "x-bcvarticles": "parascriptural",
    "x-bcvquestions": "parascriptural",
    "x-bcvimages": "parascriptural",
    "x-juxtalinear": "scripture",
    "x-parallel": "parascriptural",
    textstories: "gloss",
    "x-obsquestions": "peripheral",
    "x-obsnotes": "peripheral",
    "x-obsarticles": "peripheral",
    "x-obsimages": "peripheral",
    "x-translationplan": "parascriptural",
    "x-tcore": "parascriptural",
    "x-bcvvideo": "parascriptural",
  };

  const columns = [
    {
      field: "abbreviation",
      headerName: doI18n("pages:content:row_abbreviation", i18nRef.current),
      minWidth: 110,
      flex: 0.5,
    },
    {
      field: "name",
      headerName: doI18n("pages:content:row_name", i18nRef.current),
      minWidth: 110,
      flex: 2,
    },
    {
      field: "language",
      headerName: doI18n("pages:content:row_language", i18nRef.current),
      minWidth: 175,
      flex: 0.25,
    },
    {
      field: "source",
      headerName: doI18n("pages:content:row_source", i18nRef.current),
      minWidth: 110,
      flex: 1,
    },
    {
      field: "type",
      headerName: doI18n("pages:content:row_type", i18nRef.current),
      minWidth: 80,
      flex: 1,
      valueGetter: (v) =>
        doI18n(
          `flavors:names:${flavorTypes[v.toLowerCase()]}/${v}`,
          i18nRef.current
        ),
    },
    {
      field: "nBooks",
      headerName: doI18n("pages:content:row_nbooks", i18nRef.current),
      type: "number",
      minWidth: 150,
      flex: 0.5,
    },
    {
      field: "dateUpdated",
      headerName: doI18n("pages:content:row_date_updated", i18nRef.current),
      minWidth: 200,
      flex: 1,
    },
    {
      field: "actions",
      minWidth: isNormal ? 125 : 75,
      headerName: doI18n("pages:content:row_actions", i18nRef.current),
      flex: isNormal ? 0.7 : 0.3,
      align: "right",
      renderCell: (params) => {
        return (
          <>
            {!params.row.path.startsWith("_local_") && (
              <Notification
                remoteRepoPath={params.row.path}
                params={params}
                isDownloading={isDownloading}
                setIsDownloading={setIsDownloading}
                remoteSource={remoteSource}
              />
            )}
            {isNormal && (
              <>
                {params.row.path.startsWith("_local_/_local_") &&
                [
                  "textTranslation",
                  "x-bcvnotes",
                  "x-bcvquestions",
                  "textStories",
                ].includes(params.row.type) && clientInterfaces?.["core-local-workspace"]? (
                  <IconButton
                    onClick={async () => {
                      await postEmptyJson(
                        `/navigation/bcv/${params.row.book_codes[0]}/1/1`
                      );
                      await postEmptyJson(
                        `/app-state/current-project/${params.row.path}`
                      );
                      window.location.href = "/clients/core-local-workspace";
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                ) : (<></>
                  // <IconButton disabled={true}>
                  //   <EditOffIcon />
                  // </IconButton>
                )}
              </>
            )}
            <ContentRowButtonPlusMenu
              repoInfo={params.row}
              reposModCount={reposModCount}
              setReposModCount={setReposModCount}
              isNormal={isNormal}
              clientInterfaces={clientInterfaces}
            />
          </>
        );
      },
    },
  ];

  const filteredProject = Object.entries(projectSummaries).map((obj) => {
    return { ...obj[1], path: obj[0] };
  });

  const rows = filteredProject.map((rep, n) => {
    return {
      ...rep,
      id: n,
      name: `${rep.name.trim()}${
        rep.description.trim() !== rep.name.trim()
          ? ": " + rep.description.trim()
          : ""
      }`,
      language:
        isoThreeLookup?.[
          isoOneToThreeLookup[rep.language_code] ?? rep.language_code
        ]?.en ?? rep.language_code,
      nBooks: rep.book_codes.length,
      type: rep.flavor,
      source: rep.path.startsWith("_local_")
        ? rep.path.startsWith("_local_/_sideloaded_")
          ? doI18n("pages:content:local_resource", i18nRef.current)
          : doI18n("pages:content:local_project", i18nRef.current)
        : `${rep.path.split("/")[1]} (${rep.path.split("/")[0]})`,
      dateUpdated: rep.generated_date,
    };
  });

  return (
    <Grid2 item size={12}>
      <Box
        sx={{
          height: `${maxWindowHeight}px`,
          width: "100%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <DataGrid
          initialState={{
            columns: {
              columnVisibilityModel: {
                nBooks: false,
                source: isNormal,
                dateUpdated: false,
              },
            },
            sorting: {
              sortModel: [{ field: "name", sort: "asc" }],
            },
          }}
          rows={rows}
          columns={columns}
          autoHeight={false}
          sx={{
            fontSize: "1rem",
            "& .MuiDataGrid-columnHeaders": {
              position: "sticky",
              top: 0,
              zIndex: 2,
              backgroundColor: "background.paper",
            },
            "& .MuiDataGrid-virtualScroller": {
              overflow: "auto",
            },
          }}
        />
      </Box>
    </Grid2>
  );
}

export default DataGridComponent;
