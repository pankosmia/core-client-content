import {useState, useEffect, useContext, useCallback} from "react"
import {Box, Button, ButtonGroup, Grid2, CircularProgress, Dialog, DialogContent, DialogActions, AppBar, Toolbar, Typography} from "@mui/material";
import {DataGrid} from '@mui/x-data-grid';
import CloudDownload from "@mui/icons-material/CloudDownload";
import CloudDone from "@mui/icons-material/CloudDone";
import CloudOff from "@mui/icons-material/CloudOff";
import PendingIcon from '@mui/icons-material/Pending';
import {enqueueSnackbar} from "notistack";
import {getAndSetJson, getJson, i18nContext, doI18n, debugContext, postEmptyJson, netContext} from "pithekos-lib";

function Notifications(remoteRepoPath, params, remoteSource) {
    
    const {i18nRef} = useContext(i18nContext);
    const {debugRef} = useContext(debugContext);
    const {enabledRef} = useContext(netContext);

    const sourceWhitelist = [
        ["git.door43.org/BurritoTruck", "Xenizo curated content (Door43)"],
        ["git.door43.org/uW", "unfoldingWord curated content (Door43)"],
        ["git.door43.org/shower", "Aquifer exported content (Door43)"],
    ];
    //const [remoteSource, setRemoteSource] = useState(sourceWhitelist[0]);
    const [catalog, setCatalog] = useState([]);
    const [localRepos, setLocalRepos] = useState([]);
    const [isDownloading, setIsDownloading] = useState(null);

    useEffect(
        () => {
            const doCatalog = async () => {
                if (catalog.length === 0) {
                    let newCatalog = [];
                    for (const source of sourceWhitelist) {
                        const response = await getJson(`/gitea/remote-repos/${source[0]}`, debugRef.current);
                        if (response.ok) {
                            const newResponse = response.json.map(r => {
                                return {...r, source: source[0]}
                            })
                            newCatalog = [...newCatalog, ...newResponse];
                        }
                    }
                    setCatalog(newCatalog);
                }
            }
            if (enabledRef.current){
                doCatalog().then();
            }
            console.log("catalog", catalog);
        },
        [remoteSource, enabledRef.current]
    );

    useEffect(
        () => {
            if (enabledRef.current){
                console.log("llego hasta el getAndSetJson");
                getAndSetJson({
                    url: "/git/list-local-repos",
                    setter: setLocalRepos
                }).then()
            }
            console.log("localRepos", localRepos);
        },
        [remoteSource, enabledRef.current]
    );  

    useEffect(() => {
        /* console.log("isDownloading", isDownloading);
        console.log("remoteSource", remoteSource);
        console.log("catalog", catalog);
        console.log("localRepos", localRepos); */
        if (!isDownloading && (catalog.length > 0) && localRepos) {
            const downloadStatus = async () => {
                const newIsDownloading = {};
                for (const e of catalog) {
                    if (localRepos.includes(`${e.source}/${e.name}`)) {
                        const metadataUrl = `/burrito/metadata/summary/${e.source}/${e.name}`;
                        let metadataResponse = await getJson(metadataUrl, debugRef.current);
                        if (metadataResponse.ok) {
                            const metadataTime = metadataResponse.json.timestamp;
                            const remoteUpdateTime = Date.parse(e.updated_at)/1000;
                            newIsDownloading[`${e.source}/${e.name}`] = (remoteUpdateTime - metadataTime > 0) ? "updatable" : "downloaded"
                        } else {
                            newIsDownloading[`${e.source}/${e.name}`] = "downloaded";
                        }
                    } else {
                        newIsDownloading[`${e.source}/${e.name}`] = "notDownloaded";
                    }
                }
                setIsDownloading(newIsDownloading);
            }
            if (enabledRef.current){
                console.log("llego hasta el downloadStatus");
                downloadStatus().then();
            }
            console.log("isDownloading", isDownloading);
        }
    }, [isDownloading, remoteSource, catalog, localRepos, enabledRef.current])

    const handleDownloadClick = useCallback(async (params, remoteRepoPath, postType) => {
        setIsDownloading((isDownloadingCurrent) => ({...isDownloadingCurrent, [remoteRepoPath]: 'downloading'}));
        enqueueSnackbar(
            `${doI18n("pages:core-remote-resources:downloading", i18nRef.current)} ${params.row.abbreviation}`,
            {variant: "info"}
        );
        const fetchUrl = postType === "clone" ? `/git/clone-repo/${remoteRepoPath}` : `/git/pull-repo/origin/${remoteRepoPath}`;
        console.log("llego hasta el downloadClick")
        const fetchResponse = await postEmptyJson(fetchUrl, debugRef.current);
        if (fetchResponse.ok) {
            enqueueSnackbar(
                `${params.row.abbreviation} ${doI18n(postType === "clone" ? "pages:core-remote-resources:downloaded" : "pages:core-remote-resources:updated", i18nRef.current)}`,
                {variant: "success"}
            );
            setIsDownloading((isDownloadingCurrent) => ({...isDownloadingCurrent, [remoteRepoPath]: 'downloaded'}));
        } else {
            enqueueSnackbar(
                `${params.row.abbreviation} ${doI18n("pages:core-remote-resources:failed", i18nRef.current)} : ${fetchResponse.error} (${fetchResponse.status})`,
                {variant: "error"}
            );
            setIsDownloading((isDownloadingCurrent) => ({...isDownloadingCurrent, [remoteRepoPath]: 'notDownloaded'}))
        }
    }, [remoteSource]);

    // Columns for the Data Grid
    /* const columns = [
        {
            field: 'resourceCode',
            headerName: doI18n("pages:core-remote-resources:row_resource_code", i18nRef.current),
            flex: 0.5,
            minWidth: 140,
            headerAlign: 'left',
            align: 'left'
        },
        {
            field: 'language',
            headerName: doI18n("pages:core-remote-resources:row_language", i18nRef.current),
            flex: 0.5,
            minWidth: 120,
            headerAlign: 'left',
            align: 'left'
        },
        {
            field: 'description',
            headerName: doI18n("pages:core-remote-resources:row_description", i18nRef.current),
            flex: 2,
            minWidth: 130,
            headerAlign: 'left',
            align: 'left'
        },
        {
            field: 'type',
            headerName: doI18n("pages:core-remote-resources:row_type", i18nRef.current),
            flex: 1.5,
            minWidth: 80,
            headerAlign: 'left',
            align: 'left'
        },
        {
            field: 'download',
            sortable: false,
            headerName: doI18n("pages:core-remote-resources:row_download", i18nRef.current),
            flex: 0.5,
            minWidth: 120,
            headerAlign: 'left',
            align: 'left',

            renderCell: (params) => {
                const remoteRepoPath = `${remoteSource[0]}/${params.row.name}`;
                if (!isDownloading) {
                    return <CloudDownload disabled/>
                }
                if (isDownloading[remoteRepoPath] === "notDownloaded") {
                    return <CloudDownload onClick={() => handleDownloadClick(params, remoteRepoPath, "clone")}/>;
                }
                if (isDownloading[remoteRepoPath] === "updatable") {
                    return <Update onClick={() => handleDownloadClick(params, remoteRepoPath, "fetch")}/>;
                }
                if (isDownloading[remoteRepoPath] === "downloading") {
                    return <CircularProgress size="30px" color="secondary"/>;
                }
                return <CloudDone color="disabled"/>;
            }
        }
    ]

    // Rows for the Data Grid
    const rows = catalog
        .filter(ce => ce.source.startsWith(remoteSource[0]))
        .filter(ce => ce.flavor)
        .map((ce, n) => {
            return {
                ...ce,
                id: n,
                resourceCode: ce.abbreviation.toUpperCase(),
                language: ce.language_code,
                description: ce.description,
                type: doI18n(`flavors:names:${ce.flavor_type}/${ce.flavor}`, i18nRef.current)
            }
        }) */
    console.log("cambios de estado");
    console.log("isDownloading", isDownloading);
    console.log("remoteSource", remoteSource);
    //console.log("catalog", catalog);
    //console.log("localRepos", localRepos);
    console.log("isDownloading[remoteRepoPath]", isDownloading ? isDownloading[remoteRepoPath.remoteRepoPath] : null);
    console.log("remoteRepoPath", remoteRepoPath.remoteRepoPath);
    console.log("params", remoteRepoPath.params);
    

    return (<>
            {enabledRef.current 
            ?
                isDownloading
                ?
                    <>
                        {/* {(isDownloading[remoteRepoPath.remoteRepoPath] === "notDownloaded") && <CloudDownload onClick={() => handleDownloadClick(remoteRepoPath.params, remoteRepoPath, "clone")}/>} */}
                        {(isDownloading[remoteRepoPath.remoteRepoPath] === "updatable") && <CloudDownload onClick={() => handleDownloadClick(remoteRepoPath.params, remoteRepoPath, "fetch")}/>}
                        {(isDownloading[remoteRepoPath.remoteRepoPath] === "downloading") && <CircularProgress size="30px" color="secondary"/>}
                        {(isDownloading[remoteRepoPath.remoteRepoPath] === "downloaded") && <CloudDone color="disabled"/>}
                    </>
                :
                    <PendingIcon disabled/>
            :
                <CloudOff disabled/>
            }
        </>
    );
}

export default Notifications;