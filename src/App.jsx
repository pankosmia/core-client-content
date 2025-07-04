import {useState, useEffect, useContext,useCallback} from "react"

import {Box, Grid2, IconButton, Typography} from "@mui/material";
import {DataGrid} from '@mui/x-data-grid';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {getJson, debugContext, i18nContext, doI18n, postEmptyJson} from "pithekos-lib";
import FabPlusMenu from "./components/FabPlusMenu";
import ContentRowButtonPlusMenu from "./components/ContentRowButtonPlusMenu";
import EditIcon from "@mui/icons-material/Edit";
import EditOffIcon from "@mui/icons-material/EditOff";

function App() {

    const {debugRef} = useContext(debugContext);
    const {i18nRef} = useContext(i18nContext);
    const [repos, setRepos] = useState([]);
    const [newIsOpen, setNewIsOpen] = useState(false);
    const [reposModCount, setReposModCount] = useState(0);

    /**
     * header 48px + SpaSpa's top margin of 16px + FabPlusMenu 34px + shadow 7px = fixed position of 105px
     * innerHeight is examined in the 2nd Box, so 105px less it's top margin of 16px = 89
     * bottom margin comes from this component, and SpaSpa's bottom margin of 16px is hidden
     */
    const [maxWindowHeight, setMaxWindowHeight] = useState(window.innerHeight - 89);

    const handleWindowResize = useCallback(() => {
        setMaxWindowHeight(window.innerHeight - 89);
    }, []);

    useEffect(() => {
        window.addEventListener('resize', handleWindowResize);
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, [handleWindowResize]);

    const getRepoList = async () => {
        const listResponse = await getJson("/git/list-local-repos", debugRef.current);
        if (listResponse.ok) {
            let responses = [];
            for (const repoPath of listResponse.json) {
                const metadataResponse = await getJson(`/burrito/metadata/summary/${repoPath}`);
                if (metadataResponse.ok) {
                    responses.push({path: repoPath, ...metadataResponse.json})
                }
                const fullMetadataResponse = await getJson(`/burrito/metadata/raw/${repoPath}`);
                if (fullMetadataResponse.ok) {
                    responses[responses.length - 1]["bookCodes"] =
                        Object.entries(fullMetadataResponse.json.ingredients)
                            .map(
                                i =>
                                    Object.keys(i[1].scope || {})
                            )
                            .reduce(
                                (a, b) => [...a, ...b],
                                []
                            );
                }
            }
            setRepos(responses);
        }
    }

    useEffect(
        () => {
            if (!newIsOpen) {
                getRepoList().then();
            }
        },
        [newIsOpen, reposModCount]
    );

    const flavorTypes = {
        texttranslation: "scripture",
        audiotranslation: "scripture",
        "x-bcvnotes": "parascriptural",
        "x-bnotes": "parascriptural",
        "x-bcvarticles": "parascriptural",
        "x-bcvquestions": "parascriptural",
        "x-bcvimages": "parascriptural",
        "x-juxtalinear": "scripture",
        "x-parallel": "parascriptural"
    };

    const columns = [
        {
            field: 'name',
            headerName: <Typography>{doI18n("pages:content:row_name", i18nRef.current)}</Typography>,
            flex: 3
        },
        {
            field: 'language',
            headerName: <Typography>{doI18n("pages:content:row_language", i18nRef.current)}</Typography>,
            flex: 0.75
        },
        {
            field: 'nBooks',
            headerName: <Typography>{doI18n("pages:content:row_nbooks", i18nRef.current)}</Typography>,
            type: "number",
            flex: 0.5
        },
        {
            field: 'type',
            headerName: <Typography>{doI18n("pages:content:row_type", i18nRef.current)}</Typography>,
            flex: 0.75,
            valueGetter: v => doI18n(`flavors:names:${flavorTypes[v.toLowerCase()]}/${v}`, i18nRef.current)
        },
        {
            field: 'source',
            headerName: <Typography>{doI18n("pages:content:row_source", i18nRef.current)}</Typography>,
            flex: 1
        },
        {
            field: 'dateUpdated',
            headerName: <Typography>{doI18n("pages:content:row_date_updated", i18nRef.current)}</Typography>,
            flex: 1
        },
        {
            field: 'actions',
            headerName: <Typography>{doI18n("pages:content:row_actions", i18nRef.current)}</Typography>,
            flex: 0.5,
            renderCell: (params) => {
                return <>
                    {
                        params.row.path.startsWith("_local_") && ["textTranslation","x-bcvnotes","x-bcvquestions"].includes(params.row.type) ?
                            <IconButton
                                onClick={
                                    async () => {
                                        await postEmptyJson(`/navigation/bcv/${params.row.bookCodes[0]}/1/1`);
                                        await postEmptyJson(`/app-state/current-project/${params.row.path}`);
                                        window.location.href = "/clients/local-projects";
                                    }
                                }
                            >
                                <EditIcon/>
                            </IconButton> :
                            <IconButton disabled={true}>
                                <EditOffIcon/>
                            </IconButton>
                    }
                    <ContentRowButtonPlusMenu
                        repoInfo={params.row}
                        reposModCount={reposModCount}
                        setReposModCount={setReposModCount}
                    />
                   
                </>;
            }
        }
    ]

    const rows = repos.map((rep, n) => {
        return {
            ...rep,
            id: n,
            name: `${rep.name.trim()}${rep.description.trim() !== rep.name.trim() ? ": " + rep.description.trim() : ""}`,
            language: rep.language_code,
            nBooks: rep.bookCodes.length,
            type: rep.flavor,
            source: rep.path.startsWith("_local_") ?
                doI18n("pages:content:local_org", i18nRef.current) :
                `${rep.path.split("/")[1]} (${rep.path.split("/")[0]})`,
            dateUpdated: rep.generated_date,
        }
    });

    return (
            <Grid2 container sx={{height: '100%', width: '100%', maxHeight: maxWindowHeight, m: 0}}>
                <Grid2 item size={12}>
                    <FabPlusMenu newIsOpen={newIsOpen} setNewIsOpen={setNewIsOpen} reposModCount={reposModCount}
                        setReposModCount={setReposModCount}/>
                </Grid2>
                <Grid2 item size={12}>
                    <DataGrid
                        initialState={{
                            columns: {
                                columnVisibilityModel: {
                                    nBooks: false,
                                    source: false,
                                    dateUpdated: false
                                },
                            },
                        }}
                        rows={rows}
                        columns={columns}
                        sx={{fontSize: "1rem"}}
                    />
                </Grid2>
               
            </Grid2>
    );
}

export default App;
